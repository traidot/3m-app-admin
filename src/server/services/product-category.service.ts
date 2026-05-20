import 'server-only'

import type { Prisma, ProductCategory } from '@prisma/client'

import { prisma } from '../db'
import { ApiErrors } from '../lib/api-error'
import type {
  ProductCategoryCreateInput,
  ProductCategoryMoveInput,
  ProductCategoryUpdateInput
} from '../schemas/product-category.schema'

const MAX_DEPTH = 5 // Per screen design "Tối đa 5 cấp".

export interface CategoryTreeNode extends ProductCategory {
  children: CategoryTreeNode[]
}

export async function listCategories(opts?: { status?: 'active' | 'inactive' }): Promise<ProductCategory[]> {
  const where: Prisma.ProductCategoryWhereInput = { deletedAt: null }
  if (opts?.status) where.status = opts.status
  return prisma.productCategory.findMany({
    where,
    orderBy: [{ depth: 'asc' }, { sortOrder: 'asc' }, { name: 'asc' }]
  })
}

export async function getCategoriesAsTree(opts?: { status?: 'active' | 'inactive' }): Promise<CategoryTreeNode[]> {
  const flat = await listCategories(opts)
  const byId = new Map<string, CategoryTreeNode>()
  flat.forEach(node => byId.set(node.id, { ...node, children: [] }))

  const roots: CategoryTreeNode[] = []
  for (const node of byId.values()) {
    if (node.parentId && byId.has(node.parentId)) {
      byId.get(node.parentId)!.children.push(node)
    } else {
      roots.push(node)
    }
  }
  return roots
}

export async function getCategory(id: string): Promise<ProductCategory> {
  const category = await prisma.productCategory.findFirst({ where: { id, deletedAt: null } })
  if (!category) throw ApiErrors.notFound('Không tìm thấy danh mục')
  return category
}

export async function createCategory(input: ProductCategoryCreateInput): Promise<ProductCategory> {
  const { depth, path } = await computeDepthAndPath(input.parentId ?? null)
  if (depth >= MAX_DEPTH) {
    throw ApiErrors.conflict(`Vượt quá độ sâu tối đa (${MAX_DEPTH} cấp)`, { field: 'parentId' })
  }
  try {
    return await prisma.productCategory.create({
      data: {
        code: input.code,
        name: input.name,
        description: input.description,
        parentId: input.parentId ?? null,
        sortOrder: input.sortOrder ?? 0,
        status: input.status ?? 'active',
        depth,
        path
      }
    })
  } catch (err) {
    if (isUniqueConflict(err, 'code')) {
      throw ApiErrors.conflict(`Mã danh mục đã tồn tại: ${input.code}`, { field: 'code' })
    }
    throw err
  }
}

export async function updateCategory(id: string, input: ProductCategoryUpdateInput): Promise<ProductCategory> {
  await getCategory(id)
  // parentId changes go through moveCategory.
  if (input.parentId !== undefined) {
    throw ApiErrors.badRequest('Dùng PATCH /move để đổi parent')
  }
  try {
    return await prisma.productCategory.update({
      where: { id },
      data: {
        code: input.code,
        name: input.name,
        description: input.description,
        sortOrder: input.sortOrder,
        status: input.status
      }
    })
  } catch (err) {
    if (isUniqueConflict(err, 'code')) {
      throw ApiErrors.conflict(`Mã danh mục đã tồn tại: ${input.code}`, { field: 'code' })
    }
    throw err
  }
}

export async function moveCategory(id: string, input: ProductCategoryMoveInput): Promise<ProductCategory> {
  const node = await getCategory(id)
  if (input.parentId === id) {
    throw ApiErrors.badRequest('Không thể đặt parent là chính nó', { field: 'parentId' })
  }
  if (input.parentId) {
    const newParent = await getCategory(input.parentId)
    // Cycle check: new parent path cannot start with this node's path segment.
    const ourSegment = `/${node.id}`
    if (newParent.path === ourSegment || newParent.path.startsWith(`${ourSegment}/`) || newParent.id === node.id) {
      throw ApiErrors.badRequest('Parent mới là descendant — sẽ tạo vòng lặp', { field: 'parentId' })
    }
  }
  const { depth, path } = await computeDepthAndPath(input.parentId ?? null)
  if (depth >= MAX_DEPTH) {
    throw ApiErrors.conflict(`Vượt quá độ sâu tối đa (${MAX_DEPTH} cấp)`, { field: 'parentId' })
  }

  // Update node + cascade depth/path on all descendants.
  return prisma.$transaction(async tx => {
    const updated = await tx.productCategory.update({
      where: { id },
      data: {
        parentId: input.parentId,
        sortOrder: input.sortOrder ?? node.sortOrder,
        depth,
        path
      }
    })
    await rebuildSubtreePaths(tx, updated)
    return updated
  })
}

export async function softDeleteCategory(id: string): Promise<void> {
  const category = await getCategory(id)
  const productCount = await prisma.product.count({ where: { categoryId: category.id, deletedAt: null } })
  if (productCount > 0) {
    throw ApiErrors.conflict(`Không thể xoá: danh mục đang chứa ${productCount} sản phẩm`, {
      details: { productCount }
    })
  }
  const childCount = await prisma.productCategory.count({ where: { parentId: category.id, deletedAt: null } })
  if (childCount > 0) {
    throw ApiErrors.conflict(`Không thể xoá: danh mục đang có ${childCount} danh mục con`, {
      details: { childCount }
    })
  }
  await prisma.productCategory.update({
    where: { id },
    data: { status: 'inactive', deletedAt: new Date() }
  })
}

export async function listCategoryProducts(
  categoryId: string,
  opts: { skip: number; take: number }
): Promise<{ data: Awaited<ReturnType<typeof prisma.product.findMany>>; total: number }> {
  await getCategory(categoryId)
  const where: Prisma.ProductWhereInput = { categoryId, deletedAt: null }
  const [data, total] = await prisma.$transaction([
    prisma.product.findMany({ where, skip: opts.skip, take: opts.take, orderBy: { name: 'asc' } }),
    prisma.product.count({ where })
  ])
  return { data, total }
}

async function computeDepthAndPath(parentId: string | null): Promise<{ depth: number; path: string }> {
  if (!parentId) return { depth: 0, path: '' }
  const parent = await prisma.productCategory.findFirst({ where: { id: parentId, deletedAt: null } })
  if (!parent) throw ApiErrors.badRequest('Parent không tồn tại', { field: 'parentId' })
  const path = parent.path ? `${parent.path}/${parent.id}` : `/${parent.id}`
  return { depth: parent.depth + 1, path }
}

/**
 * Recursively recompute depth+path of every descendant after a move.
 */
async function rebuildSubtreePaths(
  tx: Prisma.TransactionClient,
  parent: ProductCategory
): Promise<void> {
  const children = await tx.productCategory.findMany({ where: { parentId: parent.id, deletedAt: null } })
  for (const child of children) {
    const newPath = parent.path ? `${parent.path}/${parent.id}` : `/${parent.id}`
    const updatedChild = await tx.productCategory.update({
      where: { id: child.id },
      data: { depth: parent.depth + 1, path: newPath }
    })
    await rebuildSubtreePaths(tx, updatedChild)
  }
}

function isUniqueConflict(err: unknown, target?: string): boolean {
  const e = err as { code?: string; meta?: { target?: unknown } }
  if (e?.code !== 'P2002') return false
  if (!target) return true
  const t = e.meta?.target
  return Array.isArray(t) ? t.includes(target) : t === target
}
