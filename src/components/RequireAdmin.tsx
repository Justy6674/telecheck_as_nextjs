'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface RequireAdminProps {
  children: ReactNode;
}

export const RequireAdmin = ({ children }: RequireAdminProps) => {
  const { user, loading: authLoading } = useAuth();
  const [isVerifiedAdmin, setIsVerifiedAdmin] = useState<boolean | null>(null);
  const [verifying, setVerifying] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const verifyAdminAccess = async () => {
      if (!user) {
        setIsVerifiedAdmin(false);
        setVerifying(false);
        return;
      }

      try {
        // Server-side admin verification
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .single();

        if (error) {
          console.error('Admin verification error:', error);

          // Check if it's a rate limit error
          if (error.message?.includes('Rate limit')) {
            toast.error('Too many admin verification attempts. Please wait a minute.');
          } else {
            toast.error('Failed to verify admin access');
          }

          setIsVerifiedAdmin(false);
        } else {
          setIsVerifiedAdmin(data?.role === 'admin');

          // Log unauthorized access attempts
          if (data?.role !== 'admin') {
            console.warn('Unauthorized admin access attempt:', {
              userId: user.id,
              timestamp: new Date().toISOString()
            });
          }
        }
      } catch (err) {
        console.error('Admin verification failed:', err);
        setIsVerifiedAdmin(false);
      } finally {
        setVerifying(false);
      }
    };

    if (!authLoading) {
      verifyAdminAccess();
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (!authLoading && !verifying && (!user || !isVerifiedAdmin)) {
      router.replace('/');
    }
  }, [authLoading, verifying, user, isVerifiedAdmin, router]);

  // Show loading state while checking authentication
  if (authLoading || verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800">
        <div className="text-white">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            <div>Verifying admin access...</div>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to home if not authenticated or not admin
  if (!user || !isVerifiedAdmin) {
    return null;
  }

  // User is authenticated and verified as admin server-side
  return <>{children}</>;
};