import React from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

interface SupportButtonProps {
  variant?: React.ComponentProps<typeof Button>['variant'];
  size?: 'sm' | 'default' | 'lg';
  showIcon?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export const SupportButton: React.FC<SupportButtonProps> = ({
  variant = 'outline',
  size = 'default',
  showIcon = true,
  children = 'Get Help',
  className = ''
}) => {
  const openSupportTicket = () => {
    // @ts-ignore - Outseta global object
    if (window.Outseta && window.Outseta.support) {
      // @ts-ignore
      window.Outseta.support.open();
    } else {
      console.warn('Outseta support widget not loaded yet');
      // Fallback to contact page
      window.location.href = '/contact';
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={openSupportTicket}
      className={`inline-flex items-center gap-2 ${className}`}
    >
      {showIcon && <HelpCircle className="h-4 w-4" />}
      {children}
    </Button>
  );
};

// Floating Help Button Component
export const FloatingHelpButton: React.FC = () => {
  const openSupportTicket = () => {
    // @ts-ignore - Outseta global object
    if (window.Outseta && window.Outseta.support) {
      // @ts-ignore
      window.Outseta.support.open();
    }
  };

  return (
    <button
      onClick={openSupportTicket}
      className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
      aria-label="Get Help"
    >
      <HelpCircle className="h-6 w-6" />
    </button>
  );
};

export default SupportButton;