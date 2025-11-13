'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, CheckCircle, AlertCircle } from "lucide-react";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

/**
 * Pure Login Dialog - ONLY for existing member authentication
 * No signup functionality, no subscription flows
 */
export const LoginDialog = ({ open, onOpenChange, onSuccess }: LoginDialogProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetStatus, setResetStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [resetMessage, setResetMessage] = useState('');
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Sign In Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You've been signed in successfully.",
        });
        onOpenChange(false);
        
        // Call onSuccess callback if provided, otherwise let Outseta handle redirect
        if (onSuccess) {
          onSuccess();
        } else {
          console.log('Login success - letting Outseta handle redirect');
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address first",
        variant: "destructive",
      });
      return;
    }

    setResetLoading(true);
    setResetStatus('idle');

    try {
      const { data, error } = await supabase.functions.invoke('send-password-reset', {
        body: { email }
      });

      if (error) throw error;

      setResetStatus('success');
      setResetMessage('Password reset email sent! Check your inbox and spam folder.');

      toast({
        title: "Reset Email Sent",
        description: "Check your email for password reset instructions",
      });
    } catch (error: any) {
      setResetStatus('error');
      setResetMessage(error.message || 'Failed to send password reset email');

      toast({
        title: "Reset Failed",
        description: error.message || 'Failed to send password reset email',
        variant: "destructive",
      });
    } finally {
      setResetLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setEmail("");
    setPassword("");
    setShowPasswordReset(false);
    setResetStatus('idle');
    setResetMessage('');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] w-[calc(100vw-2rem)] mx-auto">
        <DialogHeader>
          <DialogTitle>
            {showPasswordReset ? 'Reset Password' : 'Member Login'}
          </DialogTitle>
          <DialogDescription>
            {showPasswordReset
              ? 'Enter your email to receive a password reset link'
              : 'Sign in to your existing TeleCheck account to access your dashboard and eligibility tools.'
            }
          </DialogDescription>
        </DialogHeader>

        {!showPasswordReset ? (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                inputMode="email"
                className="min-h-[44px] text-base"
                placeholder="your.email@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="min-h-[44px] text-base"
              />
            </div>
            <Button type="submit" className="w-full min-h-[48px] text-base font-medium" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={() => setShowPasswordReset(true)}
                className="text-sm text-muted-foreground"
              >
                Forgot your password?
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email Address</Label>
              <Input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                inputMode="email"
                className="min-h-[44px] text-base"
                placeholder="your.email@example.com"
                disabled={resetLoading || resetStatus === 'success'}
              />
            </div>

            {resetStatus !== 'idle' && (
              <Alert variant={resetStatus === 'success' ? 'default' : 'destructive'}>
                {resetStatus === 'success' ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertDescription>{resetMessage}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPasswordReset(false)}
                className="flex-1"
                disabled={resetLoading}
              >
                Back to Login
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={resetLoading || resetStatus === 'success'}
              >
                {resetLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : resetStatus === 'success' ? (
                  'Email Sent!'
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            </div>

            {resetStatus === 'success' && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                <p className="font-medium mb-1">Check your email!</p>
                <p>We've sent a password reset link to {email}. Check your spam folder if you don't see it.</p>
                <p className="mt-2 text-xs">⚠️ If you subscribed via Stripe payment link, you may need to set a password for the first time.</p>
              </div>
            )}
          </form>
        )}

        <div className="text-center text-sm text-muted-foreground border-t pt-4">
          <p>Don't have an account? Subscribe to get started with TeleCheck Professional.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};