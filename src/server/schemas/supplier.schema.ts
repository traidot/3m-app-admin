import * as v from 'valibot'

const StatusEnum = v.picklist(['active', 'inactive'])

const codeRule = v.pipe(
  v.string(),
  v.trim(),
  v.toUpperCase(),
  v.minLength(1, 'Mã không được rỗng'),
  v.maxLength(40, 'Mã tối đa 40 ký tự'),
  v.regex(/^[A-Z0-9._-]+$/u, 'Mã chỉ gồm chữ HOA, số, . _ -')
)

const nameRule = v.pipe(v.string(), v.trim(), v.minLength(1, 'Tên không được rỗng'), v.maxLength(255))
const emailRule = v.pipe(v.string(), v.trim(), v.toLowerCase(), v.email('Email không hợp lệ'))
const phoneRule = v.pipe(v.string(), v.trim(), v.maxLength(40))
const optString = (max = 255) => v.pipe(v.string(), v.trim(), v.maxLength(max))

export const SupplierCreateSchema = v.object({
  code: codeRule,
  name: nameRule,
  phone: v.optional(phoneRule),
  email: v.optional(emailRule),
  country: v.optional(optString(100)),
  address: v.optional(optString(1000)),
  taxCode: v.optional(optString(40)),
  contactPerson: v.optional(optString(255)),
  paymentTerm: v.optional(optString(255)),
  notes: v.optional(optString(2000)),
  status: v.optional(StatusEnum, 'active'),
  externalId: v.optional(optString(100)),
  externalSource: v.optional(optString(40))
})

export const SupplierUpdateSchema = v.partial(SupplierCreateSchema)

export type SupplierCreateInput = v.InferOutput<typeof SupplierCreateSchema>
export type SupplierUpdateInput = v.InferOutput<typeof SupplierUpdateSchema>
