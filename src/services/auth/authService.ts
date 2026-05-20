/**
 * Auth Service
 * Mock data for UI demo (no backend connection)
 */

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role?: 'sadmin' | 'admin' | 'user';
  };
  expiresIn: number;
}

// Mock auth data stored in memory
let mockAccessToken: string | null = null;
let mockRefreshToken: string | null = null;

/**
 * Auth Service Class
 * Mock implementation for UI demo
 */
export class AuthService {
  /**
   * Login
   * Mock login - always succeeds
   */
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock response
    const mockResponse: AuthResponse = {
      accessToken: 'mock-access-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now(),
      user: {
        id: '1',
        email: credentials.email,
        firstName: 'Nguyễn Văn',
        lastName: 'Admin',
        phone: '0901234567',
        role: 'admin',
      },
      expiresIn: 3600,
    };

    mockAccessToken = mockResponse.accessToken;
    mockRefreshToken = mockResponse.refreshToken;

    return mockResponse;
  }

  /**
   * Dev Login - đăng nhập không cần mật khẩu
   */
  static async devLogin(userId: string): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock response
    const mockResponse: AuthResponse = {
      accessToken: 'mock-access-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now(),
      user: {
        id: userId,
        email: 'admin@example.com',
        firstName: 'Nguyễn Văn',
        lastName: 'Admin',
        phone: '0901234567',
        role: 'admin',
      },
      expiresIn: 3600,
    };

    mockAccessToken = mockResponse.accessToken;
    mockRefreshToken = mockResponse.refreshToken;

    return mockResponse;
  }

  /**
   * Get Access Token
   * Returns mock token from memory
   */
  static async getAccessToken(): Promise<string | null> {
    return mockAccessToken;
  }

  /**
   * Refresh Token
   * Returns new mock tokens
   */
  static async refresh(): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Mock response
    const mockResponse: AuthResponse = {
      accessToken: 'mock-access-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now(),
      user: {
        id: '1',
        email: 'admin@example.com',
        firstName: 'Nguyễn Văn',
        lastName: 'Admin',
        phone: '0901234567',
        role: 'admin',
      },
      expiresIn: 3600,
    };

    mockAccessToken = mockResponse.accessToken;
    mockRefreshToken = mockResponse.refreshToken;

    return mockResponse;
  }

  /**
   * Logout
   * Clears mock tokens
   */
  static async logout(): Promise<void> {
    mockAccessToken = null;
    mockRefreshToken = null;
  }

  /**
   * Get Profile
   * Mock profile data for UI demo
   */
  static async getProfile(): Promise<any> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Mock profile data
    return {
      id: '1',
      email: 'admin@example.com',
      name: 'Nguyễn Văn Admin',
      phone: '0901234567',
      role: 'admin',
      isActive: true,
      lastLoginAt: new Date().toISOString(),
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: new Date().toISOString(),
    };
  }
}

