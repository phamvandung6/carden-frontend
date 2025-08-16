'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NavLink } from './nav-link';

export interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  disabled?: boolean;
  external?: boolean;
  children?: NavItem[];
}

interface NavMenuProps {
  items: NavItem[];
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  showIcons?: boolean;
  showBadges?: boolean;
  collapsible?: boolean;
  level?: number;
}

export function NavMenu({
  items,
  className,
  orientation = 'vertical',
  showIcons = true,
  showBadges = true,
  collapsible = false,
  level = 0,
}: NavMenuProps) {
  const pathname = usePathname();

  const isParentActive = (item: NavItem): boolean => {
    if (item.href === pathname) return true;
    if (item.children) {
      return item.children.some(child => isParentActive(child));
    }
    return pathname.startsWith(item.href) && item.href !== '/';
  };

  return (
    <nav className={cn(
      orientation === 'horizontal' 
        ? "flex items-center space-x-1" 
        : "space-y-1",
      className
    )}>
      {items.map((item) => {
        const hasChildren = item.children && item.children.length > 0;
        const isActive = isParentActive(item);
        const shouldShowChildren = collapsible ? isActive : true;

        return (
          <div key={item.href} className={cn(level > 0 && "ml-4")}>
            <NavLink
              href={item.href}
              icon={showIcons ? item.icon : undefined}
              badge={showBadges ? item.badge : undefined}
              disabled={item.disabled}
              external={item.external}
              exactMatch={item.href === '/dashboard'}
            >
              {item.title}
            </NavLink>
            
            {/* Render children if they exist and should be shown */}
            {hasChildren && shouldShowChildren && (
              <div className="mt-1">
                <NavMenu
                  items={item.children!}
                  orientation={orientation}
                  showIcons={showIcons}
                  showBadges={showBadges}
                  collapsible={collapsible}
                  level={level + 1}
                />
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

// Specialized menu variants
export function SidebarNavMenu(props: Omit<NavMenuProps, 'orientation'>) {
  return (
    <NavMenu
      orientation="vertical"
      collapsible={true}
      {...props}
    />
  );
}

export function HeaderNavMenu(props: Omit<NavMenuProps, 'orientation' | 'showIcons'>) {
  return (
    <NavMenu
      orientation="horizontal"
      showIcons={false}
      {...props}
    />
  );
}

export function MobileNavMenu(props: Omit<NavMenuProps, 'orientation'>) {
  return (
    <NavMenu
      orientation="vertical"
      collapsible={false}
      {...props}
    />
  );
}
