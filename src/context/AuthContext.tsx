
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
import { type IUser } from '@/lib/models/User';
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
  const [isLoading, setIsLoading] = useState(initialUser ? false : true);
  const router = useRouter();

  useEffect(() => {
    // If the user is provided initially, we don't need to fetch.
    if (initialUser) {
      setUser(initialUser);
      setIsLoading(false);
    } else {
      // This path is for client-side transitions where the layout isn't reloaded
      // and we need to verify the session on the client.
      const checkSession = async () => {
        try {
          const res = await fetch('/api/auth/session');
          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
          } else {
            setUser(null);
            router.push('/');
          }
        } catch {
          setUser(null);
          router.push('/');
        } finally {
          setIsLoading(false);
        }
      };
      checkSession();
    }
  }, [initialUser, router]);


  const handleLogout = async () => {
    await logout();
    setUser(null);
  };
  
  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, logout: handleLogout, isLoading }}
    >
      {isLoading ? <div className="h-screen w-full flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div> : children}
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

    