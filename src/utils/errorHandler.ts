/**
 * Frontend Error Handler
 *
 * Xử lý errors từ backend API dựa trên exception categories:
 * - validation: Show dialog với field errors
 * - check: Show toast với message
 * - business: Show toast với message
 * - user: Redirect to login hoặc NotAuthorized page
 * - system: Redirect to System Error page hoặc show toast tùy context
 */

import { useCallback } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

/**
 * Error response format từ backend (theo ApiResponseDto)
 */
export interface BackendErrorResponse {
  success: false;
  message: string;
  errorCode?: string;
  category?: 'validation' | 'check' | 'business' | 'user' | 'system';
  timestamp?: string;
  path?: string;
  errors?: Record<string, string[]>; // Cho validation errors
  field?: string; // Cho check errors (duplicate, not found)
  value?: any; // Cho check errors
  metadata?: Record<string, any>; // Additional metadata
}

/**
 * Parsed error object
 */
export interface ParsedError {
  message: string;
  category: 'validation' | 'check' | 'business' | 'user' | 'system' | 'network' | 'unknown';
  errorCode?: string;
  statusCode?: number;
  errors?: Record<string, string[]>; // Field errors cho validation
  field?: string;
  value?: any;
  metadata?: Record<string, any>;
  isNetworkError?: boolean;
}

/**
 * Parse error từ API response
 */
export function parseError(error: any): ParsedError {
  // Network errors (không có response)
  if (error.isNetworkError || error.statusCode === 0) {
    const errorMessage = error.message ?? 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
    return {
      message: errorMessage,
      category: 'network',
      statusCode: 0,
      isNetworkError: true,
    };
  }

  // Backend error response (có category, errorCode)
  if (error.category) {
    const errorMessage = error.message ?? 'Đã xảy ra lỗi';
    return {
      message: errorMessage,
      category: error.category,
      errorCode: error.errorCode,
      statusCode: error.statusCode,
      errors: error.errors, // Cho validation
      field: error.field, // Cho check errors
      value: error.value,
      metadata: error.metadata,
    };
  }

  // HTTP status code based errors (fallback)
  if (error.statusCode) {
    let category: ParsedError['category'] = 'unknown';

    if (error.statusCode === 401 || error.statusCode === 403) {
      category = 'user';
    } else if (error.statusCode >= 500) {
      category = 'system';
    } else if (error.statusCode === 400) {
      category = 'validation';
    } else if (error.statusCode === 404 || error.statusCode === 409) {
      category = 'check';
    }

    const errorMessage = error.message ?? 'Đã xảy ra lỗi';
    return {
      message: errorMessage,
      category,
      statusCode: error.statusCode,
      errors: error.errors,
    };
  }

  // Generic error
  const errorMessage = error.message ?? 'Đã xảy ra lỗi không xác định';
  return {
    message: errorMessage,
    category: 'unknown',
  };
}

/**
 * Handle error và quyết định action (show dialog, toast, redirect)
 */
export interface ErrorHandlerOptions {
  /**
   * Show toast notification (default: true cho check/business errors)
   */
  showToast?: boolean;

  /**
   * Show dialog với field errors (default: true cho validation errors)
   */
  showDialog?: boolean;

  /**
   * Redirect to login (default: true cho 401 errors)
   */
  redirectToLogin?: boolean;

  /**
   * Redirect to system error page (default: true cho system errors)
   */
  redirectToSystemError?: boolean;

  /**
   * Custom handler cho từng category
   */
  onValidationError?: (error: ParsedError) => void;
  onCheckError?: (error: ParsedError) => void;
  onBusinessError?: (error: ParsedError) => void;
  onUserError?: (error: ParsedError) => void;
  onSystemError?: (error: ParsedError) => void;
  onNetworkError?: (error: ParsedError) => void;
}

/**
 * Handle error với options
 */
export function handleError(
  error: any,
  options: ErrorHandlerOptions = {}
): ParsedError {
  const parsed = parseError(error);

  const {
    showToast = true,
    showDialog = true,
    redirectToLogin = true,
    redirectToSystemError = true,
    onValidationError,
    onCheckError,
    onBusinessError,
    onUserError,
    onSystemError,
    onNetworkError,
  } = options;

  // Custom handlers
  switch (parsed.category) {
    case 'validation':
      if (onValidationError) {
        onValidationError(parsed);
        return parsed;
      }
      if (showDialog && parsed.errors) {
        // Show dialog với field errors
        // TODO: Implement dialog component
        console.warn('Validation errors:', parsed.errors);
      }
      if (showToast) {
        const toastMessage = parsed.message ?? 'Dữ liệu không hợp lệ';
        toast.error(toastMessage);
      }
      break;

    case 'check':
      if (onCheckError) {
        onCheckError(parsed);
        return parsed;
      }
      if (showToast) {
        toast.error(parsed.message);
      }
      break;

    case 'business':
      if (onBusinessError) {
        onBusinessError(parsed);
        return parsed;
      }
      if (showToast) {
        toast.error(parsed.message);
      }
      break;

    case 'user':
      if (onUserError) {
        onUserError(parsed);
        return parsed;
      }
      // TEMP: Disable redirect để xem log
      // 401: Redirect to login
      if (parsed.statusCode === 401 && redirectToLogin && typeof window !== 'undefined') {
        console.log('[errorHandler] TEMP: 401 error, redirect disabled from:', window.location.pathname);
        // if (!window.location.pathname.includes('/login')) {
        //   window.location.href = '/login';
        // }
      }
      // 403: Show toast (hoặc redirect to NotAuthorized nếu cần)
      else if (parsed.statusCode === 403 && showToast) {
        const toastMessage = parsed.message ?? 'Bạn không có quyền thực hiện thao tác này';
        toast.error(toastMessage);
      }
      break;

    case 'system':
      if (onSystemError) {
        onSystemError(parsed);
        return parsed;
      }
      // Redirect to system error page nếu là critical error
      if (redirectToSystemError && typeof window !== 'undefined') {
        // Chỉ redirect nếu không phải đang ở system error page
        if (!window.location.pathname.includes('/system-error')) {
          window.location.href = '/system-error';
        }
      } else if (showToast) {
        const toastMessage = parsed.message ?? 'Lỗi hệ thống. Vui lòng thử lại sau.';
        toast.error(toastMessage);
      }
      break;

    case 'network':
      if (onNetworkError) {
        onNetworkError(parsed);
        return parsed;
      }
      if (showToast) {
        const toastMessage = parsed.message ?? 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
        toast.error(toastMessage);
      }
      break;

    default:
      if (showToast) {
        const toastMessage = parsed.message ?? 'Đã xảy ra lỗi không xác định';
        toast.error(toastMessage);
      }
  }

  return parsed;
}

/**
 * React hook để handle errors trong components
 */
export function useErrorHandler() {
  const router = useRouter();

  const handle = useCallback((error: any, options?: ErrorHandlerOptions) => {
    return handleError(error, {
      ...options,
      // Override redirects để dùng Next.js router
      onUserError: (parsed) => {
        // TEMP: Disable redirect để xem log
        if (parsed.statusCode === 401 && options?.redirectToLogin !== false) {
          console.log('[useErrorHandler] TEMP: 401 error, redirect disabled');
          // if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          //   router.push('/login');
          // }
        }
        options?.onUserError?.(parsed);
      },
      onSystemError: (parsed) => {
        if (options?.redirectToSystemError !== false) {
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/system-error')) {
            router.push('/system-error');
          }
        }
        options?.onSystemError?.(parsed);
      },
    });
  }, [router]);

  return { handle, parseError };
}

