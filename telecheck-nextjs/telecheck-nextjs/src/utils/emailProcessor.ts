import { sendEmail } from '@/utils/emailService';

// Helper to process pending emails from frontend
export const processPendingEmails = async () => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    const { data, error } = await supabase.functions.invoke('process-emails');
    
    if (error) {
      console.error('Error processing emails:', error);
      return { success: false, error: error.message };
    }
    
    console.log('Email processing result:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error processing emails:', error);
    return { success: false, error: error.message };
  }
};

// Auto-process emails on app startup
if (typeof window !== 'undefined') {
  // Only run in browser
  setTimeout(() => {
    processPendingEmails();
  }, 2000); // Process after 2 seconds
}