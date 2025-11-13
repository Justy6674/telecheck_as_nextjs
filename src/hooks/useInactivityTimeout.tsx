'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Configurable session timeout based on "Remember Me" preference
const DEFAULT_TIMEOUT_MS = 8 * 60 * 60 * 1000; // 8 hours for normal sessions
const EXTENDED_TIMEOUT_MS = 30 * 24 * 60 * 60 * 1000; // 30 days for "Remember Me"
const WARNING_BEFORE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes before timeout

// Get session timeout based on stored preference
const getSessionTimeout = () => {
  const rememberMe = localStorage.getItem('rememberMe') === 'true';
  return rememberMe ? EXTENDED_TIMEOUT_MS : DEFAULT_TIMEOUT_MS;
};

export const useInactivityTimeout = () => {
  const router = useRouter();
  const { toast } = useToast();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const hasWarnedRef = useRef<boolean>(false);

  const handleSignOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();

      toast({
        title: "Session Expired",
        description: "You have been logged out due to inactivity.",
        variant: "destructive",
      });

      router.replace('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, [router, toast]);

  const resetTimeout = useCallback(() => {
    // Clear existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningRef.current) {
      clearTimeout(warningRef.current);
    }

    // Reset warning flag
    hasWarnedRef.current = false;

    // Update last activity
    lastActivityRef.current = Date.now();

    const sessionTimeout = getSessionTimeout();

    // Set warning timeout
    warningRef.current = setTimeout(() => {
      if (!hasWarnedRef.current) {
        hasWarnedRef.current = true;
        const warningMinutes = WARNING_BEFORE_TIMEOUT_MS / (60 * 1000);
        toast({
          title: "Session Expiring Soon",
          description: `Your session will expire in ${warningMinutes} minutes due to inactivity. Click anywhere to stay logged in.`,
          duration: 10000,
        });
      }
    }, sessionTimeout - WARNING_BEFORE_TIMEOUT_MS);

    // Set logout timeout
    timeoutRef.current = setTimeout(() => {
      handleSignOut();
    }, sessionTimeout);
  }, [toast, handleSignOut]);

  const handleActivity = useCallback(() => {
    const now = Date.now();
    const timeSinceLastActivity = now - lastActivityRef.current;

    // Only reset if more than 1 second has passed (debounce)
    if (timeSinceLastActivity > 1000) {
      resetTimeout();
    }
  }, [resetTimeout]);

  useEffect(() => {
    let isActive = false;

    // Check if user is authenticated
    const initializeTimeout = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        isActive = true;
        resetTimeout();
      }
    };

    initializeTimeout();

    // Listen for activity events
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click', 'mousemove'];

    const throttledHandleActivity = () => {
      if (isActive) {
        handleActivity();
      }
    };

    events.forEach(event => {
      document.addEventListener(event, throttledHandleActivity);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        isActive = false;
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (warningRef.current) clearTimeout(warningRef.current);
      } else if (event === 'SIGNED_IN') {
        isActive = true;
        resetTimeout();
      }
    });

    // Cleanup
    return () => {
      isActive = false;
      events.forEach(event => {
        document.removeEventListener(event, throttledHandleActivity);
      });
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
      subscription.unsubscribe();
    };
  }, [handleActivity, resetTimeout]);

  return {
    resetTimeout,
    getRemainingTime: () => {
      const elapsed = Date.now() - lastActivityRef.current;
      const sessionTimeout = getSessionTimeout();
      const remaining = sessionTimeout - elapsed;
      return Math.max(0, remaining);
    },
    isRememberMeEnabled: () => localStorage.getItem('rememberMe') === 'true',
  };
};