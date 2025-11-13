// Pure no-code Outseta authentication utility
// This replaces the complex useOutsetaAuth hook with direct Outseta API calls

declare global {
  interface Window {
    Outseta: any;
  }
}

export interface OutsetaUser {
  PersonUid: string;
  Email: string;
  Name?: string;
  AccountUid?: string;
  isPrimary?: boolean;
}

// Get current authenticated user from Outseta
export const getOutsetaUser = (): OutsetaUser | null => {
  try {
    if (typeof window === 'undefined') {
      return null;
    }

    if (!window.Outseta) {
      return null;
    }

    const jwtPayload = window.Outseta.getJwtPayload();

    if (jwtPayload && jwtPayload.email) {
      return {
        PersonUid: jwtPayload.sub || '',
        Email: jwtPayload.email,
        Name: jwtPayload.name || `${jwtPayload.given_name || ''} ${jwtPayload.family_name || ''}`.trim(),
        AccountUid: jwtPayload['outseta:accountUid'] || '',
        isPrimary: jwtPayload['outseta:isPrimary'] === 'true'
      };
    }

    return null;
  } catch (error) {
    console.log('No authenticated user found:', error);
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  return getOutsetaUser() !== null;
};

// Check if user is admin
export const isAdmin = (userEmail?: string): boolean => {
  const email = userEmail || getOutsetaUser()?.Email;
  if (!email) return false;

  const adminEmails = ['downscale@icloud.com'];
  return adminEmails.includes(email.toLowerCase());
};

// Login using Outseta's no-code approach
export const login = () => {
  if (typeof window !== 'undefined' && window.Outseta && window.Outseta.auth) {
    window.Outseta.auth.open({
      widgetMode: 'login'
    });
  }
};

// Logout using Outseta's no-code approach
export const logout = () => {
  if (typeof window !== 'undefined' && window.Outseta && window.Outseta.auth) {
    window.Outseta.auth.logout();
  }
};

// Wait for Outseta to load
export const waitForOutseta = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    let attempts = 0;
    const maxAttempts = 50;

    const checkOutseta = () => {
      if (window.Outseta) {
        resolve(true);
        return;
      }

      attempts++;
      if (attempts >= maxAttempts) {
        console.warn('Outseta failed to load');
        resolve(false);
        return;
      }

      setTimeout(checkOutseta, 100);
    };

    checkOutseta();
  });
};