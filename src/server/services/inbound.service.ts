import 'server-only'

import type { Inbound, Prisma } from '@prisma/client'

import { prisma } from '../db'
import { ApiErrors } from '../lib/api-error'
import type { InboundCreateInput, InboundUpdateInput } from '../schemas/inbound.schema'
import { maybeEmitLowStockAlert, mutateStock } from './stock.service'

export interface ListInboundsOpts {
  warehouseId?: string
  sourceType?: 'po' | 'return_inbound' | 'transfer_in' | 'manual'
  status?: 'draft' | 'posted' | 'cancelled'
  skip: number
  take: number
}

function buildWhere(opts: Pick<ListInboundsOpts, 'warehouseId' | 'sourceType' | 'status'>): Prisma.InboundWhereInput {
  const where: Prisma.InboundWhereInput = { deletedAt: null }
  if (opts.warehouseId) where.warehouseId = opts.warehouseId
  if (opts.sourceType) where.sourceType = opts.sourceType
  if (opts.status) where.status = opts.status
  return where
}

const includeDetail = {
  warehouse: { select: { id: true, code: true, name: true } },
  lines: {
    include: { product: { select: { id: true, sku: true, name: true, unit: true } } },
    orderBy: { createdAt: 'asc' as const }
  }
}

export async function listInbounds(opts: ListInboundsOpts) {
  const where = buildWhere(opts)
  const [data, total] = await prisma.$transaction([
    prisma.inbound.findMany({
      where,
      skip: opts.skip,
      take: opts.take,
      orderBy: { createdAt: 'desc' },
      include: { warehouse: { select: { id: true, code: true, name: true } }, _count: { select: { lines: true } } }
    }),
    prisma.inbound.count({ where })
  ])
  return { data, total }
}

export async function getInbound(id: string) {
  const row = await prisma.inbound.findFirst({ where: { id, deletedAt: null }, include: includeDetail })
  if (!row) throw ApiErrors.notFound('Không tìm thấy phiếu nhập')
  return row
}

export async function createInbound(input: InboundCreateInput): Promise<Inbound> {
  await assertWarehouseExists(input.warehouseId)
  await assertProductsExist(input.lines.map(l => l.productId))

  const code = await nextInboundCode()
  const totalQty = input.lines.reduce((sum, l) => sum + l.qty, 0)

  return prisma.inbound.create({
    data: {
      code,
      warehouseId: input.warehouseId,
      sourceType: input.sourceType,
      sourceId: input.sourceId ?? null,
      notes: input.notes ?? null,
      totalQty,
      status: 'draft',
      lines: {
        create: input.lines.map(l => ({
          productId: l.productId,
          qty: l.qty,
          lot: l.lot ?? '',
          expiry: l.expiry ? new Date(l.expiry) : null,
          note: l.note ?? null
        }))
      }
    }
  })
}

export async function updateInbound(id: string, input: InboundUpdateInput): Promise<Inbound> {
  const existing = await getInbound(id)
  if (existing.status !== 'draft') {
    throw ApiErrors.conflict('Chỉ phiếu draft mới được sửa', { details: { status: existing.status } })
  }

  if (input.lines) {
    await assertProductsExist(input.lines.map(l => l.productId))
  }
  const totalQty = input.lines ? input.lines.reduce((sum, l) => sum + l.qty, 0) : undefined

  return prisma.$transaction(async tx => {
    if (input.lines) {
      await tx.inboundLine.deleteMany({ where: { inboundId: id } })
      await tx.inboundLine.createMany({
        data: input.lines.map(l => ({
          inboundId: id,
          productId: l.productId,
          qty: l.qty,
          lot: l.lot ?? '',
          expiry: l.expiry ? new Date(l.expiry) : null,
          note: l.note ?? null
        }))
      })
    }
    return tx.inbound.update({
      where: { id },
      data: {
        notes: input.notes,
        sourceId: input.sourceId,
        totalQty
      }
    })
  })
}

export async function softDeleteInbound(id: string): Promise<void> {
  const existing = await getInbound(id)
  if (existing.status !== 'draft') {
    throw ApiErrors.conflict('Chỉ phiếu draft mới được xoá', { details: { status: existing.status } })
  }
  await prisma.inbound.update({ where: { id }, data: { deletedAt: new Date() } })
}

export async function postInbound(id: string, byUserId?: string | null): Promise<Inbound> {
  const existing = await getInbound(id)
  if (existing.status !== 'draft') {
    throw ApiErrors.conflict(`Không thể post: status hiện tại = ${existing.status}`)
  }

  return prisma.$transaction(async tx => {
    for (const line of existing.lines) {
      const result = await mutateStock(tx, {
        productId: line.productId,
        warehouseId: existing.warehouseId,
        lot: line.lot,
        expiry: line.expiry,
        qty: line.qty,
        type: 'inbound',
        refDocType: 'inbound',
        refDocId: existing.id,
        byUserId
      })
      await maybeEmitLowStockAlert(tx, line.productId, existing.warehouseId, result.balanceAfter)
    }

    return tx.inbound.update({
      where: { id: existing.id },
      data: {
        status: 'posted',
        postedAt: new Date(),
        postedById: byUserId ?? null
      }
    })
  })
}

/**
 * Cancel a posted inbound by emitting reverse-direction movements.
 * Draft cancel is a soft-delete; posted cancel writes a return.
 */
export async function cancelInbound(id: string, byUserId?: string | null): Promise<Inbound> {
  const existing = await getInbound(id)
  if (existing.status === 'cancelled') return existing
  if (existing.status === 'draft') {
    return prisma.inbound.update({
      where: { id },
      data: { status: 'cancelled', cancelledAt: new Date() }
    })
  }
  // posted → cancel by reversing stock moves
  return prisma.$transaction(async tx => {
    for (const line of existing.lines) {
      await mutateStock(tx, {
        productId: line.productId,
        warehouseId: existing.warehouseId,
        lot: line.lot,
        qty: -line.qty,
        type: 'return_movement',
        refDocType: 'inbound.cancel',
        refDocId: existing.id,
        byUserId,
        reason: 'cancel inbound after post'
      })
    }
    return tx.inbound.update({
      where: { id: existing.id },
      data: { status: 'cancelled', cancelledAt: new Date() }
    })
  })
}

async function assertWarehouseExists(id: string): Promise<void> {
  const exists = await prisma.warehouse.count({ where: { id, deletedAt: null } })
  if (!exists) throw ApiErrors.badRequest('Kho không tồn tại', { field: 'warehouseId' })
}

async function assertProductsExist(ids: string[]): Promise<void> {
  const unique = Array.from(new Set(ids))
  const found = await prisma.product.findMany({
    where: { id: { in: unique }, deletedAt: null },
    select: { id: true }
  })
  if (found.length !== unique.length) {
    const missing = unique.filter(id => !found.some(p => p.id === id))
    throw ApiErrors.badRequest('Một số sản phẩm không tồn tại', { field: 'lines.productId', details: { missing } })
  }
}

async function nextInboundCode(): Promise<string> {
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  const prefix = `IN-${yyyy}${mm}${dd}-`
  const last = await prisma.inbound.findFirst({
    where: { code: { startsWith: prefix } },
    orderBy: { code: 'desc' },
    select: { code: true }
  })
  const next = last ? Number.parseInt(last.code.slice(prefix.length), 10) + 1 : 1
  return `${prefix}${String(next).padStart(4, '0')}`
}
