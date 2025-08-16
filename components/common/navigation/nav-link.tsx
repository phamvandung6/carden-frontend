'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  variant?: 'default' | 'ghost' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  exactMatch?: boolean;
  disabled?: boolean;
  external?: boolean;
}

export function NavLink({
  href,
  children,
  icon: Icon,
  badge,
  variant = 'ghost',
  size = 'default',
  className,
  exactMatch = false,
  disabled = false,
  external = false,
  ...props
}: NavLinkProps) {
  const pathname = usePathname();
  
  const isActive = exactMatch 
    ? pathname === href
    : pathname.startsWith(href) && href !== '/';

  const buttonVariant = isActive ? 'secondary' : variant;

  const linkProps = external 
    ? { href, target: '_blank', rel: 'noopener noreferrer' }
    : { href };

  const content = (
    <Button
      variant={buttonVariant}
      size={size}
      className={cn(
        "justify-start w-full",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {Icon && <Icon className={cn("h-4 w-4", children && "mr-2")} />}
      {children && <span className="flex-1 text-left">{children}</span>}
      {badge && (
        <Badge variant="secondary" className="ml-auto h-5 text-xs">
          {badge}
        </Badge>
      )}
    </Button>
  );

  if (disabled) {
    return content;
  }

  return (
    <Link {...linkProps} className="block">
      {content}
    </Link>
  );
}

// Specialized nav link variants
export function SidebarNavLink(props: Omit<NavLinkProps, 'variant' | 'size'>) {
  return <NavLink variant="ghost" size="default" {...props} />;
}

export function HeaderNavLink({ 
  className, 
  children, 
  ...props 
}: Omit<NavLinkProps, 'variant' | 'size'>) {
  return (
    <NavLink
      variant="ghost"
      size="sm"
      className={cn("px-3 py-2 h-auto font-medium", className)}
      {...props}
    >
      {children}
    </NavLink>
  );
}

export function MobileNavLink(props: Omit<NavLinkProps, 'variant' | 'size'>) {
  return <NavLink variant="ghost" size="lg" {...props} />;
}
