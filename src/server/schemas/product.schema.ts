import * as v from 'valibot'

const StatusEnum = v.picklist(['active', 'inactive'])
const CurrencyEnum = v.picklist(['VND', 'USD', 'EUR', 'JPY', 'CNY', 'KRW'])
const uuid = v.pipe(v.string(), v.trim(), v.uuid('id phải là UUID'))

const skuRule = v.pipe(
  v.string(),
  v.trim(),
  v.toUpperCase(),
  v.minLength(1, 'SKU không được rỗng'),
  v.maxLength(60),
  v.regex(/^[A-Z0-9._/-]+$/u, 'SKU chỉ gồm chữ HOA, số, . _ - /')
)

const nameRule = v.pipe(v.string(), v.trim(), v.minLength(1), v.maxLength(255))
const optString = (max: number) => v.pipe(v.string(), v.trim(), v.maxLength(max))
const positiveDecimal = v.pipe(v.number(), v.minValue(0, 'Giá trị phải >= 0'))

export const ProductCreateSchema = v.object({
  sku: skuRule,
  name: nameRule,
  categoryId: uuid,
  unit: v.optional(optString(40)),
  price: v.optional(positiveDecimal),
  cost: v.optional(positiveDecimal),
  currency: v.optional(CurrencyEnum, 'VND'),
  reorderLevel: v.optional(v.pipe(v.number(), v.integer(), v.minValue(0))),
  safetyStock: v.optional(v.pipe(v.number(), v.integer(), v.minValue(0))),
  description: v.optional(optString(5000)),
  barcode: v.optional(optString(60)),
  dimensions: v.optional(optString(60)),
  weight: v.optional(positiveDecimal),
  images: v.optional(v.array(v.pipe(v.string(), v.url('Ảnh phải là URL hợp lệ')))),
  status: v.optional(StatusEnum, 'active')
})

export const ProductUpdateSchema = v.partial(ProductCreateSchema)

export type ProductCreateInput = v.InferOutput<typeof ProductCreateSchema>
export type ProductUpdateInput = v.InferOutput<typeof ProductUpdateSchema>
