
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
import { Loader2 } from 'lucide-react';

export type Role = 'intern' | 'mentor' | 'hr' | 'employee';

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
  initialUser 
}: { 
  children: ReactNode,
  initialUser: User | null
}) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // If the user is provided by the server (via RootLayout), use it directly.
    if (initialUser) {
      setUser(initialUser);
      setIsLoading(false);
      return;
    }
    
    // If no initial user, this means it's a client-side navigation.
    // We must verify the session with the server.
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/session');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
    
  }, [initialUser]);


  const handleLogout = async () => {
    await logout();
    setUser(null);
    router.push('/');
  };
  
  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, logout: handleLogout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
