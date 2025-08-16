'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Menu, X } from 'lucide-react';
import { MobileNavMenu, type NavItem } from './nav-menu';
import { cn } from '@/lib/utils';

interface MobileMenuProps {
  items: NavItem[];
  title?: string;
  className?: string;
  triggerClassName?: string;
  children?: React.ReactNode;
}

export function MobileMenu({
  items,
  title = 'Menu',
  className,
  triggerClassName,
  children,
}: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  const handleItemClick = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("lg:hidden", triggerClassName)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      
      <SheetContent side="left" className={cn("w-[300px] p-0", className)}>
        <div className="flex flex-col h-full">
          <SheetHeader className="p-6 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle>{title}</SheetTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                className="h-6 w-6"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </SheetHeader>

          <ScrollArea className="flex-1 p-6">
            <div onClick={handleItemClick}>
              <MobileNavMenu items={items} />
            </div>
            
            {children && (
              <div className="mt-6 pt-6 border-t">
                {children}
              </div>
            )}
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Context-aware mobile menu that automatically handles auth state
export function AppMobileMenu() {
  const publicItems: NavItem[] = [
    { title: 'Home', href: '/' },
    { title: 'Features', href: '/features' },
    { title: 'Pricing', href: '/pricing' },
    { title: 'About', href: '/about' },
    { title: 'Contact', href: '/contact' },
  ];

  const authenticatedItems: NavItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'My Decks', href: '/decks' },
    { title: 'Study', href: '/study' },
    { title: 'Practice', href: '/practice' },
    { title: 'Analytics', href: '/analytics' },
    { title: 'Settings', href: '/settings' },
  ];

  // This would be determined by auth state in real implementation
  const isAuthenticated = true; // Replace with actual auth check
  const items = isAuthenticated ? authenticatedItems : publicItems;

  return (
    <MobileMenu
      items={items}
      title={isAuthenticated ? 'Navigation' : 'Cardemy'}
    />
  );
}
