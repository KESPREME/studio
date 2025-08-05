// src/app/settings/page.tsx
"use client"

import withAuth from "@/components/with-auth"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Header } from "@/components/header"
import { Settings, User, Mail, Shield, Sparkles, Moon, Sun, Palette } from "lucide-react"
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useEffect, useState } from 'react';

function SettingsPage() {
  const { user } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check for saved theme preference without automatically applying it
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

    setIsDark(shouldBeDark);
    // Only apply the theme if it's explicitly saved, don't auto-switch
    if (savedTheme) {
      document.documentElement.classList.toggle('dark', shouldBeDark);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newTheme);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-emerald-400/25 to-teal-400/25 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-teal-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-gradient-to-r from-cyan-400/30 to-blue-400/30 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      <Header />
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Enhanced Header Section */}
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-3xl blur-xl"></div>
              <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-2xl">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg">
                    <Settings className="h-8 w-8 text-white animate-spin" style={{animationDuration: '3s'}} />
                  </div>
                </div>
                <h1 className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-4 drop-shadow-lg">
                  Account Settings
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
                  Manage your profile and preferences for the AlertFront platform 
                </p>
                
                {/* User Role Badge */}
                <div className="flex justify-center mt-6">
                  <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full border border-emerald-200/50 dark:border-emerald-700/50">
                    <Shield className="h-4 w-4 text-emerald-600 animate-pulse" />
                    <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300 capitalize">{user?.role || 'User'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Profile Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <Card className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold drop-shadow-sm">
                    Profile Information
                  </span>
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300">
                  This is how your profile appears to others on the platform.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-700 dark:text-slate-300 font-medium text-sm flex items-center gap-2">
                    <User className="h-4 w-4 text-emerald-600" />
                    Full Name
                  </Label>
                  <div className="relative">
                    <Input 
                      id="name" 
                      defaultValue={user?.name} 
                      readOnly 
                      className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 rounded-lg pr-10 font-medium"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                        <Sparkles className="h-3 w-3 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-medium text-sm flex items-center gap-2">
                    <Mail className="h-4 w-4 text-teal-600" />
                    Email Address
                  </Label>
                  <div className="relative">
                    <Input 
                      id="email" 
                      type="email" 
                      defaultValue={user?.email} 
                      readOnly 
                      className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 rounded-lg pr-10 font-medium"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-6 h-6 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center">
                        <Mail className="h-3 w-3 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-slate-700 dark:text-slate-300 font-medium text-sm flex items-center gap-2">
                    <Shield className="h-4 w-4 text-cyan-600" />
                    Account Role
                  </Label>
                  <div className="relative">
                    <Input 
                      id="role" 
                      defaultValue={user?.role} 
                      readOnly 
                      className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 rounded-lg pr-10 font-medium capitalize"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                        <Shield className="h-3 w-3 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Info Note */}
                <div className="mt-6 p-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl border border-emerald-200/50 dark:border-emerald-700/50">
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-emerald-500/20 rounded">
                      <Sparkles className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-1">
                        Profile Status: Active
                      </p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400">
                        Your profile information is managed by the system administrator. Contact support if you need to update any details.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Theme Preferences Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <Card className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                    <Palette className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-blue-600 dark:text-blue-400 font-bold drop-shadow-sm">
                    Theme Preferences
                  </span>
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300">
                  Customize your visual experience with light and dark mode options.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Dark Mode Toggle */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl border border-blue-200/50 dark:border-blue-700/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                      {isDark ? (
                        <Moon className="h-5 w-5 text-white" />
                      ) : (
                        <Sun className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <div>
                      <Label htmlFor="dark-mode" className="text-slate-700 dark:text-slate-300 font-medium text-sm">
                        {isDark ? 'Dark Mode' : 'Light Mode'}
                      </Label>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {isDark ? 'Switch to light mode for better visibility in bright environments' : 'Switch to dark mode for reduced eye strain in low light'}
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={isDark}
                    onCheckedChange={toggleTheme}
                    className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-slate-300"
                  />
                </div>

                {/* Theme Info */}
                <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl border border-blue-200/50 dark:border-blue-700/50">
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-blue-500/20 rounded">
                      <Sparkles className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">
                        Theme Status: {isDark ? 'Dark Mode Active' : 'Light Mode Active'}
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400">
                        Your theme preference is automatically saved and will persist across all your sessions. You can also use the theme toggle in the header for quick switching.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Theme Actions */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsDark(false);
                      localStorage.setItem('theme', 'light');
                      document.documentElement.classList.remove('dark');
                    }}
                    className={`flex-1 ${!isDark ? 'bg-yellow-50 border-yellow-300 text-yellow-700' : 'hover:bg-yellow-50 hover:border-yellow-300'}`}
                  >
                    <Sun className="h-4 w-4 mr-2" />
                    Light Mode
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsDark(true);
                      localStorage.setItem('theme', 'dark');
                      document.documentElement.classList.add('dark');
                    }}
                    className={`flex-1 ${isDark ? 'bg-slate-100 dark:bg-slate-800 border-slate-400 dark:border-slate-600 text-slate-700 dark:text-slate-300' : 'hover:bg-slate-100 hover:border-slate-400'}`}
                  >
                    <Moon className="h-4 w-4 mr-2" />
                    Dark Mode
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

export default withAuth(SettingsPage, { roles: ['admin', 'reporter'] })
