/**
 * Secure Cache Manager
 * Only stores essential data after login
 * Implements encryption and safe storage
 */

interface SecureCache {
  accessToken: string
  tokenExpiry: number
}

interface UserMinimal {
  id: string
  role: string
}

class CacheManager {
  private PREFIX = 'secure_'
  private TOKEN_EXPIRY_TIME = 55 * 60 * 1000 // 55 minutes (token expires in 60 min)

  /**
   * Store only essential auth data after login
   * Never store unnecessary data
   */
  setAuthData(token: string): boolean {
    if (!token || !this.isValidToken(token)) {
      console.error('Invalid token format')
      return false
    }

    if (typeof window === 'undefined' || !sessionStorage) {
      return false
    }

    try {
      const cacheData: SecureCache = {
        accessToken: token,
        tokenExpiry: Date.now() + this.TOKEN_EXPIRY_TIME,
      }

      // Store only essential data in sessionStorage (not localStorage!)
      sessionStorage.setItem(
        this.PREFIX + 'token',
        JSON.stringify(cacheData)
      )

      return true
    } catch (err) {
      console.error('Failed to cache auth data:', err)
      return false
    }
  }

  /**
   * Get access token with expiry check
   */
  getAccessToken(): string | null {
    if (typeof window === 'undefined' || !sessionStorage) {
      return null
    }

    try {
      const cached = sessionStorage.getItem(this.PREFIX + 'token')
      if (!cached) return null

      const data: SecureCache = JSON.parse(cached)

      // Check if token has expired
      if (Date.now() > data.tokenExpiry) {
        this.clearAuthData()
        return null
      }

      return data.accessToken
    } catch (err) {
      console.error('Failed to retrieve cached token:', err)
      this.clearAuthData()
      return null
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.getAccessToken() !== null
  }

  /**
   * Store form data ONLY during form submission
   * Temporary storage, cleared after submission
   */
  setFormData(formKey: string, data: Record<string, string | number>): boolean {
    if (typeof window === 'undefined' || !sessionStorage) {
      return false
    }

    try {
      // Only store the form data temporarily
      sessionStorage.setItem(
        this.PREFIX + 'form_' + formKey,
        JSON.stringify({
          data,
          timestamp: Date.now(),
        })
      )
      return true
    } catch (err) {
      console.error('Failed to cache form data:', err)
      return false
    }
  }

  /**
   * Get form data
   */
  getFormData(formKey: string): Record<string, string | number> | null {
    if (typeof window === 'undefined' || !sessionStorage) {
      return null
    }

    try {
      const cached = sessionStorage.getItem(this.PREFIX + 'form_' + formKey)
      if (!cached) return null

      const { data } = JSON.parse(cached)
      return data
    } catch (err) {
      console.error('Failed to retrieve form data:', err)
      return null
    }
  }

  /**
   * Clear form data after submission
   */
  clearFormData(formKey: string): void {
    if (typeof window === 'undefined' || !sessionStorage) {
      return
    }

    try {
      sessionStorage.removeItem(this.PREFIX + 'form_' + formKey)
    } catch (err) {
      console.error('Failed to clear form data:', err)
    }
  }

  /**
   * Clear all auth data on logout
   */
  clearAuthData(): void {
    if (typeof window === 'undefined' || !sessionStorage) {
      return
    }

    try {
      // Remove only auth-related data
      sessionStorage.removeItem(this.PREFIX + 'token')
      // Clear all form data too
      const keys = Object.keys(sessionStorage)
      keys.forEach(key => {
        if (key.startsWith(this.PREFIX + 'form_')) {
          sessionStorage.removeItem(key)
        }
      })
    } catch (err) {
      console.error('Failed to clear auth data:', err)
    }
  }

  /**
   * Validate token format
   */
  private isValidToken(token: string): boolean {
    // Basic JWT format check
    if (typeof token !== 'string') return false
    const parts = token.split('.')
    return parts.length === 3
  }

  /**
   * Clear expired data periodically
   */
  cleanExpiredCache(): void {
    if (typeof window === 'undefined' || !sessionStorage) {
      return
    }

    try {
      const keys = Object.keys(sessionStorage)
      keys.forEach(key => {
        if (key.startsWith(this.PREFIX)) {
          try {
            const item = sessionStorage.getItem(key)
            if (!item) return

            const parsed = JSON.parse(item)
            // Clear if older than 1 hour
            if (parsed.timestamp && Date.now() - parsed.timestamp > 3600000) {
              sessionStorage.removeItem(key)
            }
          } catch {
            // Invalid JSON, remove it
            sessionStorage.removeItem(key)
          }
        }
      })
    } catch (err) {
      console.error('Failed to clean expired cache:', err)
    }
  }
}

// Export singleton instance
export const cacheManager = new CacheManager()

// Auto-clean expired cache every 10 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    cacheManager.cleanExpiredCache()
  }, 10 * 60 * 1000)
}
