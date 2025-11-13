import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CsrfToken {
  token: string;
  expiresAt: number;
}

export const useCsrfToken = () => {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  useEffect(() => {
    generateCsrfToken();
  }, []);

  const generateCsrfToken = async () => {
    try {
      // Generate a secure random token
      const array = new Uint8Array(32);
      crypto.getRandomValues(array);
      const token = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');

      // Store in session storage with expiration
      const tokenData: CsrfToken = {
        token,
        expiresAt: Date.now() + (60 * 60 * 1000) // 1 hour
      };

      sessionStorage.setItem('csrf_token', JSON.stringify(tokenData));
      setCsrfToken(token);

      // Also store server-side for validation
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('csrf_tokens')
          .upsert({
            user_id: user.id,
            token,
            expires_at: new Date(tokenData.expiresAt).toISOString()
          });
      }
    } catch (error) {
      console.error('Failed to generate CSRF token:', error);
    }
  };

  const validateCsrfToken = (token: string): boolean => {
    const stored = sessionStorage.getItem('csrf_token');
    if (!stored) return false;

    const tokenData: CsrfToken = JSON.parse(stored);
    return tokenData.token === token && tokenData.expiresAt > Date.now();
  };

  const getCsrfHeaders = () => ({
    'X-CSRF-Token': csrfToken || ''
  });

  return {
    csrfToken,
    validateCsrfToken,
    getCsrfHeaders,
    regenerateToken: generateCsrfToken
  };
};