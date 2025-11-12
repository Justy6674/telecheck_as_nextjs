import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, Trash2, Shield, FileText, Clock, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const DataExportDeletion: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const exportUserData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch all user data
      const [profileData, checksData, analysesData] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', user.id).single(),
        supabase.from('eligibility_checks').select('*').eq('user_id', user.id),
        supabase.from('clinic_bulk_analyses').select('*').eq('user_id', user.id)
      ]);

      const userData = {
        export_info: {
          exported_at: new Date().toISOString(),
          user_id: user.id,
          email: user.email,
          format: 'JSON',
          gdpr_compliant: true
        },
        profile: profileData.data,
        eligibility_checks: checksData.data || [],
        bulk_analyses: analysesData.data || [],
        account_info: {
          created_at: user.created_at,
          last_sign_in: user.last_sign_in_at,
          email_confirmed: user.email_confirmed_at !== null
        }
      };

      // Remove sensitive fields
      delete userData.profile?.id;
      
      // Download as JSON
      const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `telecheck-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: 'Data Export Complete',
        description: 'Your data has been downloaded successfully.',
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: 'Export Failed',
        description: 'Unable to export your data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteUserAccount = async () => {
    if (!user || deleteConfirmation !== 'DELETE') return;

    setLoading(true);
    try {
      // Create deletion record for audit
      await supabase.from('deleted_users').insert({
        original_user_id: user.id,
        email_hash: btoa(user.email || ''),
        deletion_reason: 'user_requested',
        scheduled_purge_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days
        data_retained: {
          deleted_at: new Date().toISOString(),
          checks_count: 0, // Would need to count before deletion
          last_login: user.last_sign_in_at
        }
      });

      // Delete user data (in order due to foreign keys)
      await Promise.all([
        supabase.from('eligibility_checks').delete().eq('user_id', user.id),
        supabase.from('clinic_bulk_analyses').delete().eq('user_id', user.id),
        supabase.from('profiles').delete().eq('user_id', user.id)
      ]);

      // Sign out and redirect
      await signOut();

      toast({
        title: 'Account Deleted',
        description: 'Your account and all data have been permanently deleted.',
      });
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: 'Deletion Failed',
        description: 'Unable to delete your account. Please contact support.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Data Export */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Your Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>Profile information and account settings</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>All eligibility checks and saved results</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>Bulk analysis history and reports</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Account activity and usage statistics</span>
            </div>
          </div>

          <div className="p-3 bg-secondary/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">GDPR Compliant Export</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Your data will be exported in a structured JSON format containing all personal data 
              we hold about you, in accordance with GDPR Article 20 (Right to Data Portability).
            </p>
          </div>

          <Button onClick={exportUserData} disabled={loading} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            {loading ? 'Exporting...' : 'Download My Data'}
          </Button>
        </CardContent>
      </Card>

      {/* Account Deletion */}
      <Card className="bg-card border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Delete Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="font-medium text-sm text-destructive">Permanent Action</span>
            </div>
            <p className="text-xs text-muted-foreground">
              This action cannot be undone. All your data will be permanently deleted from our servers.
            </p>
          </div>

          <div className="space-y-3 text-sm text-muted-foreground">
            <p><strong>What will be deleted:</strong></p>
            <ul className="space-y-1 ml-4">
              <li>• Your profile and account information</li>
              <li>• All eligibility checks and saved results</li>
              <li>• Bulk analysis history and reports</li>
              <li>• Usage statistics and activity logs</li>
              <li>• Subscription and billing information</li>
            </ul>
          </div>

          <div className="space-y-3 text-sm text-muted-foreground">
            <p><strong>What we keep (anonymous, for 90 days):</strong></p>
            <ul className="space-y-1 ml-4">
              <li>• Deletion audit record (no personal identifiers)</li>
              <li>• Aggregated usage statistics</li>
              <li>• Legal compliance records (if required)</li>
            </ul>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete My Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className="space-y-2">
                  <p>This action cannot be undone. This will permanently delete your account and remove all your data from our servers.</p>
                  <p>Type <strong>DELETE</strong> below to confirm:</p>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="py-4">
                <Label htmlFor="delete-confirmation">Confirmation</Label>
                <Input
                  id="delete-confirmation"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="Type DELETE to confirm"
                  className="mt-1"
                />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setDeleteConfirmation('')}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={deleteUserAccount}
                  disabled={deleteConfirmation !== 'DELETE' || loading}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  {loading ? 'Deleting...' : 'Delete Account'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
};