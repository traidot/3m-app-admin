import * as v from 'valibot'

const TypeEnum = v.picklist(['alert', 'info', 'task'])

export const NotificationCreateSchema = v.object({
  userId: v.pipe(v.string(), v.trim(), v.uuid()),
  type: TypeEnum,
  title: v.pipe(v.string(), v.trim(), v.minLength(1), v.maxLength(200)),
  body: v.optional(v.pipe(v.string(), v.trim(), v.maxLength(2000))),
  link: v.optional(v.pipe(v.string(), v.trim(), v.maxLength(500))),
  meta: v.optional(v.unknown())
})

export type NotificationCreateInput = v.InferOutput<typeof NotificationCreateSchema>
