import type { NextRequest } from 'next/server'
import * as v from 'valibot'

import { ApiErrors } from '@/server/lib/api-error'
import { noContent, ok, withApi } from '@/server/lib/api-response'
import { requirePermission } from '@/server/lib/auth-context'
import { ContainerUpdateSchema } from '@/server/schemas/container.schema'
import { getContainer, softDeleteContainer, updateContainer } from '@/server/services/container.service'

type RouteContext = { params: Promise<{ id: string }> }

export const GET = withApi(async (req: NextRequest, ctx: RouteContext) => {
  requirePermission('containers.view', req)
  const { id } = await ctx.params
  const container = await getContainer(id)
  return ok(container)
})

export const PATCH = withApi(async (req: NextRequest, ctx: RouteContext) => {
  requirePermission('containers.update', req)
  const { id } = await ctx.params
  const body = await readJson(req)
  const parsed = v.safeParse(ContainerUpdateSchema, body)
  if (!parsed.success) {
    throw ApiErrors.validation('Dữ liệu không hợp lệ', { issues: parsed.issues })
  }
  const container = await updateContainer(id, parsed.output)
  return ok(container)
})

export const DELETE = withApi(async (req: NextRequest, ctx: RouteContext) => {
  requirePermission('containers.delete', req)
  const { id } = await ctx.params
  await softDeleteContainer(id)
  return noContent()
})

async function readJson(req: NextRequest): Promise<unknown> {
  try {
    return await req.json()
  } catch {
    throw ApiErrors.badRequest('Body must be valid JSON')
  }
}
