// Authentication Store using Zustand for Metrix Gaming Platform

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, AuthTokens, UserRole } from '@/types';
import { apiClient } from '@/services/api';
import { storage } from '@/utils';

// =================================================================
// TYPES AND INTERFACES
// =================================================================

interface AuthState {
  // State
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  clearError: () => void;
  initialize: () => Promise<void>;
  setUser: (user: User | null) => void;
  setTokens: (tokens: AuthTokens | null) => void;
  updateUserField: (field: keyof User, value: any) => void;
}

// =================================================================
// INITIAL STATE
// =================================================================

const initialState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,
};

// =================================================================
// AUTH STORE
// =================================================================

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // =================================================================
      // AUTHENTICATION ACTIONS
      // =================================================================

      /**
       * Login user with email and password
       */
      login: async (email: string, password: string, rememberMe: boolean = false) => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.post('/auth/login', {
            email,
            password,
            rememberMe,
          });

          const { user, tokens } = response.data;

          // Store tokens
          storage.set('access_token', tokens.accessToken);
          if (tokens.refreshToken) {
            storage.set('refresh_token', tokens.refreshToken);
          }

          set({
            user,
            tokens,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Login failed',
          });
          throw error;
        }
      },

      /**
       * Register new user
       */
      register: async (userData: any) => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.post('/auth/register', userData);

          set({
            isLoading: false,
            error: null,
          });

          return response.data;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Registration failed',
          });
          throw error;
        }
      },

      /**
       * Logout user
       */
      logout: async () => {
        set({ isLoading: true });

        try {
          // Call logout endpoint to invalidate tokens server-side
          await apiClient.post('/auth/logout');
        } catch (error) {
          // Continue with logout even if server call fails
          console.warn('Logout API call failed:', error);
        }

        // Clear local storage
        storage.remove('access_token');
        storage.remove('refresh_token');
        storage.remove('user');

        // Reset state
        set({
          ...initialState,
          isInitialized: true,
        });
      },

      /**
       * Refresh authentication token
       */
      refreshToken: async () => {
        const refreshToken = storage.get<string>('refresh_token');

        if (!refreshToken) {
          get().logout();
          return;
        }

        try {
          const response = await apiClient.post('/auth/refresh', {
            refreshToken,
          });

          const { tokens } = response.data;

          // Update tokens
          storage.set('access_token', tokens.accessToken);
          if (tokens.refreshToken) {
            storage.set('refresh_token', tokens.refreshToken);
          }

          set({
            tokens,
            error: null,
          });
        } catch (error: any) {
          console.error('Token refresh failed:', error);
          get().logout();
        }
      },

      // =================================================================
      // PROFILE ACTIONS
      // =================================================================

      /**
       * Update user profile
       */
      updateProfile: async (userData: Partial<User>) => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.put('/auth/profile', userData);
          const updatedUser = response.data.user;

          set({
            user: updatedUser,
            isLoading: false,
            error: null,
          });

          return updatedUser;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Profile update failed',
          });
          throw error;
        }
      },

      /**
       * Change user password
       */
      changePassword: async (currentPassword: string, newPassword: string) => {
        set({ isLoading: true, error: null });

        try {
          await apiClient.put('/auth/change-password', {
            currentPassword,
            newPassword,
          });

          set({
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Password change failed',
          });
          throw error;
        }
      },

      // =================================================================
      // PASSWORD RESET ACTIONS
      // =================================================================

      /**
       * Request password reset
       */
      forgotPassword: async (email: string) => {
        set({ isLoading: true, error: null });

        try {
          await apiClient.post('/auth/forgot-password', { email });

          set({
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Password reset request failed',
          });
          throw error;
        }
      },

      /**
       * Reset password with token
       */
      resetPassword: async (token: string, newPassword: string) => {
        set({ isLoading: true, error: null });

        try {
          await apiClient.post('/auth/reset-password', {
            token,
            newPassword,
          });

          set({
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Password reset failed',
          });
          throw error;
        }
      },

      // =================================================================
      // EMAIL VERIFICATION ACTIONS
      // =================================================================

      /**
       * Verify email address
       */
      verifyEmail: async (token: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await apiClient.get(`/auth/verify-email/${token}`);
          const { user } = response.data;

          set({
            user,
            isLoading: false,
            error: null,
          });

          return user;
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Email verification failed',
          });
          throw error;
        }
      },

      /**
       * Resend verification email
       */
      resendVerificationEmail: async (email: string) => {
        set({ isLoading: true, error: null });

        try {
          await apiClient.post('/auth/resend-verification', { email });

          set({
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to resend verification email',
          });
          throw error;
        }
      },

      // =================================================================
      // UTILITY ACTIONS
      // =================================================================

      /**
       * Check authentication status
       */
      checkAuthStatus: async () => {
        const token = storage.get<string>('access_token');

        if (!token) {
          set({ isAuthenticated: false, isInitialized: true });
          return;
        }

        set({ isLoading: true });

        try {
          const response = await apiClient.get('/auth/me');
          const user = response.data.user;

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            isInitialized: true,
            error: null,
          });
        } catch (error: any) {
          console.error('Auth status check failed:', error);

          // Try to refresh token
          try {
            await get().refreshToken();
            await get().checkAuthStatus();
          } catch (refreshError) {
            // If refresh fails, logout
            get().logout();
          }
        }
      },

      /**
       * Initialize auth store
       */
      initialize: async () => {
        if (get().isInitialized) return;

        const token = storage.get<string>('access_token');
        const user = storage.get<User>('user');

        if (token && user) {
          set({
            user,
            tokens: { accessToken: token, expiresIn: 0 },
            isAuthenticated: true,
          });

          // Verify token is still valid
          await get().checkAuthStatus();
        } else {
          set({ isInitialized: true });
        }
      },

      /**
       * Clear error state
       */
      clearError: () => {
        set({ error: null });
      },

      /**
       * Set user directly
       */
      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user });
        if (user) {
          storage.set('user', user);
        } else {
          storage.remove('user');
        }
      },

      /**
       * Set tokens directly
       */
      setTokens: (tokens: AuthTokens | null) => {
        set({ tokens });
        if (tokens) {
          storage.set('access_token', tokens.accessToken);
          if (tokens.refreshToken) {
            storage.set('refresh_token', tokens.refreshToken);
          }
        } else {
          storage.remove('access_token');
          storage.remove('refresh_token');
        }
      },

      /**
       * Update specific user field
       */
      updateUserField: (field: keyof User, value: any) => {
        const currentUser = get().user;
        if (!currentUser) return;

        const updatedUser = { ...currentUser, [field]: value };
        set({ user: updatedUser });
        storage.set('user', updatedUser);
      },
    }),
    {
      name: 'metrix-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        // Handle migrations for future versions
        if (version === 0) {
          // Migration from version 0 to 1
          return {
            ...persistedState,
            isInitialized: false,
          };
        }
        return persistedState;
      },
    }
  )
);

