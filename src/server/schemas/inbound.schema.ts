import * as v from 'valibot'

const uuid = v.pipe(v.string(), v.trim(), v.uuid('id phải là UUID'))
const isoDate = v.pipe(v.string(), v.trim(), v.isoTimestamp('Ngày phải theo định dạng ISO 8601'))

const SourceTypeEnum = v.picklist(['po', 'return_inbound', 'transfer_in', 'manual'])

const lineRule = v.object({
  productId: uuid,
  qty: v.pipe(v.number(), v.integer(), v.minValue(1, 'qty phải >= 1')),
  lot: v.optional(v.pipe(v.string(), v.trim(), v.maxLength(60)), ''),
  expiry: v.optional(v.nullable(isoDate)),
  note: v.optional(v.pipe(v.string(), v.trim(), v.maxLength(500)))
})

export const InboundCreateSchema = v.object({
  warehouseId: uuid,
  sourceType: SourceTypeEnum,
  sourceId: v.optional(v.nullable(v.pipe(v.string(), v.trim(), v.maxLength(60)))),
  notes: v.optional(v.pipe(v.string(), v.trim(), v.maxLength(2000))),
  lines: v.pipe(v.array(lineRule), v.minLength(1, 'Cần tối thiểu 1 dòng'))
})

export const InboundUpdateSchema = v.partial(
  v.object({
    notes: v.pipe(v.string(), v.trim(), v.maxLength(2000)),
    sourceId: v.nullable(v.pipe(v.string(), v.trim(), v.maxLength(60))),
    lines: v.pipe(v.array(lineRule), v.minLength(1))
  })
)

export type InboundCreateInput = v.InferOutput<typeof InboundCreateSchema>
export type InboundUpdateInput = v.InferOutput<typeof InboundUpdateSchema>
