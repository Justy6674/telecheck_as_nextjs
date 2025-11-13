import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2 } from 'lucide-react';
import { OutsetaClient } from '@/integrations/outseta/client';
import { toast } from 'sonner';

/**
 * Outseta Billing Management
 * Direct integration with Outseta for payment and subscription management
 */
export const ManageBilling = () => {
  const [loading, setLoading] = useState(false);

  const handleManageBilling = async () => {
    setLoading(true);
    try {
      // Check if user is authenticated with Outseta
      const user = await OutsetaClient.getCurrentUser();

      if (!user) {
        toast.error('Please sign in to manage your billing');
        return;
      }

      // Use Outseta's built-in payment method update
      OutsetaClient.updatePaymentMethod();

    } catch (error) {
      console.error('Error opening billing portal:', error);
      toast.error('Unable to open billing portal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleManageBilling}
      variant="outline"
      className="flex items-center gap-2"
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <CreditCard className="h-4 w-4" />
      )}
      Manage Billing
    </Button>
  );
};