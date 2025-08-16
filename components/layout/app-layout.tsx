'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Header } from './header';
import { Sidebar } from './sidebar';
import { MobileNav } from './mobile-nav';
import { Breadcrumbs } from './breadcrumbs';

interface AppLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  showBreadcrumbs?: boolean;
  className?: string;
}

export function AppLayout({ 
  children, 
  showSidebar = true, 
  showBreadcrumbs = true,
  className 
}: AppLayoutProps) {
  const pathname = usePathname();
  
  // Determine layout type based on route
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isDashboard = pathname.startsWith('/dashboard') || pathname.startsWith('/decks') || pathname.startsWith('/cards');
  const isLearning = pathname.startsWith('/study') || pathname.startsWith('/practice');
  
  // Auth pages use minimal layout
  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header />
      
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Desktop Sidebar */}
        {showSidebar && (isDashboard || isLearning) && (
          <div className="hidden lg:block">
            <Sidebar />
          </div>
        )}
        
        {/* Mobile Navigation */}
        <MobileNav />
        
        {/* Main Content */}
        <main className={cn(
          "flex-1 overflow-auto",
          showSidebar && (isDashboard || isLearning) ? "lg:pl-0" : "",
          className
        )}>
          <div className="container mx-auto px-4 py-6">
            {/* Breadcrumbs */}
            {showBreadcrumbs && !isAuthPage && (
              <div className="mb-6">
                <Breadcrumbs />
              </div>
            )}
            
            {/* Page Content */}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

// Layout variants for different sections
export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout showSidebar={true} showBreadcrumbs={true}>
      {children}
    </AppLayout>
  );
}

export function LearningLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout showSidebar={true} showBreadcrumbs={true}>
      {children}
    </AppLayout>
  );
}

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout showSidebar={false} showBreadcrumbs={false}>
      {children}
    </AppLayout>
  );
}

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout showSidebar={false} showBreadcrumbs={false}>
      {children}
    </AppLayout>
  );
}
