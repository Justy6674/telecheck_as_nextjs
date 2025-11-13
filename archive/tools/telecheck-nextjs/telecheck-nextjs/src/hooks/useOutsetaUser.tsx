import { useState, useEffect } from 'react';
import { getOutsetaUser, isAdmin as checkIsAdmin, waitForOutseta, type OutsetaUser } from '@/utils/outsetaAuth';

export const useOutsetaUser = () => {
  const [user, setUser] = useState<OutsetaUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    setIsLoading(true);

    // Wait for Outseta to load
    await waitForOutseta();

    // Get the current user
    const currentUser = getOutsetaUser();
    setUser(currentUser);
    setIsLoading(false);
  };

  useEffect(() => {
    checkAuth();

    // Listen for Outseta authentication events
    const handleAuth = () => {
      console.log('Outseta authentication event detected');
      setTimeout(() => {
        const currentUser = getOutsetaUser();
        setUser(currentUser);
      }, 1000);
    };

    const handleLogout = () => {
      console.log('Outseta logout event detected');
      setUser(null);
    };

    // Listen for Outseta's built-in events
    window.addEventListener('outseta:authenticated', handleAuth);
    window.addEventListener('outseta:logout', handleLogout);

    return () => {
      window.removeEventListener('outseta:authenticated', handleAuth);
      window.removeEventListener('outseta:logout', handleLogout);
    };
  }, []);

  const isAdmin = checkIsAdmin(user?.Email);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin,
    hasActiveSubscription: !!user, // For now, allow all authenticated users
  };
};