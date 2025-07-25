
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { UserNav } from '@/components/user-nav';
import { DashboardNav } from '@/components/dashboard-nav';
import { ChevronsLeft, MenuIcon, ChevronsRight, type LucideProps, Loader2 } from 'lucide-react';
import { useMediaQuery } from '@/hooks/use-media-query';

function Icon(props: LucideProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, router]);
  
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
            {!isCollapsed && <span>Synergy</span>}
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
                    <span>Synergy</span>
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
