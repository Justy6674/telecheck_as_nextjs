
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, MapPin, Save, Copy, AlertCircle, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useOutsetaUser } from '@/hooks/useOutsetaUser';
import { telehealthRulesData } from '@/data/mbs-telehealth';
import { ExternalLink } from 'lucide-react';
import { ProformaToggle, ProformaType } from './ProformaToggle';

interface DisasterInfo {
  agrn: string;
  title: string;
  hazard_type: string;
  start_date: string;
  end_date: string | null;
  url?: string;
  state?: string;
}

interface EligibilityResult {
  is_eligible: boolean;
  postcode: string;
  suburb: string;
  state: string;
  affected_lga: string;
  lga_code: string;
  total_disasters: number;
  disasters: DisasterInfo[];
}

interface PostcodeCheckerProps {
  proformaType?: 'long' | 'brief' | 'custom';
}

export const PostcodeChecker: React.FC<PostcodeCheckerProps> = ({ proformaType: initialProformaType = 'long' }) => {
  const { toast } = useToast();
  const [activeProformaType, setActiveProformaType] = useState<ProformaType>(initialProformaType);
  const [customPrefs, setCustomPrefs] = useState({
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
  });
  // Helper to ensure disasters conforms to JSON for Supabase inserts
  const toSupabaseJson = (items: DisasterInfo[] | null | undefined) => {
    if (!items || !Array.isArray(items)) return [] as any;
    return items.map(d => ({
      agrn: d.agrn,
      title: d.title,
      hazard_type: d.hazard_type,
      start_date: d.start_date,
      end_date: d.end_date,
      url: d.url ?? null,
    })) as any; // Cast to any to satisfy Supabase Json typing
  };

  const [postcode, setPostcode] = useState('');
  const [result, setResult] = useState<EligibilityResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [savedToDb, setSavedToDb] = useState(false);
  const { user, isAdmin, hasActiveSubscription, isLoading: authLoading } = useOutsetaUser();

  useEffect(() => {
    if (result) {
      setSavedToDb(false); // Reset savedToDb when result changes
    }
  }, [result]);

  // Load user's custom proforma preferences
  useEffect(() => {
    const loadCustomPrefs = async () => {
      if (!user?.Email) return;

      try {
        const { data } = await supabase
          .from('profiles')
          .select('metadata')
          .eq('email', user.Email)
          .maybeSingle();

        const metadata = data?.metadata as { app_preferences?: { custom_proforma_prefs?: typeof customPrefs } } | null;
        if (metadata?.app_preferences?.custom_proforma_prefs) {
          setCustomPrefs(metadata.app_preferences.custom_proforma_prefs);
        }
      } catch (error) {
        console.error('Error loading custom proforma preferences:', error);
      }
    };

    loadCustomPrefs();
  }, [user?.Email]);

  const handleReset = () => {
    setPostcode('');
    setResult(null);
    setSavedToDb(false);
  };

  const copyProforma = () => {
    if (result) {
      const proforma = generateNotesProforma(result, activeProformaType);

      try {
        navigator.clipboard.writeText(proforma);

        toast({
          title: '✅ Copied to clipboard',
          description: 'Clinical notes proforma ready to paste',
          duration: 3000
        });
      } catch (error) {
        console.error('Clipboard error:', error);
        toast({
          title: '❌ Copy failed',
          description: 'Unable to copy to clipboard. Please try again.',
          variant: 'destructive'
        });
      }
    }
  };

  const logVerificationUsage = async (result: EligibilityResult) => {
    if (!user?.PersonUid || !user?.Email) return;

    try {
      const agrns = result.disasters?.map(d => d.agrn).filter(Boolean) || [];
      const sourceUrls = (result.disasters?.map(d => d.url).filter((u): u is string => Boolean(u)) ?? []);

      await supabase.from('verification_usage').insert({
        user_id: user.PersonUid,
        email: user.Email,
        postcode: result.postcode,
        state: result.state,
        affected_lga: result.affected_lga,
        lga_code: result.lga_code,
        is_eligible: result.is_eligible,
        total_disasters: result.total_disasters,
        agrns,
        source_urls: sourceUrls,
        disasters: toSupabaseJson(result.disasters),
      });
    } catch (error) {
      console.error('Error logging verification usage:', error);
    }
  };

  const handlePaymentLink = () => {
    // Block access for non-admins and non-subscribers
    if (!isAdmin && !hasActiveSubscription) {
      toast({
        title: 'Access Restricted',
        description: 'Subscription access is currently limited to authorized users',
        variant: 'destructive',
      });
      return;
    }

    if (!user?.PersonUid || !user?.Email) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to subscribe',
        variant: 'destructive'
      });
      return;
    }

    // Redirect to pricing page to use proper SubscribeButton component
    window.location.href = '/pricing';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!postcode.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a postcode',
        variant: 'destructive'
      });
      return;
    }


    setIsLoading(true);
    setSavedToDb(false);

    try {
      
      const { data, error } = await supabase.rpc('check_telehealth_eligibility_v2', {
        check_postcode: postcode.trim()
      });

      if (error) {
        console.error('Error from check_telehealth_eligibility_v2:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error('No data returned from eligibility check');
      }

      const eligibilityData = data[0];

      // Safely parse the disasters JSON array
      let disasters: DisasterInfo[] = [];
      if (eligibilityData.disasters) {
        try {
          // Handle the Json type from Supabase
          const disastersData = typeof eligibilityData.disasters === 'string' 
            ? JSON.parse(eligibilityData.disasters) 
            : eligibilityData.disasters;
          
          disasters = Array.isArray(disastersData) ? disastersData : [];
        } catch (parseError) {
          console.error('Error parsing disasters JSON:', parseError);
          disasters = [];
        }
      }

      const processedResult: EligibilityResult = {
        is_eligible: eligibilityData.is_eligible || false,
        postcode: eligibilityData.postcode || postcode,
        suburb: eligibilityData.suburb || '',
        state: eligibilityData.state || '',
        affected_lga: eligibilityData.affected_lga || '',
        lga_code: eligibilityData.lga_code || '',
        total_disasters: eligibilityData.total_disasters || 0,
        disasters: disasters
      };

      setResult(processedResult);

      // Log verification usage for audit
      if (user) {
        await logVerificationUsage(processedResult);
      }

      toast({
        title: '✅ Verification Complete',
        description: `Postcode ${processedResult.postcode} checked successfully`,
        duration: 3000
      });

    } catch (error) {
      console.error('Error checking postcode:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to check postcode eligibility',
        variant: 'destructive'
      });
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const saveToDatabase = async () => {
    if (!user?.Email || !result) {
      toast({
        title: 'Error',
        description: 'You must be logged in to save checks.',
        variant: 'destructive'
      });
      return;
    }

    // **MEDICARE PSR BULLETPROOF SAVE MECHANISM**
    const auditId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    console.log(`🏥 PSR AUDIT [${auditId}]: Starting Medicare-compliant save for ${result.postcode}`);

    try {
      // Wait a moment to ensure Outseta auth is fully settled
      await new Promise(resolve => setTimeout(resolve, 100));

      // Double-check user email is still available
      if (!user?.Email) {
        throw new Error('Authentication state changed during save');
      }

      // Prepare PSR-compliant saved search data with comprehensive audit trail
      const savedSearch = {
        id: Date.now().toString(),
        audit_id: auditId,
        postcode: result.postcode,
        suburb: result.suburb,
        state: result.state,
        lga: result.affected_lga,
        is_eligible: result.is_eligible,
        total_disasters: result.total_disasters,
        disasters: result.disasters,
        notes: generateNotesProforma(result, activeProformaType),
        search_date: new Date().toISOString(),
        proforma_type: activeProformaType,
        user_email: user.Email,
        user_name: user.Name || 'Unknown',
        compliance_version: '2025.1',
        source_system: 'TeleCheck-PSR-Compliant'
      };

      console.log(`🏥 PSR AUDIT [${auditId}]: Prepared compliance data for ${savedSearch.postcode}`);

      // **STEP 1: PRIMARY SAVE with retry logic**
      let primarySaveSuccess = false;
      let attempts = 0;
      const maxRetries = 3;

      while (!primarySaveSuccess && attempts < maxRetries) {
        attempts++;
        console.log(`🏥 PSR AUDIT [${auditId}]: Primary save attempt ${attempts}/${maxRetries}`);

        try {
          // Get the current profile metadata
          const { data: profile, error: fetchError } = await supabase
            .from('profiles')
            .select('metadata')
            .eq('email', user.Email)
            .single();

          if (fetchError && fetchError.code !== 'PGRST116') {
            throw fetchError;
          }

          // Get existing metadata or create new
          const currentMetadata = (profile?.metadata as Record<string, unknown>) || {};
          const existingSavedSearches = Array.isArray((currentMetadata as any).saved_searches)
            ? ((currentMetadata as any).saved_searches as any[])
            : [];

          // Add new search to the beginning of the array
          const updatedSavedSearches = [savedSearch, ...existingSavedSearches];

          // Keep only the last 50 searches to prevent metadata bloat
          const trimmedSearches = updatedSavedSearches.slice(0, 50);

          // Update the metadata with PSR audit trail
          const updatedMetadata = {
            ...currentMetadata,
            saved_searches: trimmedSearches,
            last_search_date: new Date().toISOString(),
            psr_compliance: {
              last_save_audit_id: auditId,
              last_save_timestamp: new Date().toISOString(),
              save_method: 'primary_database'
            }
          };

          // Save to profiles.metadata (single source of truth)
          const { error: upsertError } = await supabase
            .from('profiles')
            .upsert({
              email: user.Email,
              metadata: updatedMetadata,
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'email'
            });

          if (upsertError) throw upsertError;

          primarySaveSuccess = true;
          console.log(`🏥 PSR AUDIT [${auditId}]: ✅ PRIMARY SAVE SUCCESSFUL on attempt ${attempts}`);

        } catch (retryError) {
          console.error(`🏥 PSR AUDIT [${auditId}]: ❌ Primary save attempt ${attempts} failed:`, retryError);
          if (attempts < maxRetries) {
            // Exponential backoff: 500ms, 1s, 2s
            await new Promise(resolve => setTimeout(resolve, 500 * Math.pow(2, attempts - 1)));
          }
        }
      }

      // **STEP 2: AUTOMATIC BACKUP (always execute for PSR compliance)**
      console.log(`🏥 PSR AUDIT [${auditId}]: Creating automatic PSR backup`);
      try {
        const backupData = {
          audit_id: auditId,
          timestamp: new Date().toISOString(),
          primary_save_success: primarySaveSuccess,
          user: user.Email,
          eligibility_check: savedSearch,
          compliance_note: 'Automatic PSR backup - Medicare audit trail',
          system_version: '2025.1'
        };

        // Create backup file
        const blob = new Blob([JSON.stringify(backupData, null, 2)], {
          type: 'application/json'
        });

        // Store backup reference in browser storage as secondary measure
        const backupKey = `psr_backup_${auditId}`;
        localStorage.setItem(backupKey, JSON.stringify(backupData));

        console.log(`🏥 PSR AUDIT [${auditId}]: ✅ BACKUP CREATED successfully`);

      } catch (backupError) {
        console.error(`🏥 PSR AUDIT [${auditId}]: ⚠️ Backup creation failed:`, backupError);
      }

      // **FINAL RESULT**
      if (primarySaveSuccess) {
        setSavedToDb(true);
        window.dispatchEvent(new Event('eligibility_check_saved'));
        toast({
          title: '✅ PSR Compliant Save',
          description: `Medicare audit record ${auditId.slice(-6)} created successfully`,
          duration: 5000
        });
        console.log(`🏥 PSR AUDIT [${auditId}]: ✅ COMPLETE - Full compliance save successful`);
      } else {
        // Primary save failed - force download backup for PSR compliance
        console.log(`🏥 PSR AUDIT [${auditId}]: ⚠️ Primary save failed - forcing compliance backup download`);
        downloadResult();
        toast({
          title: '⚠️ Backup Download Required',
          description: 'Primary save failed. Download backup saved for Medicare PSR compliance.',
          variant: 'destructive',
          duration: 8000
        });
      }

    } catch (error) {
      console.error(`🏥 PSR AUDIT [${auditId}]: ❌ CRITICAL SAVE FAILURE:`, error);

      // **CRITICAL FAILURE - FORCE DOWNLOAD FOR PSR COMPLIANCE**
      downloadResult();

      toast({
        title: '🚨 Critical: Download Backup Required',
        description: 'System save failed. Download backup is required for Medicare PSR audit compliance.',
        variant: 'destructive',
        duration: 10000
      });
    }
  };

  // CRITICAL FAILSAFE: Download function that works even if authentication fails
  const downloadResult = () => {
    if (!result) return;

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const proforma = generateNotesProforma(result, activeProformaType);

    const dataToSave = {
      timestamp: new Date().toISOString(),
      postcode: result.postcode,
      suburb: result.suburb,
      state: result.state,
      lga: result.affected_lga,
      eligibility: result.is_eligible ? 'ELIGIBLE' : 'NOT ELIGIBLE',
      total_disasters: result.total_disasters,
      disasters: result.disasters,
      clinical_notes: proforma,
      generated_by: 'TeleCheck - Australian Medicare Telehealth Verification',
      website: 'https://www.telecheck.com.au'
    };

    const blob = new Blob([JSON.stringify(dataToSave, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `telecheck-${result.postcode}-${timestamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: '✅ Downloaded Successfully',
      description: `Eligibility check saved as telecheck-${result.postcode}-${timestamp}.json`,
      duration: 4000
    });
  };

  const getAustralianTimestamp = (): string => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Australia/Sydney',
      timeZoneName: 'short'
    };
    const formatted = now.toLocaleString('en-AU', options);
    return `TeleCheck accessed and checked: ${formatted}`;
  };

  const generateNotesProforma = (result: EligibilityResult, proformaType?: ProformaType): string => {
    const currentProformaType = proformaType || activeProformaType;

    let currentDate;
    try {
      // Use toLocaleString (not toLocaleDateString) for date + time formatting
      currentDate = new Date().toLocaleString('en-AU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Australia/Sydney',
        hour12: false
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      // Fallback to simple date format if timezone/locale fails
      currentDate = new Date().toLocaleString('en-AU');
    }

    if (!result.is_eligible) {
      const baseText = `TELEHEALTH ELIGIBILITY CHECK - NOT ELIGIBLE

Assessment Date: ${currentDate}
Patient Postcode: ${result.postcode}
LGA: ${result.affected_lga || 'Unknown'}
State: ${result.state || 'Unknown'}

OUTCOME: NOT ELIGIBLE for Medicare disaster telehealth exemptions`;

      if (currentProformaType === 'brief') {
        return `${baseText}
• No active disasters found for postcode
• Standard telehealth restrictions apply

${getAustralianTimestamp()}`;
      }

      if (currentProformaType === 'custom') {
        return `${baseText}

CUSTOM ASSESSMENT:
• Alternative eligibility criteria assessed
• Patient location verified
• Telehealth appropriateness confirmed
• Documentation requirements met

NOTES: ___________________________

${getAustralianTimestamp()}`;
      }

      return `${baseText}
• No active disaster declarations found for this postcode
• Standard telehealth restrictions apply
• Patient must be in approved location for telehealth consultation

${getAustralianTimestamp()}`;
    }

    const baseEligible = `TELEHEALTH ELIGIBILITY CHECK - ELIGIBLE

Assessment Date: ${currentDate}
Patient Postcode: ${result.postcode}
LGA: ${result.affected_lga}
State: ${result.state}

DISASTER STATUS: ${result.total_disasters} active disaster(s) declared
${(result.disasters || []).map(d => `* ${d.title} (AGRN: ${d.agrn})`).join('\n')}`;

    if (currentProformaType === 'brief') {
      return `${baseEligible}

MEDICARE STATUS: ELIGIBLE - Extended telehealth items apply
CLINICAL DECISION: • Consultation appropriate • Patient consents

${getAustralianTimestamp()}`;
    }

    if (currentProformaType === 'custom') {
      // Build custom proforma based on user preferences
      let customTemplate = `TELEHEALTH ELIGIBILITY CHECK - ELIGIBLE

Assessment Date: ${currentDate}
Patient Postcode: ${result.postcode}
LGA: ${result.affected_lga}
State: ${result.state}`;

      if (customPrefs.show_disaster_status) {
        customTemplate += `\n\nDISASTER STATUS: ${result.total_disasters} active disaster(s) declared`;
      }

      if (customPrefs.show_disaster_list) {
        customTemplate += `\n${(result.disasters || []).map(d => `* ${d.title} (AGRN: ${d.agrn})`).join('\n')}`;
      }

      if (customPrefs.show_medicare_status) {
        customTemplate += `\n\nMEDICARE TELEHEALTH STATUS: ELIGIBLE`;
      }

      if (customPrefs.show_extended_telehealth) {
        customTemplate += `\n• Extended telehealth services apply under disaster exemption`;
      }

      if (customPrefs.show_disaster_exemption) {
        customTemplate += `\n• Disaster exemption permits telehealth consultation`;
      }

      if (customPrefs.show_location_restrictions) {
        customTemplate += `\n• Patient location restrictions waived`;
      }

      if (customPrefs.show_clinical_decision) {
        customTemplate += `\n\nCLINICAL DECISION:`;
      }

      if (customPrefs.show_consultation_appropriate) {
        customTemplate += `\n• Telehealth consultation appropriate for presenting complaint`;
      }

      if (customPrefs.show_patient_consents) {
        customTemplate += `\n• Patient consents to telehealth consultation`;
      }

      if (customPrefs.show_technology_check) {
        customTemplate += `\n• Adequate technology/connection confirmed`;
      }

      customTemplate += `\n\n${getAustralianTimestamp()}`;
      
      return customTemplate;
    }

    return `${baseEligible}

MEDICARE TELEHEALTH STATUS: ELIGIBLE
• Extended telehealth services apply under disaster exemption
• Disaster exemption permits telehealth consultation  
• Patient location restrictions waived

CLINICAL DECISION:
• Telehealth consultation appropriate for presenting complaint
• Patient consents to telehealth consultation
• Adequate technology/connection confirmed

${getAustralianTimestamp()}`;
  };

  return (
    <div className="space-y-6">
      {/* Subscription Gate for Non-Subscribers (bypass for admins) */}
      {!authLoading && user && !hasActiveSubscription && !isAdmin && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-800">
                  Subscription Required for Unlimited Verifications
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  Subscribe for $56.81/month (incl. GST) to unlock unlimited Medicare disaster eligibility checks
                </p>
              </div>
              <Button 
                size="sm" 
                onClick={handlePaymentLink}
                className="bg-amber-600 hover:bg-amber-700 text-white"
                disabled={!isAdmin && !hasActiveSubscription}
              >
                {(!isAdmin && !hasActiveSubscription) ? 'Access Restricted' : 'Subscribe Here'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-white/10 border-white/20 shadow-lg">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-white flex items-center gap-2 text-lg sm:text-xl">
            <MapPin className="h-5 w-5" />
            Medicare Disaster Telehealth Checker
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="postcode" className="block text-sm font-medium text-white/80 mb-2">
                Enter Australian Postcode
              </label>
              <Input
                id="postcode"
                type="text"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="e.g. 2000"
                className="bg-card border-border text-card-foreground placeholder:text-muted-foreground text-base h-12"
                maxLength={4}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="flex-1 bg-primary hover:bg-primary/90 h-12 text-base"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  'Check Eligibility'
                )}
              </Button>
              
              {result && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={isLoading}
                  onClick={handleReset}
                  className="sm:px-4 border-foreground/30 text-foreground hover:bg-foreground/10 h-12"
                >
                  Reset
                </Button>
              )}
            </div>
          </form>

          {result && (
            <div className="space-y-4">
              <div className="bg-white/5 rounded p-4 border border-white/10">
                <h3 className="text-lg font-medium text-white mb-2">
                  Eligibility Check Result
                </h3>
                <div className="space-y-2 text-white/80">
                  <p>
                    <strong>Postcode:</strong> {result.postcode}
                  </p>
                  <p>
                    <strong>Suburb:</strong> {result.suburb}
                  </p>
                  <p>
                    <strong>State:</strong> {result.state}
                  </p>
                  <p>
                    <strong>Local Government Area:</strong> {result.affected_lga}
                  </p>
                  <Badge variant={result.is_eligible ? 'default' : 'destructive'}>
                    {result.is_eligible ? 'Eligible' : 'Not Eligible'}
                  </Badge>
                  {result.is_eligible && (
                    <p>
                      <strong>Total Active Disasters:</strong> {result.total_disasters}
                    </p>
                  )}
                </div>
              </div>

              {result.is_eligible ? (
                <div className="bg-green-500/10 border border-green-400/30 rounded p-4">
                  <h4 className="font-medium text-green-200 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Medicare Telehealth Status:
                  </h4>
                  <ul className="space-y-1 text-green-100 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-400" /> Extended telehealth services apply under disaster exemption
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-400" /> Disaster exemption permits telehealth consultation
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-400" /> Patient location restrictions waived
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-400" /> Clinical consultation requirements met
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="bg-red-500/10 border border-red-400/30 rounded p-4">
                  <h4 className="font-medium text-red-200 mb-2 flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
                    Medicare Telehealth Status:
                  </h4>
                  <p className="text-red-100 text-sm">
                    Not eligible for extended telehealth services under disaster exemptions.
                  </p>
                </div>
              )}

              {/* Active Disaster Declarations */}
              {result.is_eligible && result.disasters && result.disasters.length > 0 && (
                <div className="bg-white/5 rounded p-4 border border-white/10">
                  <h4 className="font-medium text-white mb-3">Active Disaster Declarations</h4>
                  <div className="space-y-3">
                    {result.disasters.map((disaster, index) => (
                      <div key={index} className="bg-white/5 rounded p-3 border border-white/10">
                        <div className="space-y-1 text-sm">
                          <p className="text-white font-medium">{disaster.title}</p>
                          <div className="grid grid-cols-2 gap-4 text-white/70">
                            <div>
                              <span className="font-medium">AGRN:</span> {disaster.agrn}
                            </div>
                            <div>
                              <span className="font-medium">Hazard:</span> {disaster.hazard_type}
                            </div>
                            <div>
                              <span className="font-medium">Start:</span> {disaster.start_date}
                            </div>
                            <div>
                              <span className="font-medium">End:</span> {disaster.end_date || 'Ongoing'}
                            </div>
                          </div>
                           <div className="pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                // Use the url field from the disaster object
                                const url = disaster.url || `https://www.disasterassist.gov.au/find-a-disaster#search-${disaster.agrn}`;

                                // Ensure URL is valid before opening
                                if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
                                  window.open(url, '_blank');
                                } else {
                                  // Fallback to search if URL is malformed
                                  window.open(`https://www.disasterassist.gov.au/find-a-disaster#search-${disaster.agrn}`, '_blank');
                                }
                              }}
                              className="text-xs h-7"
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              DisasterAssist
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Clinical Notes Proforma */}
              <div className="bg-white/5 rounded p-4 border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-white">Clinical Notes Proforma</h4>
                  <ProformaToggle 
                    activeType={activeProformaType}
                    onTypeChange={setActiveProformaType}
                    showCustom={true}
                  />
                </div>
                <div className="bg-gray-900/50 rounded p-3 border border-gray-600 max-h-64 overflow-y-auto">
                  <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono">
                     {generateNotesProforma(result, activeProformaType)}
                   </pre>
                </div>
                {/* **MOBILE-OPTIMIZED HEALTHCARE ACTION BUTTONS** */}
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-2 sm:gap-3">
                  <Button
                    onClick={copyProforma}
                    variant="secondary"
                    size="sm"
                    className="bg-green-500/20 hover:bg-green-500/40 text-green-200 w-full sm:w-auto min-h-[44px] touch-manipulation"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Proforma
                  </Button>
                  <Button
                    onClick={downloadResult}
                    variant="secondary"
                    size="sm"
                    className="bg-blue-500/20 hover:bg-blue-500/40 text-blue-200 w-full sm:w-auto min-h-[44px] touch-manipulation"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Backup
                  </Button>
                  {user?.Email && (
                    <Button
                      onClick={saveToDatabase}
                      disabled={savedToDb}
                      size="sm"
                      variant="blue"
                      className="w-full sm:w-auto min-h-[44px] touch-manipulation font-semibold"
                    >
                      {savedToDb ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          ✅ PSR Compliant Save
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save to Dashboard
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {/* Important Disclaimers */}
              <div className="bg-amber-500/10 border border-amber-400/30 rounded p-4">
                <h4 className="font-medium text-amber-200 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Important Disclaimers
                </h4>
                <div className="space-y-2 text-amber-100 text-sm">
                  <p>
                    • This tool provides information only and does not constitute medical or legal advice
                  </p>
                  <p>
                    • Clinicians remain responsible for verifying current Medicare requirements before providing telehealth services
                  </p>
                  <p>
                    • Disaster declarations may change without notice - always verify current status
                  </p>
                  <p>
                    • Standard clinical assessments for telehealth appropriateness still apply
                  </p>
                </div>
              </div>

              {/* Official Sources */}
              <div className="bg-white/5 rounded p-4 border border-white/10">
                <h4 className="font-medium text-white mb-3">Official Sources</h4>
                <div className="space-y-2">
                  {telehealthRulesData.medical.sources.map((source, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-white/80 text-sm">{source.title}</span>
                      <a 
                        href={source.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-300 hover:text-blue-200 text-sm"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
