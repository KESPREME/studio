// src/app/settings/page.tsx
"use client"

import withAuth from "@/components/with-auth"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Header } from "@/components/header"
import { Settings, User, Mail, Shield, Sparkles, Moon, Sun, Palette } from "lucide-react"
import { useEffect, useState } from 'react'

function SettingsPage() {
  const { user } = useAuth()
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-blue-950/30 dark:to-purple-950/20">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold font-headline bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Settings</h1>
            <p className="text-muted-foreground mt-2">Manage your account and preferences.</p>
          </div>
          <div className="space-y-8">
            {/* Profile Card */}
            <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Profile
                </CardTitle>
                <CardDescription>This is how your profile appears to others.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-600" />
                    Name
                  </Label>
                  <Input id="name" defaultValue={user?.name} readOnly className="bg-white dark:bg-slate-800" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-green-600" />
                    Email
                  </Label>
                  <Input id="email" type="email" defaultValue={user?.email} readOnly className="bg-white dark:bg-slate-800" />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="role" className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-purple-600" />
                    Role
                  </Label>
                  <Input id="role" defaultValue={user?.role} readOnly className="capitalize bg-white dark:bg-slate-800" />
                </div>
              </CardContent>
            </Card>

            {/* Theme Preferences Card */}
            <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-purple-600" />
                  Theme Preferences
                </CardTitle>
                <CardDescription>Customize your visual experience with light and dark mode options.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Dark Mode Toggle */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg">
                      {isDark ? (
                        <Moon className="h-4 w-4 text-white" />
                      ) : (
                        <Sun className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div>
                      <Label htmlFor="dark-mode" className="text-slate-700 dark:text-slate-300 font-medium">
                        {isDark ? 'Dark Mode' : 'Light Mode'}
                      </Label>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {isDark ? 'Switch to light mode for better visibility' : 'Switch to dark mode for reduced eye strain'}
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={isDark}
                    onCheckedChange={toggleTheme}
                    className="data-[state=checked]:bg-blue-600"
                  />
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
                    className={`flex-1 ${!isDark ? 'bg-yellow-50 border-yellow-300 text-yellow-700' : ''}`}
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
                    className={`flex-1 ${isDark ? 'bg-slate-100 dark:bg-slate-800 border-slate-400 dark:border-slate-600' : ''}`}
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