// Tenant service for multi-tenancy support

const BASE_DOMAIN = import.meta.env.VITE_BASE_DOMAIN || 'localhost';

export const tenantService = {
  /**
   * Extract tenant code from current subdomain
   * e.g., tenant1.domain.com -> tenant1
   */
  getTenantCode(): string | null {
    const hostname = window.location.hostname;
    
    // Handle localhost development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      // Check for tenant in localStorage during development
      return localStorage.getItem('dev_tenant_code') || null;
    }
    
    // Extract subdomain from hostname
    const parts = hostname.split('.');
    if (parts.length >= 3) {
      // subdomain.domain.tld format
      return parts[0];
    }
    
    return null;
  },

  /**
   * Set tenant code (used during registration or login)
   */
  setTenantCode(tenantCode: string): void {
    localStorage.setItem('dev_tenant_code', tenantCode);
  },

  /**
   * Redirect to tenant subdomain after registration
   */
  redirectToTenantDomain(tenantCode: string): void {
    const protocol = window.location.protocol;
    const port = window.location.port ? `:${window.location.port}` : '';
    
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      // In development, store tenant and reload
      this.setTenantCode(tenantCode);
      window.location.reload();
    } else {
      // In production, redirect to tenant subdomain
      const tenantUrl = `${protocol}//${tenantCode}.${BASE_DOMAIN}${port}`;
      window.location.href = tenantUrl;
    }
  },

  /**
   * Check if user is on a valid tenant domain
   */
  isOnTenantDomain(): boolean {
    return this.getTenantCode() !== null;
  },

  /**
   * Clear tenant context (logout)
   */
  clearTenant(): void {
    localStorage.removeItem('dev_tenant_code');
  }
};
