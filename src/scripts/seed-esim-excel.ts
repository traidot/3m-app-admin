import { PrismaClient, CommonStatus } from '@prisma/client'
import ExcelJS from 'exceljs'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Bắt đầu quá trình Seed dữ liệu eSIM từ Excel...')

  // 1. Tạo Nhà cung cấp NCC1
  const supplier = await prisma.supplier.upsert({
    where: { code: 'NCC1' },
    update: {},
    create: {
      code: 'NCC1',
      name: 'Nhà cung cấp 1 (Global eSIM)',
      status: 'active'
    }
  })

  // 2. Đọc file Excel NCC1
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.readFile('/Users/david/Developments/GitHub/esim-market/sample/Gói esim NCC1.xlsx')
  const worksheet = workbook.getWorksheet(1)

  let count = 0
  if (worksheet) {
    for (let i = 3; i <= worksheet.rowCount; i++) {
      const row = worksheet.getRow(i)
      const externalCode = row.getCell(16).value?.toString() || ''
      const country = row.getCell(10).value?.toString() || ''
      const data = row.getCell(8).value?.toString() || ''
      const daysStr = row.getCell(7).value?.toString() || '1'
      const days = parseInt(daysStr) || 1
      const priceStr = row.getCell(11).value?.toString() || '0'
      const price = parseFloat(priceStr) || 0

      const region = row.getCell(2).value?.toString() || 'Global'

      if (!externalCode || !country) continue

      // A. Tạo Marketplace Product (Nếu chưa có)
      const marketplaceProduct = await prisma.marketplaceProduct.upsert({
        where: { code: `${country}-${data}-${days}D`.replace(/\s+/g, '') },
        update: {},
        create: {
          code: `${country}-${data}-${days}D`.replace(/\s+/g, ''),
          name: `${country} - ${data} - ${days} Ngày`,
          region: region, // Region (Col B)
          dataAmount: data.includes('GB') ? parseInt(data) * 1024 : parseInt(data) || 500,
          validityDays: days,
          status: 'active'
        }
      })

      // B. Tạo Supplier Product
      await prisma.supplierProduct.upsert({
        where: {
          supplierId_externalCode: {
            supplierId: supplier.id,
            externalCode: externalCode
          }
        },
        update: { costPrice: price },
        create: {
          supplierId: supplier.id,
          marketplaceProductId: marketplaceProduct.id,
          externalCode: externalCode,
          costPrice: price,
          currency: 'USD'
        }
      })

      count++
      if (count % 50 === 0) console.log(`已导入 ${count} gói cước...`)
    }
  }

  // 3. Tạo Nhà cung cấp ZEYFI
  const supplierZ = await prisma.supplier.upsert({
    where: { code: 'ZEYFI' },
    update: {},
    create: {
      code: 'ZEYFI',
      name: 'ZEYFI eSIM',
      status: 'active'
    }
  })

  // 4. Đọc file Excel ZEYFI
  const workbookZ = new ExcelJS.Workbook()
  await workbookZ.xlsx.readFile('/Users/david/Developments/GitHub/esim-market/sample/ZEYFI_eSIM一覧_20260415.xlsx')
  const worksheetZ = workbookZ.getWorksheet(1)

  let countZ = 0
  if (worksheetZ) {
    for (let i = 3; i <= worksheetZ.rowCount; i++) {
      const row = worksheetZ.getRow(i)
      const region = row.getCell(2).value?.toString() || 'Global'
      const country = row.getCell(3).value?.toString() || ''
      const data = row.getCell(6).value?.toString() || ''
      const daysStr = row.getCell(5).value?.toString() || '1'
      const days = parseInt(daysStr) || 1
      const priceStr = row.getCell(8).value?.toString() || '0'
      const price = parseFloat(priceStr) || 0
      const packageCode = row.getCell(1).value?.toString() || '' // Dùng ID dòng làm code tạm nếu thiếu

      if (!country || !data) continue

      // A. Tạo Marketplace Product
      const marketplaceProduct = await prisma.marketplaceProduct.upsert({
        where: { code: `${country}-${data}-${days}D`.replace(/\s+/g, '') },
        update: {},
        create: {
          code: `${country}-${data}-${days}D`.replace(/\s+/g, ''),
          name: `${country} - ${data} - ${days} Ngày`,
          region: region,
          dataAmount: data.includes('GB') ? parseInt(data) * 1024 : parseInt(data) || 500,
          validityDays: days,
          status: 'active'
        }
      })

      // B. Tạo Supplier Product
      await prisma.supplierProduct.upsert({
        where: {
          supplierId_externalCode: {
            supplierId: supplierZ.id,
            externalCode: `Z-${packageCode}`
          }
        },
        update: { costPrice: price },
        create: {
          supplierId: supplierZ.id,
          marketplaceProductId: marketplaceProduct.id,
          externalCode: `Z-${packageCode}`,
          costPrice: price,
          currency: 'USD'
        }
      })

      countZ++
    }
  }

  console.log(`✅ Hoàn thành! Đã seed ${countZ} gói cước từ ZEYFI.`)
  console.log('🚀 Tổng cộng đã nạp xong toàn bộ dữ liệu từ 2 nhà cung cấp.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
