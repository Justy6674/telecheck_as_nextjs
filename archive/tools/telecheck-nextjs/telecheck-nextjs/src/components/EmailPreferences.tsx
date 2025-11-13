import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Mail, Bell, Shield, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EmailPrefs {
  marketing: boolean;
  product_updates: boolean;
  billing_alerts: boolean;
  security_alerts: boolean;
  system_maintenance: boolean;
  weekly_digest: boolean;
  tips_and_tricks: boolean;
  disaster_updates: boolean;
  compliance_reminders: boolean;
}

export const EmailPreferences: React.FC = () => {
  const [preferences, setPreferences] = useState<EmailPrefs>({
    marketing: false,
    product_updates: true,
    billing_alerts: true,
    security_alerts: true,
    system_maintenance: true,
    weekly_digest: false,
    tips_and_tricks: false,
    disaster_updates: true,
    compliance_reminders: true
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const loadPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('notification_prefs')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      if (data?.notification_prefs && typeof data.notification_prefs === 'object') {
        setPreferences({
          ...preferences,
          ...(data.notification_prefs as Partial<EmailPrefs>)
        });
      }
    } catch (error) {
      console.error('Error loading email preferences:', error);
    }
  };

  const savePreferences = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ notification_prefs: preferences as any })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'Preferences Saved',
        description: 'Your email preferences have been updated.',
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to save email preferences.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePreference = (key: keyof EmailPrefs) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getPreferenceIcon = (type: string) => {
    switch (type) {
      case 'security': return <Shield className="h-4 w-4" />;
      case 'billing': return <Zap className="h-4 w-4" />;
      case 'system': return <Bell className="h-4 w-4" />;
      default: return <Mail className="h-4 w-4" />;
    }
  };

  useEffect(() => {
    loadPreferences();
  }, [user]);

  const emailCategories = [
    {
      title: 'Essential Communications',
      description: 'Critical updates you should receive',
      items: [
        {
          key: 'security_alerts' as keyof EmailPrefs,
          label: 'Security Alerts',
          description: 'Login attempts, password changes, suspicious activity',
          icon: 'security',
          required: true
        },
        {
          key: 'billing_alerts' as keyof EmailPrefs,
          label: 'Billing Alerts',
          description: 'Payment confirmations, invoice notices, billing issues',
          icon: 'billing',
          required: true
        },
        {
          key: 'system_maintenance' as keyof EmailPrefs,
          label: 'System Maintenance',
          description: 'Scheduled downtime, service interruptions',
          icon: 'system',
          required: false
        }
      ]
    },
    {
      title: 'Product & Updates',
      description: 'Stay informed about new features and improvements',
      items: [
        {
          key: 'product_updates' as keyof EmailPrefs,
          label: 'Product Updates',
          description: 'New features, improvements, bug fixes',
          icon: 'product',
          required: false
        },
        {
          key: 'disaster_updates' as keyof EmailPrefs,
          label: 'Disaster Database Updates',
          description: 'New disaster declarations, eligibility changes',
          icon: 'disaster',
          required: false
        },
        {
          key: 'compliance_reminders' as keyof EmailPrefs,
          label: 'Compliance Reminders',
          description: 'Medicare updates, regulatory changes, audit reminders',
          icon: 'compliance',
          required: false
        }
      ]
    },
    {
      title: 'Optional Communications',
      description: 'Marketing and educational content',
      items: [
        {
          key: 'marketing' as keyof EmailPrefs,
          label: 'Marketing & Promotions',
          description: 'Special offers, new services, partner promotions',
          icon: 'marketing',
          required: false
        },
        {
          key: 'weekly_digest' as keyof EmailPrefs,
          label: 'Weekly Digest',
          description: 'Summary of your usage, tips, industry news',
          icon: 'digest',
          required: false
        },
        {
          key: 'tips_and_tricks' as keyof EmailPrefs,
          label: 'Tips & Tricks',
          description: 'How-to guides, best practices, efficiency tips',
          icon: 'tips',
          required: false
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {emailCategories.map((category, categoryIndex) => (
        <Card key={categoryIndex} className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              {getPreferenceIcon(category.title.toLowerCase())}
              {category.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{category.description}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {category.items.map((item) => (
              <div key={item.key} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Label htmlFor={item.key} className="font-medium">
                      {item.label}
                    </Label>
                    {item.required && (
                      <Badge variant="secondary" className="text-xs">Required</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <Switch
                  id={item.key}
                  checked={preferences[item.key]}
                  onCheckedChange={() => togglePreference(item.key)}
                  disabled={item.required}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {/* Save Button */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <Button onClick={savePreferences} disabled={loading} className="w-full">
            Save Email Preferences
          </Button>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Changes take effect immediately. You can unsubscribe from any email using the link at the bottom.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};