import 'server-only'

import type { Prisma, SupplierPricing } from '@prisma/client'

import { prisma } from '../db'
import { ApiErrors } from '../lib/api-error'
import type {
  SupplierPricingCreateInput,
  SupplierPricingUpdateInput
} from '../schemas/supplier-pricing.schema'

export interface ListPricingOpts {
  supplierId?: string
  productId?: string
  currency?: 'VND' | 'USD' | 'EUR' | 'JPY' | 'CNY' | 'KRW'
  status?: 'active' | 'expired' | 'upcoming'
  skip: number
  take: number
}

function buildWhere(opts: Pick<ListPricingOpts, 'supplierId' | 'productId' | 'currency' | 'status'>): Prisma.SupplierPricingWhereInput {
  const where: Prisma.SupplierPricingWhereInput = { deletedAt: null }
  if (opts.supplierId) where.supplierId = opts.supplierId
  if (opts.productId) where.productId = opts.productId
  if (opts.currency) where.currency = opts.currency
  if (opts.status) where.status = opts.status
  return where
}

export async function listPricing(opts: ListPricingOpts) {
  const where = buildWhere(opts)
  const [data, total] = await prisma.$transaction([
    prisma.supplierPricing.findMany({
      where,
      skip: opts.skip,
      take: opts.take,
      orderBy: { effectiveFrom: 'desc' },
      include: {
        supplier: { select: { id: true, code: true, name: true } },
        product: { select: { id: true, sku: true, name: true } }
      }
    }),
    prisma.supplierPricing.count({ where })
  ])
  return { data, total }
}

export async function getPricing(id: string): Promise<SupplierPricing> {
  const row = await prisma.supplierPricing.findFirst({
    where: { id, deletedAt: null },
    include: {
      supplier: { select: { id: true, code: true, name: true } },
      product: { select: { id: true, sku: true, name: true } }
    }
  })
  if (!row) throw ApiErrors.notFound('Không tìm thấy bảng giá')
  return row
}

export async function createPricing(input: SupplierPricingCreateInput): Promise<SupplierPricing> {
  await assertSupplierExists(input.supplierId)
  await assertProductExists(input.productId)

  await ensureNoOverlap({
    supplierId: input.supplierId,
    productId: input.productId,
    currency: input.currency ?? 'VND',
    effectiveFrom: new Date(input.effectiveFrom),
    effectiveTo: input.effectiveTo ? new Date(input.effectiveTo) : null
  })

  try {
    return await prisma.supplierPricing.create({
      data: {
        supplierId: input.supplierId,
        productId: input.productId,
        price: input.price,
        currency: input.currency ?? 'VND',
        unit: input.unit,
        moq: input.moq,
        effectiveFrom: new Date(input.effectiveFrom),
        effectiveTo: input.effectiveTo ? new Date(input.effectiveTo) : null,
        status: deriveStatus(new Date(input.effectiveFrom), input.effectiveTo ? new Date(input.effectiveTo) : null)
      }
    })
  } catch (err) {
    if ((err as { code?: string }).code === 'P2002') {
      throw ApiErrors.conflict('Bảng giá trùng (supplier + product + currency + effectiveFrom)')
    }
    throw err
  }
}

export async function updatePricing(id: string, input: SupplierPricingUpdateInput): Promise<SupplierPricing> {
  const existing = await getPricing(id)

  const next = {
    currency: input.currency ?? existing.currency,
    effectiveFrom: input.effectiveFrom ? new Date(input.effectiveFrom) : existing.effectiveFrom,
    effectiveTo:
      input.effectiveTo === undefined
        ? existing.effectiveTo
        : input.effectiveTo === null
          ? null
          : new Date(input.effectiveTo)
  }

  await ensureNoOverlap({
    supplierId: existing.supplierId,
    productId: existing.productId,
    currency: next.currency,
    effectiveFrom: next.effectiveFrom,
    effectiveTo: next.effectiveTo,
    excludeId: existing.id
  })

  return prisma.supplierPricing.update({
    where: { id },
    data: {
      price: input.price,
      currency: input.currency,
      unit: input.unit,
      moq: input.moq,
      effectiveFrom: input.effectiveFrom ? new Date(input.effectiveFrom) : undefined,
      effectiveTo:
        input.effectiveTo === undefined ? undefined : input.effectiveTo === null ? null : new Date(input.effectiveTo),
      status: deriveStatus(next.effectiveFrom, next.effectiveTo)
    }
  })
}

export async function softDeletePricing(id: string): Promise<void> {
  await getPricing(id)
  await prisma.supplierPricing.update({
    where: { id },
    data: { deletedAt: new Date() }
  })
}

async function ensureNoOverlap(args: {
  supplierId: string
  productId: string
  currency: SupplierPricing['currency']
  effectiveFrom: Date
  effectiveTo: Date | null
  excludeId?: string
}): Promise<void> {
  const overlap = await prisma.supplierPricing.findFirst({
    where: {
      id: args.excludeId ? { not: args.excludeId } : undefined,
      supplierId: args.supplierId,
      productId: args.productId,
      currency: args.currency,
      deletedAt: null,
      AND: [
        { effectiveFrom: { lte: args.effectiveTo ?? new Date('9999-12-31') } },
        {
          OR: [
            { effectiveTo: null },
            { effectiveTo: { gte: args.effectiveFrom } }
          ]
        }
      ]
    }
  })
  if (overlap) {
    throw ApiErrors.conflict('Khoảng hiệu lực bị chồng chéo với bảng giá hiện có', {
      details: { conflictId: overlap.id }
    })
  }
}

function deriveStatus(from: Date, to: Date | null): 'active' | 'expired' | 'upcoming' {
  const now = Date.now()
  if (from.getTime() > now) return 'upcoming'
  if (to && to.getTime() < now) return 'expired'
  return 'active'
}

async function assertSupplierExists(id: string): Promise<void> {
  const exists = await prisma.supplier.count({ where: { id, deletedAt: null } })
  if (!exists) throw ApiErrors.badRequest('Nhà cung cấp không tồn tại', { field: 'supplierId' })
}

async function assertProductExists(id: string): Promise<void> {
  const exists = await prisma.product.count({ where: { id, deletedAt: null } })
  if (!exists) throw ApiErrors.badRequest('Sản phẩm không tồn tại', { field: 'productId' })
}
