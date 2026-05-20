import 'server-only'

import type { Container, ContainerLoadItem, Prisma } from '@prisma/client'

import { prisma } from '../db'
import { ApiErrors } from '../lib/api-error'
import type {
  ContainerCreateInput,
  ContainerLoadItemCreateInput,
  ContainerLoadItemUpdateInput,
  ContainerUpdateInput
} from '../schemas/container.schema'

const containerWithRelations = {
  include: {
    originWarehouse: { select: { id: true, code: true, name: true } },
    loadItems: {
      orderBy: { position: 'asc' as const },
      include: {
        outbound: {
          select: { id: true, code: true, status: true, targetType: true, targetId: true, totalQty: true }
        }
      }
    }
  }
} satisfies Prisma.ContainerDefaultArgs

type ContainerWithRelations = Prisma.ContainerGetPayload<typeof containerWithRelations>

export interface ContainerFillStats {
  totalQty: number
  totalVolumeM3: number
  totalWeightKg: number
  volumeUtilizationPct: number | null
  weightUtilizationPct: number | null
}

export interface ContainerDetail extends ContainerWithRelations {
  fill: ContainerFillStats
}

function decimalToNumber(value: unknown): number {
  if (value == null) return 0
  if (typeof value === 'number') return value
  if (typeof value === 'string') return Number.parseFloat(value)
  if (typeof value === 'object' && 'toNumber' in value && typeof (value as { toNumber: () => number }).toNumber === 'function') {
    return (value as { toNumber: () => number }).toNumber()
  }
  return 0
}

function computeFill(container: ContainerWithRelations): ContainerFillStats {
  const totals = container.loadItems.reduce(
    (acc, item) => {
      acc.totalQty += item.qty
      acc.totalVolumeM3 += decimalToNumber(item.volumeM3)
      acc.totalWeightKg += decimalToNumber(item.weightKg)
      return acc
    },
    { totalQty: 0, totalVolumeM3: 0, totalWeightKg: 0 }
  )
  const maxV = decimalToNumber(container.maxVolumeM3)
  const maxW = decimalToNumber(container.maxWeightKg)
  return {
    ...totals,
    volumeUtilizationPct: maxV > 0 ? round(totals.totalVolumeM3 / maxV * 100, 2) : null,
    weightUtilizationPct: maxW > 0 ? round(totals.totalWeightKg / maxW * 100, 2) : null
  }
}

function round(n: number, dp: number): number {
  const f = 10 ** dp
  return Math.round(n * f) / f
}

// -----------------------------------------------------------------------------
// List / get
// -----------------------------------------------------------------------------

export interface ListContainersOpts {
  q?: string
  status?: 'draft' | 'planned' | 'loading' | 'loaded' | 'shipped' | 'cancelled'
  originWarehouseId?: string
  skip: number
  take: number
  orderBy?: Prisma.ContainerOrderByWithRelationInput
}

function buildWhere(opts: Pick<ListContainersOpts, 'q' | 'status' | 'originWarehouseId'>): Prisma.ContainerWhereInput {
  const where: Prisma.ContainerWhereInput = { deletedAt: null }
  if (opts.status) where.status = opts.status
  if (opts.originWarehouseId) where.originWarehouseId = opts.originWarehouseId
  if (opts.q) {
    where.OR = [
      { code: { contains: opts.q, mode: 'insensitive' } },
      { name: { contains: opts.q, mode: 'insensitive' } },
      { destination: { contains: opts.q, mode: 'insensitive' } }
    ]
  }
  return where
}

export async function listContainers(opts: ListContainersOpts) {
  const where = buildWhere(opts)
  const [data, total] = await prisma.$transaction([
    prisma.container.findMany({
      where,
      skip: opts.skip,
      take: opts.take,
      orderBy: opts.orderBy ?? { createdAt: 'desc' },
      include: {
        originWarehouse: { select: { id: true, code: true, name: true } },
        _count: { select: { loadItems: true } }
      }
    }),
    prisma.container.count({ where })
  ])
  return { data, total }
}

export async function getContainer(id: string): Promise<ContainerDetail> {
  const container = await prisma.container.findFirst({
    where: { id, deletedAt: null },
    ...containerWithRelations
  })
  if (!container) throw ApiErrors.notFound('Không tìm thấy container')
  return { ...container, fill: computeFill(container) }
}

// -----------------------------------------------------------------------------
// Create / update / delete
// -----------------------------------------------------------------------------

async function nextContainerCode(): Promise<string> {
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  const prefix = `CT-${yyyy}${mm}${dd}-`
  const last = await prisma.container.findFirst({
    where: { code: { startsWith: prefix } },
    orderBy: { code: 'desc' },
    select: { code: true }
  })
  const next = last ? Number.parseInt(last.code.slice(prefix.length), 10) + 1 : 1
  return `${prefix}${String(next).padStart(4, '0')}`
}

