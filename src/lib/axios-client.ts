/**
 * Axios Client với Interceptors
 * - Request Interceptor: Tự động thêm Authorization header từ httpOnly cookie
 * - Response Interceptor: Xử lý 401, refresh token, error handling
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  timestamp?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
  category?: 'validation' | 'check' | 'business' | 'user' | 'system';
  errorCode?: string;
  field?: string;
  value?: any;
  metadata?: Record<string, any>;
}

/**
 * Token cache để tránh gọi API nhiều lần
 */
let tokenCache: string | null = null;
let tokenCacheTime: number = 0;
let tokenExpiry: number = 0; // Timestamp khi token hết hạn
const TOKEN_CACHE_DURATION = 5 * 60 * 1000; // 5 phút

/**
 * Lấy access token từ httpOnly cookie (qua API route)
 * - Dùng AuthService
 */
const getAuthToken = async (): Promise<string | null> => {
  if (typeof window === 'undefined') return null;

  const now = Date.now();

  // Check nếu token cache đã hết hạn (ưu tiên check expiration hơn cache duration)
  if (tokenCache && tokenExpiry > 0) {
    if (now >= tokenExpiry) {
      tokenCache = null;
      tokenCacheTime = 0;
      tokenExpiry = 0;
    } else {
      // Token chưa hết hạn, check cache duration
      if ((now - tokenCacheTime) < TOKEN_CACHE_DURATION) {
        return tokenCache;
      }
    }
  } else if (tokenCache && (now - tokenCacheTime) < TOKEN_CACHE_DURATION) {
    // Nếu không có expiry info, dùng cache duration
    return tokenCache;
  }

  try {

    // Dùng AuthService để lấy token
    const { AuthService } = await import('@/services/auth/authService');
    const token = await AuthService.getAccessToken();

    if (token) {
      // Decode JWT để lấy expiration time
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp) {
          tokenExpiry = payload.exp * 1000; // Convert to milliseconds
          const timeUntilExpiry = tokenExpiry - now;

          // Nếu token hết hạn trong vòng 5 phút, refresh ngay
          if (timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0) {

            try {
              const { AuthService } = await import('@/services/auth/authService');
              const refreshData = await AuthService.refresh();
              if (refreshData?.accessToken) {
                const newToken = refreshData.accessToken;
                const newPayload = JSON.parse(atob(newToken.split('.')[1]));
                tokenCache = newToken;
                tokenCacheTime = now;
                tokenExpiry = newPayload.exp ? newPayload.exp * 1000 : 0;
                return tokenCache;
              }
            } catch (refreshError) {
              console.warn('[getAuthToken] Proactive refresh failed, using current token:', refreshError);
            }
          }
        }
      } catch (decodeError) {
        console.warn('[getAuthToken] Error decoding token for expiration check:', decodeError);
      }

      tokenCache = token;
      tokenCacheTime = now;
      return tokenCache;
    }

    tokenCache = null;
    tokenExpiry = 0;
    return null;
  } catch (error) {
    console.error('[getAuthToken] Error fetching token:', error);
    tokenCache = null;
    tokenExpiry = 0;
    return null;
  }
};

/**
 * Clear token cache
 */
export const clearTokenCache = (): void => {
  tokenCache = null;
  tokenCacheTime = 0;
  tokenExpiry = 0;
};

/**
 * Refresh access token
 * - Dùng AuthService
 */
const refreshAccessToken = async (): Promise<string | null> => {
  try {
    // Dùng AuthService để refresh token
    const { AuthService } = await import('@/services/auth/authService');
    const data = await AuthService.refresh();

    if (data?.accessToken) {
      tokenCache = data.accessToken;
      tokenCacheTime = Date.now();

      // Update token expiry
      try {
        const payload = JSON.parse(atob(data.accessToken.split('.')[1]));
        tokenExpiry = payload.exp ? payload.exp * 1000 : 0;
      } catch {
        tokenExpiry = 0;
      }

      return tokenCache;
    }

    return null;
  } catch {
    return null;
  }
};

