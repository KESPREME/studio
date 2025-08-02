// src/app/signup/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldAlert, Loader2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { PeekingRaccoon } from '@/components/peeking-raccoon';

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

  const [showPassword, setShowPassword] = useState(false);
  const [isPeeking, setIsPeeking] = useState(false);
  const [isHiding, setIsHiding] = useState(false);
  
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

  const handleFocus = (field: 'email' | 'password' | 'phone' | 'otp') => {
    if (field === 'password' || field === 'otp') {
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
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40 p-4" style={{ perspective: '1000px' }}>
      <div className="relative w-full max-w-sm">
        <PeekingRaccoon isPeeking={isPeeking} isHiding={isHiding} />
        <Card 
          className="w-full max-w-sm mx-auto shadow-2xl transition-transform duration-500"
          style={{ transform: isPeeking ? 'rotateY(-10deg) rotateX(3deg)' : 'rotateY(0) rotateX(0)'}}
        >
          <CardHeader className="text-center">
            <ShieldAlert className="mx-auto h-12 w-12 text-primary" />
            <CardTitle className="text-2xl font-bold font-headline mt-4">Create your AlertFront Account</CardTitle>
            <CardDescription>
              {step === 'details' ? 'Enter your details to get started' : 'Enter the OTP sent to your phone'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 'details' && (
              <form onSubmit={handleDetailsSubmit} className="space-y-4">
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
                 <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="+911234567890" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)}
                    onFocus={() => handleFocus('phone')}
                    onBlur={handleBlur}
                    required 
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 animate-spin" />}
                  Send OTP
                </Button>
              </form>
            )}

            {step === 'otp' && (
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">One-Time Password</Label>
                  <Input 
                    id="otp" 
                    type="text" 
                    placeholder="123456" 
                    value={otp} 
                    onChange={e => setOtp(e.target.value)}
                    onFocus={() => handleFocus('otp')}
                    onBlur={handleBlur}
                    required 
                  />
                </div>
                 <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 animate-spin" />}
                  Verify & Create Account
                </Button>
                <Button variant="link" size="sm" className="w-full" onClick={() => setStep('details')}>
                  Back to details
                </Button>
              </form>
            )}

             <div className="mt-4 text-center text-sm">
                Already have an account?{' '}
                <Link href="/login" className="underline text-primary">
                  Login
                </Link>
              </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
