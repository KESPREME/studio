// src/components/with-auth.tsx
"use client";

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, ComponentType } from 'react';
import { Loader2 } from 'lucide-react';

interface WithAuthOptions {
  roles?: ('reporter' | 'admin')[];
}

export default function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const AuthComponent = (props: P) => {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading) {
        if (!user) {
          router.replace('/login');
        } else if (options.roles && !options.roles.includes(user.role)) {
          // If user role is not allowed, redirect to a relevant page
          router.replace(user.role === 'admin' ? '/admin' : '/report/new');
        }
      }
    }, [user, isLoading, router]);

    if (isLoading || !user || (options.roles && !options.roles.includes(user.role))) {
      return (
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
  
  AuthComponent.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return AuthComponent;
}
