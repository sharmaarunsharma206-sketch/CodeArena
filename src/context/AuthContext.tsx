import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export interface CodeArenaUser {
  id: string;
  google_subject_id: string;
  full_name: string;
  email: string;
  username: string;
  profile_picture?: string;
  email_verified: boolean;
  role: 'ROLE_USER' | 'ROLE_ADMIN';
  points: number;
  created_at: string;
  name?: string;
  avatar?: string;
  bio?: string;
  country?: string;
}

export interface UserStats {
  solvedCount: number;
  solvedProblemIds: string[];
  totalSubmissions: number;
  dailyUsage: {
    todayDateIST: string;
    usedCount: number;
    maxDailyLimit: number;
    remaining: number;
    accessedProblemIds: string[];
  };
}

interface AuthContextType {
  user: CodeArenaUser | null;
  userStats: UserStats | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  loginWithGoogle: (idToken: string, usernameChoice?: string, consentGiven?: boolean) => Promise<{ success: boolean; message?: string }>;
  simulateGoogleLogin: (email: string, name?: string, usernameChoice?: string, consentGiven?: boolean) => Promise<{ success: boolean; message?: string }>;
  updateProfile: (updates: { full_name?: string; bio?: string; country?: string; profile_picture?: string }) => Promise<{ success: boolean; message?: string }>;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<CodeArenaUser | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Refresh user data from backend
  const refreshUser = useCallback(async () => {
    try {
      const data = await api.getCurrentUser();
      if (data && data.user) {
        setUser({
          ...data.user,
          name: data.user.full_name,
          avatar: data.user.profile_picture || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(data.user.username)}`,
        });
        setUserStats({
          solvedCount: data.solvedCount || 0,
          solvedProblemIds: data.solvedProblemIds || [],
          totalSubmissions: data.totalSubmissions || 0,
          dailyUsage: data.dailyUsage || {
            todayDateIST: '',
            usedCount: 0,
            maxDailyLimit: 2,
            remaining: 2,
            accessedProblemIds: [],
          },
        });
      } else {
        setUser(null);
        setUserStats(null);
      }
    } catch {
      setUser(null);
      setUserStats(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Restore authenticated session on mount
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const loginWithGoogle = async (
    idToken: string,
    usernameChoice?: string,
    consentGiven: boolean = true
  ): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    try {
      const res = await api.loginWithGoogle(idToken, usernameChoice, consentGiven);
      await refreshUser();
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message || 'Google authentication failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const simulateGoogleLogin = async (
    email: string,
    name?: string,
    usernameChoice?: string,
    consentGiven: boolean = true
  ): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    try {
      // Validate Gmail domain on client first for instant feedback
      const cleanEmail = email.trim().toLowerCase();
      if (!cleanEmail.endsWith('@gmail.com')) {
        return {
          success: false,
          message: 'Registration is restricted to verified personal @gmail.com accounts only.',
        };
      }

      const idToken = await api.simulateGoogleToken(cleanEmail, name);
      const res = await api.loginWithGoogle(idToken, usernameChoice, consentGiven);
      await refreshUser();
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message || 'Google Sign-In failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await api.logout();
    } finally {
      setUser(null);
      setUserStats(null);
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: {
    full_name?: string;
    bio?: string;
    country?: string;
    profile_picture?: string;
  }): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await api.updateProfile(updates);
      await refreshUser();
      return { success: true, message: res.message || 'Profile updated successfully' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to update profile' };
    }
  };

  const isAdmin = user?.role === 'ROLE_ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        userStats,
        isAuthenticated: !!user,
        isLoading,
        isAdmin,
        loginWithGoogle,
        simulateGoogleLogin,
        updateProfile,
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
