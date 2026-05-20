import 'server-only'

import type { Prisma } from '@prisma/client'

import { prisma } from '../db'
import { ApiErrors } from '../lib/api-error'
import { maybeEmitLowStockAlert, mutateStock } from './stock.service'

export interface ListInventoryOpts {
  warehouseId?: string
  productId?: string
  lowStock?: boolean
  skip: number
  take: number
}

export async function listInventory(opts: ListInventoryOpts) {
  const where: Prisma.InventoryStockWhereInput = {}
  if (opts.warehouseId) where.warehouseId = opts.warehouseId
  if (opts.productId) where.productId = opts.productId

  const [rows, total] = await prisma.$transaction([
    prisma.inventoryStock.findMany({
      where,
      include: {
        product: { select: { id: true, sku: true, name: true, unit: true, reorderLevel: true } },
        warehouse: { select: { id: true, code: true, name: true } }
      },
      skip: opts.skip,
      take: opts.take,
      orderBy: [{ warehouseId: 'asc' }, { productId: 'asc' }]
    }),
    prisma.inventoryStock.count({ where })
  ])

  // lowStock filter is applied in-memory because it depends on Product.reorderLevel.
  const data = rows
    .map(r => ({
      ...r,
      availableQty: r.onHandQty - r.reservedQty
    }))
    .filter(r => {
      if (!opts.lowStock) return true
      const lvl = r.product.reorderLevel ?? 0
      return lvl > 0 && r.onHandQty <= lvl
    })

  return { data, total: opts.lowStock ? data.length : total }
}

export async function getInventoryStock(id: string) {
  const row = await prisma.inventoryStock.findUnique({
    where: { id },
    include: {
      product: { select: { id: true, sku: true, name: true, unit: true, reorderLevel: true } },
      warehouse: { select: { id: true, code: true, name: true } }
    }
  })
  if (!row) throw ApiErrors.notFound('Không tìm thấy bản ghi tồn kho')
  return { ...row, availableQty: row.onHandQty - row.reservedQty }
}

export async function listStockTransactions(stockId: string, opts: { skip: number; take: number }) {
  await getInventoryStock(stockId)
  const where: Prisma.StockMovementWhereInput = { inventoryStockId: stockId }
  const [data, total] = await prisma.$transaction([
    prisma.stockMovement.findMany({ where, skip: opts.skip, take: opts.take, orderBy: { at: 'desc' } }),
    prisma.stockMovement.count({ where })
  ])
  return { data, total }
}

export async function adjustInventory(
  stockId: string,
  args: { qty: number; reason: string; byUserId?: string | null }
) {
  const stock = await getInventoryStock(stockId)
  if (args.qty === 0) {
    throw ApiErrors.badRequest('qty không được bằng 0', { field: 'qty' })
  }
  return prisma.$transaction(async tx => {
    const result = await mutateStock(tx, {
      productId: stock.productId,
      warehouseId: stock.warehouseId,
      lot: stock.lot,
      qty: args.qty,
      type: 'adjustment',
      refDocType: 'adjustment',
      refDocId: stock.id,
      byUserId: args.byUserId,
      reason: args.reason
    })
    await maybeEmitLowStockAlert(tx, stock.productId, stock.warehouseId, result.balanceAfter)
    return tx.inventoryStock.findUniqueOrThrow({
      where: { id: stockId },
      include: {
        product: { select: { id: true, sku: true, name: true, unit: true, reorderLevel: true } },
        warehouse: { select: { id: true, code: true, name: true } }
      }
    })
  })
}

export interface ListOutboundInventoryOpts {
  warehouseId?: string
  productId?: string
  outboundId?: string
  skip: number
  take: number
}

/**
 * Derived view: rows from OutboundAllocation joined to outbounds in
 * `allocated`/`picked` (not yet shipped, not cancelled). Used by
 * `/api/outbound-inventory` per screen design.
 */
export async function listOutboundInventory(opts: ListOutboundInventoryOpts) {
  const where: Prisma.OutboundAllocationWhereInput = {
    outboundLine: {
      outbound: {
        deletedAt: null,
        status: { in: ['allocated', 'picked'] },
        ...(opts.warehouseId ? { warehouseId: opts.warehouseId } : {}),
        ...(opts.outboundId ? { id: opts.outboundId } : {})
      },
      ...(opts.productId ? { productId: opts.productId } : {})
    }
  }
  const [data, total] = await prisma.$transaction([
    prisma.outboundAllocation.findMany({
      where,
      include: {
        stock: { select: { id: true, productId: true, warehouseId: true, lot: true, expiry: true } },
        outboundLine: {
          include: {
            outbound: { select: { id: true, code: true, status: true, warehouseId: true } },
            product: { select: { id: true, sku: true, name: true } }
          }
        }
      },
      skip: opts.skip,
      take: opts.take,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.outboundAllocation.count({ where })
  ])

  const flat = data.map(a => ({
    id: a.id,
    productId: a.outboundLine.productId,
    product: a.outboundLine.product,
    warehouseId: a.outboundLine.outbound.warehouseId,
    lot: a.lot,
    reservedQty: a.qty,
    outboundId: a.outboundLine.outbound.id,
    outboundCode: a.outboundLine.outbound.code,
    status: a.outboundLine.outbound.status,
    createdAt: a.createdAt
  }))
  return { data: flat, total }
}

export async function getOutboundAllocation(id: string) {
  const a = await prisma.outboundAllocation.findUnique({
    where: { id },
    include: {
      stock: true,
      outboundLine: {
        include: {
          outbound: { select: { id: true, code: true, status: true, warehouseId: true } },
          product: { select: { id: true, sku: true, name: true } }
        }
      }
    }
  })
  if (!a) throw ApiErrors.notFound('Không tìm thấy bản ghi outbound-inventory')
  return a
}

export async function listAllocationEvents(allocationId: string) {
  const a = await getOutboundAllocation(allocationId)
  // Pull the stock movements that reference this allocation's outbound, scoped to the same product.
  const events = await prisma.stockMovement.findMany({
    where: {
      productId: a.outboundLine.productId,
      warehouseId: a.outboundLine.outbound.warehouseId,
      refDocType: { startsWith: 'outbound' },
      refDocId: a.outboundLine.outbound.id
    },
    orderBy: { at: 'asc' }
  })
  return events
}