export async function createContainer(input: ContainerCreateInput): Promise<Container> {
  if (input.originWarehouseId) await assertWarehouseExists(input.originWarehouseId)
  const code = input.code || (await nextContainerCode())
  try {
    return await prisma.container.create({
      data: {
        code,
        name: input.name,
        type: input.type,
        maxVolumeM3: input.maxVolumeM3,
        maxWeightKg: input.maxWeightKg,
        originWarehouseId: input.originWarehouseId ?? null,
        destination: input.destination,
        plannedDepartureAt: input.plannedDepartureAt ? new Date(input.plannedDepartureAt) : null,
        notes: input.notes,
        status: 'draft'
      }
    })
  } catch (err) {
    if (isUniqueConflict(err, 'code')) {
      throw ApiErrors.conflict(`Mã container đã tồn tại: ${code}`, { field: 'code' })
    }
    throw err
  }
}

export async function updateContainer(id: string, input: ContainerUpdateInput): Promise<Container> {
  const existing = await getContainer(id)
  assertEditableStatus(existing.status, 'cập nhật')
  if (input.originWarehouseId) await assertWarehouseExists(input.originWarehouseId)
  return prisma.container.update({
    where: { id },
    data: {
      name: input.name,
      type: input.type,
      maxVolumeM3: input.maxVolumeM3,
      maxWeightKg: input.maxWeightKg,
      originWarehouseId: input.originWarehouseId,
      destination: input.destination,
      plannedDepartureAt: input.plannedDepartureAt === undefined
        ? undefined
        : input.plannedDepartureAt === null
          ? null
          : new Date(input.plannedDepartureAt),
      notes: input.notes
    }
  })
}

export async function softDeleteContainer(id: string): Promise<void> {
  const container = await getContainer(id)
  if (container.status !== 'draft' && container.status !== 'cancelled') {
    throw ApiErrors.conflict(`Chỉ xoá được container ở trạng thái draft hoặc cancelled (hiện tại: ${container.status})`)
  }
  await prisma.container.update({ where: { id }, data: { deletedAt: new Date() } })
}

// -----------------------------------------------------------------------------
// Load items
// -----------------------------------------------------------------------------

export async function addLoadItem(containerId: string, input: ContainerLoadItemCreateInput): Promise<ContainerLoadItem> {
  const container = await getContainer(containerId)
  assertEditableStatus(container.status, 'thêm hàng')

  const outbound = await prisma.outbound.findFirst({
    where: { id: input.outboundId, deletedAt: null },
    select: { id: true, code: true, status: true, warehouseId: true, totalQty: true }
  })
  if (!outbound) throw ApiErrors.badRequest('Không tìm thấy outbound', { field: 'outboundId' })
  if (outbound.status === 'cancelled') {
    throw ApiErrors.conflict(`Outbound đã bị huỷ: ${outbound.code}`, { field: 'outboundId' })
  }
  if (container.originWarehouseId && container.originWarehouseId !== outbound.warehouseId) {
    throw ApiErrors.conflict('Outbound không thuộc kho xuất phát của container', {
      field: 'outboundId',
      details: { containerOrigin: container.originWarehouseId, outboundWarehouse: outbound.warehouseId }
    })
  }
  if (input.qty > outbound.totalQty) {
    throw ApiErrors.conflict(`Số lượng vượt totalQty của outbound (${outbound.totalQty})`, { field: 'qty' })
  }

  try {
    return await prisma.containerLoadItem.create({
      data: {
        containerId,
        outboundId: input.outboundId,
        qty: input.qty,
        volumeM3: input.volumeM3,
        weightKg: input.weightKg,
        position: input.position ?? 0,
        notes: input.notes
      }
    })
  } catch (err) {
    if (isUniqueConflict(err)) {
      throw ApiErrors.conflict(`Outbound đã có trong container: ${outbound.code}`, { field: 'outboundId' })
    }
    throw err
  }
}

export async function updateLoadItem(
  containerId: string,
  itemId: string,
  input: ContainerLoadItemUpdateInput
): Promise<ContainerLoadItem> {
  const container = await getContainer(containerId)
  assertEditableStatus(container.status, 'cập nhật hàng')
  const item = container.loadItems.find(i => i.id === itemId)
  if (!item) throw ApiErrors.notFound('Không tìm thấy mục xếp')
  if (input.qty != null) {
    const outbound = await prisma.outbound.findUnique({ where: { id: item.outboundId }, select: { totalQty: true } })
    if (outbound && input.qty > outbound.totalQty) {
      throw ApiErrors.conflict(`Số lượng vượt totalQty của outbound (${outbound.totalQty})`, { field: 'qty' })
    }
  }
  return prisma.containerLoadItem.update({
    where: { id: itemId },
    data: { qty: input.qty, volumeM3: input.volumeM3, weightKg: input.weightKg, position: input.position, notes: input.notes }
  })
}

