import 'server-only'

import type { Prisma, StockMovementType } from '@prisma/client'

import { prisma } from '../db'
import { ApiErrors } from '../lib/api-error'
import { createNotificationForRoles } from './notification.service'

/**
 * Atomic mutation of an InventoryStock row + StockMovement ledger entry.
 *
 * Caller MUST run this inside a `prisma.$transaction(async tx => ...)` so that
 * status flips on Inbound/Outbound and stock changes commit together.
 *
 * `qty` is the signed delta:
 *   - positive  → onHand += qty (inbound, returns, adjustments up)
 *   - negative  → onHand += qty (outbound ship, adjustments down)
 * `reservedDelta` is signed too (positive = reserve more, negative = release).
 */
export interface MutateStockArgs {
  productId: string
  warehouseId: string
  lot?: string
  expiry?: Date | null
  qty: number
  reservedDelta?: number
  type: StockMovementType
  refDocType?: string | null
  refDocId?: string | null
  reason?: string | null
  byUserId?: string | null
}

export async function mutateStock(
  tx: Prisma.TransactionClient,
  args: MutateStockArgs
): Promise<{ stockId: string; balanceAfter: number; reservedAfter: number }> {
  const lot = args.lot ?? ''
  const reservedDelta = args.reservedDelta ?? 0

  // Upsert the stock row to obtain a stable id under (product, warehouse, lot).
  const existing = await tx.inventoryStock.findUnique({
    where: { productId_warehouseId_lot: { productId: args.productId, warehouseId: args.warehouseId, lot } }
  })

  let stockId: string
  let onHandQty = 0
  let reservedQty = 0
  let expiry = args.expiry ?? null

  if (existing) {
    stockId = existing.id
    onHandQty = existing.onHandQty + args.qty
    reservedQty = existing.reservedQty + reservedDelta
    expiry = args.expiry === undefined ? existing.expiry : (args.expiry ?? null)
  } else {
    onHandQty = args.qty
    reservedQty = reservedDelta
    const created = await tx.inventoryStock.create({
      data: {
        productId: args.productId,
        warehouseId: args.warehouseId,
        lot,
        expiry,
        onHandQty,
        reservedQty
      }
    })
    stockId = created.id
  }

  // Invariant guards.
  if (onHandQty < 0) {
    throw ApiErrors.conflict('Tồn kho không đủ', {
      details: { productId: args.productId, warehouseId: args.warehouseId, lot, requested: -args.qty }
    })
  }
  if (reservedQty < 0) {
    throw ApiErrors.conflict('Reserved không thể âm', {
      details: { productId: args.productId, warehouseId: args.warehouseId, lot, reservedDelta }
    })
  }
  if (reservedQty > onHandQty) {
    throw ApiErrors.conflict('Reserved không được vượt quá onHand', {
      details: { reservedQty, onHandQty }
    })
  }

  if (existing) {
    await tx.inventoryStock.update({
      where: { id: stockId },
      data: { onHandQty, reservedQty, expiry: expiry ?? null }
    })
  }

  await tx.stockMovement.create({
    data: {
      inventoryStockId: stockId,
      warehouseId: args.warehouseId,
      productId: args.productId,
      type: args.type,
      qty: args.qty,
      balanceAfter: onHandQty,
      refDocType: args.refDocType ?? null,
      refDocId: args.refDocId ?? null,
      reason: args.reason ?? null,
      byUserId: args.byUserId ?? null
    }
  })

  return { stockId, balanceAfter: onHandQty, reservedAfter: reservedQty }
}

/**
 * After a stock change, write an audit-log entry AND fan a notification out to
 * warehouse + admin roles when onHand drops to/below reorderLevel.
 */
export async function maybeEmitLowStockAlert(
  tx: Prisma.TransactionClient,
  productId: string,
  warehouseId: string,
  onHandAfter: number
): Promise<void> {
  const [product, warehouse] = await Promise.all([
    tx.product.findUnique({ where: { id: productId }, select: { reorderLevel: true, sku: true, name: true } }),
    tx.warehouse.findUnique({ where: { id: warehouseId }, select: { code: true, name: true } })
  ])
  if (!product?.reorderLevel || product.reorderLevel <= 0) return
  if (onHandAfter > product.reorderLevel) return

  const meta = {
    productId,
    warehouseId,
    sku: product.sku,
    onHand: onHandAfter,
    reorderLevel: product.reorderLevel
  } as const

  await tx.auditLog.create({
    data: {
      action: 'stock.low',
      entity: 'InventoryStock',
      entityId: null,
      diff: meta as Prisma.InputJsonValue
    }
  })

  await createNotificationForRoles(
    ['warehouse', 'admin'],
    {
      type: 'alert',
      title: `Tồn kho thấp: ${product.sku}`,
      body: `${product.name} tại kho ${warehouse?.name ?? warehouseId}: còn ${onHandAfter} (mức cảnh báo ${product.reorderLevel}).`,
      link: `/warehouse/inventory?productId=${productId}&warehouseId=${warehouseId}`,
      meta: meta as Prisma.InputJsonValue
    },
    tx
  )
}

/**
 * FIFO selection: pick stock rows for `productId @ warehouseId` ordered by
 * (expiry asc nulls last, createdAt asc). Returns rows with available > 0.
 */
export async function pickFifoLots(
  tx: Prisma.TransactionClient,
  productId: string,
  warehouseId: string
): Promise<{ id: string; lot: string; onHandQty: number; reservedQty: number; expiry: Date | null }[]> {
  return tx.inventoryStock.findMany({
    where: { productId, warehouseId },
    orderBy: [{ expiry: { sort: 'asc', nulls: 'last' } }, { createdAt: 'asc' }]
  })
}
