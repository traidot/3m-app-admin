// Business Error Class for handling application errors
export class BusinessError extends Error {
  public readonly code: string
  public readonly statusCode: number

  constructor(code: string, message: string, statusCode: number = 400) {
    super(message)
    this.name = 'BusinessError'
    this.code = code
    this.statusCode = statusCode
  }
}
