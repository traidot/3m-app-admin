import { PrismaClient } from '@prisma/client'
import { AgentService } from './AgentService'
import { PricingService } from './PricingService'

const prisma = new PrismaClient()

export class DigitalOrderService {
  /**
   * Create a new digital order (Buy eSIM)
   */
  static async createOrder(data: {
    agentId: string
    marketplaceProductId: string
    customerEmail?: string
  }) {
    const { agentId, marketplaceProductId, customerEmail } = data

    return prisma.$transaction(async (tx) => {
      // 1. Get Product & Pricing
      const product = await tx.marketplaceProduct.findUnique({
        where: { id: marketplaceProductId },
        include: {
          supplierProducts: {
            where: { isAvailable: true },
            orderBy: { costPrice: 'asc' },
            take: 1
          }
        }
      })

      if (!product || product.supplierProducts.length === 0) {
        throw new Error('Product not available or no supplier found')
      }

      const supplierProduct = product.supplierProducts[0]
      
      // 2. Calculate Final Price for Agent
      // In a real app, we would fetch the Agent's specific pricing rule
      const pricingRule = await tx.pricingRule.findFirst({
        where: {
          OR: [
            { agentId },
            { marketplaceProductId },
            { tier: (await tx.agent.findUnique({ where: { id: agentId } }))?.tier }
          ]
        },
        orderBy: { priority: 'desc' }
      })

      const markupPercent = pricingRule ? Number(pricingRule.markupValue) : 10 // Default 10%
      
      const finalPrice = PricingService.calculatePrice({
        costPrice: Number(supplierProduct.costPrice),
        exchangeRate: 1, // Assume USD for now
        opsFee: 0,
        markupPercent: markupPercent,
        markupFixed: 0
      })

      // 3. Check Balance
      const hasBalance = await AgentService.hasSufficientBalance(agentId, finalPrice)
      if (!hasBalance) {
        throw new Error('Insufficient balance')
      }

      // 4. Create Order record
      const order = await tx.digitalOrder.create({
        data: {
          agentId,
          marketplaceProductId,
          supplierProductId: supplierProduct.id,
          status: 'PROCESSING',
          unitPrice: finalPrice,
          totalAmount: finalPrice,
          customerEmail,
          currency: supplierProduct.currency
        }
      })

      // 5. Deduct Balance
      await AgentService.processPurchase(agentId, finalPrice, order.id, supplierProduct.currency)

      return order
    })
  }

  /**
   * Update order status (e.g. from Supplier Webhook)
   */
  static async updateOrderStatus(orderId: string, status: string, activationCode?: string) {
    return prisma.digitalOrder.update({
      where: { id: orderId },
      data: {
        status,
        activationCode,
        updatedAt: new Date()
      }
    })
  }
}
