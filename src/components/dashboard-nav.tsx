'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Users,
  UserCheck,
  FolderKanban,
  FileText,
  DollarSign,
  Lightbulb,
  FileBarChart2,
  Handshake,
  Star,
  Briefcase,
  FileDown,
  PenSquare,
  User,
  LayoutDashboard,
  ClipboardPlus,
  GraduationCap,
  type LucideIcon,
  UserPlus,
  FileUp,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { useAuth, type Role } from '@/context/AuthContext';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

const navItems: Record<Role, NavItem[]> = {
  hr: [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/dashboard/interns', label: 'Interns', icon: Users },
    { href: '/dashboard/mentors', label: 'Mentors', icon: UserCheck },
    { href: '/dashboard/projects', label: 'Projects', icon: FolderKanban },
    { href: '/dashboard/add-applicant', label: 'Add Applicants', icon: UserPlus },
    { href: '/dashboard/assign-mentor', label: 'Assign Mentor', icon: UserPlus },
    { href: '/dashboard/assign-documents', label: 'Assign Documents', icon: FileUp },
    { href: '/dashboard/stipends', label: 'Stipends', icon: DollarSign },
    { href: '/dashboard/ai-insights', label: 'AI Insights', icon: Lightbulb },
  ],
  mentor: [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/dashboard/my-interns', label: 'My Interns', icon: Users },
    { href: '/dashboard/mentor-projects', label: 'My Projects', icon: FolderKanban },
    { href: '/dashboard/assign-project', label: 'Assign Project', icon: ClipboardPlus },
    { href: '/dashboard/reports', label: 'Reports', icon: FileBarChart2 },
    { href: '/dashboard/mentorship', label: 'Mentorship Requests', icon: Handshake },
  ],
  intern: [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/dashboard/my-projects', label: 'My Projects', icon: FolderKanban },
    { href: '/dashboard/daily-report', label: 'Daily Report', icon: FileText },
    { href: '/dashboard/my-feedback', label: 'My Feedback', icon: Star },
    { href: '/dashboard/mentorship', label: 'Mentorship Hub', icon: Handshake },
    { href: '/dashboard/my-mentorship', label: 'My Mentorship', icon: UserCheck },
    { href: '/dashboard/ppo-status', label: 'PPO Status', icon: Briefcase },
    { href: '/dashboard/documents', label: 'Documents', icon: FileDown },
    { href: '/dashboard/my-review', label: 'My Review', icon: PenSquare },
    { href: '/dashboard/assessment', label: 'Final Assessment', icon: GraduationCap },
  ],
  employee: [
    { href: '/dashboard', label: 'My Profile', icon: User, exact: true },
    { href: '/dashboard/documents', label: 'My Documents', icon: FileDown },
  ],
};

export function DashboardNav({ isCollapsed }: { isCollapsed: boolean }) {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) return null;

  const items = navItems[user.role] || [];

  return (
    <TooltipProvider>
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {items.map((item, index) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return isCollapsed ? (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
                    isActive && 'bg-accent text-accent-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="sr-only">{item.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {item.label}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              key={index}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground',
                isActive && 'bg-accent text-accent-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </TooltipProvider>
  );
}
