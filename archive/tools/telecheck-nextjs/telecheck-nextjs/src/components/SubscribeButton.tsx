import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { OutsetaSignup } from './OutsetaSignup';

interface SubscribeButtonProps {
  className?: string;
}

/**
 * OUTSETA SUBSCRIPTION FLOW
 * 1. User clicks Subscribe button
 * 2. Shows embedded Outseta signup form
 * 3. User completes payment and account creation
 * 4. Automatically logged in via Outseta
 * 5. No complex webhook handling needed
 */
export const SubscribeButton = React.forwardRef<HTMLDivElement, SubscribeButtonProps>(({
  className
}, ref) => {
  const [showSignup, setShowSignup] = useState(false);

  if (showSignup) {
    return (
      <div ref={ref} className={className}>
        <OutsetaSignup className="w-full" />
        <Button
          onClick={() => setShowSignup(false)}
          variant="outline"
          className="w-full mt-4"
        >
          ← Back
        </Button>
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      <Button
        onClick={() => setShowSignup(true)}
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