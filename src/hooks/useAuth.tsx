'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';

// Pure no-code Outseta authentication context
interface AuthContextType {
  user: any | null;
  session: any | null;
  isAdmin: boolean;
  loading: boolean;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isAdmin: false,
  loading: true,
  isLoading: true,
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        if (!window.Outseta || !window.Outseta.getJwtPayload) {
          console.log('❌ Outseta not loaded or getJwtPayload not available');
          if (mounted) {
            setUser(null);
            setSession(null);
            setIsAdmin(false);
            setLoading(false);
          }
          return;
        }

        // FIXED: getJwtPayload() returns a Promise according to Outseta docs
        const jwtPayload = await window.Outseta.getJwtPayload();

        if (jwtPayload && jwtPayload.email) {
          console.log('✅ User authenticated via Outseta JWT:', jwtPayload.email);

          // Create user object from JWT payload
          const outsetaUser = {
            email: jwtPayload.email,
            name: jwtPayload.name || `${jwtPayload.given_name || ''} ${jwtPayload.family_name || ''}`.trim(),
            firstName: jwtPayload.given_name,
            lastName: jwtPayload.family_name,
            outseta_uid: jwtPayload.sub,
            account_uid: jwtPayload['outseta:accountUid'],
            isPrimary: jwtPayload['outseta:isPrimary'] === 'true'
          };

          if (mounted) {
            setUser(outsetaUser);
            setSession({ user: outsetaUser }); // Create compatible session object

            // Check admin status
            const adminEmails = ['downscale@icloud.com'];
            setIsAdmin(adminEmails.includes(jwtPayload.email?.toLowerCase()) || false);
          }
        } else {
          console.log('❌ User not authenticated');
          if (mounted) {
            setUser(null);
            setSession(null);
            setIsAdmin(false);
          }
        }

        if (mounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        if (mounted) {
          setUser(null);
          setSession(null);
          setIsAdmin(false);
          setLoading(false);
        }
      }
    };

    // Much simpler initialization - just check immediately and set a short timeout
    console.log('🔄 useAuth: Starting auth check...');

    // ENHANCED DEBUG: Set loading to false immediately if Outseta not ready
    if (!window.Outseta) {
      console.log('⚠️ Outseta not available on init, setting loading to false immediately');
      setLoading(false);
      return () => {
        mounted = false;
      };
    }

    // Immediate check
    setTimeout(() => {
      if (mounted) {
        console.log('🔄 useAuth: Running checkAuth after 100ms delay');
        checkAuth();
      }
    }, 100);

    // Fallback timeout to ensure we never hang
    const fallbackTimeout = setTimeout(() => {
      if (mounted) {
        console.warn('🚨 useAuth: Fallback timeout reached, forcing loading to false');
        setUser(null);
        setSession(null);
        setIsAdmin(false);
        setLoading(false);
      }
    }, 2000); // Just 2 seconds max

    // Listen for Outseta authentication events
    const handleAuth = () => {
      console.log('🔔 Outseta authentication event detected');
      setTimeout(checkAuth, 100); // Small delay to ensure JWT is ready
    };

    const handleLogout = () => {
      console.log('🔔 Outseta logout event detected');
      setSession(null);
      setUser(null);
      setIsAdmin(false);
    };

    window.addEventListener('outseta:authenticated', handleAuth);
    window.addEventListener('outseta:logout', handleLogout);

    return () => {
      mounted = false;
      clearTimeout(fallbackTimeout);
      window.removeEventListener('outseta:authenticated', handleAuth);
      window.removeEventListener('outseta:logout', handleLogout);
    };
  }, []);

  const signOut = async () => {
    try {
      // Use Outseta's logout functionality
      if (window.Outseta && window.Outseta.auth) {
        window.Outseta.auth.logout();
      }
      setSession(null);
      setUser(null);
      setIsAdmin(false);
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isAdmin,
      loading,
      isLoading: loading,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};