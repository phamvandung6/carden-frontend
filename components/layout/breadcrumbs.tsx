'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface BreadcrumbsProps {
  className?: string;
  items?: BreadcrumbItem[];
}

export function Breadcrumbs({ className, items }: BreadcrumbsProps) {
  const pathname = usePathname();

  // Generate breadcrumbs from pathname if items not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean);
    
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', href: '/dashboard', icon: Home }
    ];

    // Route mapping for better labels
    const routeLabels: Record<string, string> = {
      dashboard: 'Dashboard',
      decks: 'My Decks',
      cards: 'Cards',
      study: 'Study',
      practice: 'Practice',
      analytics: 'Analytics',
      settings: 'Settings',
      profile: 'Profile',
      new: 'Create New',
      edit: 'Edit',
      review: 'Review',
      favorites: 'Favorites',
      recent: 'Recent',
      test: 'Test Mode',
      timed: 'Timed Practice',
    };

    let currentPath = '';
    
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;
      
      // Skip if it's just a dynamic ID (numbers only)
      if (/^\d+$/.test(segment)) {
        return;
      }
      
      const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      
      breadcrumbs.push({
        label,
        href: isLast ? undefined : currentPath, // Don't make last item clickable
      });
    });

    return breadcrumbs;
  };

  const breadcrumbItems = items || generateBreadcrumbs();

  // Don't show breadcrumbs on root pages or auth pages
  if (pathname === '/' || pathname === '/dashboard' || pathname.startsWith('/login') || pathname.startsWith('/register')) {
    return null;
  }

  return (
    <nav className={cn("flex items-center space-x-1 text-sm text-muted-foreground", className)}>
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRight className="h-4 w-4 mx-1" />
          )}
          
          <div className="flex items-center space-x-1">
            {item.icon && (
              <item.icon className="h-4 w-4" />
            )}
            
            {item.href ? (
              <Link 
                href={item.href}
                className="hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground font-medium">
                {item.label}
              </span>
            )}
          </div>
        </React.Fragment>
      ))}
    </nav>
  );
}

// Predefined breadcrumb configurations for specific pages
export const breadcrumbConfigs = {
  deckDetails: (deckName: string): BreadcrumbItem[] => [
    { label: 'Home', href: '/dashboard', icon: Home },
    { label: 'My Decks', href: '/decks' },
    { label: deckName },
  ],
  
  cardEdit: (deckName: string, cardTitle?: string): BreadcrumbItem[] => [
    { label: 'Home', href: '/dashboard', icon: Home },
    { label: 'My Decks', href: '/decks' },
    { label: deckName, href: '/decks/[id]' },
    { label: cardTitle ? `Edit: ${cardTitle}` : 'Edit Card' },
  ],
  
  studySession: (deckName?: string): BreadcrumbItem[] => [
    { label: 'Home', href: '/dashboard', icon: Home },
    { label: 'Study', href: '/study' },
    ...(deckName ? [{ label: deckName }] : []),
  ],
  
  practiceSession: (mode: string, deckName?: string): BreadcrumbItem[] => [
    { label: 'Home', href: '/dashboard', icon: Home },
    { label: 'Practice', href: '/practice' },
    { label: mode },
    ...(deckName ? [{ label: deckName }] : []),
  ],
  
  userSettings: (section?: string): BreadcrumbItem[] => [
    { label: 'Home', href: '/dashboard', icon: Home },
    { label: 'Settings', href: '/settings' },
    ...(section ? [{ label: section }] : []),
  ],
};
