import * as v from 'valibot'

const TypeEnum = v.picklist(['ft20', 'ft40', 'ft40hc', 'refrigerated', 'custom'])
const StatusEnum = v.picklist(['draft', 'planned', 'loading', 'loaded', 'shipped', 'cancelled'])
const uuid = v.pipe(v.string(), v.trim(), v.uuid('id phải là UUID'))

const codeRule = v.pipe(
  v.string(),
  v.trim(),
  v.toUpperCase(),
  v.minLength(1, 'Mã không được rỗng'),
  v.maxLength(40, 'Mã tối đa 40 ký tự'),
  v.regex(/^[A-Z0-9._/-]+$/u, 'Mã chỉ gồm chữ HOA, số, . _ - /')
)

const nonEmptyName = v.pipe(v.string(), v.trim(), v.maxLength(255))
const optString = (max: number) => v.pipe(v.string(), v.trim(), v.maxLength(max))
const positiveNumber = v.pipe(v.number(), v.minValue(0.001, 'Phải > 0'))
const nonNegativeNumber = v.pipe(v.number(), v.minValue(0, 'Phải >= 0'))
const positiveInt = v.pipe(v.number(), v.integer(), v.minValue(1, 'Số lượng phải >= 1'))

const isoTimestamp = v.pipe(v.string(), v.trim(), v.isoTimestamp('Ngày phải theo định dạng ISO 8601'))

export const ContainerCreateSchema = v.object({
  code: v.optional(codeRule),
  name: v.optional(nonEmptyName),
  type: TypeEnum,
  maxVolumeM3: positiveNumber,
  maxWeightKg: positiveNumber,
  originWarehouseId: v.optional(v.nullable(uuid)),
  destination: v.optional(optString(255)),
  plannedDepartureAt: v.optional(v.nullable(isoTimestamp)),
  notes: v.optional(optString(2000))
})

export const ContainerUpdateSchema = v.partial(
  v.object({
    name: nonEmptyName,
    type: TypeEnum,
    maxVolumeM3: positiveNumber,
    maxWeightKg: positiveNumber,
    originWarehouseId: v.nullable(uuid),
    destination: optString(255),
    plannedDepartureAt: v.nullable(isoTimestamp),
    notes: optString(2000)
  })
)

export const ContainerLoadItemCreateSchema = v.object({
  outboundId: uuid,
  qty: positiveInt,
  volumeM3: v.optional(nonNegativeNumber),
  weightKg: v.optional(nonNegativeNumber),
  position: v.optional(v.pipe(v.number(), v.integer(), v.minValue(0)), 0),
  notes: v.optional(optString(1000))
})

export const ContainerLoadItemUpdateSchema = v.partial(
  v.object({
    qty: positiveInt,
    volumeM3: nonNegativeNumber,
    weightKg: nonNegativeNumber,
    position: v.pipe(v.number(), v.integer(), v.minValue(0)),
    notes: optString(1000)
  })
)

export const ContainerCancelSchema = v.object({
  reason: v.pipe(v.string(), v.trim(), v.minLength(3, 'Lý do tối thiểu 3 ký tự'), v.maxLength(500))
})

export const ContainerShipSchema = v.object({
  departedAt: v.optional(isoTimestamp)
})

export type ContainerCreateInput = v.InferOutput<typeof ContainerCreateSchema>
export type ContainerUpdateInput = v.InferOutput<typeof ContainerUpdateSchema>
export type ContainerLoadItemCreateInput = v.InferOutput<typeof ContainerLoadItemCreateSchema>
export type ContainerLoadItemUpdateInput = v.InferOutput<typeof ContainerLoadItemUpdateSchema>
export type ContainerCancelInput = v.InferOutput<typeof ContainerCancelSchema>
export type ContainerShipInput = v.InferOutput<typeof ContainerShipSchema>

export type ContainerStatus = v.InferOutput<typeof StatusEnum>
export type ContainerType = v.InferOutput<typeof TypeEnum>
