import 'server-only'

import type { Prisma, Product } from '@prisma/client'

import { prisma } from '../db'
import { ApiErrors } from '../lib/api-error'
import type { ProductCreateInput, ProductUpdateInput } from '../schemas/product.schema'

export interface ListProductsOpts {
  q?: string
  status?: 'active' | 'inactive'
  categoryId?: string
  skip: number
  take: number
  orderBy?: Prisma.ProductOrderByWithRelationInput
}

export interface ListProductsResult {
  data: (Product & { category?: { id: string; code: string; name: string } | null })[]
  total: number
}

function buildWhere(opts: Pick<ListProductsOpts, 'q' | 'status' | 'categoryId'>): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = { deletedAt: null }
  if (opts.status) where.status = opts.status
  if (opts.categoryId) where.categoryId = opts.categoryId
  if (opts.q) {
    where.OR = [
      { sku: { contains: opts.q, mode: 'insensitive' } },
      { name: { contains: opts.q, mode: 'insensitive' } },
      { barcode: { contains: opts.q, mode: 'insensitive' } }
    ]
  }
  return where
}

export async function listProducts(opts: ListProductsOpts): Promise<ListProductsResult> {
  const where = buildWhere(opts)
  const [data, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      skip: opts.skip,
      take: opts.take,
      orderBy: opts.orderBy ?? { createdAt: 'desc' },
      include: { category: { select: { id: true, code: true, name: true } } }
    }),
    prisma.product.count({ where })
  ])
  return { data, total }
}

export async function getProduct(id: string): Promise<Product> {
  const product = await prisma.product.findFirst({
    where: { id, deletedAt: null },
    include: { category: { select: { id: true, code: true, name: true } } }
  })
  if (!product) throw ApiErrors.notFound('Không tìm thấy sản phẩm')
  return product
}

export async function createProduct(input: ProductCreateInput): Promise<Product> {
  await assertCategoryExists(input.categoryId)
  try {
    return await prisma.product.create({
      data: {
        sku: input.sku,
        name: input.name,
        categoryId: input.categoryId,
        unit: input.unit,
        price: input.price,
        cost: input.cost,
        currency: input.currency ?? 'VND',
        reorderLevel: input.reorderLevel,
        safetyStock: input.safetyStock,
        description: input.description,
        barcode: input.barcode,
        dimensions: input.dimensions,
        weight: input.weight,
        images: input.images ?? undefined,
        status: input.status ?? 'active'
      }
    })
  } catch (err) {
    if (isUniqueConflict(err, 'sku')) {
      throw ApiErrors.conflict(`SKU đã tồn tại: ${input.sku}`, { field: 'sku' })
    }
    throw err
  }
}

export async function updateProduct(id: string, input: ProductUpdateInput): Promise<Product> {
  const existing = await getProduct(id)
  if (input.categoryId && input.categoryId !== existing.categoryId) {
    await assertCategoryExists(input.categoryId)
  }
  // Per design: SKU cannot change once transactions exist. We don't have transactions yet (Phase 4),
  // so just enforce unique on update. Re-evaluate when StockMovement lands.
  try {
    return await prisma.product.update({
      where: { id },
      data: {
        sku: input.sku,
        name: input.name,
        categoryId: input.categoryId,
        unit: input.unit,
        price: input.price,
        cost: input.cost,
        currency: input.currency,
        reorderLevel: input.reorderLevel,
        safetyStock: input.safetyStock,
        description: input.description,
        barcode: input.barcode,
        dimensions: input.dimensions,
        weight: input.weight,
        images: input.images ?? undefined,
        status: input.status
      }
    })
  } catch (err) {
    if (isUniqueConflict(err, 'sku')) {
      throw ApiErrors.conflict(`SKU đã tồn tại: ${input.sku}`, { field: 'sku' })
    }
    throw err
  }
}

/**
 * Soft delete. Phase 2 cannot yet enforce "no active stock / no active PO" because
 * those tables land in Phase 3/4 — checks will be added there.
 */
export async function softDeleteProduct(id: string): Promise<void> {
  const product = await getProduct(id)
  const activePricing = await prisma.supplierPricing.count({
    where: { productId: product.id, deletedAt: null, status: 'active' }
  })
  if (activePricing > 0) {
    throw ApiErrors.conflict('Không thể xoá: sản phẩm đang có bảng giá hiệu lực', {
      details: { activePricing }
    })
  }
  await prisma.product.update({
    where: { id },
    data: { status: 'inactive', deletedAt: new Date() }
  })
}

export async function listProductPricing(
  productId: string,
  opts: { skip: number; take: number }
): Promise<{ data: Awaited<ReturnType<typeof prisma.supplierPricing.findMany>>; total: number }> {
  await getProduct(productId)
  const where: Prisma.SupplierPricingWhereInput = { productId, deletedAt: null }
  const [data, total] = await prisma.$transaction([
    prisma.supplierPricing.findMany({
      where,
      skip: opts.skip,
      take: opts.take,
      orderBy: { effectiveFrom: 'desc' },
      include: { supplier: { select: { id: true, code: true, name: true } } }
    }),
    prisma.supplierPricing.count({ where })
  ])
  return { data, total }
}

async function assertCategoryExists(id: string): Promise<void> {
  const exists = await prisma.productCategory.count({ where: { id, deletedAt: null } })
  if (!exists) throw ApiErrors.badRequest('Danh mục không tồn tại', { field: 'categoryId' })
}

function isUniqueConflict(err: unknown, target?: string): boolean {
  const e = err as { code?: string; meta?: { target?: unknown } }
  if (e?.code !== 'P2002') return false
  if (!target) return true
  const t = e.meta?.target
  return Array.isArray(t) ? t.includes(target) : t === target
}
