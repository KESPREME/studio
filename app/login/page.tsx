// src/app/login/page.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogIn, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

      {/* Enhanced Login Card */}
      <div className="relative group w-full max-w-sm mx-auto p-4">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <Card className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl">
          <CardHeader className="text-center pb-6">
            {/* Simplified Logo Area */}
            <div className="relative mb-6 py-6">
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

              {/* Main Logo */}
              <div className="relative z-10 group cursor-pointer flex flex-col items-center" onClick={() => router.push('/')}>
                <div className="relative mb-3">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-green-600 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                  <div className="text-5xl transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 filter drop-shadow-xl">
                    🛡️
                  </div>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent transform transition-all duration-300 group-hover:scale-105 mb-1">
                  AlertFront
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Community Safety Network
                </p>
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

            {/* Security Badge */}
            <div className="mb-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-green-500/20 via-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-full border border-green-200/50 dark:border-green-700/50 shadow-lg">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-semibold text-green-700 dark:text-green-300">🔒 Secure Login</span>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
              </div>
            </div>

            {/* Welcome Text */}
            <div className="space-y-2">
              <CardTitle className="text-lg font-bold bg-gradient-to-r from-blue-600 via-green-600 to-cyan-600 bg-clip-text text-transparent">
                Welcome Back to AlertFront
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-300 text-sm">
                Your community safety dashboard awaits 🛡️
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-medium text-sm">Email</Label>
                <div className="relative">
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="user@example.com" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required 
                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg transition-all duration-300 pr-10"
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
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 dark:text-slate-300 font-medium text-sm">Password</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    required 
                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg transition-all duration-300 pr-10"
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
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-500 to-green-600 hover:from-blue-600 hover:to-green-700 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 rounded-lg py-2.5 border-0" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <LogIn className="mr-2 h-4 w-4" />
                )}
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
              <div className="mt-4 text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Don&apos;t have an account?{' '}
                  <Link 
                    href="/signup" 
                    className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-300"
                  >
                    Sign up here
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