/**
 * Tạo Axios instance
 */
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: '/api', // LUÔN dùng Next.js API routes để forward cookies
    timeout: 30000,
    withCredentials: true, // Quan trọng: để gửi/nhận httpOnly cookies
    headers: {
      'Content-Type': 'application/json',
    },
  });

  /**
   * Request Interceptor: Tự động thêm Authorization header
   */
  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      // Lấy token từ httpOnly cookie
      const token = await getAuthToken();

      // Thêm Authorization header nếu có token
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        // Không có token: trong demo hoặc khi chưa login, vẫn cho phép request chạy
        if (process.env.NODE_ENV === 'development') {
          // log nhẹ để debug, tránh spam error
          console.warn('[AxiosClient] No token available for request:', config.url);
        }
      }


      // LUÔN dùng Next.js API routes (relative path) để forward cookies
      // Next.js API routes sẽ proxy request đến backend và forward cookies/token
      // Đảm bảo URL không bắt đầu bằng / để axios có thể combine với baseURL
      if (config.url && !config.url.startsWith('http') && config.url.startsWith('/')) {
        // Loại bỏ / ở đầu để axios có thể combine với baseURL
        config.url = config.url.slice(1);
      }

      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  /**
   * Response Interceptor: Xử lý 401, refresh token, error handling
   */
  instance.interceptors.response.use(
    (response) => {
      // Response thành công, emit event để clear network error
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('api-success'));
      }
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      // Xử lý 401 Unauthorized
      if (error.response?.status === 401 && !originalRequest._retry) {
        console.warn('[AxiosClient] 401 Unauthorized for:', originalRequest.url);
        originalRequest._retry = true;

        // Thử refresh token
        const newToken = await refreshAccessToken();

        if (newToken && originalRequest.headers) {
          // Retry request với token mới
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return instance(originalRequest);
        }

        // Refresh token thất bại, clear cache và redirect
        console.warn('[AxiosClient] Token refresh failed, redirecting to login');
        clearTokenCache();

        // Clear tokens via AuthService (mock - no API call)
        try {
          const { AuthService } = await import('@/services/auth/authService');
          await AuthService.logout();
        } catch {
          // Silent fail
        }

        // Redirect to login nếu không phải đang ở login page
        // Lưu URL hiện tại để redirect về sau khi login
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          const currentPath = window.location.pathname + window.location.search;
          const redirectUrl = `/login?from=${encodeURIComponent(currentPath)}`;
          window.location.href = redirectUrl;
        }

        return Promise.reject({
          message: 'Session expired. Please login again.',
          statusCode: 401,
        } as ApiError);
      }

      // Xử lý network errors
      if (!error.response) {
        const networkError = {
          message: 'Không thể kết nối đến backend. Vui lòng kiểm tra backend có đang chạy không.',
          statusCode: 0,
          isNetworkError: true,
        } as ApiError & { isNetworkError: boolean };

        // Emit event để NetworkStatusContext có thể track
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('api-network-error', {
            detail: networkError,
          }));
        }

        return Promise.reject(networkError);
      }

      // Xử lý các lỗi khác - Parse error response từ backend theo format ApiResponseDto
      const apiError: ApiError = {
        message: 'An error occurred',
        statusCode: error.response.status,
      };

      try {
        const errorData = error.response.data as any;
        // Parse theo format ApiResponseDto từ backend
        apiError.message = errorData.message ?? errorData.error ?? apiError.message;
        apiError.errors = errorData.errors; // Cho validation errors
        apiError.category = errorData.category; // validation | check | business | user | system
        apiError.errorCode = errorData.errorCode; // Error code từ backend
        apiError.field = errorData.field; // Cho check errors (duplicate, not found)
        apiError.value = errorData.value;
        apiError.metadata = errorData.metadata; // Additional metadata
      } catch {
        apiError.message = error.response.statusText ?? apiError.message;
      }

      return Promise.reject(apiError);
    }
  );

  return instance;
};

/**
 * Axios instance đã được config với interceptors
 */
export const axiosClient = createAxiosInstance();

/**
 * Helper functions để gọi API với Axios
 */
export const axiosGet = <T = any>(url: string, config?: any) => {
  return axiosClient.get<ApiResponse<T>>(url, config).then((res) => res.data);
};

export const axiosPost = <T = any>(url: string, data?: any, config?: any) => {
  return axiosClient.post<ApiResponse<T>>(url, data, config).then((res) => res.data);
};

export const axiosPut = <T = any>(url: string, data?: any, config?: any) => {
  return axiosClient.put<ApiResponse<T>>(url, data, config).then((res) => res.data);
};

export const axiosPatch = <T = any>(url: string, data?: any, config?: any) => {
  return axiosClient.patch<ApiResponse<T>>(url, data, config).then((res) => res.data);
};

export const axiosDelete = <T = any>(url: string, config?: any) => {
  return axiosClient.delete<ApiResponse<T>>(url, config).then((res) => res.data);
};

