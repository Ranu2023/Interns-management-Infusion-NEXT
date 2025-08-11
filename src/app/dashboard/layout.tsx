
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, redirect } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { UserNav } from '@/components/user-nav';
import { DashboardNav } from '@/components/dashboard-nav';
import { ChevronsLeft, MenuIcon, ChevronsRight, type LucideProps, Loader2 } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useAuth } from '@/context/AuthContext';


function Icon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width="24"
      height="24"
      {...props}
    >
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'rgb(0,158,255)', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: 'rgb(83,59,255)', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path
        fill="url(#grad1)"
        d="M181.88 24.32C159.87 2.31 129.53-5.24 102.43 4.88C51.27 23.36 24.08 81.33 43.12 133.58C52.12 158.03 69.83 177.64 91.24 189.53C95.27 191.73 97.46 196.44 96.53 201.07C94.43 211.53 89.54 220.9 82.38 228.06C81.01 229.43 82.02 231.63 83.82 231.63H156.41C158.21 231.63 159.22 229.43 157.85 228.06C148.16 218.37 142.3 205.5 141.52 191.36C140.85 178.9 146.61 166.97 156.41 158.42C182.02 136.56 200.41 100.41 181.88 24.32Z"
      />
    </svg>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  React.useEffect(() => {
    if (isDesktop) {
      setIsCollapsed(false);
    } else {
      setIsCollapsed(true);
    }
  }, [isDesktop]);

  if (isLoading || !isAuthenticated || !user) {
    return (
        <div className="h-screen w-full flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[auto_1fr]">
      <aside
        className={cn(
          'hidden md:flex flex-col border-r bg-muted/40 transition-all duration-300 ease-in-out',
          isCollapsed ? 'w-16' : 'w-64'
        )}
      >
        <div className="flex h-16 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold font-headline text-primary">
            <Icon className="h-6 w-6" />
            {!isCollapsed && <span>Infusion NEXT</span>}
          </Link>
          {isDesktop && (
            <Button variant="ghost" size="icon" className="ml-auto" onClick={toggleCollapse}>
              {isCollapsed ? <ChevronsRight className="h-5 w-5" /> : <ChevronsLeft className="h-5 w-5" />}
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          )}
        </div>
        <div className="flex-1 py-4">
          <DashboardNav isCollapsed={isCollapsed} />
        </div>
      </aside>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <MenuIcon className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0">
               <div className="flex h-16 items-center border-b px-4 lg:h-[60px] lg:px-6">
                  <Link href="/dashboard" className="flex items-center gap-2 font-bold font-headline text-primary">
                    <Icon className="h-6 w-6" />
                    <span>Infusion NEXT</span>
                  </Link>
                </div>
              <DashboardNav isCollapsed={false} />
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            {/* Can add search bar here */}
          </div>
          <UserNav />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
