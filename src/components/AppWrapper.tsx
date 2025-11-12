import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useInactivityTimeout } from '@/hooks/useInactivityTimeout';

export const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const inactivityTimeout = useInactivityTimeout();

  useEffect(() => {
    // The timeout hook manages its own lifecycle based on auth state
    // This component just ensures it's initialized when user is present
    if (user) {
      console.log('Session timeout monitoring active (30 minutes)');
    }
  }, [user]);

  return <>{children}</>;
};