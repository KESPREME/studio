"use client"

import Link from "next/link"
import { ShieldAlert, UserCircle, LogOut, Settings, LayoutDashboard, Users, Moon, Sun, TestTube } from "lucide-react"
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
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/95 dark:bg-slate-950/95 border-b border-white/20 dark:border-slate-800/30 shadow-lg shadow-black/5 dark:shadow-black/10">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-purple-50/20 to-green-50/30 dark:from-blue-950/15 dark:via-purple-950/10 dark:to-green-950/15 opacity-60"></div>

      {/* Very gentle animated overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-gradient-flow-x opacity-30"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative">
        <div className="flex justify-between items-center h-24">
          {/* Enhanced Logo Section - Matching Login/Signup Style */}
          <Link href={getDashboardLink()} className="group flex items-center gap-4 hover:scale-105 transition-all duration-500">
            <div className="relative">
              {/* Enhanced background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-green-500/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 scale-150"></div>

              {/* Shield emoji container - matching login/signup style */}
              <div className="relative p-3 bg-gradient-to-br from-blue-500/15 to-green-500/15 rounded-2xl border border-white/30 dark:border-slate-700/40 group-hover:border-blue-400/60 dark:group-hover:border-green-400/60 transition-all duration-500 shadow-xl group-hover:shadow-2xl backdrop-blur-sm">
                <div className="text-3xl transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 filter drop-shadow-lg">
                  🛡️
                </div>

                {/* Enhanced shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out rounded-2xl"></div>
              </div>
            </div>

            {/* Enhanced brand text - matching login/signup style */}
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent group-hover:from-green-600 group-hover:to-blue-600 transition-all duration-500 drop-shadow-sm">
                AlertFront
              </span>
              <span className="text-sm text-slate-600 dark:text-slate-300 font-semibold bg-white/80 dark:bg-slate-800/80 px-3 py-1 rounded-full backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                Community Safety Network
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-4 header-controls">
            {/* Amazing 3D Animated Dark Mode Toggle - Always Visible */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="dark-mode-toggle group relative overflow-hidden h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-gradient-to-br from-yellow-50/90 via-orange-50/70 to-yellow-50/90 dark:from-slate-800/90 dark:via-slate-700/70 dark:to-slate-800/90 border-2 border-white/50 dark:border-slate-600/50 hover:border-yellow-400/80 dark:hover:border-blue-400/80 hover:shadow-2xl hover:scale-110 transition-all duration-700 backdrop-blur-md transform-gpu hover:-translate-y-1 flex-shrink-0"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {/* 3D Base Layer */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/5 dark:from-white/5 dark:via-transparent dark:to-black/20 rounded-2xl"></div>

              {/* Animated rotating background */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-orange-400/30 to-yellow-400/20 dark:from-blue-400/20 dark:via-purple-400/30 dark:to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl animate-gradient-rotate"></div>

              {/* Pulsing glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/30 to-orange-300/30 dark:from-blue-300/30 dark:to-purple-300/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse scale-150"></div>

              {/* 3D shine effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-30 group-hover:opacity-60 transition-opacity duration-700 rounded-2xl"></div>

              {/* Moving shine */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1200 ease-out rounded-2xl"></div>

              <div className="relative flex items-center justify-center z-10">
                {mounted ? (
                  <>
                    {isDark ? (
                      <div className="relative">
                        {/* Sun with 3D effect */}
                        <Sun className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500 group-hover:text-yellow-300 group-hover:rotate-180 group-hover:scale-125 transition-all duration-700 drop-shadow-xl filter" />

                        {/* Sun rays animation */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                          <div className="absolute top-0 left-1/2 w-0.5 h-2 bg-yellow-400/60 rounded-full transform -translate-x-1/2 -translate-y-3 animate-pulse"></div>
                          <div className="absolute bottom-0 left-1/2 w-0.5 h-2 bg-yellow-400/60 rounded-full transform -translate-x-1/2 translate-y-3 animate-pulse" style={{animationDelay: '0.2s'}}></div>
                          <div className="absolute left-0 top-1/2 w-2 h-0.5 bg-yellow-400/60 rounded-full transform -translate-y-1/2 -translate-x-3 animate-pulse" style={{animationDelay: '0.4s'}}></div>
                          <div className="absolute right-0 top-1/2 w-2 h-0.5 bg-yellow-400/60 rounded-full transform -translate-y-1/2 translate-x-3 animate-pulse" style={{animationDelay: '0.6s'}}></div>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        {/* Moon with 3D effect */}
                        <Moon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 group-hover:text-blue-400 group-hover:-rotate-12 group-hover:scale-125 transition-all duration-700 drop-shadow-xl filter" />

                        {/* Stars animation */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                          <div className="absolute top-1 right-1 w-1 h-1 bg-blue-400/80 rounded-full animate-pulse"></div>
                          <div className="absolute top-2 left-1 w-0.5 h-0.5 bg-cyan-400/80 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
                          <div className="absolute bottom-1 right-2 w-0.5 h-0.5 bg-indigo-400/80 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="h-5 w-5 sm:h-6 sm:w-6 bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700 rounded-full animate-pulse"></div>
                )}
              </div>

              {/* 3D bottom shadow */}
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-black/10 to-transparent rounded-b-2xl group-hover:via-black/20 transition-all duration-700"></div>
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="group relative overflow-hidden flex items-center gap-3 h-14 px-5 rounded-2xl bg-gradient-to-r from-slate-50/80 to-slate-100/80 dark:from-slate-800/80 dark:to-slate-700/80 border-2 border-white/40 dark:border-slate-600/40 hover:border-blue-400/70 dark:hover:border-purple-400/70 hover:shadow-2xl hover:scale-105 transition-all duration-700 backdrop-blur-md transform-gpu hover:-translate-y-1">
                    {/* Enhanced animated background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/15 to-purple-400/15 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl"></div>

                    {/* 3D shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-20 group-hover:opacity-40 transition-opacity duration-700 rounded-2xl"></div>

                    {/* Moving shine */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1200 ease-out rounded-2xl"></div>

                    <div className="relative flex items-center gap-3 z-10">
                      <div className="relative">
                        <UserCircle className="h-8 w-8 text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-purple-400 transition-colors duration-700 drop-shadow-lg filter" />
                        {/* Enhanced status indicator */}
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-2 border-white dark:border-slate-800 group-hover:scale-125 transition-transform duration-500 shadow-lg animate-pulse"></div>
                      </div>
                      <div className="hidden sm:flex flex-col items-start">
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-blue-700 dark:group-hover:text-purple-300 transition-colors duration-700">{user.name}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 capitalize font-medium">{user.role}</span>
                      </div>
                    </div>

                    {/* 3D bottom shadow */}
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-black/10 to-transparent rounded-b-2xl group-hover:via-black/20 transition-all duration-700"></div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 p-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 dark:border-slate-700/30 shadow-2xl rounded-2xl">
                  <DropdownMenuLabel className="p-4 rounded-xl bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-100/50 dark:border-blue-800/30 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <UserCircle className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></div>
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{user.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{user.email}</div>
                        <div className="text-xs text-blue-600 dark:text-blue-400 capitalize font-medium">{user.role} Account</div>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-200/50 dark:bg-slate-700/50" />
                  <DropdownMenuItem onClick={() => router.push(getDashboardLink())} className="group flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition-all duration-300 cursor-pointer">
                    <div className="p-2 rounded-lg bg-blue-100/50 dark:bg-blue-900/30 group-hover:bg-blue-200/50 dark:group-hover:bg-blue-800/40 transition-colors duration-300">
                      <LayoutDashboard className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <span className="font-medium text-slate-700 dark:text-slate-200">Dashboard</span>
                      <div className="text-xs text-slate-500 dark:text-slate-400">View your reports</div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/community')} className="group flex items-center gap-3 p-3 rounded-xl hover:bg-green-50/50 dark:hover:bg-green-950/30 transition-all duration-300 cursor-pointer">
                    <div className="p-2 rounded-lg bg-green-100/50 dark:bg-green-900/30 group-hover:bg-green-200/50 dark:group-hover:bg-green-800/40 transition-colors duration-300">
                      <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <span className="font-medium text-slate-700 dark:text-slate-200">Community</span>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Insights & analytics</div>
                    </div>
                  </DropdownMenuItem>
                  {user?.role === 'admin' && (
                    <DropdownMenuItem onClick={() => router.push('/admin/simulator')} className="group flex items-center gap-3 p-3 rounded-xl hover:bg-orange-50/50 dark:hover:bg-orange-950/30 transition-all duration-300 cursor-pointer">
                      <div className="p-2 rounded-lg bg-orange-100/50 dark:bg-orange-900/30 group-hover:bg-orange-200/50 dark:group-hover:bg-orange-800/40 transition-colors duration-300">
                        <TestTube className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <span className="font-medium text-slate-700 dark:text-slate-200">AI Simulator</span>
                        <div className="text-xs text-slate-500 dark:text-slate-400">Disaster simulation center</div>
                      </div>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => router.push('/settings')} className="group flex items-center gap-3 p-3 rounded-xl hover:bg-purple-50/50 dark:hover:bg-purple-950/30 transition-all duration-300 cursor-pointer">
                    <div className="p-2 rounded-lg bg-purple-100/50 dark:bg-purple-900/30 group-hover:bg-purple-200/50 dark:group-hover:bg-purple-800/40 transition-colors duration-300">
                      <Settings className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <span className="font-medium text-slate-700 dark:text-slate-200">Settings</span>
                      <div className="text-xs text-slate-500 dark:text-slate-400">Preferences & account</div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-200/50 dark:bg-slate-700/50 my-2" />
                  <DropdownMenuItem onClick={handleLogout} className="group flex items-center gap-3 p-3 rounded-xl hover:bg-red-50/50 dark:hover:bg-red-950/30 transition-all duration-300 cursor-pointer">
                    <div className="p-2 rounded-lg bg-red-100/50 dark:bg-red-900/30 group-hover:bg-red-200/50 dark:group-hover:bg-red-800/40 transition-colors duration-300">
                      <LogOut className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <span className="font-medium text-slate-700 dark:text-slate-200">Sign Out</span>
                      <div className="text-xs text-slate-500 dark:text-slate-400">End your session</div>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-4">
                <Button asChild variant="ghost" className="group relative overflow-hidden h-12 px-6 rounded-2xl bg-gradient-to-r from-slate-50/80 to-slate-100/80 dark:from-slate-800/80 dark:to-slate-700/80 border-2 border-white/40 dark:border-slate-600/40 hover:border-blue-400/70 dark:hover:border-purple-400/70 hover:shadow-xl hover:scale-105 transition-all duration-700 backdrop-blur-md transform-gpu hover:-translate-y-1">
                  <Link href="/login" className="relative flex items-center gap-2 z-10">
                    {/* Enhanced animated background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/15 to-purple-400/15 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl"></div>

                    {/* 3D shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-20 group-hover:opacity-40 transition-opacity duration-700 rounded-2xl"></div>

                    {/* Moving shine */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1200 ease-out rounded-2xl"></div>

                    <span className="relative font-bold text-slate-700 dark:text-slate-200 group-hover:text-blue-700 dark:group-hover:text-purple-300 transition-colors duration-700">Login</span>

                    {/* 3D bottom shadow */}
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-black/10 to-transparent rounded-b-2xl group-hover:via-black/20 transition-all duration-700"></div>
                  </Link>
                </Button>

                <Button asChild className="group relative overflow-hidden h-12 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-700 transform-gpu hover:-translate-y-1">
                  <Link href="/signup" className="relative flex items-center gap-2 z-10">
                    {/* Enhanced shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1200 ease-out rounded-2xl"></div>

                    {/* Pulsing glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-green-400/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse scale-150"></div>

                    <span className="relative font-bold">Sign Up</span>

                    {/* 3D bottom shadow */}
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-black/20 to-transparent rounded-b-2xl"></div>
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
