import { NextResponse } from 'next/server'

export interface ApiError {
  message: string
  status: number
  code?: string
}

export class ApiErrorHandler {
  /**
   * Handle service errors and return appropriate HTTP response
   */
  static handle(error: any): NextResponse {
    console.error('API Error:', error)

    const message = error?.message
    const code = error?.code

    // Version conflict (optimistic locking)
    if (code === 'P2025' || /Record đã bị thay đổi/.test(message)) {
      return NextResponse.json({ success: false, message }, { status: 409 })
    }

    // Foreign key constraint violations
    if (code === 'P2003' || /Foreign key constraint/.test(message)) {
      return NextResponse.json({ success: false, message: 'Ràng buộc khóa ngoại không hợp lệ' }, { status: 400 })
    }

    // Generic server error (but return message for easier DX)
    return NextResponse.json({ success: false, message, code }, { status: 500 })
  }

  /**
   * Create success response
   */
  static success(data: any, status: number = 200): NextResponse {
    return NextResponse.json({ success: true, data }, { status })
  }

  /**
   * Create error response
   */
  static error(message: string, status: number = 500): NextResponse {
    return NextResponse.json({ message }, { status })
  }
}
