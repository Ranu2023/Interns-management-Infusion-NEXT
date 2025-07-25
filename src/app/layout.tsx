
import type { Metadata } from 'next';
import './globals.css';
import { AppProviders } from '@/providers/app-providers';
import { Toaster } from '@/components/ui/toaster';
import { getSession } from '@/lib/session';

export const metadata: Metadata = {
  title: 'Synergy Interns',
  description: 'Smart Intern Feedback & Mentorship System',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <AppProviders initialUser={session?.user || null}>
          {children}
          <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}
