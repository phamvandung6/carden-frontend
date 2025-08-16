'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Settings, 
  BarChart3, 
  LogOut, 
  Crown,
  Mail,
  Shield,
  HelpCircle,
  Moon,
  Sun
} from 'lucide-react';
import { useAuth } from '@/features/auth';
import { useTheme } from 'next-themes';

export function UserMenu() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={undefined} alt={user.displayName} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(user.displayName)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-80" align="end" forceMount>
        {/* User Info Header */}
        <DropdownMenuLabel className="p-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={undefined} alt={user.displayName} />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {getInitials(user.displayName)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium truncate">
                  {user.displayName}
                </p>
                {user.role === 'ADMIN' && (
                  <Badge variant="secondary" className="text-xs">
                    <Crown className="h-3 w-3 mr-1" />
                    Admin
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center space-x-1 mt-1">
                <Mail className="h-3 w-3 text-muted-foreground" />
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
                {user.emailVerified && (
                  <Shield className="h-3 w-3 text-green-500" />
                )}
              </div>
              
              <p className="text-xs text-muted-foreground mt-1">
                @{user.username}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Navigation Items */}
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center space-x-2 cursor-pointer">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/settings" className="flex items-center space-x-2 cursor-pointer">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/analytics" className="flex items-center space-x-2 cursor-pointer">
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Theme Toggle */}
        <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer">
          <div className="flex items-center space-x-2">
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            <span>
              Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
            </span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Help & Support */}
        <DropdownMenuItem asChild>
          <Link href="/help" className="flex items-center space-x-2 cursor-pointer">
            <HelpCircle className="h-4 w-4" />
            <span>Help & Support</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem 
          onClick={handleLogout}
          className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
        >
          <div className="flex items-center space-x-2">
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
