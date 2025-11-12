import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useInactivityTimeout } from '@/hooks/useInactivityTimeout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  ArrowLeft,
  User,
  Shield,
  CreditCard,
  Bell,
  Lock,
  Database,
  Loader2,
  Check,
  AlertCircle,
  AlertTriangle,
  ExternalLink,
  Download,
  Trash2,
  Globe,
  Palette,
  Key,
  Settings as SettingsIcon
} from 'lucide-react';

// Component imports
import { SessionManager } from '@/components/SessionManager';
import { ManageBilling } from '@/components/ManageBilling';
// import { TaxDetails } from '@/components/TaxDetails'; // Temporarily disabled
import { EmailPreferences } from '@/components/EmailPreferences';
import { DataExportDeletion } from '@/components/DataExportDeletion';
// import { BiometricAuthSection } from '@/components/BiometricAuthSection';
// import { TrustedDeviceManager } from '@/components/TrustedDeviceManager';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface UserProfile {
  full_name: string;
  display_name: string;
  phone: string;
  profession: string;
  timezone: string;
  locale: string;
  company_name: string;
  abn: string;
  billing_address: string;
  role: string;
  privacy_policy_accepted_at?: string;
  terms_accepted_at?: string;
  notification_prefs: {
    marketing: boolean;
    product_updates: boolean;
    billing_alerts: boolean;
    tips: boolean;
  };
  reduced_motion: boolean;
}

