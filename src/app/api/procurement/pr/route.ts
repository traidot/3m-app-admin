import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { PRStatus } from '@prisma/client'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      requestedById, 
      department, 
      priority, 
      neededBy, 
      notes, 
      items 
    } = body

    if (!requestedById || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const pr = await prisma.purchaseRequisition.create({
      data: {
        code: `PR-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
        requestedById,
        department,
        priority: priority || 'Normal',
        neededBy: neededBy ? new Date(neededBy) : null,
        notes,
        status: PRStatus.draft,
        lines: {
          create: items.map((item: any) => ({
            productId: item.productId,
            qty: item.qty,
            estimatedPrice: item.estimatedPrice
          }))
        }
      },
      include: {
        lines: true
      }
    })

    return NextResponse.json(pr)

  } catch (error: any) {
    console.error('PR Creation Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const requisitions = await prisma.purchaseRequisition.findMany({
      include: {
        lines: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(requisitions)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