// =================================================================
// SELECTORS
// =================================================================

// User selectors
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useIsLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);
export const useIsInitialized = () => useAuthStore((state) => state.isInitialized);

// User role and permissions
export const useUserRole = () => useAuthStore((state) => state.user?.role);
export const useIsAdmin = () => useAuthStore((state) => state.user?.role === UserRole.ADMIN);
export const useIsPlayer = () => useAuthStore((state) => state.user?.role === UserRole.PLAYER);
export const useIsSpectator = () => useAuthStore((state) => state.user?.role === UserRole.SPECTATOR);

// User status
export const useIsEmailVerified = () => useAuthStore((state) => state.user?.isEmailVerified ?? false);
export const useUserStatus = () => useAuthStore((state) => state.user?.status);

// User profile data
export const useUserProfile = () => useAuthStore((state) => {
  const user = state.user;
  if (!user) return null;

  return {
    id: user.id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    avatarUrl: user.avatarUrl,
    accountTier: user.accountTier,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
  };
});

// User stats
export const useUserStats = () => useAuthStore((state) => {
  const user = state.user;
  if (!user) return null;

  return {
    totalTournamentsPlayed: user.totalTournamentsPlayed,
    totalTournamentsWon: user.totalTournamentsWon,
    totalEarnings: user.totalEarnings,
    winRate: user.winRate,
    skillRating: user.skillRating,
    spectatorRating: user.spectatorRating,
    totalMatchesSpectated: user.totalMatchesSpectated,
    spectatorEarnings: user.spectatorEarnings,
  };
});

// Wallet data
export const useWallet = () => useAuthStore((state) => {
  const user = state.user;
  if (!user) return null;

  return {
    balance: user.walletBalance,
    pendingBalance: user.pendingBalance,
    bankAccountNumber: user.bankAccountNumber,
    bankCode: user.bankCode,
    bankAccountName: user.bankAccountName,
  };
});

// =================================================================
// HOOKS
// =================================================================

/**
 * Hook to check if user has specific permission
 */
export const useHasPermission = (permission: string) => {
  return useAuthStore((state) => {
    if (!state.user) return false;

    const permissions = state.user.role === UserRole.ADMIN
      ? ['admin:all']
      : getPermissionsForRole(state.user.role);

    return permissions.includes(permission) || permissions.includes('admin:all');
  });
};

/**
 * Hook to require authentication
 */
export const useRequireAuth = () => {
  const isAuthenticated = useIsAuthenticated();
  const isInitialized = useIsInitialized();

  return {
    isAuthenticated,
    isInitialized,
    isReady: isInitialized && isAuthenticated,
  };
};

/**
 * Hook for authentication actions
 */
export const useAuthActions = () => {
  const store = useAuthStore();

  return {
    login: store.login,
    register: store.register,
    logout: store.logout,
    refreshToken: store.refreshToken,
    updateProfile: store.updateProfile,
    changePassword: store.changePassword,
    forgotPassword: store.forgotPassword,
    resetPassword: store.resetPassword,
    verifyEmail: store.verifyEmail,
    resendVerificationEmail: store.resendVerificationEmail,
    checkAuthStatus: store.checkAuthStatus,
    clearError: store.clearError,
    initialize: store.initialize,
  };
};

// =================================================================
// UTILITY FUNCTIONS
// =================================================================

/**
 * Get permissions for a specific role
 */
function getPermissionsForRole(role: UserRole): string[] {
  const basePermissions = ['profile:read', 'profile:update'];

  switch (role) {
    case UserRole.ADMIN:
      return [
        ...basePermissions,
        'admin:all',
        'user:manage',
        'tournament:manage',
        'match:manage',
        'payment:manage',
        'dispute:manage',
        'report:view'
      ];
    case UserRole.PLAYER:
      return [
        ...basePermissions,
        'tournament:register',
        'tournament:view',
        'match:participate',
        'wallet:manage',
        'withdrawal:request'
      ];
    case UserRole.SPECTATOR:
      return [
        ...basePermissions,
        'tournament:view',
        'match:spectate',
        'match:report',
        'spectator:earnings'
      ];
    default:
      return basePermissions;
  }
}

// =================================================================
// EXPORTS
// =================================================================

export default useAuthStore;
