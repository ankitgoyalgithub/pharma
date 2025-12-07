// API client with multi-tenant support

import { tenantService } from './tenantService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

interface RequestOptions extends RequestInit {
  skipTenant?: boolean;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Build URL with tenant code as path parameter
   */
  private buildUrl(endpoint: string, skipTenant = false): string {
    const tenantCode = tenantService.getTenantCode();
    
    if (!skipTenant && tenantCode) {
      // Include tenant_code as path parameter: /api/{tenant_code}/endpoint
      return `${this.baseUrl}/${tenantCode}${endpoint}`;
    }
    
    return `${this.baseUrl}${endpoint}`;
  }

  /**
   * Get auth token from storage
   */
  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Build headers with auth token
   */
  private buildHeaders(customHeaders?: HeadersInit): Headers {
    const headers = new Headers({
      'Content-Type': 'application/json',
      ...customHeaders,
    });

    const token = this.getAuthToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const tenantCode = tenantService.getTenantCode();
    if (tenantCode) {
      headers.set('X-Tenant-Code', tenantCode);
    }

    return headers;
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || error.detail || `HTTP ${response.status}`);
    }
    return response.json();
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { skipTenant, ...fetchOptions } = options;
    const response = await fetch(this.buildUrl(endpoint, skipTenant), {
      method: 'GET',
      headers: this.buildHeaders(fetchOptions.headers as HeadersInit),
      ...fetchOptions,
    });
    return this.handleResponse<T>(response);
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: unknown, options: RequestOptions = {}): Promise<T> {
    const { skipTenant, ...fetchOptions } = options;
    const response = await fetch(this.buildUrl(endpoint, skipTenant), {
      method: 'POST',
      headers: this.buildHeaders(fetchOptions.headers as HeadersInit),
      body: data ? JSON.stringify(data) : undefined,
      ...fetchOptions,
    });
    return this.handleResponse<T>(response);
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: unknown, options: RequestOptions = {}): Promise<T> {
    const { skipTenant, ...fetchOptions } = options;
    const response = await fetch(this.buildUrl(endpoint, skipTenant), {
      method: 'PUT',
      headers: this.buildHeaders(fetchOptions.headers as HeadersInit),
      body: data ? JSON.stringify(data) : undefined,
      ...fetchOptions,
    });
    return this.handleResponse<T>(response);
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: unknown, options: RequestOptions = {}): Promise<T> {
    const { skipTenant, ...fetchOptions } = options;
    const response = await fetch(this.buildUrl(endpoint, skipTenant), {
      method: 'PATCH',
      headers: this.buildHeaders(fetchOptions.headers as HeadersInit),
      body: data ? JSON.stringify(data) : undefined,
      ...fetchOptions,
    });
    return this.handleResponse<T>(response);
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { skipTenant, ...fetchOptions } = options;
    const response = await fetch(this.buildUrl(endpoint, skipTenant), {
      method: 'DELETE',
      headers: this.buildHeaders(fetchOptions.headers as HeadersInit),
      ...fetchOptions,
    });
    return this.handleResponse<T>(response);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
