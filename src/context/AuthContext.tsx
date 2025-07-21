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

export type Role = 'intern' | 'mentor' | 'hr' | 'employee';

export type User = {
  name: string;
  email: string;
  role: Role;
  avatar: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: Role) => void;
  logout: () => void;
  switchRole: (role: Role) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: Record<Role, User> = {
  hr: {
    name: 'Admin Power',
    email: 'hr@synergy.com',
    role: 'hr',
    avatar: 'https://placehold.co/100x100.png',
  },
  mentor: {
    name: 'Dr. Guide',
    email: 'mentor@synergy.com',
    role: 'mentor',
    avatar: 'https://placehold.co/100x100.png',
  },
  intern: {
    name: 'Learny McLearnface',
    email: 'intern@synergy.com',
    role: 'intern',
    avatar: 'https://placehold.co/100x100.png',
  },
  employee: {
    name: 'Worker Bee',
    email: 'employee@synergy.com',
    role: 'employee',
    avatar: 'https://placehold.co/100x100.png',
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('synergy-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      localStorage.removeItem('synergy-user');
    }
  }, []);

  const login = (email: string, password: string, role: Role) => {
    // In a real app, you'd verify credentials
    const userToLogin = mockUsers[role];
    if (userToLogin) {
      setUser(userToLogin);
      localStorage.setItem('synergy-user', JSON.stringify(userToLogin));
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${userToLogin.name}!`,
      });
      router.push('/dashboard');
    } else {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Invalid credentials or role.',
      });
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('synergy-user');
    router.push('/');
  };

  const switchRole = (role: Role) => {
    if (user) {
      const newUser = mockUsers[role];
      setUser(newUser);
      localStorage.setItem('synergy-user', JSON.stringify(newUser));
      toast({
        title: 'Role Switched',
        description: `You are now viewing the dashboard as ${newUser.name} (${newUser.role}).`,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout, switchRole }}
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
