import { useEffect } from 'react';
import { useAuth } from './useAuth';
import { sendWelcomeEmail } from '@/utils/emailService';
import { useToast } from './use-toast';

export const useWelcomeEmail = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const sendWelcomeIfNeeded = async () => {
      if (user && user.email) {
        // Check if this is a new subscription - check localStorage to avoid duplicate sends
        const urlParams = new URLSearchParams(window.location.search);
        const hasSessionId = urlParams.has('session_id');
        const hasOnboarding = urlParams.has('onboarding');
        const welcomeEmailSent = localStorage.getItem(`welcome_email_sent_${user.id}`);
        
        const isNewSubscription = (hasSessionId || hasOnboarding) && !welcomeEmailSent;
        
        if (isNewSubscription) {
          try {
            console.log('🎉 Sending welcome email to:', user.email);
            const result = await sendWelcomeEmail(
              user.email, 
              user.id, 
              user.user_metadata?.full_name || 'Valued Customer'
            );
            
            if (result.success) {
              console.log('✅ Welcome email sent successfully');
              // Mark as sent to prevent duplicates
              localStorage.setItem(`welcome_email_sent_${user.id}`, 'true');
            } else {
              console.error('❌ Welcome email failed:', result.error);
            }
          } catch (error) {
            console.error('❌ Welcome email error:', error);
          }
        }
      }
    };

    // Add slight delay to ensure user is fully loaded
    const timeoutId = setTimeout(sendWelcomeIfNeeded, 1000);
    return () => clearTimeout(timeoutId);
  }, [user, toast]);

  return null; // This is just a utility hook
};