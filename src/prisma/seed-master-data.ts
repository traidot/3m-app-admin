/**
 * Master-data seed — idempotent.
 * Creates a small but realistic catalogue: 4 suppliers, ~6 categories (2-level),
 * ~12 products, and ~10 supplier pricing rows.
 *
 * Usage: npm run seed:master-data
 */
import 'dotenv/config'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface CategorySeed {
  code: string
  name: string
  parentCode?: string
  sortOrder?: number
}

interface SupplierSeed {
  code: string
  name: string
  country?: string
  email?: string
  phone?: string
  contactPerson?: string
  paymentTerm?: string
}

interface ProductSeed {
  sku: string
  name: string
  categoryCode: string
  unit: string
  price: number
  cost?: number
  reorderLevel?: number
  safetyStock?: number
  barcode?: string
}

interface PricingSeed {
  supplierCode: string
  productSku: string
  price: number
  currency?: 'VND' | 'USD' | 'EUR'
  unit?: string
  moq?: number
  effectiveFromDaysAgo?: number
}

const CATEGORIES: CategorySeed[] = [
  { code: 'BEV', name: 'Đồ uống', sortOrder: 1 },
  { code: 'BEV-COFFEE', name: 'Cà phê', parentCode: 'BEV', sortOrder: 1 },
  { code: 'BEV-TEA', name: 'Trà', parentCode: 'BEV', sortOrder: 2 },
  { code: 'FOOD', name: 'Thực phẩm', sortOrder: 2 },
  { code: 'FOOD-SNACK', name: 'Đồ ăn vặt', parentCode: 'FOOD', sortOrder: 1 },
  { code: 'PKG', name: 'Bao bì', sortOrder: 3 }
]

const SUPPLIERS: SupplierSeed[] = [
  { code: 'SUP-001', name: 'Công ty TNHH Cà phê Trung Nguyên', country: 'VN', email: 'sales@trungnguyen.example', contactPerson: 'Nguyễn Văn A', paymentTerm: 'Net 30' },
  { code: 'SUP-002', name: 'Phúc Long Coffee & Tea', country: 'VN', email: 'b2b@phuclong.example', paymentTerm: 'Net 15' },
  { code: 'SUP-003', name: 'Lavazza Vietnam', country: 'IT', email: 'vn@lavazza.example', paymentTerm: 'Net 45' },
  { code: 'SUP-004', name: 'Bao bì Tân Tiến', country: 'VN', email: 'order@tantien.example', contactPerson: 'Trần Thị B' }
]

const PRODUCTS: ProductSeed[] = [
  { sku: 'COF-G1KG-001', name: 'Cà phê hạt rang Trung Nguyên 1kg', categoryCode: 'BEV-COFFEE', unit: 'bag', price: 380000, cost: 290000, reorderLevel: 50, safetyStock: 20, barcode: '8934563000011' },
  { sku: 'COF-G500-002', name: 'Cà phê hạt rang Trung Nguyên 500g', categoryCode: 'BEV-COFFEE', unit: 'bag', price: 200000, cost: 150000, reorderLevel: 80, safetyStock: 30 },
  { sku: 'COF-G1KG-003', name: 'Lavazza Crema E Gusto 1kg', categoryCode: 'BEV-COFFEE', unit: 'bag', price: 520000, cost: 410000, reorderLevel: 30, safetyStock: 10 },
  { sku: 'TEA-PL250-001', name: 'Trà Phúc Long Olong 250g', categoryCode: 'BEV-TEA', unit: 'box', price: 180000, cost: 130000, reorderLevel: 40, safetyStock: 15 },
  { sku: 'TEA-PL100-002', name: 'Trà Phúc Long Lài 100g', categoryCode: 'BEV-TEA', unit: 'box', price: 90000, cost: 60000, reorderLevel: 60, safetyStock: 20 },
  { sku: 'SNK-CHIP-001', name: 'Bánh snack khoai tây 80g', categoryCode: 'FOOD-SNACK', unit: 'pack', price: 18000, cost: 11000, reorderLevel: 200, safetyStock: 80 },
  { sku: 'PKG-BOX-S001', name: 'Hộp giấy carton 30x20x15', categoryCode: 'PKG', unit: 'pcs', price: 8500, cost: 5500, reorderLevel: 500, safetyStock: 150 },
  { sku: 'PKG-BOX-M002', name: 'Hộp giấy carton 40x30x25', categoryCode: 'PKG', unit: 'pcs', price: 12500, cost: 8000, reorderLevel: 400, safetyStock: 120 }
]

const PRICING: PricingSeed[] = [
  { supplierCode: 'SUP-001', productSku: 'COF-G1KG-001', price: 290000, unit: 'bag', moq: 10, effectiveFromDaysAgo: 60 },
  { supplierCode: 'SUP-001', productSku: 'COF-G500-002', price: 150000, unit: 'bag', moq: 20, effectiveFromDaysAgo: 60 },
  { supplierCode: 'SUP-002', productSku: 'TEA-PL250-001', price: 130000, unit: 'box', moq: 5, effectiveFromDaysAgo: 30 },
  { supplierCode: 'SUP-002', productSku: 'TEA-PL100-002', price: 60000, unit: 'box', moq: 10, effectiveFromDaysAgo: 30 },
  { supplierCode: 'SUP-003', productSku: 'COF-G1KG-003', price: 18, currency: 'EUR', unit: 'bag', moq: 6, effectiveFromDaysAgo: 90 },
  { supplierCode: 'SUP-004', productSku: 'PKG-BOX-S001', price: 5500, moq: 100, effectiveFromDaysAgo: 14 },
  { supplierCode: 'SUP-004', productSku: 'PKG-BOX-M002', price: 8000, moq: 100, effectiveFromDaysAgo: 14 }
]

