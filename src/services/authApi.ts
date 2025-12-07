// Authentication API service with multi-tenant support

import { apiClient } from './apiClient';
import { tenantService } from './tenantService';

export interface RegisterData {
  name: string;
  email: string;
  company: string;
  password: string;
  tenant_code?: string; // Optional: auto-generated from company name if not provided
}

export interface LoginData {
  email: string;
  password: string;
  tenant_code?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  tenant_code: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  tenant_code?: string;
  message?: string;
}

export const authApi = {
  /**
   * Register a new user and create tenant
   * After successful registration, redirects to tenant subdomain
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    // Generate tenant_code from company name if not provided
    const tenantCode = data.tenant_code || data.company
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 20);

    const response = await apiClient.post<AuthResponse>(
      '/auth/register',
      { ...data, tenant_code: tenantCode },
      { skipTenant: true } // Registration doesn't require tenant context
    );

    if (response.success && response.token) {
      // Store auth token
      localStorage.setItem('auth_token', response.token);
      
      // Store user data
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      // Redirect to tenant subdomain
      const finalTenantCode = response.tenant_code || tenantCode;
      tenantService.redirectToTenantDomain(finalTenantCode);
    }

    return response;
  },

  /**
   * Login user within tenant context
   */
  login: async (data: LoginData): Promise<AuthResponse> => {
    const tenantCode = data.tenant_code || tenantService.getTenantCode();
    
    if (!tenantCode) {
      throw new Error('Tenant code is required. Please access from your tenant domain.');
    }

    // Set tenant for API calls
    tenantService.setTenantCode(tenantCode);

    const response = await apiClient.post<AuthResponse>('/auth/login', {
      email: data.email,
      password: data.password,
    });

    if (response.success && response.token) {
      // Store auth token
      localStorage.setItem('auth_token', response.token);
      
      // Store user data
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }
    }

    return response;
  },

  /**
   * Logout user and clear tenant context
   */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Continue with local cleanup even if API call fails
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      tenantService.clearTenant();
    }
  },

  /**
   * Get current user profile
   */
  getProfile: async (): Promise<User> => {
    return apiClient.get<User>('/auth/profile');
  },

  /**
   * Refresh auth token
   */
  refreshToken: async (): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/refresh');
    
    if (response.success && response.token) {
      localStorage.setItem('auth_token', response.token);
    }
    
    return response;
  },

  /**
   * Validate tenant code availability
   */
  validateTenantCode: async (tenantCode: string): Promise<{ available: boolean }> => {
    return apiClient.get<{ available: boolean }>(
      `/auth/validate-tenant/${tenantCode}`,
      { skipTenant: true }
    );
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('auth_token') && tenantService.isOnTenantDomain();
  },

  /**
   * Get stored user
   */
  getStoredUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};
