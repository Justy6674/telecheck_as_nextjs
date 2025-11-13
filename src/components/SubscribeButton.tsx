import React from 'react';
import { Button } from '@/components/ui/button';

interface SubscribeButtonProps {
  className?: string;
}

/**
 * Simplified subscription button that redirects to the pricing page
 * where the full Outseta signup flow is available.
 */
export const SubscribeButton = React.forwardRef<HTMLDivElement, SubscribeButtonProps>(({ className }, ref) => {
  const handleSubscribe = () => {
    window.location.href = '/pricing';
  };

  return (
    <div ref={ref} className={className}>
      <Button
        onClick={handleSubscribe}
        size="lg"
        className="w-full"
        data-subscribe="true"
      >
        Subscribe Now - A$56.81/month
      </Button>
    </div>
  );
});

SubscribeButton.displayName = 'SubscribeButton';