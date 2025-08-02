// src/app/login/page.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldAlert, LogIn, Loader2, Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { PeekingRaccoon } from '@/components/peeking-raccoon';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { login, user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPeeking, setIsPeeking] = useState(false);
  const [isHiding, setIsHiding] = useState(false);

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

  const handleFocus = (field: 'email' | 'password') => {
    if (field === 'password') {
      setIsPeeking(true);
      setIsHiding(false);
    } else {
      setIsHiding(true);
      setIsPeeking(false);
    }
  };

  const handleBlur = () => {
    setIsPeeking(false);
    setIsHiding(false);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40 p-4" style={{ perspective: '1000px' }}>
      <div className="relative w-full max-w-sm">
        <PeekingRaccoon isPeeking={isPeeking} isHiding={isHiding} />
        <Card 
          className="w-full shadow-2xl transition-transform duration-500 relative z-20"
          style={{ transform: isPeeking ? 'rotateY(-10deg) rotateX(3deg)' : 'rotateY(0) rotateX(0)'}}
        >
          <CardHeader className="text-center">
            <ShieldAlert className="mx-auto h-12 w-12 text-primary" />
            <CardTitle className="text-2xl font-bold font-headline mt-4">Welcome Back to AlertFront</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="user@example.com" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  onFocus={() => handleFocus('email')}
                  onBlur={handleBlur}
                  required 
                />
              </div>
              <div className="space-y-2 relative">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type={showPassword ? 'text' : 'password'}
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  onFocus={() => handleFocus('password')}
                  onBlur={handleBlur}
                  required 
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute bottom-1 right-1 h-7 w-7"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 animate-spin" />}
                Login
              </Button>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="underline text-primary">
                  Sign up
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
