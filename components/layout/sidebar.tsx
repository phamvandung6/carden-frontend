'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  BookOpen, 
  GraduationCap, 
  Target, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Clock,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/features/auth';

interface SidebarProps {
  className?: string;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  children?: NavItem[];
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigation: NavItem[] = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'My Decks',
      href: '/dashboard/decks',
      icon: BookOpen,
      badge: '12', // This would come from actual data
      children: [
        { title: 'All Decks', href: '/dashboard/decks', icon: BookOpen },
        { title: 'Recent', href: '/dashboard/decks/recent', icon: Clock },
        { title: 'Favorites', href: '/dashboard/decks/favorites', icon: Star },
        { title: 'Create New', href: '/dashboard/decks/create', icon: Plus },
      ]
    },
    {
      title: 'Study',
      href: '/study',
      icon: GraduationCap,
      children: [
        { title: 'Study Session', href: '/study', icon: GraduationCap },
        { title: 'Review Due', href: '/study/review', icon: Clock },
        { title: 'Browse Cards', href: '/cards', icon: Search },
      ]
    },
    {
      title: 'Practice',
      href: '/practice',
      icon: Target,
      children: [
        { title: 'Quick Practice', href: '/practice', icon: Target },
        { title: 'Test Mode', href: '/practice/test', icon: Target },
        { title: 'Timed Practice', href: '/practice/timed', icon: Clock },
      ]
    },
    {
      title: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: Settings,
    },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  const renderNavItem = (item: NavItem, level = 0) => {
    const active = isActive(item.href);
    
    return (
      <div key={item.href}>
        <Link href={item.href}>
          <Button
            variant={active ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start h-10",
              level > 0 && "ml-4 w-[calc(100%-1rem)]",
              isCollapsed && level === 0 && "justify-center px-2"
            )}
          >
            <item.icon className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
            {!isCollapsed && (
              <>
                <span className="flex-1 text-left">{item.title}</span>
                {item.badge && (
                  <Badge variant="secondary" className="ml-auto h-5 text-xs">
                    {item.badge}
                  </Badge>
                )}
              </>
            )}
          </Button>
        </Link>
        
        {/* Render children if expanded and has children */}
        {!isCollapsed && item.children && active && (
          <div className="mt-1 space-y-1">
            {item.children.map((child) => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn(
      "flex flex-col border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      isCollapsed ? "w-16" : "w-64",
      "transition-all duration-300 ease-in-out",
      className
    )}>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-semibold">
                {user?.displayName?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user?.displayName || 'User'}</span>
              <span className="text-xs text-muted-foreground">
                {user?.role?.toLowerCase() || 'user'}
              </span>
            </div>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {navigation.map((item) => renderNavItem(item))}
        </nav>
      </ScrollArea>

      {/* Quick Actions (when expanded) */}
      {!isCollapsed && (
        <div className="p-3 border-t">
          <Link href="/dashboard/decks/create">
            <Button className="w-full" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create Deck
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