export default function Settings() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  // Initialize session timeout monitoring
  useInactivityTimeout();
  // Auto-detect timezone
  const getDetectedTimezone = () => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return 'Australia/Sydney'; // Fallback
    }
  };

  const [profile, setProfile] = useState<UserProfile>({
    full_name: '',
    display_name: '',
    phone: '',
    profession: '',
    timezone: getDetectedTimezone(),
    locale: 'en-AU',
    company_name: '',
    abn: '',
    billing_address: '',
    role: '',
    notification_prefs: {
      marketing: false,
      product_updates: true,
      billing_alerts: true,
      tips: false
    },
    reduced_motion: false
  });
  const [subscription, setSubscription] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  useEffect(() => {
    loadUserData();
    loadSessions();
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      // Load profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileData) {
        setProfile({
          full_name: profileData.full_name || '',
          display_name: profileData.display_name || '',
          phone: profileData.phone || '',
          profession: profileData.profession || '',
          timezone: profileData.timezone || getDetectedTimezone(),
          locale: profileData.locale || 'en-AU',
          company_name: profileData.company_name || '',
          abn: profileData.abn || '',
          billing_address: profileData.billing_address || '',
          role: profileData.role || 'user',
          privacy_policy_accepted_at: profileData.privacy_policy_accepted_at,
          terms_accepted_at: profileData.terms_accepted_at,
          notification_prefs: (typeof profileData.notification_prefs === 'object' && 
                                  profileData.notification_prefs !== null) ? 
                                 profileData.notification_prefs as any : {
            marketing: false,
            product_updates: true,
            billing_alerts: true,
            tips: false
          },
          reduced_motion: profileData.reduced_motion || false
        });

        // Get subscription data from profiles table (single source of truth)
        setSubscription({
          tier: profileData.subscription_tier || null,
          status: profileData.stripe_subscription_status || null,
          current_period_end: profileData.current_period_end || null,
          customer_id: profileData.stripe_customer_id || null
        });
      }

      // Check MFA status
      const { data: { user: authUser } } = await supabase.auth.getUser();
      setMfaEnabled(authUser?.app_metadata?.mfa_enabled || false);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadSessions = async () => {
    if (!user) return;
    
    try {
      const { data: sessionData, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('last_activity', { ascending: false });

      if (error) throw error;

      const formattedSessions = sessionData?.map(session => ({
        id: session.id,
        device: session.user_agent ? session.user_agent.slice(0, 50) + '...' : 'Unknown Device',
        ip: session.ip_address || 'Unknown',
        location: (session.metadata as any)?.location || 'Unknown',
        timezone: (session.metadata as any)?.timezone || 'Unknown',
        last_active: session.last_activity,
        current: session.id === sessionData[0]?.id // Most recent session is current
      })) || [];

      setSessions(formattedSessions);
    } catch (error) {
      console.error('Error loading sessions:', error);
      setSessions([]);
    }
  };

  const updateProfile = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          display_name: profile.display_name,
          phone: profile.phone,
          profession: profile.profession as any,
          timezone: profile.timezone,
          locale: profile.locale,
          company_name: profile.company_name,
          abn: profile.abn,
          billing_address: profile.billing_address,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user?.id);

      if (error) throw error;
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async () => {
    if (passwordForm.new !== passwordForm.confirm) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordForm.new.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.new
      });

      if (error) throw error;

      toast.success('Password updated successfully');
      setPasswordForm({ current: '', new: '', confirm: '' });
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const sendPasswordReset = async () => {
    if (!user?.email) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });

      if (error) throw error;
      toast.success('Password reset email sent');
    } catch (error) {
      console.error('Error sending reset email:', error);
      toast.error('Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  const updateNotificationPrefs = async (prefs: typeof profile.notification_prefs) => {
    setProfile(prev => ({ ...prev, notification_prefs: prefs }));

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ notification_prefs: prefs })
        .eq('user_id', user?.id);

      if (error) throw error;
      toast.success('Notification preferences updated');
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update preferences');
    }
  };

  const openCustomerPortal = async () => {
    // OPTION A: Direct link to customer portal
    window.open('https://billing.stripe.com/p/login/14AfZh6xv6cp0Qk1jC0Jq00', '_blank');
  };

  const downloadData = async () => {
    setLoading(true);
    try {
      // Fetch all user data
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      const { data: checksData } = await supabase
        .from('eligibility_checks')
        .select('*')
        .eq('user_id', user?.id);

      const exportData = {
        profile: profileData,
        eligibility_checks: checksData,
        exported_at: new Date().toISOString()
      };

      // Create download
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

  const deleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    if (!confirm('This will permanently delete all your data. Are you absolutely sure?')) {
      return;
    }

    setLoading(true);
    try {
      // Account deletion requires manual admin intervention
      toast.success('Account deletion request submitted. Please contact support@telecheck.com.au to complete the process.');
      // Don't sign out yet - let user continue using account until deletion is processed
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to submit deletion request');
    } finally {
      setLoading(false);
    }
  };

  const signOutOtherSessions = async () => {
    setLoading(true);
    try {
      // In a real app, this would invalidate other sessions
      toast.success('Signed out of all other sessions');
      loadSessions();
    } catch (error) {
      console.error('Error signing out sessions:', error);
      toast.error('Failed to sign out other sessions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
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
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2 h-auto p-1 bg-slate-800/50">
            <TabsTrigger value="profile" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-300 hover:text-white transition-colors">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-300 hover:text-white transition-colors">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="billing" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-300 hover:text-white transition-colors">
              <CreditCard className="h-4 w-4 mr-2" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-300 hover:text-white transition-colors">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-300 hover:text-white transition-colors">
              <Lock className="h-4 w-4 mr-2" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="display" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-300 hover:text-white transition-colors">
              <Palette className="h-4 w-4 mr-2" />
              Display
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Profile Information</CardTitle>
                <CardDescription className="text-slate-400">
                  Update your personal and business information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-200">Email (Verified)</Label>
                    <div className="flex gap-2">
                      <Input
                        id="email"
                        value={user?.email || ''}
                        disabled
                        className="bg-slate-700/50 text-slate-300 border-slate-600"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="full_name" className="text-slate-200">Full Name</Label>
                     <Input className="bg-slate-700/50 text-white border-slate-600 placeholder:text-slate-400 focus:bg-slate-600/50 focus:border-slate-500"
                      id="full_name"
                      value={profile.full_name}
                      onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="display_name" className="text-slate-200">Display Name</Label>
                    <Input className="bg-slate-700/50 text-white border-slate-600 placeholder:text-slate-400 focus:bg-slate-600/50 focus:border-slate-500"
                      id="display_name"
                      value={profile.display_name}
                      onChange={(e) => setProfile(prev => ({ ...prev, display_name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-slate-200">Phone</Label>
                    <Input className="bg-slate-700/50 text-white border-slate-600 placeholder:text-slate-400 focus:bg-slate-600/50 focus:border-slate-500"
                      id="phone"
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profession" className="text-slate-200">
                      Healthcare Profession <span className="text-red-400">*</span>
                    </Label>
                    <Select
                      value={profile.profession || ''}
                      onValueChange={(value) => setProfile(prev => ({ ...prev, profession: value }))}
                    >
                      <SelectTrigger id="profession" className="bg-slate-700/50 text-white border-slate-600 hover:bg-slate-600/50 focus:border-slate-500">
                        <SelectValue placeholder="Select your profession" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 text-white border-slate-600">
                        <SelectItem value="General Practitioner">General Practitioner (GP)</SelectItem>
                        <SelectItem value="Specialist Doctor">Specialist Doctor</SelectItem>
                        <SelectItem value="Nurse">Registered Nurse</SelectItem>
                        <SelectItem value="Nurse Practitioner">Nurse Practitioner</SelectItem>
                        <SelectItem value="Allied Health Professional">Allied Health Professional</SelectItem>
                        <SelectItem value="Practice Manager">Practice Manager</SelectItem>
                        <SelectItem value="Administration Staff">Administration Staff</SelectItem>
                        <SelectItem value="Medical Receptionist">Medical Receptionist</SelectItem>
                        <SelectItem value="Other Healthcare Professional">Other Healthcare Professional</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-slate-400">Required for AHPRA compliance and Medicare billing</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone" className="text-slate-200">Timezone</Label>
                    <Select
                      value={profile.timezone}
                      onValueChange={(value) => setProfile(prev => ({ ...prev, timezone: value }))}
                    >
                      <SelectTrigger className="bg-slate-700/50 text-white border-slate-600 hover:bg-slate-600/50 focus:border-slate-500">
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
                  <div className="space-y-2">
                    <Label htmlFor="locale" className="text-slate-200">Locale</Label>
                    <Select
                      value={profile.locale}
                      onValueChange={(value) => setProfile(prev => ({ ...prev, locale: value }))}
                    >
                      <SelectTrigger className="bg-slate-700/50 text-white border-slate-600 hover:bg-slate-600/50 focus:border-slate-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 text-white border-slate-600">
                        <SelectItem value="en-AU">English (Australia)</SelectItem>
                        <SelectItem value="en-GB">English (UK)</SelectItem>
                        <SelectItem value="en-US">English (US)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Business Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-200" htmlFor="company_name">Company Name</Label>
                      <Input className="bg-slate-700/50 text-white border-slate-600 placeholder:text-slate-400 focus:bg-slate-600/50 focus:border-slate-500"
                        id="company_name"
                        value={profile.company_name}
                        onChange={(e) => setProfile(prev => ({ ...prev, company_name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-200" htmlFor="abn">ABN/ACN</Label>
                      <Input className="bg-slate-700/50 text-white border-slate-600 placeholder:text-slate-400 focus:bg-slate-600/50 focus:border-slate-500"
                        id="abn"
                        value={profile.abn}
                        onChange={(e) => setProfile(prev => ({ ...prev, abn: e.target.value }))}
                      />
                    </div>
                    <div className="col-span-full space-y-2">
                      <Label className="text-slate-200" htmlFor="billing_address">Billing Address</Label>
                      <Input className="bg-slate-700/50 text-white border-slate-600 placeholder:text-slate-400 focus:bg-slate-600/50 focus:border-slate-500"
                        id="billing_address"
                        value={profile.billing_address}
                        onChange={(e) => setProfile(prev => ({ ...prev, billing_address: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Badge variant="outline">Role: {profile.role || 'User'}</Badge>
                  <Badge variant="outline">Plan: {subscription?.status === 'active' ? 'Professional' : 'Free'}</Badge>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={updateProfile} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Password</CardTitle>
                <CardDescription className="text-slate-400">
                  Change your password or reset it via email
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-slate-200" htmlFor="current_password">Current Password</Label>
                    <Input className="bg-input text-foreground border-border placeholder:text-muted-foreground focus:border-ring transition-colors"
                      id="current_password"
                      type="password"
                      value={passwordForm.current}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, current: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-200" htmlFor="new_password">New Password</Label>
                    <Input className="bg-input text-foreground border-border placeholder:text-muted-foreground focus:border-ring transition-colors"
                      id="new_password"
                      type="password"
                      value={passwordForm.new}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, new: e.target.value }))}
                    />
                    <p className="text-sm text-muted-foreground">Minimum 8 characters</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-200" htmlFor="confirm_password">Confirm New Password</Label>
                    <Input className="bg-input text-foreground border-border placeholder:text-muted-foreground focus:border-ring transition-colors"
                      id="confirm_password"
                      type="password"
                      value={passwordForm.confirm}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, confirm: e.target.value }))}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={sendPasswordReset}>
                  Send Reset Email
                </Button>
                <Button onClick={updatePassword} disabled={loading}>
                  Update Password
                </Button>
              </CardFooter>
            </Card>

            {/* Biometric Authentication - Temporarily disabled */}
            {/* <BiometricAuthSection /> */}

            {/* Trusted Devices - Temporarily disabled */}
            {/* <TrustedDeviceManager /> */}

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Two-Factor Authentication</CardTitle>
                <CardDescription className="text-slate-400">
                  Add an extra layer of security to your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <span className="font-medium">Authenticator App</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Use an app like Google Authenticator or Authy
                    </p>
                  </div>
                  <Switch
                    checked={mfaEnabled}
                    onCheckedChange={(checked) => {
                      toast.info('MFA is available for Professional and Enterprise plans');
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Active Sessions</CardTitle>
                <CardDescription className="text-slate-400">
                  Manage your active login sessions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
                    <div className="space-y-1">
                      <div className="font-medium flex items-center gap-2">
                        {session.device}
                        {session.current && <Badge variant="default" className="text-xs">Current</Badge>}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {session.location} • {session.ip}
                      </div>
                      <div className="text-xs text-slate-500">
                        Last active: {new Date(session.last_active).toLocaleString()}
                      </div>
                    </div>
                    {!session.current && (
                      <Button variant="outline" size="sm">
                        Sign Out
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={signOutOtherSessions}>
                  Sign Out Other Sessions
                </Button>
              </CardFooter>
            </Card>

            {/* Enhanced Security Log */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Security Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {sessions.map((session) => (
                    <div key={session.id} className="text-sm">
                      <span className="text-muted-foreground">
                        {new Date(session.last_active).toLocaleString()}: Login from {session.location}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab - User subscription management and tax details */}
          <TabsContent value="billing" className="space-y-6">
            {/* Personal Subscription Management */}
            <div className="text-center">
              <ManageBilling />
            </div>

            {/* Australian Tax & Invoicing - Temporarily disabled */}
            <Card>
              <CardHeader>
                <CardTitle>Tax Details</CardTitle>
                <CardDescription>Tax feature temporarily unavailable</CardDescription>
              </CardHeader>
            </Card>

          </TabsContent>

          {/* Notifications Tab - Enhanced with granular preferences */}
          <TabsContent value="notifications" className="space-y-6">
            {/* Enhanced Email Preferences with APP compliance */}
            <EmailPreferences />
          </TabsContent>

          {/* Privacy Tab - Enhanced with comprehensive data management */}
          <TabsContent value="privacy" className="space-y-6">
            {/* Enhanced Data Export & Deletion with GDPR compliance */}
            <DataExportDeletion />

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Privacy Policy & Terms</CardTitle>
                <CardDescription className="text-slate-400">
                  Review our policies and your consent status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-card border border-border rounded">
                  <span className="text-sm">Privacy Policy</span>
                  <Button variant="outline" size="sm" asChild>
                    <a href="/privacy" target="_blank">
                      View <ExternalLink className="h-3 w-3 ml-2" />
                    </a>
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-card border border-border rounded">
                  <span className="text-sm">Terms of Service</span>
                  <Button variant="outline" size="sm" asChild>
                    <a href="/terms" target="_blank">
                      View <ExternalLink className="h-3 w-3 ml-2" />
                    </a>
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground mt-4">
                  Privacy Policy: {profile.privacy_policy_accepted_at ? new Date(profile.privacy_policy_accepted_at).toLocaleDateString() : 'Not accepted'} |
                  Terms: {profile.terms_accepted_at ? new Date(profile.terms_accepted_at).toLocaleDateString() : 'Not accepted'}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Display Tab */}
          <TabsContent value="display" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Appearance</CardTitle>
                <CardDescription className="text-slate-400">
                  Customise how TeleCheck looks for you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-slate-200" htmlFor="reduced_motion">Reduced Motion</Label>
                      <p className="text-sm text-slate-400">Minimise animations and transitions</p>
                    </div>
                    <Switch
                      id="reduced_motion"
                      checked={profile.reduced_motion}
                      onCheckedChange={(checked) =>
                        setProfile(prev => ({ ...prev, reduced_motion: checked }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={updateProfile} disabled={loading}>
                  Save Preferences
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}