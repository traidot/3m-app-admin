import 'dotenv/config'
import { PrismaClient, PRStatus, POStatus, Currency } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('▶ Seeding Procurement Data...')

  // 1. Get some existing data
  const user = await prisma.user.findFirst()
  const techSupplier = await prisma.supplier.findFirst({ where: { code: 'SUP-001' } })
  const furnitureSupplier = await prisma.supplier.findFirst({ where: { code: 'SUP-004' } })
  
  const products = await prisma.product.findMany({ take: 5 })

  if (!user || !techSupplier || !furnitureSupplier || products.length < 2) {
    console.error('❌ Missing prerequisite data. Please run seed:system and seed:master-data first.')
    return
  }

  // 2. Create Purchase Requisitions (PR)
  console.log('  → Creating PRs...')
  const pr1 = await prisma.purchaseRequisition.upsert({
    where: { code: 'PR-2026-001' },
    update: {},
    create: {
      code: 'PR-2026-001',
      requestedById: user.id,
      department: 'IT Support',
      priority: 'High',
      status: 'approved',
      neededBy: new Date('2026-05-15'),
      notes: 'Server room upgrade phase 2',
      lines: {
        create: [
          { productId: products[0].id, qty: 5, estimatedPrice: 150000 },
          { productId: products[1].id, qty: 10, estimatedPrice: 250000 }
        ]
      }
    }
  })

  const pr2 = await prisma.purchaseRequisition.upsert({
    where: { code: 'PR-2026-002' },
    update: {},
    create: {
      code: 'PR-2026-002',
      requestedById: user.id,
      department: 'Operations',
      priority: 'Normal',
      status: 'draft',
      neededBy: new Date('2026-06-01'),
      notes: 'General office supplies replenishment',
      lines: {
        create: [
          { productId: products[2].id, qty: 100, estimatedPrice: 5000 }
        ]
      }
    }
  })

  // 3. Create Purchase Orders (PO)
  console.log('  → Creating POs...')
  const po1 = await prisma.purchaseOrder.upsert({
    where: { code: 'PO-2026-001' },
    update: {},
    create: {
      code: 'PO-2026-001',
      supplierId: techSupplier.id,
      status: 'confirmed',
      orderDate: new Date('2026-04-10'),
      expectedDate: new Date('2026-04-25'),
      totalAmount: 5000000,
      currency: 'VND',
      notes: 'Direct purchase for emergency maintenance',
      lines: {
        create: [
          { productId: products[0].id, qty: 20, unitPrice: 250000, lineTotal: 5000000 }
        ]
      }
    }
  })

  console.log('✓ Procurement Seed Complete')
}

main()
  .catch(err => {
    console.error('Seed failed:', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
