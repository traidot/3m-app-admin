import 'server-only'

import type { Outbound, Prisma } from '@prisma/client'

import { prisma } from '../db'
import { ApiErrors } from '../lib/api-error'
import type { OutboundCreateInput, OutboundUpdateInput } from '../schemas/outbound.schema'
import { maybeEmitLowStockAlert, mutateStock, pickFifoLots } from './stock.service'

export interface ListOutboundsOpts {
  warehouseId?: string
  targetType?: 'customer' | 'warehouse' | 'supplier'
  status?: 'draft' | 'allocated' | 'picked' | 'shipped' | 'cancelled'
  skip: number
  take: number
}

function buildWhere(opts: Pick<ListOutboundsOpts, 'warehouseId' | 'targetType' | 'status'>): Prisma.OutboundWhereInput {
  const where: Prisma.OutboundWhereInput = { deletedAt: null }
  if (opts.warehouseId) where.warehouseId = opts.warehouseId
  if (opts.targetType) where.targetType = opts.targetType
  if (opts.status) where.status = opts.status
  return where
}

const includeDetail = {
  warehouse: { select: { id: true, code: true, name: true } },
  lines: {
    include: {
      product: { select: { id: true, sku: true, name: true, unit: true } },
      allocations: true
    },
    orderBy: { createdAt: 'asc' as const }
  }
}

export async function listOutbounds(opts: ListOutboundsOpts) {
  const where = buildWhere(opts)
  const [data, total] = await prisma.$transaction([
    prisma.outbound.findMany({
      where,
      skip: opts.skip,
      take: opts.take,
      orderBy: { createdAt: 'desc' },
      include: { warehouse: { select: { id: true, code: true, name: true } }, _count: { select: { lines: true } } }
    }),
    prisma.outbound.count({ where })
  ])
  return { data, total }
}

export async function getOutbound(id: string) {
  const row = await prisma.outbound.findFirst({ where: { id, deletedAt: null }, include: includeDetail })
  if (!row) throw ApiErrors.notFound('Không tìm thấy phiếu xuất')
  return row
}

export async function createOutbound(input: OutboundCreateInput): Promise<Outbound> {
  await assertWarehouseExists(input.warehouseId)
  await assertProductsExist(input.lines.map(l => l.productId))

  const code = await nextOutboundCode()
  const totalQty = input.lines.reduce((sum, l) => sum + l.requestedQty, 0)

  return prisma.outbound.create({
    data: {
      code,
      warehouseId: input.warehouseId,
      targetType: input.targetType,
      targetId: input.targetId ?? null,
      scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : null,
      notes: input.notes ?? null,
      totalQty,
      status: 'draft',
      lines: {
        create: input.lines.map(l => ({
          productId: l.productId,
          requestedQty: l.requestedQty,
          note: l.note ?? null
        }))
      }
    }
  })
}

export async function updateOutbound(id: string, input: OutboundUpdateInput): Promise<Outbound> {
  const existing = await getOutbound(id)
  if (existing.status !== 'draft') {
    throw ApiErrors.conflict('Chỉ phiếu draft mới được sửa', { details: { status: existing.status } })
  }
  if (input.lines) {
    await assertProductsExist(input.lines.map(l => l.productId))
  }
  const totalQty = input.lines ? input.lines.reduce((sum, l) => sum + l.requestedQty, 0) : undefined

  return prisma.$transaction(async tx => {
    if (input.lines) {
      await tx.outboundLine.deleteMany({ where: { outboundId: id } })
      await tx.outboundLine.createMany({
        data: input.lines.map(l => ({
          outboundId: id,
          productId: l.productId,
          requestedQty: l.requestedQty,
          note: l.note ?? null
        }))
      })
    }
    return tx.outbound.update({
      where: { id },
      data: {
        notes: input.notes,
        targetId: input.targetId,
        scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : input.scheduledAt === null ? null : undefined,
        totalQty
      }
    })
  })
}

export async function softDeleteOutbound(id: string): Promise<void> {
  const existing = await getOutbound(id)
  if (existing.status !== 'draft') {
    throw ApiErrors.conflict('Chỉ phiếu draft mới được xoá', { details: { status: existing.status } })
  }
  await prisma.outbound.update({ where: { id }, data: { deletedAt: new Date() } })
}

/**
 * Allocate stock for every line via FIFO (oldest expiry first).
 * Bumps reservedQty on stock rows and creates OutboundAllocation records.
 * If any line cannot be fully allocated → 409 with shortage details, no partial commit.
 */
