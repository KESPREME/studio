"use client"

import Link from "next/link"
import { ShieldAlert, UserCircle, LogOut, Settings, LayoutDashboard, Users, Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newTheme);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    return user.role === 'admin' ? '/admin' : '/dashboard';
  }

  return (
    <header className="bg-card border-b shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href={getDashboardLink()} className="flex items-center gap-2">
            <ShieldAlert className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold font-headline text-foreground">AlertFront</span>
          </Link>
          <div className="flex items-center gap-4">
            {/* Dark Mode Toggle - Enhanced Visibility */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="group relative overflow-hidden bg-gradient-to-r from-yellow-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 border-2 border-yellow-400/50 dark:border-blue-400/50 hover:border-yellow-500 dark:hover:border-blue-500 hover:shadow-lg hover:scale-105 transition-all duration-300 rounded-xl px-3 py-2"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-blue-400/10 dark:from-blue-400/10 dark:to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-1.5">
                {mounted ? (
                  <>
                    {isDark ? (
                      <>
                        <Sun className="h-4 w-4 text-yellow-600 group-hover:animate-pulse" />
                        <span className="text-xs font-medium text-yellow-700 dark:text-yellow-400 hidden sm:inline">Light</span>
                      </>
                    ) : (
                      <>
                        <Moon className="h-4 w-4 text-blue-600 group-hover:animate-pulse" />
                        <span className="text-xs font-medium text-blue-700 dark:text-blue-400 hidden sm:inline">Dark</span>
                      </>
                    )}
                  </>
                ) : (
                  <div className="h-4 w-4 bg-slate-300 dark:bg-slate-600 rounded animate-pulse"></div>
                )}
              </div>
            </Button>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800">
                    <UserCircle className="h-6 w-6 text-slate-700 dark:text-slate-300" />
                    <span className="hidden sm:inline text-slate-700 dark:text-slate-300">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push(getDashboardLink())}>
                    <LayoutDashboard className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/community')}>
                    <Users className="mr-2 h-4 w-4 text-green-600 dark:text-green-400" />
                    <span>Community Insights</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/settings')}>
                    <Settings className="mr-2 h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4 text-red-600 dark:text-red-400" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild>
                <Link href="/login">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
