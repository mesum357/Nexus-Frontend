/**
 * PWA Authentication Utilities
 * Handles authentication in PWA/offline scenarios
 */

import { API_BASE_URL } from './config';

export interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  isOffline: boolean;
  lastSync: number;
}

const AUTH_STORAGE_KEY = 'nexus_auth_state';
const AUTH_CACHE_DURATION = 1000 * 60 * 15; // 15 minutes

/**
 * Get cached authentication state
 */
export function getCachedAuthState(): AuthState | null {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return null;
    
    const authState = JSON.parse(stored) as AuthState;
    const now = Date.now();
    
    // Check if cache is still valid
    if (now - authState.lastSync > AUTH_CACHE_DURATION) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
    
    return authState;
  } catch (error) {
    console.error('Error reading cached auth state:', error);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

/**
 * Cache authentication state
 */
export function setCachedAuthState(authState: Partial<AuthState>): void {
  try {
    const currentState = getCachedAuthState() || {
      isAuthenticated: false,
      user: null,
      isOffline: false,
      lastSync: 0
    };
    
    const newState: AuthState = {
      ...currentState,
      ...authState,
      lastSync: Date.now()
    };
    
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newState));
  } catch (error) {
    console.error('Error caching auth state:', error);
  }
}

/**
 * Clear cached authentication state
 */
export function clearCachedAuthState(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

/**
 * Check if user is authenticated (with offline support)
 */
export async function checkAuthStatus(): Promise<AuthState> {
  try {
    // Try network first
    const response = await fetch(`${API_BASE_URL}/me`, {
      credentials: 'include',
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      const authState: AuthState = {
        isAuthenticated: !!data.user,
        user: data.user || null,
        isOffline: false,
        lastSync: Date.now()
      };
      
      // Cache the successful auth state
      setCachedAuthState(authState);
      return authState;
    } else {
      // Network request failed, try cached state
      const cached = getCachedAuthState();
      if (cached) {
        return { ...cached, isOffline: false };
      }
      
      // No cached state, user is not authenticated
      return {
        isAuthenticated: false,
        user: null,
        isOffline: false,
        lastSync: Date.now()
      };
    }
  } catch (error) {
    console.log('Network unavailable, checking cached auth state...');
    
    // Network failed, check cached state
    const cached = getCachedAuthState();
    if (cached) {
      return { ...cached, isOffline: true };
    }
    
    // No cached state available
    return {
      isAuthenticated: false,
      user: null,
      isOffline: true,
      lastSync: 0
    };
  }
}

/**
 * Handle authentication error responses
 */
export function handleAuthError(error: any): { needsOnline: boolean; message: string } {
  if (error?.offline || error?.needsOnline) {
    return {
      needsOnline: true,
      message: 'Authentication requires an internet connection. Please check your connection and try again.'
    };
  }
  
  return {
    needsOnline: false,
    message: error?.message || 'Authentication failed. Please try again.'
  };
}

/**
 * Enhanced fetch with PWA authentication handling
 */
export async function pwaFetch(url: string, options: RequestInit = {}): Promise<Response> {
  try {
    const response = await fetch(url, {
      ...options,
      credentials: 'include'
    });
    
    return response;
  } catch (error) {
    // Check if this is an authentication-related request
    const authEndpoints = ['/login', '/register', '/logout', '/me', '/verify-email'];
    const isAuthRequest = authEndpoints.some(endpoint => url.includes(endpoint));
    
    if (isAuthRequest) {
      throw new Error(JSON.stringify({
        offline: true,
        needsOnline: true,
        message: 'Authentication requires an internet connection'
      }));
    }
    
    throw error;
  }
}

/**
 * Check if the app is running as a PWA
 */
export function isPWA(): boolean {
  return window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
}

/**
 * Check if the device is online
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

/**
 * Add online/offline event listeners
 */
export function addNetworkListeners(onOnline: () => void, onOffline: () => void): void {
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
}

/**
 * Queue authentication actions for when online
 */
const authQueue: Array<{ action: string; data: any; timestamp: number }> = [];

export function queueAuthAction(action: string, data: any): void {
  authQueue.push({
    action,
    data,
    timestamp: Date.now()
  });
  
  // Try to process queue if online
  if (isOnline()) {
    processAuthQueue();
  }
}

async function processAuthQueue(): Promise<void> {
  while (authQueue.length > 0) {
    const item = authQueue.shift();
    if (!item) break;
    
    try {
      // Process queued authentication actions
      console.log('Processing queued auth action:', item.action);
      // Implementation would depend on specific requirements
    } catch (error) {
      console.error('Failed to process queued auth action:', error);
      // Re-queue the item if it failed
      authQueue.unshift(item);
      break;
    }
  }
}

// Auto-process queue when coming online
if (typeof window !== 'undefined') {
  window.addEventListener('online', processAuthQueue);
}
