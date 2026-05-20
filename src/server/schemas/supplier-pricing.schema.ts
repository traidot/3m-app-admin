import * as v from 'valibot'

const CurrencyEnum = v.picklist(['VND', 'USD', 'EUR', 'JPY', 'CNY', 'KRW'])
const uuid = v.pipe(v.string(), v.trim(), v.uuid('id phải là UUID'))

const isoDate = v.pipe(
  v.string(),
  v.trim(),
  v.isoTimestamp('Ngày phải theo định dạng ISO 8601')
)

export const SupplierPricingCreateSchema = v.pipe(
  v.object({
    supplierId: uuid,
    productId: uuid,
    price: v.pipe(v.number(), v.minValue(0.0001, 'Giá phải > 0')),
    currency: v.optional(CurrencyEnum, 'VND'),
    unit: v.optional(v.pipe(v.string(), v.trim(), v.maxLength(40))),
    moq: v.optional(v.pipe(v.number(), v.integer(), v.minValue(0))),
    effectiveFrom: isoDate,
    effectiveTo: v.optional(v.nullable(isoDate))
  }),
  v.check(
    input => !input.effectiveTo || new Date(input.effectiveFrom) <= new Date(input.effectiveTo),
    'effectiveFrom phải <= effectiveTo'
  )
)

export const SupplierPricingUpdateSchema = v.pipe(
  v.partial(
    v.object({
      price: v.pipe(v.number(), v.minValue(0.0001)),
      currency: CurrencyEnum,
      unit: v.pipe(v.string(), v.trim(), v.maxLength(40)),
      moq: v.pipe(v.number(), v.integer(), v.minValue(0)),
      effectiveFrom: isoDate,
      effectiveTo: v.nullable(isoDate)
    })
  ),
  v.check(input => {
    if (input.effectiveFrom && input.effectiveTo) {
      return new Date(input.effectiveFrom) <= new Date(input.effectiveTo)
    }
    return true
  }, 'effectiveFrom phải <= effectiveTo')
)

export type SupplierPricingCreateInput = v.InferOutput<typeof SupplierPricingCreateSchema>
export type SupplierPricingUpdateInput = v.InferOutput<typeof SupplierPricingUpdateSchema>
