import { supabase } from '@/integrations/supabase/client';

interface SendEmailProps {
  template_name: string;
  to_email: string;
  user_id?: string;
  variables?: Record<string, any>;
}

export const sendEmail = async ({ template_name, to_email, user_id, variables }: SendEmailProps) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        template_name,
        to_email,
        user_id,
        variables: variables || {}
      }
    });

    if (error) {
      console.error('Error sending email via Resend:', error);
      return { success: false, error: error.message };
    }

    console.log('Email sent successfully via Resend:', data);
    return { success: true, data };
  } catch (error: any) {
    console.error('Error invoking send-email function:', error);
    return { success: false, error: error.message };
  }
};

// Helper function to send welcome email after signup
export const sendWelcomeEmail = async (email: string, userId: string, name?: string) => {
  // Extract first name from full name if available
  const firstName = name ? name.split(' ')[0] : 'Valued Customer';
  
  return sendEmail({
    template_name: 'welcome_email',
    to_email: email,
    user_id: userId,
    variables: {
      user_name: firstName,
      app_name: 'TeleCheck',
      login_url: `${window.location.origin}/members`
    }
  });
};

// Helper function to send password reset email
export const sendPasswordResetEmail = async (email: string) => {
  return sendEmail({
    template_name: 'password_reset',
    to_email: email,
    variables: {
      app_name: 'TeleCheck',
      reset_url: `${window.location.origin}/auth?mode=reset`
    }
  });
};