'use client';

import { useRouter } from 'next/navigation';
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { logout } from '@/lib/actions';
import type { Role } from '@/types';
 // Make sure this is correctly imported if separated

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser: User | null;
}) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [isLoading, setIsLoading] = useState<boolean>(!initialUser);
  const router = useRouter();

  useEffect(() => {
    if (!initialUser) {
      const checkSession = async () => {
        try {
          const res = await fetch('/api/auth/session');
          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
          } else {
            setUser(null);
          }
        } catch (err) {
          console.error('Session check failed:', err);
          setUser(null);
        } finally {
          setIsLoading(false);
        }
      };
      checkSession();
    } else {
      setIsLoading(false);
    }
  }, [initialUser]);

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        logout: handleLogout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
