import 'server-only'

import type { Prisma, Warehouse } from '@prisma/client'

import { prisma } from '../db'
import { ApiErrors } from '../lib/api-error'
import type { WarehouseCreateInput, WarehouseUpdateInput } from '../schemas/warehouse.schema'

export interface ListWarehousesOpts {
  q?: string
  status?: 'active' | 'inactive'
  skip: number
  take: number
}

function buildWhere(opts: Pick<ListWarehousesOpts, 'q' | 'status'>): Prisma.WarehouseWhereInput {
  const where: Prisma.WarehouseWhereInput = { deletedAt: null }
  if (opts.status) where.status = opts.status
  if (opts.q) {
    where.OR = [
      { code: { contains: opts.q, mode: 'insensitive' } },
      { name: { contains: opts.q, mode: 'insensitive' } }
    ]
  }
  return where
}

export async function listWarehouses(opts: ListWarehousesOpts): Promise<{ data: Warehouse[]; total: number }> {
  const where = buildWhere(opts)
  const [data, total] = await prisma.$transaction([
    prisma.warehouse.findMany({ where, skip: opts.skip, take: opts.take, orderBy: { name: 'asc' } }),
    prisma.warehouse.count({ where })
  ])
  return { data, total }
}

export async function getWarehouse(id: string): Promise<Warehouse> {
  const w = await prisma.warehouse.findFirst({ where: { id, deletedAt: null } })
  if (!w) throw ApiErrors.notFound('Không tìm thấy kho')
  return w
}

export async function createWarehouse(input: WarehouseCreateInput): Promise<Warehouse> {
  try {
    return await prisma.warehouse.create({
      data: { code: input.code, name: input.name, address: input.address, status: input.status ?? 'active' }
    })
  } catch (err) {
    if (isUniqueConflict(err, 'code')) {
      throw ApiErrors.conflict(`Mã kho đã tồn tại: ${input.code}`, { field: 'code' })
    }
    throw err
  }
}

export async function updateWarehouse(id: string, input: WarehouseUpdateInput): Promise<Warehouse> {
  await getWarehouse(id)
  try {
    return await prisma.warehouse.update({
      where: { id },
      data: { code: input.code, name: input.name, address: input.address, status: input.status }
    })
  } catch (err) {
    if (isUniqueConflict(err, 'code')) {
      throw ApiErrors.conflict(`Mã kho đã tồn tại: ${input.code}`, { field: 'code' })
    }
    throw err
  }
}

export async function softDeleteWarehouse(id: string): Promise<void> {
  await getWarehouse(id)
  const stockCount = await prisma.inventoryStock.count({
    where: { warehouseId: id, OR: [{ onHandQty: { gt: 0 } }, { reservedQty: { gt: 0 } }] }
  })
  if (stockCount > 0) {
    throw ApiErrors.conflict(`Không thể xoá: kho còn ${stockCount} dòng tồn kho`, { details: { stockCount } })
  }
  await prisma.warehouse.update({
    where: { id },
    data: { status: 'inactive', deletedAt: new Date() }
  })
}

function isUniqueConflict(err: unknown, target?: string): boolean {
  const e = err as { code?: string; meta?: { target?: unknown } }
  if (e?.code !== 'P2002') return false
  if (!target) return true
  const t = e.meta?.target
  return Array.isArray(t) ? t.includes(target) : t === target
}
