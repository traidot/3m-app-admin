import type { NextRequest } from 'next/server'
import * as v from 'valibot'

import { ApiErrors } from '@/server/lib/api-error'
import { noContent, ok, withApi } from '@/server/lib/api-response'
import { requirePermission } from '@/server/lib/auth-context'
import { ContainerLoadItemUpdateSchema } from '@/server/schemas/container.schema'
import { removeLoadItem, updateLoadItem } from '@/server/services/container.service'

type RouteContext = { params: Promise<{ id: string; itemId: string }> }

export const PATCH = withApi(async (req: NextRequest, ctx: RouteContext) => {
  requirePermission('containers.update', req)
  const { id, itemId } = await ctx.params
  const body = await readJson(req)
  const parsed = v.safeParse(ContainerLoadItemUpdateSchema, body)
  if (!parsed.success) {
    throw ApiErrors.validation('Dữ liệu không hợp lệ', { issues: parsed.issues })
  }
  const item = await updateLoadItem(id, itemId, parsed.output)
  return ok(item)
})

export const DELETE = withApi(async (req: NextRequest, ctx: RouteContext) => {
  requirePermission('containers.update', req)
  const { id, itemId } = await ctx.params
  await removeLoadItem(id, itemId)
  return noContent()
})

async function readJson(req: NextRequest): Promise<unknown> {
  try {
    return await req.json()
  } catch {
    throw ApiErrors.badRequest('Body must be valid JSON')
  }
}
