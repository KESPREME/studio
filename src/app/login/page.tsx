// src/app/login/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, User, LogIn } from 'lucide-react';
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
  const [role, setRole] = useState<'reporter' | 'admin'>('reporter');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // In a real app, you'd validate credentials here.
    // For this demo, we'll just log in with the selected role.
    const user = {
      name: role === 'admin' ? 'NDRF Responder' : 'Community Member',
      email: role === 'admin' ? 'responder@ndrf.gov.in' : 'citizen@example.com',
      role: role,
    };
    
    login(user);

    toast({
      title: 'Login Successful',
      description: `Welcome, ${user.name}!`,
    });
    
    // Redirect based on role
    if (role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/report/new');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <Card className="w-full max-w-sm mx-auto shadow-2xl">
        <CardHeader className="text-center">
          <ShieldAlert className="mx-auto h-12 w-12 text-primary" />
          <CardTitle className="text-2xl font-bold font-headline mt-4">Welcome to AlertFront</CardTitle>
          <CardDescription>Sign in to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="user@example.com" defaultValue={role === 'admin' ? 'responder@ndrf.gov.in' : 'citizen@example.com'} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" defaultValue="password" required />
            </div>
            <div className="space-y-2">
              <Label>Select your role</Label>
              <RadioGroup defaultValue="reporter" onValueChange={(value) => setRole(value as 'reporter' | 'admin')}>
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
            <Button type="submit" className="w-full">
              <LogIn className="mr-2" />
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}