export async function allocateOutbound(id: string, byUserId?: string | null): Promise<Outbound> {
  const existing = await getOutbound(id)
  if (existing.status !== 'draft') {
    throw ApiErrors.conflict(`Không thể allocate: status hiện tại = ${existing.status}`)
  }

  return prisma.$transaction(async tx => {
    for (const line of existing.lines) {
      const lots = await pickFifoLots(tx, line.productId, existing.warehouseId)
      let remaining = line.requestedQty
      const planned: { stockId: string; lot: string; take: number }[] = []

      for (const lot of lots) {
        if (remaining <= 0) break
        const available = lot.onHandQty - lot.reservedQty
        if (available <= 0) continue
        const take = Math.min(available, remaining)
        planned.push({ stockId: lot.id, lot: lot.lot, take })
        remaining -= take
      }

      if (remaining > 0) {
        throw ApiErrors.conflict('Tồn kho không đủ để allocate', {
          details: { productId: line.productId, requestedQty: line.requestedQty, shortage: remaining }
        })
      }

      for (const p of planned) {
        await mutateStock(tx, {
          productId: line.productId,
          warehouseId: existing.warehouseId,
          lot: p.lot,
          qty: 0,
          reservedDelta: p.take,
          type: 'reservation',
          refDocType: 'outbound',
          refDocId: existing.id,
          byUserId
        })
        await tx.outboundAllocation.create({
          data: {
            outboundLineId: line.id,
            inventoryStockId: p.stockId,
            lot: p.lot,
            qty: p.take
          }
        })
      }

      await tx.outboundLine.update({ where: { id: line.id }, data: { allocatedQty: line.requestedQty } })
    }

    return tx.outbound.update({
      where: { id: existing.id },
      data: { status: 'allocated', allocatedAt: new Date() }
    })
  })
}

export async function pickOutbound(id: string): Promise<Outbound> {
  const existing = await getOutbound(id)
  if (existing.status !== 'allocated') {
    throw ApiErrors.conflict(`Không thể pick: status hiện tại = ${existing.status}`)
  }
  return prisma.$transaction(async tx => {
    for (const line of existing.lines) {
      await tx.outboundLine.update({ where: { id: line.id }, data: { pickedQty: line.allocatedQty } })
    }
    return tx.outbound.update({
      where: { id },
      data: { status: 'picked', pickedAt: new Date() }
    })
  })
}

/**
 * Ship: convert reservations to actual outbound. Decrement onHand and reserved
 * on each allocated stock row; emit `outbound` movement; close the outbound.
 */
export async function shipOutbound(id: string, byUserId?: string | null): Promise<Outbound> {
  const existing = await getOutbound(id)
  if (existing.status !== 'picked' && existing.status !== 'allocated') {
    throw ApiErrors.conflict(`Không thể ship: status hiện tại = ${existing.status}`)
  }

  return prisma.$transaction(async tx => {
    for (const line of existing.lines) {
      for (const alloc of line.allocations) {
        const result = await mutateStock(tx, {
          productId: line.productId,
          warehouseId: existing.warehouseId,
          lot: alloc.lot,
          qty: -alloc.qty,
          reservedDelta: -alloc.qty,
          type: 'outbound',
          refDocType: 'outbound',
          refDocId: existing.id,
          byUserId
        })
        await maybeEmitLowStockAlert(tx, line.productId, existing.warehouseId, result.balanceAfter)
      }
      await tx.outboundLine.update({ where: { id: line.id }, data: { shippedQty: line.allocatedQty } })
    }

    return tx.outbound.update({
      where: { id: existing.id },
      data: { status: 'shipped', shippedAt: new Date(), pickedAt: existing.pickedAt ?? new Date() }
    })
  })
}

/**
 * Cancel:
 *   - draft → just mark cancelled
 *   - allocated/picked → release reservations, mark cancelled
 *   - shipped → write reverse-direction (return) movement, mark cancelled
 */
export async function cancelOutbound(id: string, byUserId?: string | null): Promise<Outbound> {
  const existing = await getOutbound(id)
  if (existing.status === 'cancelled') return existing

  if (existing.status === 'draft') {
    return prisma.outbound.update({ where: { id }, data: { status: 'cancelled', cancelledAt: new Date() } })
  }

  return prisma.$transaction(async tx => {
    if (existing.status === 'allocated' || existing.status === 'picked') {
      for (const line of existing.lines) {
        for (const alloc of line.allocations) {
          await mutateStock(tx, {
            productId: line.productId,
            warehouseId: existing.warehouseId,
            lot: alloc.lot,
            qty: 0,
            reservedDelta: -alloc.qty,
            type: 'release',
            refDocType: 'outbound.cancel',
            refDocId: existing.id,
            byUserId
          })
          await tx.outboundAllocation.delete({ where: { id: alloc.id } })
        }
        await tx.outboundLine.update({
          where: { id: line.id },
          data: { allocatedQty: 0, pickedQty: 0 }
        })
      }
    } else if (existing.status === 'shipped') {
      for (const line of existing.lines) {
        for (const alloc of line.allocations) {
          await mutateStock(tx, {
            productId: line.productId,
            warehouseId: existing.warehouseId,
            lot: alloc.lot,
            qty: alloc.qty,
            type: 'return_movement',
            refDocType: 'outbound.cancel',
            refDocId: existing.id,
            byUserId,
            reason: 'cancel after ship'
          })
        }
      }
    }

    return tx.outbound.update({
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

async function nextOutboundCode(): Promise<string> {
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  const prefix = `OUT-${yyyy}${mm}${dd}-`
  const last = await prisma.outbound.findFirst({
    where: { code: { startsWith: prefix } },
    orderBy: { code: 'desc' },
    select: { code: true }
  })
  const next = last ? Number.parseInt(last.code.slice(prefix.length), 10) + 1 : 1
  return `${prefix}${String(next).padStart(4, '0')}`
}
