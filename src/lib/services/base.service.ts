// Base Service Class for all modules
// import { PrismaClient } from '@prisma/client' // Disabled - using NestJS backend
import { BusinessError } from '../types/business-error'

export abstract class BaseService {
  // protected prisma: PrismaClient // Disabled - using NestJS backend

  constructor() {
    // this.prisma = new PrismaClient() // Disabled - using NestJS backend
  }

  protected async validateAccess(userId: string): Promise<void> {
    console.warn('[BaseService] validateAccess() called but Prisma is disabled. Backend should handle access validation.')
  }

  protected async checkPermission(userId: string, permission: string): Promise<boolean> {
    console.warn('[BaseService] checkPermission() called but Prisma is disabled. Backend should handle permission checking.')
    return false
  }

  protected async requirePermission(userId: string, permission: string): Promise<void> {
    const hasPermission = await this.checkPermission(userId, permission)
    if (!hasPermission) {
      throw new BusinessError('PERMISSION_DENIED', `Permission required: ${permission}`)
    }
  }

  protected async auditLog(
    userId: string,
    action: string,
    entity: string,
    entityId?: string,
    oldData?: any,
    newData?: any
  ): Promise<void> {
    console.warn('[BaseService] auditLog() called but Prisma is disabled. Backend should handle audit logging.')
  }

  protected handleError(error: any): never {
    if (error instanceof BusinessError) {
      throw error
    }

    console.error('Service Error:', error)
    throw new BusinessError('INTERNAL_ERROR', 'An internal error occurred')
  }

  async disconnect(): Promise<void> {
    // NOTE: Prisma disconnect is disabled - no-op
    // await this.prisma.$disconnect() // Disabled
  }
}
