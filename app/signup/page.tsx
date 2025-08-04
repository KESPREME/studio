// src/app/signup/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldAlert, LogIn, Loader2, UserPlus, Phone, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuth();
  
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  
  const handleDetailsSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to send OTP.');
      }
      
      toast({
        title: 'OTP Sent',
        description: 'A one-time password has been sent to your phone.',
      });
      setStep('otp');

    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      // First, verify the OTP
      const otpResponse = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code: otp }),
      });
      
      const otpResult = await otpResponse.json();

       if (!otpResponse.ok) {
        throw new Error(otpResult.message || 'Failed to verify OTP.');
      }
      
      // OTP is valid, proceed with creating the user account
      const signupResponse = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, phone }),
      });

      const signupResult = await signupResponse.json();

      if (!signupResponse.ok) {
          throw new Error(signupResult.message || 'Failed to create account.');
      }
      
      const user = signupResult.user;
      
      login(user);

      toast({
        title: 'Account Created!',
        description: `Welcome, ${user.name}!`,
      });
      
      router.push('/dashboard');

    } catch (error: any) {
       toast({
        title: 'Signup Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-gradient-to-r from-green-400/25 to-emerald-400/25 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Enhanced Signup Card */}
      <div className="relative group w-full max-w-sm mx-auto p-4">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <Card className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-3xl">
          <CardHeader className="text-center pb-4">
            <div className="relative mb-6">
              {/* Enhanced Logo Area with Creative Elements */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl"></div>
              <div className="relative">
                {/* Floating Particles */}
                <div className="absolute -top-2 -left-2 w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
                <div className="absolute -top-1 right-0 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-rose-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                <div className="absolute -bottom-2 right-1 w-2 h-2 bg-purple-300 rounded-full animate-ping" style={{animationDelay: '1.5s'}}></div>
                
                {/* Main Logo Container */}
                <div className="relative p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl shadow-2xl mx-auto w-fit transform hover:scale-110 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>
                  <ShieldAlert className="h-10 w-10 text-white animate-pulse relative z-10" />
                  
                  {/* Orbiting Elements */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-white/30 rounded-full animate-spin" style={{animationDuration: '3s'}}></div>
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white/40 rounded-full animate-spin" style={{animationDuration: '2s', animationDirection: 'reverse'}}></div>
                </div>
                
                {/* Welcome Badge */}
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-full border border-purple-200/50 dark:border-purple-700/50">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-purple-700 dark:text-purple-300">New Member</span>
                  </div>
                </div>
              </div>
            </div>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
              Join the AlertFront Community
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300 text-sm">
              Help make your community safer together 🎆
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            {step === 'details' && (
              <form onSubmit={handleDetailsSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-medium text-sm flex items-center gap-2">
                    <Mail className="h-4 w-4 text-purple-600" />
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
                      className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:border-purple-500 focus:ring-purple-500/20 rounded-lg transition-all duration-300 pr-10"
                    />
                    {email && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-all duration-300">
                        <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">🦝</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700 dark:text-slate-300 font-medium text-sm flex items-center gap-2">
                    <Lock className="h-4 w-4 text-pink-600" />
                    Password
                  </Label>
                  <div className="relative">
                    <Input 
                      id="password" 
                      type="password" 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      required 
                      className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:border-pink-500 focus:ring-pink-500/20 rounded-lg transition-all duration-300 pr-10"
                    />
                    {password && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-all duration-500">
                        <div className="w-6 h-6 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center animate-bounce">
                          <span className="text-white text-xs">👀</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-700 dark:text-slate-300 font-medium text-sm flex items-center gap-2">
                    <Phone className="h-4 w-4 text-blue-600" />
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="+911234567890" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                      required 
                      className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg transition-all duration-300 pr-10"
                    />
                    {phone && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-all duration-300">
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center animate-pulse">
                          <span className="text-white text-xs">📱</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 rounded-lg py-2.5 border-0" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Phone className="mr-2 h-4 w-4" />
                  )}
                  {isLoading ? 'Sending OTP...' : 'Send OTP'}
                </Button>
              </form>
            )}

            {step === 'otp' && (
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-slate-700 dark:text-slate-300 font-medium text-sm flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-green-600" />
                    One-Time Password
                  </Label>
                  <div className="relative">
                    <Input 
                      id="otp" 
                      type="text" 
                      placeholder="123456" 
                      value={otp} 
                      onChange={e => setOtp(e.target.value)} 
                      required 
                      className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:border-green-500 focus:ring-green-500/20 rounded-lg transition-all duration-300 pr-10 text-center text-lg font-mono tracking-wider"
                    />
                    {otp && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-all duration-500">
                        <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center animate-spin">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 rounded-lg py-2.5 border-0" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <UserPlus className="mr-2 h-4 w-4" />
                  )}
                  {isLoading ? 'Creating Account...' : 'Verify & Create Account'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-300" 
                  onClick={() => setStep('details')}
                  type="button"
                >
                  ← Back to details
                </Button>
              </form>
            )}

            <div className="mt-4 text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Already have an account?{' '}
                <Link 
                  href="/login" 
                  className="font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors duration-300"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
