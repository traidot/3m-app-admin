import 'server-only'

import type { Prisma, Supplier } from '@prisma/client'

import { prisma } from '../db'
import { ApiErrors } from '../lib/api-error'
import type { SupplierCreateInput, SupplierUpdateInput } from '../schemas/supplier.schema'

export interface ListSuppliersOpts {
  q?: string
  status?: 'active' | 'inactive'
  country?: string
  skip: number
  take: number
  orderBy?: Prisma.SupplierOrderByWithRelationInput
}

export interface ListSuppliersResult {
  data: Supplier[]
  total: number
}

function buildWhere(opts: Pick<ListSuppliersOpts, 'q' | 'status' | 'country'>): Prisma.SupplierWhereInput {
  const where: Prisma.SupplierWhereInput = { deletedAt: null }
  if (opts.status) where.status = opts.status
  if (opts.country) where.country = opts.country
  if (opts.q) {
    where.OR = [
      { code: { contains: opts.q, mode: 'insensitive' } },
      { name: { contains: opts.q, mode: 'insensitive' } },
      { email: { contains: opts.q, mode: 'insensitive' } },
      { taxCode: { contains: opts.q, mode: 'insensitive' } }
    ]
  }
  return where
}

export async function listSuppliers(opts: ListSuppliersOpts): Promise<ListSuppliersResult> {
  const where = buildWhere(opts)
  const [data, total] = await prisma.$transaction([
    prisma.supplier.findMany({
      where,
      skip: opts.skip,
      take: opts.take,
      orderBy: opts.orderBy ?? { createdAt: 'desc' }
    }),
    prisma.supplier.count({ where })
  ])
  return { data, total }
}

export async function getSupplier(id: string): Promise<Supplier> {
  const supplier = await prisma.supplier.findFirst({ where: { id, deletedAt: null } })
  if (!supplier) throw ApiErrors.notFound('Không tìm thấy nhà cung cấp')
  return supplier
}

export async function createSupplier(input: SupplierCreateInput): Promise<Supplier> {
  try {
    return await prisma.supplier.create({ data: input })
  } catch (err) {
    if (isUniqueConflict(err, 'code')) {
      throw ApiErrors.conflict(`Mã nhà cung cấp đã tồn tại: ${input.code}`, { field: 'code' })
    }
    throw err
  }
}

export async function updateSupplier(id: string, input: SupplierUpdateInput): Promise<Supplier> {
  await getSupplier(id) // 404 guard
  try {
    return await prisma.supplier.update({ where: { id }, data: input })
  } catch (err) {
    if (isUniqueConflict(err, 'code')) {
      throw ApiErrors.conflict(`Mã nhà cung cấp đã tồn tại: ${input.code}`, { field: 'code' })
    }
    throw err
  }
}

/**
 * Soft delete: set status=inactive + deletedAt. Blocks if supplier has active pricing.
 */
export async function softDeleteSupplier(id: string): Promise<void> {
  const supplier = await getSupplier(id)
  const activePricing = await prisma.supplierPricing.count({
    where: { supplierId: supplier.id, deletedAt: null, status: 'active' }
  })
  if (activePricing > 0) {
    throw ApiErrors.conflict('Không thể xoá: nhà cung cấp đang có bảng giá hiệu lực', {
      details: { activePricing }
    })
  }
  await prisma.supplier.update({
    where: { id },
    data: { status: 'inactive', deletedAt: new Date() }
  })
}

export async function listSupplierPricing(
  supplierId: string,
  opts: { skip: number; take: number }
): Promise<{ data: Awaited<ReturnType<typeof prisma.supplierPricing.findMany>>; total: number }> {
  await getSupplier(supplierId)
  const where: Prisma.SupplierPricingWhereInput = { supplierId, deletedAt: null }
  const [data, total] = await prisma.$transaction([
    prisma.supplierPricing.findMany({
      where,
      skip: opts.skip,
      take: opts.take,
      orderBy: { effectiveFrom: 'desc' },
      include: { product: { select: { id: true, sku: true, name: true } } }
    }),
    prisma.supplierPricing.count({ where })
  ])
  return { data, total }
}

function isUniqueConflict(err: unknown, target?: string): boolean {
  const e = err as { code?: string; meta?: { target?: unknown } }
  if (e?.code !== 'P2002') return false
  if (!target) return true
  const t = e.meta?.target
  return Array.isArray(t) ? t.includes(target) : t === target
}
