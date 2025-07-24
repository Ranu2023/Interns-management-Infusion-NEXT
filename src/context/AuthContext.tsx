'use client';

import { useRouter } from 'next/navigation';
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { useToast } from '@/hooks/use-toast';
import { logout as logoutAction } from '@/lib/actions';
import { type IUser } from '@/lib/models/User';

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
  switchRole: (role: Role) => void; // This will now be for dev purposes only
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: Record<Role, User> = {
  hr: {
    id: 'hr-id',
    name: 'Admin Power',
    email: 'hr@synergy.com',
    role: 'hr',
    avatar: 'https://placehold.co/100x100.png',
  },
  mentor: {
    id: 'mentor-id',
    name: 'Dr. Guide',
    email: 'mentor@synergy.com',
    role: 'mentor',
    avatar: 'https://placehold.co/100x100.png',
  },
  intern: {
    id: 'intern-id',
    name: 'Learny McLearnface',
    email: 'intern@synergy.com',
    role: 'intern',
    avatar: 'https://placehold.co/100x100.png',
  },
  employee: {
    id: 'employee-id',
    name: 'Worker Bee',
    email: 'employee@synergy.com',
    role: 'employee',
    avatar: 'https://placehold.co/100x100.png',
  },
};


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/session');
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
          }
        }
      } catch (error) {
        console.error('Failed to fetch session', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const logout = async () => {
    await logoutAction();
    setUser(null);
    router.push('/');
  };

  const switchRole = (role: Role) => {
    // This is a mock function for development convenience to see different dashboards
    // It doesn't reflect a real-world scenario
    if (user) {
      const newUser = mockUsers[role];
       setUser(newUser);
       toast({
        title: 'Role Switched (Dev)',
        description: `You are now viewing the dashboard as ${newUser.name} (${newUser.role}). This is a DEV feature.`,
      });
      // In a real app, you might re-fetch permissions or redirect
       router.push('/dashboard');
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, logout, switchRole, isLoading }}
    >
      {isLoading ? null : children}
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
