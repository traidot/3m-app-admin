import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { POStatus, PRStatus } from '@prisma/client'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: prId } = await params

    // 1. Fetch the PR with its lines
    const pr = await prisma.purchaseRequisition.findUnique({
      where: { id: prId },
      include: { lines: true }
    })

    if (!pr) {
      return NextResponse.json({ error: 'PR not found' }, { status: 404 })
    }

    if (pr.status !== PRStatus.approved) {
      return NextResponse.json({ error: 'Only approved PRs can be converted to PO' }, { status: 400 })
    }

    // 2. We need a supplier. In a real system, we might ask which supplier to use.
    // For now, we'll take the first supplier that has a price for the first item, or just pick one.
    // Let's assume the request body contains supplierId.
    const body = await request.json()
    const { supplierId } = body

    if (!supplierId) {
      return NextResponse.json({ error: 'Supplier ID is required for conversion' }, { status: 400 })
    }

    // 3. Create the PO
    const po = await prisma.$transaction(async (tx) => {
      // Create PO Header
      const newPo = await tx.purchaseOrder.create({
        data: {
          code: `PO-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
          prId: pr.id,
          supplierId,
          status: POStatus.draft,
          totalAmount: 0, // Will update after lines
          orderDate: new Date(),
        }
      })

      let totalAmount = 0

      // Create PO Lines from PR Lines
      for (const line of pr.lines) {
        // Handle Decimal multiplication
        const unitPriceNum = Number(line.estimatedPrice || 0)
        const lineTotalNum = unitPriceNum * line.qty
        
        await tx.purchaseOrderLine.create({
          data: {
            poId: newPo.id,
            productId: line.productId,
            qty: line.qty,
            unitPrice: unitPriceNum,
            lineTotal: lineTotalNum
          }
        })
        
        totalAmount += lineTotalNum
      }

      // Update PO total
      const updatedPo = await tx.purchaseOrder.update({
        where: { id: newPo.id },
        data: { totalAmount }
      })

      // Update PR status
      await tx.purchaseRequisition.update({
        where: { id: pr.id },
        data: { status: PRStatus.converted_to_po }
      })

      return updatedPo
    })

    return NextResponse.json(po)

  } catch (error: any) {
    console.error('PR Conversion Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
