'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, BookOpen, Clock } from 'lucide-react';
import { UserMenu } from './user-menu';
import { useAuth } from '@/features/auth';
import { useDueCardsCount, NextReviewInfo } from '@/features/study';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();
  const { isLoggedIn } = useAuth();
  const { data: dueCount } = useDueCardsCount();
  
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');
  
  // Don't show header on auth pages
  if (isAuthPage) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              {/* Mobile navigation content will be handled by MobileNav */}
            </SheetContent>
          </Sheet>
          
          {/* Logo */}
          <Link href={isLoggedIn ? "/dashboard" : "/"} className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Cardemy</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6">
          {isLoggedIn ? (
            <>
              <Link 
                href="/dashboard" 
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname.startsWith('/dashboard') ? "text-primary" : "text-muted-foreground"
                )}
              >
                Dashboard
              </Link>
              <Link 
                href="/decks" 
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname.startsWith('/decks') ? "text-primary" : "text-muted-foreground"
                )}
              >
                My Decks
              </Link>
              <Link 
                href="/study" 
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname.startsWith('/study') ? "text-primary" : "text-muted-foreground"
                )}
              >
                Study
              </Link>
              <Link 
                href="/practice" 
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname.startsWith('/practice') ? "text-primary" : "text-muted-foreground"
                )}
              >
                Practice
              </Link>
            </>
          ) : (
            <>
              <Link 
                href="/features" 
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Features
              </Link>
              <Link 
                href="/pricing" 
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                Pricing
              </Link>
              <Link 
                href="/about" 
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                About
              </Link>
            </>
          )}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              {/* Next Review Info */}
              {dueCount && dueCount.totalDue === 0 && (
                <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-muted rounded-full text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <NextReviewInfo 
                    nextAvailableTime={dueCount.nextCardAvailableAt}
                    minutesUntil={dueCount.minutesUntilNext}
                    variant="compact"
                    showIcon={false}
                  />
                </div>
              )}
              
              {/* Study Now Button */}
              {dueCount && dueCount.totalDue > 0 && (
                <Button size="sm" asChild className="hidden md:flex">
                  <Link href="/practice">
                    Study ({dueCount.totalDue})
                  </Link>
                </Button>
              )}
              
              <UserMenu />
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
