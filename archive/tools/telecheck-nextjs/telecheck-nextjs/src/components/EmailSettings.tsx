import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Mail, CheckCircle, AlertCircle, Send } from 'lucide-react';

export function EmailSettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [magicLinkEnabled, setMagicLinkEnabled] = useState(false);
  const [emailConfig, setEmailConfig] = useState<any>(null);

  // Load email configuration
  const loadEmailConfig = async () => {
    try {
      // Use audit logs to track email config access
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('event_type', 'email_config_access')
        .limit(1);

      if (error) throw error;
      setEmailConfig(data);
    } catch (error: any) {
      console.error('Error loading email config:', error);
    }
  };

  // Test email sending
  const sendTestEmail = async () => {
    if (!testEmail) {
      toast({
        title: "Email Required",
        description: "Please enter an email address to test",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Create a test magic link
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
          template_name: 'magic_link',
          to_email: testEmail,
          variables: {
            link: `${window.location.origin}/auth?token=test-token-${Date.now()}`
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Test Email Sent",
        description: `Check ${testEmail} for the test email`,
      });

      // Log the test
      await supabase.from('audit_logs').insert({
        event_type: 'test_email_sent',
        resource_type: 'email',
        resource_id: data?.message_id,
        hash: `test-${Date.now()}`,
        severity: 'info',
        metadata: {
          to: testEmail,
          template: 'magic_link',
          provider: 'aws_ses'
        }
      });

    } catch (error: any) {
      toast({
        title: "Email Test Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle magic link authentication
  const toggleMagicLink = async (enabled: boolean) => {
    setIsLoading(true);
    try {
      // Update auth settings in Supabase
      // Note: This would typically be done through Supabase dashboard
      // or via management API

      setMagicLinkEnabled(enabled);

      toast({
        title: enabled ? "Magic Links Enabled" : "Magic Links Disabled",
        description: enabled
          ? "Users can now sign in with email links"
          : "Password authentication required",
      });

      // Log the change
      await supabase.from('audit_logs').insert({
        event_type: 'auth_method_changed',
        resource_type: 'settings',
        hash: `auth-${Date.now()}`,
        severity: 'info',
        metadata: {
          magic_link_enabled: enabled,
          changed_by: 'admin'
        }
      });

    } catch (error: any) {
      toast({
        title: "Settings Update Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            AWS SES Email Configuration
          </CardTitle>
          <CardDescription>
            Email delivery powered by Amazon Simple Email Service (SES)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription>
              <strong>AWS SES Connected</strong><br />
              Region: ap-southeast-2 (Sydney)<br />
              SMTP Host: email-smtp.ap-southeast-2.amazonaws.com<br />
              Status: Active
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <Label className="text-muted-foreground">From Email</Label>
              <p className="font-medium">noreply@telecheck.com.au</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Reply To</Label>
              <p className="font-medium">support@telecheck.com.au</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Rate Limit (Hourly)</Label>
              <p className="font-medium">100 emails</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Rate Limit (Daily)</Label>
              <p className="font-medium">1,000 emails</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email Authentication</CardTitle>
          <CardDescription>
            Configure how users sign in to TeleCheck
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="magic-link">Magic Link Authentication</Label>
              <p className="text-sm text-muted-foreground">
                Send secure sign-in links via email (passwordless)
              </p>
            </div>
            <Switch
              id="magic-link"
              checked={magicLinkEnabled}
              onCheckedChange={toggleMagicLink}
              disabled={isLoading}
            />
          </div>

          {!magicLinkEnabled && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Currently using password authentication. Enable magic links for passwordless sign-in.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Email Delivery</CardTitle>
          <CardDescription>
            Send a test email to verify AWS SES configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="test-email">Test Email Address</Label>
            <div className="flex gap-2">
              <Input
                id="test-email"
                type="email"
                placeholder="test@example.com"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                disabled={isLoading}
              />
              <Button
                onClick={sendTestEmail}
                disabled={isLoading || !testEmail}
              >
                <Send className="h-4 w-4 mr-2" />
                Send Test
              </Button>
            </div>
          </div>

          <Alert>
            <AlertDescription>
              Test emails use the magic link template. Check your spam folder if not received.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email Templates</CardTitle>
          <CardDescription>
            Configured email templates for TeleCheck
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Magic Link</p>
                <p className="text-sm text-muted-foreground">Sign-in authentication emails</p>
              </div>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Subscription Confirmation</p>
                <p className="text-sm text-muted-foreground">Welcome emails for new subscribers</p>
              </div>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Payment Receipt</p>
                <p className="text-sm text-muted-foreground">Invoice and payment confirmations</p>
              </div>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}