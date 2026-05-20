import * as v from 'valibot'

const StatusEnum = v.picklist(['active', 'inactive'])
const uuid = v.pipe(v.string(), v.trim(), v.uuid('id phải là UUID'))

const codeRule = v.pipe(
  v.string(),
  v.trim(),
  v.toUpperCase(),
  v.minLength(1, 'Mã không được rỗng'),
  v.maxLength(40),
  v.regex(/^[A-Z0-9._-]+$/u, 'Mã chỉ gồm chữ HOA, số, . _ -')
)

const nameRule = v.pipe(v.string(), v.trim(), v.minLength(1, 'Tên không được rỗng'), v.maxLength(255))

export const ProductCategoryCreateSchema = v.object({
  code: codeRule,
  name: nameRule,
  description: v.optional(v.pipe(v.string(), v.trim(), v.maxLength(2000))),
  parentId: v.optional(v.nullable(uuid)),
  sortOrder: v.optional(v.pipe(v.number(), v.integer(), v.minValue(0)), 0),
  status: v.optional(StatusEnum, 'active')
})

export const ProductCategoryUpdateSchema = v.partial(ProductCategoryCreateSchema)

export const ProductCategoryMoveSchema = v.object({
  parentId: v.nullable(uuid),
  sortOrder: v.optional(v.pipe(v.number(), v.integer(), v.minValue(0)))
})

export type ProductCategoryCreateInput = v.InferOutput<typeof ProductCategoryCreateSchema>
export type ProductCategoryUpdateInput = v.InferOutput<typeof ProductCategoryUpdateSchema>
export type ProductCategoryMoveInput = v.InferOutput<typeof ProductCategoryMoveSchema>
