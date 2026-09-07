import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { StorageService } from '../services/storage';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (name: string, email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginAsGuest: () => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session or auto-initialize local session
    let current = StorageService.getCurrentUser();
    if (!current) {
      current = StorageService.createOrUpdateUser({
        id: 'local_user',
        email: 'user@90days.local',
        displayName: '90-Day Champion',
        isOnboarded: true,
      });
    }
    setUser(current);
    setLoading(false);
  }, []);

  const login = async (email: string) => {
    const users = StorageService.getUsers();
    let existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!existing) {
      // Create user if doesn't exist
      existing = StorageService.createOrUpdateUser({
        id: `user_${Date.now()}`,
        email,
        displayName: email.split('@')[0],
        isOnboarded: false,
      });
    } else {
      StorageService.setCurrentUserId(existing.id);
    }
    setUser(existing);
  };

  const signup = async (name: string, email: string) => {
    const newUser = StorageService.createOrUpdateUser({
      id: `user_${Date.now()}`,
      displayName: name,
      email,
      isOnboarded: false,
    });
    setUser(newUser);
  };

  const loginWithGoogle = async () => {
    const mockGoogleUser = StorageService.createOrUpdateUser({
      id: `google_${Date.now()}`,
      displayName: 'Google Explorer',
      email: 'explorer@gmail.com',
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isOnboarded: false,
    });
    setUser(mockGoogleUser);
  };

  const loginAsGuest = async () => {
    const guest = StorageService.createOrUpdateUser({
      id: `guest_${Date.now()}`,
      displayName: 'Guest Champion',
      email: 'guest@90days.local',
      isOnboarded: true,
    });
    setUser(guest);
  };

  const logout = () => {
    StorageService.setCurrentUserId(null);
    const guest = StorageService.createOrUpdateUser({
      id: `user_${Date.now()}`,
      displayName: '90-Day Champion',
      email: 'champion@90days.local',
      isOnboarded: true,
    });
    setUser(guest);
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    const updated = StorageService.createOrUpdateUser({
      ...user,
      ...updates,
    });
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        loginWithGoogle,
        loginAsGuest,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
