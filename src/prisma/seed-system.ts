/**
 * System seed — idempotent.
 * - Default roles + permissions for the Purchase Management System.
 * - Bootstrap admin user (only when no users exist).
 *
 * Usage: pnpm seed:system   |   npm run seed:system
 */
import 'dotenv/config'

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

interface PermissionSeed {
  key: string
  resource: string
  action: string
  description?: string
}

interface RoleSeed {
  key: string
  name: string
  description?: string
  permissions: 'all' | string[]
}

const RESOURCES = [
  'users',
  'roles',
  'suppliers',
  'products',
  'product_categories',
  'supplier_pricing',
  'quotations',
  'purchase_orders',
  'inbound',
  'inventory',
  'outbound',
  'containers',
  'invoices',
  'packing_lists',
  'reports',
  'settings',
  'notifications'
] as const

const ACTIONS = ['view', 'create', 'update', 'delete', 'approve', 'export', 'import'] as const

const PERMISSIONS: PermissionSeed[] = RESOURCES.flatMap(resource =>
  ACTIONS.map(action => ({
    key: `${resource}.${action}`,
    resource,
    action
  }))
)

const ROLES: RoleSeed[] = [
  { key: 'admin', name: 'Quản trị hệ thống', description: 'Toàn quyền', permissions: 'all' },
  {
    key: 'purchasing',
    name: 'Mua hàng',
    permissions: [
      'suppliers.view', 'suppliers.create', 'suppliers.update',
      'products.view', 'products.create', 'products.update',
      'supplier_pricing.view', 'supplier_pricing.create', 'supplier_pricing.update',
      'quotations.view', 'quotations.create', 'quotations.update', 'quotations.approve',
      'purchase_orders.view', 'purchase_orders.create', 'purchase_orders.update', 'purchase_orders.approve',
      'inbound.view'
    ]
  },
  {
    key: 'warehouse',
    name: 'Kho',
    permissions: [
      'products.view',
      'inbound.view', 'inbound.create', 'inbound.update', 'inbound.approve',
      'inventory.view', 'inventory.update',
      'outbound.view', 'outbound.create', 'outbound.update', 'outbound.approve',
      'containers.view'
    ]
  },
  {
    key: 'logistics',
    name: 'Logistics',
    permissions: [
      'containers.view', 'containers.create', 'containers.update', 'containers.approve',
      'outbound.view',
      'invoices.view',
      'packing_lists.view', 'packing_lists.create', 'packing_lists.update'
    ]
  },
  {
    key: 'accounting',
    name: 'Kế toán',
    permissions: [
      'invoices.view', 'invoices.create', 'invoices.update', 'invoices.approve', 'invoices.export',
      'purchase_orders.view',
      'reports.view', 'reports.export'
    ]
  },
  {
    key: 'manager',
    name: 'Quản lý',
    permissions: [
      ...RESOURCES.map(r => `${r}.view`),
      'reports.export',
      'quotations.approve',
      'purchase_orders.approve',
      'inbound.approve',
      'outbound.approve',
      'invoices.approve'
    ]
  },
  {
    key: 'viewer',
    name: 'Chỉ xem',
    permissions: RESOURCES.map(r => `${r}.view`)
  }
]

async function upsertPermissions() {
  for (const p of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { key: p.key },
      create: { key: p.key, resource: p.resource, action: p.action, description: p.description },
      update: { resource: p.resource, action: p.action, description: p.description }
    })
  }
  console.log(`✔ permissions: ${PERMISSIONS.length}`)
}

async function upsertRoles() {
  const allPerms = await prisma.permission.findMany({ select: { id: true, key: true } })
  const permIdByKey = new Map(allPerms.map(p => [p.key, p.id]))

  for (const r of ROLES) {
    const role = await prisma.role.upsert({
      where: { key: r.key },
      create: { key: r.key, name: r.name, description: r.description, isSystem: true },
      update: { name: r.name, description: r.description, isSystem: true }
    })

    const targetKeys = r.permissions === 'all' ? allPerms.map(p => p.key) : r.permissions
    const targetIds = targetKeys.map(k => permIdByKey.get(k)).filter((id): id is string => Boolean(id))

    // Replace role permissions atomically
    await prisma.$transaction([
      prisma.rolePermission.deleteMany({ where: { roleId: role.id } }),
      prisma.rolePermission.createMany({
        data: targetIds.map(permissionId => ({ roleId: role.id, permissionId })),
        skipDuplicates: true
      })
    ])
    console.log(`✔ role ${r.key}: ${targetIds.length} permissions`)
  }
}

async function ensureBootstrapAdmin() {
  const userCount = await prisma.user.count()
  if (userCount > 0) {
    console.log('• users already exist — skipping bootstrap admin')
    return
  }
  const email = (process.env.SEED_ADMIN_EMAIL ?? 'admin@3m-app.local').toLowerCase()
  const password = process.env.SEED_ADMIN_PASSWORD ?? 'ChangeMe!2026'
  const passwordHash = await bcrypt.hash(password, 12)
  const admin = await prisma.user.create({
    data: {
      email,
      passwordHash,
      firstName: 'System',
      lastName: 'Admin',
      status: 'active'
    }
  })
  const adminRole = await prisma.role.findUnique({ where: { key: 'admin' } })
  if (adminRole) {
    await prisma.userRole.create({ data: { userId: admin.id, roleId: adminRole.id } })
  }
  console.log(`✔ bootstrap admin: ${email} (password from SEED_ADMIN_PASSWORD or default)`)
}

async function main() {
  console.log('▶ seed-system')
  await upsertPermissions()
  await upsertRoles()
  await ensureBootstrapAdmin()
  console.log('✓ done')
}

main()
  .catch(err => {
    console.error('✗ seed-system failed:', err)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
