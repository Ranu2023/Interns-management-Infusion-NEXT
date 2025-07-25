'use client';

import { type ReactNode } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from 'next-themes';
import { type User } from '@/context/AuthContext';


export function AppProviders({ children, initialUser }: { children: ReactNode, initialUser: User | null }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider initialUser={initialUser}>
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}
