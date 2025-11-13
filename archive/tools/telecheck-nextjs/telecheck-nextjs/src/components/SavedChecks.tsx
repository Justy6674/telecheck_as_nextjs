import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Trash2, Copy, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useOutsetaUser } from '@/hooks/useOutsetaUser';
import { useToast } from '@/hooks/use-toast';

interface SavedCheck {
  id: string;
  postcode: string;
  suburb?: string | null;
  state: string | null;
  lga: string | null;
  is_eligible: boolean;
  total_disasters: number | null;
  disasters: any;
  notes?: string | null;
  search_date: string;
  proforma_type?: string;
}

export const SavedChecks = () => {
  const [checks, setChecks] = useState<SavedCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCheck, setExpandedCheck] = useState<string | null>(null);
  const { user } = useOutsetaUser();
  const { toast } = useToast();

  useEffect(() => {
    if (user?.Email) {
      fetchSavedChecks();
    } else if (user !== null) {
      // User object exists but no email - stop loading
      setLoading(false);
    }
    // If user is null, keep loading until auth resolves
  }, [user]);

  useEffect(() => {
    const onSaved = () => {
      if (user?.Email) {
        fetchSavedChecks();
      }
    };
    window.addEventListener('eligibility_check_saved', onSaved);
    return () => window.removeEventListener('eligibility_check_saved', onSaved);
  }, [user]);

  const fetchSavedChecks = async () => {
    try {
      console.log('🔍 DEBUGGING SavedChecks - user?.Email:', user?.Email);
      console.log('🔍 DEBUGGING SavedChecks - user?.Name:', user?.Name);
      console.log('🔍 DEBUGGING SavedChecks - full user object:', user);

      // Read from profiles.metadata (single source of truth)
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('metadata')
        .eq('email', user?.Email)
        .single();

      console.log('🔍 DEBUGGING SavedChecks - profile query result:', { profile, error });

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        throw error;
      }

      // Extract saved searches from metadata
      const savedSearches = profile?.metadata?.saved_searches || [];
      console.log('🔍 DEBUGGING SavedChecks - found', savedSearches.length, 'saved checks in metadata');

      setChecks(savedSearches);
    } catch (error) {
      console.error('Error fetching saved checks:', error);
      toast({
        title: 'Error',
        description: 'Failed to load saved checks',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteCheck = async (id: string) => {
    try {
      // Get current profile metadata
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('metadata')
        .eq('email', user?.Email)
        .single();

      if (fetchError) throw fetchError;

      // Remove the specific check from saved_searches
      const currentMetadata = profile?.metadata || {};
      const existingSavedSearches = currentMetadata.saved_searches || [];
      const updatedSavedSearches = existingSavedSearches.filter((check: SavedCheck) => check.id !== id);

      // Update the metadata
      const updatedMetadata = {
        ...currentMetadata,
        saved_searches: updatedSavedSearches
      };

      // Save updated metadata back to profiles
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          metadata: updatedMetadata,
          updated_at: new Date().toISOString()
        })
        .eq('email', user?.Email);

      if (updateError) throw updateError;

      setChecks(prev => prev.filter(check => check.id !== id));
      toast({
        title: 'Deleted',
        description: 'Check removed from dashboard'
      });
    } catch (error) {
      console.error('Error deleting check:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete check',
        variant: 'destructive'
      });
    }
  };

  const copyProforma = (proforma: string | null) => {
    if (proforma) {
      navigator.clipboard.writeText(proforma);
      toast({
        title: '✅ Copied to clipboard',
        description: 'Clinical notes proforma copied',
        duration: 3000
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
      </div>
    );
  }

  if (checks.length === 0) {
    return (
      <Card className="bg-white shadow-lg">
        <CardContent className="p-8 text-center">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Saved Checks</h3>
          <p className="text-gray-600">
            Your saved eligibility checks will appear here. Use the "Save to Dashboard" button when checking postcodes.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg sm:text-xl font-semibold text-white">Recent Checks</h2>
      
      <div className="grid gap-3">
        {checks.slice(0, 5).map((check) => (
          <Card key={check.id} className="bg-white/10 border-white/20">
            <CardContent className="p-3 sm:p-4">
              <div 
                className="flex justify-between items-center cursor-pointer hover:bg-white/5 -m-4 p-4 rounded"
                onClick={() => setExpandedCheck(expandedCheck === check.id ? null : check.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">
                      {check.postcode}
                    </span>
                    <Badge 
                      variant={check.is_eligible ? "default" : "destructive"}
                      className={`text-xs ${check.is_eligible ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
                    >
                      {check.is_eligible ? "Eligible" : "Not Eligible"}
                    </Badge>
                  </div>
                  <div className="text-xs text-white/60">
                    {new Date(check.search_date).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 px-2 text-red-300 hover:bg-red-500/20"
                    onClick={() => deleteCheck(check.id)}
                  >
                    ×
                  </Button>
                </div>
              </div>

              {expandedCheck === check.id && (
                <div className="mt-4 pt-4 border-t border-white/20 space-y-4">
                  {/* Location Details */}
                  <div className="bg-white/5 rounded p-3 border border-white/10">
                    <h4 className="font-medium text-white mb-2"><span className="text-role-consumer">Patient</span> Location Details</h4>
                    <div className="space-y-1 text-white/80 text-sm">
                      <p><strong>Postcode:</strong> {check.postcode}</p>
                      {check.lga && <p><strong>Local Government Area:</strong> {check.lga}</p>}
                      {check.state && <p><strong>State:</strong> {check.state}</p>}
                    </div>
                  </div>

                  {/* Status Badge */}
                  {check.is_eligible && (
                    <div className="text-center">
                      <div className="inline-block px-4 py-2 rounded-full text-white font-medium text-sm bg-green-500">
                        ✓ ELIGIBLE - {check.total_disasters} Active Disasters in {check.lga} LGA
                      </div>
                    </div>
                  )}

                  {/* Medicare Status */}
                  {check.is_eligible && (
                    <div className="bg-blue-500/20 border border-blue-400/30 rounded p-3">
                      <h4 className="font-medium text-blue-200 mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Medicare Telehealth Status:
                      </h4>
                      <ul className="space-y-1 text-blue-100 text-sm">
                        <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-400" /> Extended telehealth services apply under disaster exemption</li>
                        <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-400" /> Disaster exemption permits telehealth consultation</li>
                        <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-400" /> <span className="text-role-consumer">Patient</span> location restrictions waived</li>
                        <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-400" /> Clinical consultation requirements met</li>
                      </ul>
                    </div>
                   )}

                  {/* Active Disaster Declarations */}
                  {check.is_eligible && check.disasters && Array.isArray(check.disasters) && check.disasters.length > 0 && (
                    <div className="bg-white/5 rounded p-3 border border-white/10">
                      <h4 className="font-medium text-white mb-3">Active Disaster Declarations</h4>
                      <div className="space-y-2">
                        {check.disasters.map((disaster: any, index: number) => (
                          <div key={index} className="p-3 bg-accent/50 rounded-lg">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <h4 className="font-medium text-foreground">{disaster.title}</h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                  AGRN: {disaster.agrn}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Start Date: {disaster.start_date}
                                </p>
                              </div>
                               <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const url = disaster.url && disaster.url.startsWith('http')
                                      ? disaster.url
                                      : 'https://www.disasterassist.gov.au';
                                    window.open(url, '_blank');
                                  }}
                                  className="text-xs"
                                >
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  DisasterAssist
                                </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {check.notes && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-green-200 flex items-center gap-2">
                        📝 Clinical Notes - Copy for Documentation
                      </h4>
                      <div className="bg-white/5 p-3 rounded text-white/70 text-sm font-mono whitespace-pre-wrap border border-white/10">
                        {check.notes}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-green-400/50 text-green-300 hover:bg-green-500/20"
                        onClick={() => copyProforma(check.notes)}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy Clinical Notes
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        {checks.length > 5 && (
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-3 text-center">
              <p className="text-white/60 text-xs">
                Showing 5 most recent checks. You have {checks.length - 5} more.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};