async function seedCategories(): Promise<Map<string, string>> {
  const idByCode = new Map<string, string>()

  // Two passes: roots first, then children, so depth/path can be computed.
  for (const seed of CATEGORIES.filter(c => !c.parentCode)) {
    const cat = await prisma.productCategory.upsert({
      where: { code: seed.code },
      update: { name: seed.name, sortOrder: seed.sortOrder ?? 0 },
      create: {
        code: seed.code,
        name: seed.name,
        sortOrder: seed.sortOrder ?? 0,
        depth: 0,
        path: ''
      }
    })
    idByCode.set(seed.code, cat.id)
  }

  for (const seed of CATEGORIES.filter(c => !!c.parentCode)) {
    const parentId = idByCode.get(seed.parentCode!)
    if (!parentId) throw new Error(`Parent category not seeded: ${seed.parentCode}`)
    const parent = await prisma.productCategory.findUniqueOrThrow({ where: { id: parentId } })
    const path = parent.path ? `${parent.path}/${parent.id}` : `/${parent.id}`
    const cat = await prisma.productCategory.upsert({
      where: { code: seed.code },
      update: {
        name: seed.name,
        sortOrder: seed.sortOrder ?? 0,
        parentId,
        depth: parent.depth + 1,
        path
      },
      create: {
        code: seed.code,
        name: seed.name,
        sortOrder: seed.sortOrder ?? 0,
        parentId,
        depth: parent.depth + 1,
        path
      }
    })
    idByCode.set(seed.code, cat.id)
  }

  return idByCode
}

async function seedSuppliers(): Promise<Map<string, string>> {
  const idByCode = new Map<string, string>()
  for (const seed of SUPPLIERS) {
    const sup = await prisma.supplier.upsert({
      where: { code: seed.code },
      update: { name: seed.name, country: seed.country, email: seed.email, phone: seed.phone, contactPerson: seed.contactPerson, paymentTerm: seed.paymentTerm },
      create: { code: seed.code, name: seed.name, country: seed.country, email: seed.email, phone: seed.phone, contactPerson: seed.contactPerson, paymentTerm: seed.paymentTerm }
    })
    idByCode.set(seed.code, sup.id)
  }
  return idByCode
}

async function seedProducts(catByCode: Map<string, string>): Promise<Map<string, string>> {
  const idBySku = new Map<string, string>()
  for (const seed of PRODUCTS) {
    const categoryId = catByCode.get(seed.categoryCode)
    if (!categoryId) throw new Error(`Category not seeded: ${seed.categoryCode}`)
    const product = await prisma.product.upsert({
      where: { sku: seed.sku },
      update: {
        name: seed.name,
        categoryId,
        unit: seed.unit,
        price: seed.price,
        cost: seed.cost,
        reorderLevel: seed.reorderLevel,
        safetyStock: seed.safetyStock,
        barcode: seed.barcode
      },
      create: {
        sku: seed.sku,
        name: seed.name,
        categoryId,
        unit: seed.unit,
        price: seed.price,
        cost: seed.cost,
        reorderLevel: seed.reorderLevel,
        safetyStock: seed.safetyStock,
        barcode: seed.barcode
      }
    })
    idBySku.set(seed.sku, product.id)
  }
  return idBySku
}

async function seedPricing(supByCode: Map<string, string>, prodBySku: Map<string, string>): Promise<number> {
  let count = 0
  for (const seed of PRICING) {
    const supplierId = supByCode.get(seed.supplierCode)
    const productId = prodBySku.get(seed.productSku)
    if (!supplierId || !productId) continue

    const effectiveFrom = new Date()
    effectiveFrom.setDate(effectiveFrom.getDate() - (seed.effectiveFromDaysAgo ?? 0))
    effectiveFrom.setHours(0, 0, 0, 0)

    await prisma.supplierPricing.upsert({
      where: {
        supplierId_productId_currency_effectiveFrom: {
          supplierId,
          productId,
          currency: seed.currency ?? 'VND',
          effectiveFrom
        }
      },
      update: {
        price: seed.price,
        unit: seed.unit,
        moq: seed.moq,
        status: 'active'
      },
      create: {
        supplierId,
        productId,
        price: seed.price,
        currency: seed.currency ?? 'VND',
        unit: seed.unit,
        moq: seed.moq,
        effectiveFrom,
        status: 'active'
      }
    })
    count += 1
  }
  return count
}

async function main() {
  console.log('▶ Seeding categories...')
  const catByCode = await seedCategories()
  console.log(`  ✓ ${catByCode.size} categories`)

  console.log('▶ Seeding suppliers...')
  const supByCode = await seedSuppliers()
  console.log(`  ✓ ${supByCode.size} suppliers`)

  console.log('▶ Seeding products...')
  const prodBySku = await seedProducts(catByCode)
  console.log(`  ✓ ${prodBySku.size} products`)

  console.log('▶ Seeding supplier pricing...')
  const pricingCount = await seedPricing(supByCode, prodBySku)
  console.log(`  ✓ ${pricingCount} pricing rows`)
}

main()
  .catch(err => {
    console.error('Seed failed:', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