export async function removeLoadItem(containerId: string, itemId: string): Promise<void> {
  const container = await getContainer(containerId)
  assertEditableStatus(container.status, 'xoá hàng')
  const exists = container.loadItems.some(i => i.id === itemId)
  if (!exists) throw ApiErrors.notFound('Không tìm thấy mục xếp')
  await prisma.containerLoadItem.delete({ where: { id: itemId } })
}

// -----------------------------------------------------------------------------
// Workflow transitions
// -----------------------------------------------------------------------------

export async function planContainer(id: string): Promise<ContainerDetail> {
  const container = await getContainer(id)
  if (container.status !== 'draft') {
    throw ApiErrors.conflict(`Chỉ chuyển sang planned từ draft (hiện tại: ${container.status})`)
  }
  if (container.loadItems.length === 0) {
    throw ApiErrors.conflict('Container chưa có hàng — không thể plan')
  }
  const fill = container.fill
  const overV = fill.volumeUtilizationPct != null && fill.volumeUtilizationPct > 100
  const overW = fill.weightUtilizationPct != null && fill.weightUtilizationPct > 100
  if (overV || overW) {
    throw ApiErrors.conflict('Vượt giới hạn container', {
      details: {
        volumePct: fill.volumeUtilizationPct,
        weightPct: fill.weightUtilizationPct,
        overVolume: overV,
        overWeight: overW
      }
    })
  }
  await prisma.container.update({ where: { id }, data: { status: 'planned' } })
  return getContainer(id)
}

export async function startLoading(id: string): Promise<ContainerDetail> {
  const container = await getContainer(id)
  if (container.status !== 'planned') {
    throw ApiErrors.conflict(`Chỉ start-loading từ planned (hiện tại: ${container.status})`)
  }
  await prisma.container.update({ where: { id }, data: { status: 'loading' } })
  return getContainer(id)
}

export async function finishLoading(id: string): Promise<ContainerDetail> {
  const container = await getContainer(id)
  if (container.status !== 'loading') {
    throw ApiErrors.conflict(`Chỉ finish-loading từ loading (hiện tại: ${container.status})`)
  }
  await prisma.container.update({ where: { id }, data: { status: 'loaded' } })
  return getContainer(id)
}

export async function shipContainer(id: string, input: { departedAt?: string }): Promise<ContainerDetail> {
  const container = await getContainer(id)
  if (container.status !== 'loaded' && container.status !== 'planned') {
    throw ApiErrors.conflict(`Chỉ ship từ loaded (hoặc planned khi bỏ qua loading) — hiện tại: ${container.status}`)
  }
  await prisma.container.update({
    where: { id },
    data: { status: 'shipped', departedAt: input.departedAt ? new Date(input.departedAt) : new Date() }
  })
  return getContainer(id)
}

export async function cancelContainer(id: string, reason: string): Promise<ContainerDetail> {
  const container = await getContainer(id)
  if (container.status === 'cancelled' || container.status === 'shipped') {
    throw ApiErrors.conflict(`Không thể cancel khi status=${container.status}`)
  }
  await prisma.container.update({
    where: { id },
    data: {
      status: 'cancelled',
      cancelledAt: new Date(),
      notes: container.notes ? `${container.notes}\n[CANCELLED] ${reason}` : `[CANCELLED] ${reason}`
    }
  })
  return getContainer(id)
}

// -----------------------------------------------------------------------------
// helpers
// -----------------------------------------------------------------------------

function assertEditableStatus(status: string, action: string): void {
  if (status !== 'draft') {
    throw ApiErrors.conflict(`Chỉ ${action} được khi container ở trạng thái draft (hiện tại: ${status})`)
  }
}

async function assertWarehouseExists(id: string): Promise<void> {
  const exists = await prisma.warehouse.count({ where: { id, deletedAt: null } })
  if (!exists) throw ApiErrors.badRequest('Kho không tồn tại', { field: 'originWarehouseId' })
}

function isUniqueConflict(err: unknown, target?: string): boolean {
  const e = err as { code?: string; meta?: { target?: unknown } }
  if (e?.code !== 'P2002') return false
  if (!target) return true
  const t = e.meta?.target
  return Array.isArray(t) ? t.includes(target) : t === target
}
