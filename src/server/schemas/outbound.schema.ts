import * as v from 'valibot'

const uuid = v.pipe(v.string(), v.trim(), v.uuid('id phải là UUID'))
const isoDate = v.pipe(v.string(), v.trim(), v.isoTimestamp('Ngày phải theo định dạng ISO 8601'))

const TargetTypeEnum = v.picklist(['customer', 'warehouse', 'supplier'])

const lineRule = v.object({
  productId: uuid,
  requestedQty: v.pipe(v.number(), v.integer(), v.minValue(1, 'requestedQty phải >= 1')),
  note: v.optional(v.pipe(v.string(), v.trim(), v.maxLength(500)))
})

export const OutboundCreateSchema = v.object({
  warehouseId: uuid,
  targetType: TargetTypeEnum,
  targetId: v.optional(v.nullable(v.pipe(v.string(), v.trim(), v.maxLength(60)))),
  scheduledAt: v.optional(v.nullable(isoDate)),
  notes: v.optional(v.pipe(v.string(), v.trim(), v.maxLength(2000))),
  lines: v.pipe(v.array(lineRule), v.minLength(1, 'Cần tối thiểu 1 dòng'))
})

export const OutboundUpdateSchema = v.partial(
  v.object({
    notes: v.pipe(v.string(), v.trim(), v.maxLength(2000)),
    targetId: v.nullable(v.pipe(v.string(), v.trim(), v.maxLength(60))),
    scheduledAt: v.nullable(isoDate),
    lines: v.pipe(v.array(lineRule), v.minLength(1))
  })
)

export const InventoryAdjustSchema = v.object({
  qty: v.pipe(v.number(), v.integer()),
  reason: v.pipe(v.string(), v.trim(), v.minLength(3, 'Lý do tối thiểu 3 ký tự'), v.maxLength(500))
})

export type OutboundCreateInput = v.InferOutput<typeof OutboundCreateSchema>
export type OutboundUpdateInput = v.InferOutput<typeof OutboundUpdateSchema>
export type InventoryAdjustInput = v.InferOutput<typeof InventoryAdjustSchema>
