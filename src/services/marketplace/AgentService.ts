import { PrismaClient, Currency } from '@prisma/client'

const prisma = new PrismaClient()

export class AgentService {
  /**
   * Check if agent has enough balance for a purchase
   */
  static async hasSufficientBalance(agentId: string, amount: number, currency: Currency = 'USD'): Promise<boolean> {
    const wallet = await prisma.wallet.findUnique({
      where: {
        agentId_currency: { agentId, currency }
      }
    })

    if (!wallet) return false

    const balance = Number(wallet.balance)
    const agent = await prisma.agent.findUnique({ where: { id: agentId } })
    const creditLimit = agent ? Number(agent.creditLimit) : 0

    return (balance + creditLimit) >= amount
  }

  /**
   * Deduct balance from agent wallet
   */
  static async processPurchase(agentId: string, amount: number, orderId: string, currency: Currency = 'USD') {
    return prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.update({
        where: {
          agentId_currency: { agentId, currency }
        },
        data: {
          balance: { decrement: amount }
        }
      })

      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          amount: -amount,
          type: 'PURCHASE',
          referenceId: orderId,
          description: `Purchase of eSIM package`
        }
      })

      return wallet
    })
  }

  /**
   * Top up agent wallet
   */
  static async topUp(agentId: string, amount: number, referenceId: string, currency: Currency = 'USD') {
    return prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.upsert({
        where: {
          agentId_currency: { agentId, currency }
        },
        create: {
          agentId,
          currency,
          balance: amount
        },
        update: {
          balance: { increment: amount }
        }
      })

      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          amount: amount,
          type: 'TOPUP',
          referenceId: referenceId,
          description: `Wallet top-up`
        }
      })

      return wallet
    })
  }
}
