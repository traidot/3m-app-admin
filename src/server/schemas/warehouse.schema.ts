import * as v from 'valibot'

const StatusEnum = v.picklist(['active', 'inactive'])

const codeRule = v.pipe(
  v.string(),
  v.trim(),
  v.toUpperCase(),
  v.minLength(1, 'Mã không được rỗng'),
  v.maxLength(40),
  v.regex(/^[A-Z0-9._-]+$/u, 'Mã chỉ gồm chữ HOA, số, . _ -')
)

export const WarehouseCreateSchema = v.object({
  code: codeRule,
  name: v.pipe(v.string(), v.trim(), v.minLength(1), v.maxLength(255)),
  address: v.optional(v.pipe(v.string(), v.trim(), v.maxLength(1000))),
  status: v.optional(StatusEnum, 'active')
})

export const WarehouseUpdateSchema = v.partial(WarehouseCreateSchema)

export type WarehouseCreateInput = v.InferOutput<typeof WarehouseCreateSchema>
export type WarehouseUpdateInput = v.InferOutput<typeof WarehouseUpdateSchema>
