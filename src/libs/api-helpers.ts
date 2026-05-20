import type { NextRequest } from 'next/server';

/**
 * Lấy cookie và Authorization header từ NextRequest.
 * - Ưu tiên header Authorization nếu đã được gửi từ client.
 * - Nếu thiếu, cố gắng đọc `accessToken` trong cookie và tạo header Bearer.
 */
export function getAuthHeaders(req: NextRequest): {
  cookieHeader: string;
  authHeader?: string;
} {
  const cookieHeader = req.headers.get('cookie') || '';
  let authHeader = req.headers.get('authorization') || '';

  if (!authHeader) {
    const accessTokenMatch = cookieHeader.match(/accessToken=([^;]+)/);
    if (accessTokenMatch?.[1]) {
      authHeader = `Bearer ${accessTokenMatch[1]}`;
    }
  }

  return {
    cookieHeader,
    ...(authHeader ? { authHeader } : {}),
  };
}

