// src/app/login/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, LogIn, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuth();
  
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [isLoading, setIsLoading] = useState(false);

  const [role, setRole] = useState<'reporter' | 'admin'>('reporter');
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
      const response = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code: otp }),
      });
      
      const result = await response.json();

       if (!response.ok) {
        throw new Error(result.message || 'Failed to verify OTP.');
      }
      
      // OTP is valid, proceed with login
      const user = {
        name: role === 'admin' ? 'NDRF Responder' : 'Community Member',
        email: email || (role === 'admin' ? 'responder@ndrf.gov.in' : 'citizen@example.com'),
        role: role,
        phone: phone,
      };
      
      login(user);

      toast({
        title: 'Login Successful',
        description: `Welcome, ${user.name}!`,
      });
      
      router.push(role === 'admin' ? '/admin' : '/dashboard');

    } catch (error: any) {
       toast({
        title: 'OTP Verification Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <Card className="w-full max-w-sm mx-auto shadow-2xl">
        <CardHeader className="text-center">
          <ShieldAlert className="mx-auto h-12 w-12 text-primary" />
          <CardTitle className="text-2xl font-bold font-headline mt-4">Welcome to AlertFront</CardTitle>
          <CardDescription>
            {step === 'details' ? 'Sign in or create an account' : 'Enter the OTP sent to your phone'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'details' && (
            <form onSubmit={handleDetailsSubmit} className="space-y-4">
               <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="user@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
               <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="+1234567890" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Select your role</Label>
                <RadioGroup value={role} onValueChange={(value) => setRole(value as 'reporter' | 'admin')}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="reporter" id="reporter" />
                    <Label htmlFor="reporter">Community Member</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="admin" id="admin" />
                    <Label htmlFor="admin">NDRF Responder</Label>
                  </div>
                </RadioGroup>
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
                <Input id="otp" type="text" placeholder="123456" value={otp} onChange={e => setOtp(e.target.value)} required />
              </div>
               <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 animate-spin" />}
                Verify & Login
              </Button>
              <Button variant="link" size="sm" className="w-full" onClick={() => setStep('details')}>
                Back to details
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}