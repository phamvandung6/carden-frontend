'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  BookOpen, 
  GraduationCap, 
  Target, 
  BarChart3, 
  Settings,
  Plus,
  Search,
  Clock,
  Star,
  User,
  LogOut
} from 'lucide-react';
// import { cn } from '@/lib/utils'; // unused for now
import { useAuth } from '@/features/auth';

interface MobileNavProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function MobileNav({ open, onOpenChange }: MobileNavProps) {
  const pathname = usePathname();
  const { user, logout, isLoggedIn } = useAuth();

  const navigation = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'My Decks',
      href: '/decks',
      icon: BookOpen,
      badge: '12',
    },
    {
      title: 'Study',
      href: '/study',
      icon: GraduationCap,
    },
    {
      title: 'Practice',
      href: '/practice',
      icon: Target,
    },
    {
      title: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
    },
  ];

  const quickActions = [
    {
      title: 'Create Deck',
      href: '/decks/new',
      icon: Plus,
    },
    {
      title: 'Browse Cards',
      href: '/cards',
      icon: Search,
    },
    {
      title: 'Review Due',
      href: '/study/review',
      icon: Clock,
    },
    {
      title: 'Favorites',
      href: '/decks/favorites',
      icon: Star,
    },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  const handleLinkClick = () => {
    onOpenChange?.(false);
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[300px] p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="p-6 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-semibold">
                  {user?.displayName?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex flex-col text-left">
                <SheetTitle className="text-base">
                  {user?.displayName || 'User'}
                </SheetTitle>
                <span className="text-sm text-muted-foreground">
                  {user?.email}
                </span>
              </div>
            </div>
          </SheetHeader>

          <ScrollArea className="flex-1">
            <div className="p-6 space-y-6">
              {/* Main Navigation */}
              <div>
                <h3 className="mb-3 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Navigation
                </h3>
                <nav className="space-y-1">
                  {navigation.map((item) => (
                    <Link key={item.href} href={item.href} onClick={handleLinkClick}>
                      <Button
                        variant={isActive(item.href) ? "secondary" : "ghost"}
                        className="w-full justify-start h-11"
                      >
                        <item.icon className="h-4 w-4 mr-3" />
                        <span className="flex-1 text-left">{item.title}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="ml-auto">
                            {item.badge}
                          </Badge>
                        )}
                      </Button>
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="mb-3 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action) => (
                    <Link key={action.href} href={action.href} onClick={handleLinkClick}>
                      <Button
                        variant="outline"
                        className="w-full h-16 flex-col space-y-1"
                      >
                        <action.icon className="h-4 w-4" />
                        <span className="text-xs">{action.title}</span>
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Account Actions */}
              <div>
                <h3 className="mb-3 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Account
                </h3>
                <nav className="space-y-1">
                  <Link href="/settings" onClick={handleLinkClick}>
                    <Button
                      variant={isActive('/settings') ? "secondary" : "ghost"}
                      className="w-full justify-start h-11"
                    >
                      <Settings className="h-4 w-4 mr-3" />
                      Settings
                    </Button>
                  </Link>
                  
                  <Link href="/profile" onClick={handleLinkClick}>
                    <Button
                      variant={isActive('/profile') ? "secondary" : "ghost"}
                      className="w-full justify-start h-11"
                    >
                      <User className="h-4 w-4 mr-3" />
                      Profile
                    </Button>
                  </Link>
                </nav>
              </div>
            </div>
          </ScrollArea>

          {/* Footer Actions */}
          <div className="p-6 border-t">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                logout();
                handleLinkClick();
              }}
            >
              <LogOut className="h-4 w-4 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
