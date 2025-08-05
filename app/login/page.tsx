// src/app/login/page.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogIn, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatedButton } from '@/components/animated-button';
import { AnimatedCard } from '@/components/animated-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { login, user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Redirect if user is already logged in
  if (user) {
    router.replace(user.role === 'admin' ? '/admin' : '/dashboard');
    return null; // Render nothing while redirecting
  }

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Login failed.');
      }

      const loggedInUser = result.user;
      login(loggedInUser);

      toast({
        title: 'Login Successful',
        description: `Welcome back, ${loggedInUser.name}!`,
      });

      router.push(loggedInUser.role === 'admin' ? '/admin' : '/dashboard');

    } catch (error: any) {
      toast({
        title: 'Login Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-green-50/20 dark:from-slate-950 dark:via-blue-950/30 dark:to-green-950/20"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-green-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-green-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Enhanced Login Card - Increased Size */}
      <div className="relative group w-full max-w-md mx-auto p-4">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <AnimatedCard variant="glass" hover3d={true} glowColor="blue" className="rounded-3xl">
          <CardHeader className="text-center pb-8">
            {/* Enhanced Logo Area */}
            <div className="relative mb-8 py-8">
              {/* Background Network Visualization */}
              <div className="absolute inset-0 -m-8 opacity-20">
                <svg className="w-full h-full" viewBox="0 0 400 300">
                  <circle cx="200" cy="150" r="50" fill="none" stroke="url(#gradient1)" strokeWidth="2" className="animate-pulse" />
                  <circle cx="200" cy="150" r="80" fill="none" stroke="url(#gradient2)" strokeWidth="1" opacity="0.6" className="animate-spin" style={{animationDuration: '20s'}} strokeDasharray="5,5" />
                  <circle cx="200" cy="150" r="110" fill="none" stroke="url(#gradient1)" strokeWidth="0.5" opacity="0.4" className="animate-spin" style={{animationDuration: '30s', animationDirection: 'reverse'}} strokeDasharray="3,7" />

                  <defs>
                    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
                    </linearGradient>
                    <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.6" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Floating Network Nodes */}
              <div className="absolute top-4 left-8 w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-bounce shadow-lg shadow-blue-400/50" style={{animationDelay: '0s'}} />
              <div className="absolute top-6 right-8 w-2 h-2 bg-gradient-to-r from-green-400 to-green-600 rounded-full animate-bounce shadow-lg shadow-green-400/50" style={{animationDelay: '1s'}} />
              <div className="absolute bottom-4 left-6 w-2.5 h-2.5 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full animate-bounce shadow-lg shadow-purple-400/50" style={{animationDelay: '2s'}} />
              <div className="absolute bottom-6 right-6 w-2 h-2 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full animate-bounce shadow-lg shadow-cyan-400/50" style={{animationDelay: '1.5s'}} />

              {/* Enhanced Main Logo Section */}
              <div className="relative z-10 flex flex-col items-center space-y-4">
                {/* Logo Container */}
                <div className="group cursor-pointer" onClick={() => router.push('/')}>
                  <div className="relative mb-4">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-green-600 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                    <div className="text-6xl transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 filter drop-shadow-xl">
                      🛡️
                    </div>
                  </div>
                </div>

                {/* Perfectly Centered Text Section */}
                <div className="text-center flex flex-col items-center">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent drop-shadow-lg mb-3">
                    AlertFront
                  </h1>
                  <div className="text-sm text-slate-600 dark:text-slate-300 font-semibold bg-white/90 dark:bg-slate-800/90 px-4 py-1.5 rounded-full backdrop-blur-sm border border-blue-200/50 dark:border-blue-700/50 shadow-sm">
                    Community Safety Network
                  </div>
                  <div className="flex items-center gap-1.5 mt-3 justify-center">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                  </div>
                </div>
              </div>

              {/* Status Indicators */}
              <div className="absolute top-8 left-4">
                <div className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-blue-500/20 to-transparent backdrop-blur-sm rounded-full border border-blue-200/30 dark:border-blue-700/30">
                  <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Live</span>
                </div>
              </div>

              <div className="absolute top-8 right-4">
                <div className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-green-500/20 to-transparent backdrop-blur-sm rounded-full border border-green-200/30 dark:border-green-700/30">
                  <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">Safe</span>
                </div>
              </div>
            </div>

            {/* Enhanced Security Badge */}
            <div className="mb-6 flex justify-center">
              <div className="relative group">
                <div className="relative flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500/20 via-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-full border border-green-300/30 dark:border-green-600/30 shadow-lg transform hover:scale-105 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent rounded-full"></div>
                  <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-400 rounded-full animate-pulse" style={{animationDuration: '2s'}}></div>
                  <span className="text-sm font-semibold text-green-700 dark:text-green-300 drop-shadow-sm">🔒 Secure Login</span>
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse" style={{animationDelay: '1s', animationDuration: '2s'}}></div>
                </div>
              </div>
            </div>

            {/* Enhanced Welcome Text */}
            <div className="space-y-3">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-green-600 to-cyan-600 bg-clip-text text-transparent drop-shadow-sm">
                Welcome Back to AlertFront
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                Your community safety dashboard awaits 🛡️
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-semibold text-sm flex items-center gap-2">
                  <span className="text-blue-600">📧</span>
                  Email
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg transition-all duration-300 pr-10 h-12 text-base"
                  />
                  {email && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-all duration-300">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">🦝</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="password" className="text-slate-700 dark:text-slate-300 font-semibold text-sm flex items-center gap-2">
                  <span className="text-green-600">🔒</span>
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg transition-all duration-300 pr-10 h-12 text-base"
                  />
                  {password && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-all duration-500">
                      <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center animate-bounce">
                        <span className="text-white text-xs">👀</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <AnimatedButton
                type="submit"
                variant="gradient"
                className="w-full h-12 text-base mt-2"
                disabled={isLoading}
                loading={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <LogIn className="mr-2 h-5 w-5" />
                )}
                {isLoading ? 'Signing In...' : 'Sign In'}
              </AnimatedButton>
              <div className="mt-6 text-center">
                <p className="text-base text-slate-600 dark:text-slate-400">
                  Don&apos;t have an account?{' '}
                  <Link
                    href="/signup"
                    className="group relative inline-flex items-center font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-all duration-300"
                  >
                    <span className="relative z-10 px-2 py-1 rounded-lg transition-all duration-300 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20">
                      Sign up here
                    </span>

                    {/* Animated underline */}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300 group-hover:w-full"></span>

                    {/* Floating arrow animation */}
                    <span className="ml-1 transform transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110">
                      →
                    </span>

                    {/* Subtle glow effect */}
                    <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400/0 to-green-400/0 group-hover:from-blue-400/10 group-hover:to-green-400/10 transition-all duration-300 blur-sm"></span>
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </AnimatedCard>
      </div>
    </div>
  );
}
