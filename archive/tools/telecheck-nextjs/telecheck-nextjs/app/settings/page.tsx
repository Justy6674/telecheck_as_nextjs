"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOutsetaUser } from '@/hooks/useOutsetaUser';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Palette,
  Bell,
  Lock,
  Download,
  Trash2,
  ExternalLink,
  Loader2,
  User,
  CreditCard
} from 'lucide-react';

import { ManageBilling } from '@/components/ManageBilling';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AppPreferences {
  timezone: string;
  reduced_motion: boolean;
  notification_prefs: {
    marketing: boolean;
    product_updates: boolean;
    billing_alerts: boolean;
    tips: boolean;
  };
  custom_proforma_prefs: {
    show_disaster_status: boolean;
    show_disaster_list: boolean;
    show_medicare_status: boolean;
    show_extended_telehealth: boolean;
    show_disaster_exemption: boolean;
    show_location_restrictions: boolean;
    show_clinical_decision: boolean;
    show_consultation_appropriate: boolean;
    show_patient_consents: boolean;
    show_technology_check: boolean;
  };
}

export default function Settings() {
  const navigate = useNavigate();
  const { user, isLoading } = useOutsetaUser();
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState<AppPreferences>({
    timezone: 'Australia/Sydney',
    reduced_motion: false,
    notification_prefs: {
      marketing: false,
      product_updates: true,
      billing_alerts: true,
      tips: false
    },
    custom_proforma_prefs: {
      show_disaster_status: true,
      show_disaster_list: true,
      show_medicare_status: true,
      show_extended_telehealth: true,
      show_disaster_exemption: true,
      show_location_restrictions: true,
      show_clinical_decision: true,
      show_consultation_appropriate: true,
      show_patient_consents: true,
      show_technology_check: true
    }
  });

  // Auto-detect timezone
  const getDetectedTimezone = () => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return 'Australia/Sydney';
    }
  };

  useEffect(() => {
    loadAppPreferences();
  }, [user]);

  const loadAppPreferences = async () => {
    if (!user?.Email) return;

    try {
      // Load from profiles table metadata
      const { data } = await supabase
        .from('profiles')
        .select('metadata')
        .eq('email', user.Email)
        .maybeSingle();

      if (data?.metadata?.app_preferences) {
        setPreferences(data.metadata.app_preferences);
      } else {
        // Set detected timezone as default
        setPreferences(prev => ({
          ...prev,
          timezone: getDetectedTimezone()
        }));
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const savePreferences = async () => {
    if (!user?.Email) return;

    setLoading(true);
    try {
      // Save to profiles table metadata
      const { error } = await supabase
        .from('profiles')
        .upsert({
          email: user.Email,
          metadata: { app_preferences: preferences },
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      toast.success('Preferences saved successfully');
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  const downloadData = async () => {
    if (!user?.Email) return;

    setLoading(true);
    try {
      // Export user's saved searches and reports
      const { data: searchData } = await supabase
        .from('saved_searches_outseta')
        .select('*')
        .eq('user_email', user.Email);

      const { data: reportsData } = await supabase
        .from('user_reports_outseta')
        .select('*')
        .eq('user_email', user.Email);

      const exportData = {
        user_email: user.Email,
        saved_searches: searchData,
        reports: reportsData,
        preferences: preferences,
        exported_at: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `telecheck-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Data downloaded successfully');
    } catch (error) {
      console.error('Error downloading data:', error);
      toast.error('Failed to download data');
    } finally {
      setLoading(false);
    }
  };

  const deleteData = async () => {
    if (!user?.Email) return;

    if (!confirm('Delete all your saved searches and reports? This cannot be undone.')) return;

    setLoading(true);
    try {
      // Delete user's app data
      await supabase.from('saved_searches_outseta').delete().eq('user_email', user.Email);
      await supabase.from('user_reports_outseta').delete().eq('user_email', user.Email);

      toast.success('All app data deleted successfully');
    } catch (error) {
      console.error('Error deleting data:', error);
      toast.error('Failed to delete data');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/members')}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-xl font-bold text-white">Settings</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Alert className="mb-6 bg-blue-900/20 border-blue-700">
          <User className="h-4 w-4" />
          <AlertDescription className="text-blue-200">
            Your profile, billing, and account settings are managed by Outseta.
            Use the "My Account" option in the dashboard for profile changes.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="display" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 h-auto p-1 bg-slate-800/50">
            <TabsTrigger value="display" className="data-[state=active]:bg-slate-700">
              <Palette className="h-4 w-4 mr-2" />
              Display
            </TabsTrigger>
            <TabsTrigger value="billing" className="data-[state=active]:bg-slate-700">
              <CreditCard className="h-4 w-4 mr-2" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-slate-700">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy" className="data-[state=active]:bg-slate-700">
              <Lock className="h-4 w-4 mr-2" />
              Privacy
            </TabsTrigger>
          </TabsList>

          {/* Display Tab */}
          <TabsContent value="display" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">App Preferences</CardTitle>
                <CardDescription className="text-slate-400">
                  Customise how TeleCheck works for you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-200">Timezone</Label>
                  <Select
                    value={preferences.timezone}
                    onValueChange={(value) => setPreferences(prev => ({ ...prev, timezone: value }))}
                  >
                    <SelectTrigger className="bg-slate-700/50 text-white border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 text-white border-slate-600">
                      <SelectItem value="Australia/Sydney">Sydney</SelectItem>
                      <SelectItem value="Australia/Melbourne">Melbourne</SelectItem>
                      <SelectItem value="Australia/Brisbane">Brisbane</SelectItem>
                      <SelectItem value="Australia/Perth">Perth</SelectItem>
                      <SelectItem value="Australia/Adelaide">Adelaide</SelectItem>
                      <SelectItem value="Australia/Darwin">Darwin</SelectItem>
                      <SelectItem value="Australia/Hobart">Hobart</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-slate-200">Reduced Motion</Label>
                    <p className="text-sm text-slate-400">Minimise animations and transitions</p>
                  </div>
                  <Switch
                    checked={preferences.reduced_motion}
                    onCheckedChange={(checked) =>
                      setPreferences(prev => ({ ...prev, reduced_motion: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Custom Proforma Preferences</CardTitle>
                <CardDescription className="text-slate-400">
                  Configure which lines appear in your custom telehealth proforma
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-slate-200">Disaster Status Line</Label>
                      <p className="text-sm text-slate-400">Show "DISASTER STATUS: X active disaster(s) declared"</p>
                    </div>
                    <Switch
                      checked={preferences.custom_proforma_prefs.show_disaster_status}
                      onCheckedChange={(checked) =>
                        setPreferences(prev => ({
                          ...prev,
                          custom_proforma_prefs: { ...prev.custom_proforma_prefs, show_disaster_status: checked }
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-slate-200">Individual Disaster Details</Label>
                      <p className="text-sm text-slate-400">Show list of specific disasters (* AGRN lines)</p>
                    </div>
                    <Switch
                      checked={preferences.custom_proforma_prefs.show_disaster_list}
                      onCheckedChange={(checked) =>
                        setPreferences(prev => ({
                          ...prev,
                          custom_proforma_prefs: { ...prev.custom_proforma_prefs, show_disaster_list: checked }
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-slate-200">Medicare Status Header</Label>
                      <p className="text-sm text-slate-400">Show "MEDICARE TELEHEALTH STATUS: ELIGIBLE"</p>
                    </div>
                    <Switch
                      checked={preferences.custom_proforma_prefs.show_medicare_status}
                      onCheckedChange={(checked) =>
                        setPreferences(prev => ({
                          ...prev,
                          custom_proforma_prefs: { ...prev.custom_proforma_prefs, show_medicare_status: checked }
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-slate-200">Extended Telehealth Services</Label>
                      <p className="text-sm text-slate-400">Show "☑ Extended telehealth services apply under disaster exemption"</p>
                    </div>
                    <Switch
                      checked={preferences.custom_proforma_prefs.show_extended_telehealth}
                      onCheckedChange={(checked) =>
                        setPreferences(prev => ({
                          ...prev,
                          custom_proforma_prefs: { ...prev.custom_proforma_prefs, show_extended_telehealth: checked }
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-slate-200">Disaster Exemption Permits</Label>
                      <p className="text-sm text-slate-400">Show "☑ Disaster exemption permits telehealth consultation"</p>
                    </div>
                    <Switch
                      checked={preferences.custom_proforma_prefs.show_disaster_exemption}
                      onCheckedChange={(checked) =>
                        setPreferences(prev => ({
                          ...prev,
                          custom_proforma_prefs: { ...prev.custom_proforma_prefs, show_disaster_exemption: checked }
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-slate-200">Location Restrictions Waived</Label>
                      <p className="text-sm text-slate-400">Show "☑ Patient location restrictions waived"</p>
                    </div>
                    <Switch
                      checked={preferences.custom_proforma_prefs.show_location_restrictions}
                      onCheckedChange={(checked) =>
                        setPreferences(prev => ({
                          ...prev,
                          custom_proforma_prefs: { ...prev.custom_proforma_prefs, show_location_restrictions: checked }
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-slate-200">Clinical Decision Section</Label>
                      <p className="text-sm text-slate-400">Show "CLINICAL DECISION:" header</p>
                    </div>
                    <Switch
                      checked={preferences.custom_proforma_prefs.show_clinical_decision}
                      onCheckedChange={(checked) =>
                        setPreferences(prev => ({
                          ...prev,
                          custom_proforma_prefs: { ...prev.custom_proforma_prefs, show_clinical_decision: checked }
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-slate-200">Consultation Appropriate Checkbox</Label>
                      <p className="text-sm text-slate-400">Show "☐ Telehealth consultation appropriate for presenting complaint"</p>
                    </div>
                    <Switch
                      checked={preferences.custom_proforma_prefs.show_consultation_appropriate}
                      onCheckedChange={(checked) =>
                        setPreferences(prev => ({
                          ...prev,
                          custom_proforma_prefs: { ...prev.custom_proforma_prefs, show_consultation_appropriate: checked }
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-slate-200">Patient Consents Checkbox</Label>
                      <p className="text-sm text-slate-400">Show "☐ Patient consents to telehealth consultation"</p>
                    </div>
                    <Switch
                      checked={preferences.custom_proforma_prefs.show_patient_consents}
                      onCheckedChange={(checked) =>
                        setPreferences(prev => ({
                          ...prev,
                          custom_proforma_prefs: { ...prev.custom_proforma_prefs, show_patient_consents: checked }
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-slate-200">Technology Check Checkbox</Label>
                      <p className="text-sm text-slate-400">Show "☐ Adequate technology/connection confirmed"</p>
                    </div>
                    <Switch
                      checked={preferences.custom_proforma_prefs.show_technology_check}
                      onCheckedChange={(checked) =>
                        setPreferences(prev => ({
                          ...prev,
                          custom_proforma_prefs: { ...prev.custom_proforma_prefs, show_technology_check: checked }
                        }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={savePreferences} disabled={loading}>
                  {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Save Preferences
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <div className="text-center">
              <ManageBilling />
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Email Preferences</CardTitle>
                <CardDescription className="text-slate-400">
                  Choose what emails you'd like to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(preferences.notification_prefs).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <Label className="text-slate-200 capitalize">
                        {key.replace('_', ' ')}
                      </Label>
                      <p className="text-sm text-slate-400">
                        {key === 'marketing' && 'Promotional emails and special offers'}
                        {key === 'product_updates' && 'New features and product announcements'}
                        {key === 'billing_alerts' && 'Payment confirmations and billing notices'}
                        {key === 'tips' && 'Usage tips and best practices'}
                      </p>
                    </div>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) =>
                        setPreferences(prev => ({
                          ...prev,
                          notification_prefs: { ...prev.notification_prefs, [key]: checked }
                        }))
                      }
                    />
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button onClick={savePreferences} disabled={loading}>
                  Save Preferences
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Data Management</CardTitle>
                <CardDescription className="text-slate-400">
                  Export or delete your TeleCheck data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <div>
                    <p className="font-medium text-white">Export Your Data</p>
                    <p className="text-sm text-slate-400">Download all your saved searches and reports</p>
                  </div>
                  <Button variant="outline" onClick={downloadData} disabled={loading}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-red-900/20 border border-red-700/50 rounded-lg">
                  <div>
                    <p className="font-medium text-white">Delete App Data</p>
                    <p className="text-sm text-slate-400">Remove all saved searches and reports</p>
                  </div>
                  <Button variant="destructive" onClick={deleteData} disabled={loading}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Account Management</CardTitle>
                <CardDescription className="text-slate-400">
                  For profile, billing, and account deletion
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    data-o-profile
                    data-mode="popup"
                  >
                    Manage Account with Outseta
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <p className="text-sm text-slate-400">
                    Profile, billing, and account deletion are managed by Outseta
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}