import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  FileBarChart,
  MapPin,
  Users,
  AlertTriangle,
  Download,
  Loader2,
  Upload,
  CheckCircle,
  Clock,
  Shield,
  AlertCircle,
  Save
} from 'lucide-react';
// PDF generation using simple jsPDF (client-side)
import { generateSimplePDF } from '@/utils/simplePdfGenerator';
import { saveClinicReport } from '@/utils/reportGenerator';
import { useOutsetaUser } from '@/hooks/useOutsetaUser';

interface PostcodeData {
  postcodes: string[];
  totalRecords: number;
  uploadMethod: 'csv' | 'text';
}

interface StateBreakdown {
  total: number;
  disasterExempt: number;       // IN open disaster zones = Medicare eligible via disaster pathway
  nonDisaster: number;          // NOT in disaster zones = require other eligibility pathways
  disasterExemptPercentage: number;
}

interface RemotenessBreakdown {
  total: number;
  disasterExempt: number;       // IN open disaster zones = Medicare eligible via disaster pathway
  nonDisaster: number;          // NOT in disaster zones = require other eligibility pathways
  disasterExemptPercentage: number;
}

interface AnalysisResult {
  totalPatients?: number;
  totalAnalyzed?: number;
  eligibleCount?: number;
  ineligibleCount?: number;
  eligiblePercentage?: number;
  totalActiveDisasters?: number; // Total count of open disasters (NULL end_date)
  totalEligiblePatients?: number; // Total eligible patients (sum of time periods)
  disasterRiskBreakdown?: {
    active: number;      // No end date (immediate eligibility)
    high: number;        // <12 months since disaster
    medium: number;      // 1-2 years since disaster
    low: number;         // 2+ years since disaster
    none: number;        // No disaster history
  };
  timeBasedAnalysis?: {
    within12Months: { count: number; percentage: number; description: string };
    between12And24Months: { count: number; percentage: number; description: string };
    over24Months: { count: number; percentage: number; description: string };
  };
  stateDistribution?: Record<string, number>;
  demographicAnalysis?: {
    state_breakdown: Record<string, number>;
    remoteness_breakdown: Record<string, number>;
    geographic_distribution: {
      remote: number;
      very_remote: number;
      major_cities: number;
      inner_regional: number;
      outer_regional: number;
    };
  };
  remotenessDistribution?: {
    'Major Cities': number;
    'Inner Regional': number;
    'Outer Regional': number;
    'Remote': number;
    'Very Remote': number;
  };
  nationalRemotenessBreakdown?: {
    'Major Cities': number;
    'Inner Regional': number;
    'Outer Regional': number;
    'Remote': number;
    'Very Remote': number;
  };
  // Enhanced breakdown data
  enhancedStateDistribution?: Record<string, StateBreakdown>;
  enhancedRemotenessDistribution?: Record<string, RemotenessBreakdown>;
  eligibilityRate?: number; // % with active or recent disasters
  analysedAt?: string;
  analysisDate?: string;
  clinicName?: string;
}

export const ClinicAnalysisProfessional = () => {
  console.log('🎯 NEW PDFSHIFT VERSION LOADED AT:', new Date().toISOString(), '🎯');

  const [postcodeData, setPostcodeData] = useState<PostcodeData | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  // Australian State Color Scheme - Static classes for Tailwind detection
  const getStateStyle = (stateName: string) => {
    switch (stateName) {
      case 'QLD':
        return 'border-l-6 border-blue-600 bg-blue-900/20 hover:bg-blue-800/30'; // Pacific Ocean Blue
      case 'NSW':
        return 'border-l-6 border-red-600 bg-red-900/20 hover:bg-red-800/30';   // Heritage Red
      case 'VIC':
        return 'border-l-6 border-purple-600 bg-purple-900/20 hover:bg-purple-800/30'; // Racing Purple
      case 'WA':
        return 'border-l-6 border-orange-600 bg-orange-900/20 hover:bg-orange-800/30'; // Desert Sunset
      case 'SA':
        return 'border-l-6 border-pink-600 bg-pink-900/20 hover:bg-pink-800/30';     // Festival Pink
      case 'TAS':
        return 'border-l-6 border-green-600 bg-green-900/20 hover:bg-green-800/30';  // Wilderness Green
      case 'ACT':
        return 'border-l-6 border-indigo-600 bg-indigo-900/20 hover:bg-indigo-800/30'; // Capital Blue
      case 'NT':
        return 'border-l-6 border-yellow-600 bg-yellow-900/20 hover:bg-yellow-800/30'; // Outback Gold
      default:
        return 'border-l-6 border-gray-600 bg-gray-900/20 hover:bg-gray-800/30';     // Default Grey
    }
  };

  // Australian Remoteness Color Scheme - Green & Gold theme (subtle/classy)
  const getRemotenessStyle = (remotenessName: string) => {
    switch (remotenessName) {
      case 'Major Cities':
        return 'border-l-6 border-green-600 bg-green-900/20 hover:bg-green-800/30'; // Urban Green
      case 'Inner Regional':
        return 'border-l-6 border-green-500 bg-green-800/20 hover:bg-green-700/30'; // Regional Green
      case 'Outer Regional':
        return 'border-l-6 border-yellow-600 bg-yellow-900/20 hover:bg-yellow-800/30'; // Gold
      case 'Remote':
        return 'border-l-6 border-yellow-500 bg-yellow-800/20 hover:bg-yellow-700/30'; // Deep Gold
      case 'Very Remote':
        return 'border-l-6 border-amber-600 bg-amber-900/20 hover:bg-amber-800/30'; // Outback Amber
      default:
        return 'border-l-6 border-green-600 bg-green-900/20 hover:bg-green-800/30'; // Default Green
    }
  };

  // Debug logging whenever analysisResult changes
  useEffect(() => {
    if (analysisResult) {
      console.log('🔍 ANALYSIS RESULT STATE UPDATED:', analysisResult);
      console.log('🔍 DISASTER BREAKDOWN IN STATE:', analysisResult.disasterRiskBreakdown);
      console.log('🔍 VALUES BEING DISPLAYED:', {
        active: analysisResult.disasterRiskBreakdown.active,
        high: analysisResult.disasterRiskBreakdown.high,
        medium: analysisResult.disasterRiskBreakdown.medium,
        low: analysisResult.disasterRiskBreakdown.low,
        none: analysisResult.disasterRiskBreakdown.none
      });
    } else {
      console.log('🔍 ANALYSIS RESULT IS NULL/UNDEFINED');
    }
  }, [analysisResult]);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [clinicName, setClinicName] = useState('');
  const [pasteInput, setPasteInput] = useState('');
  const { toast } = useToast();
  const { user } = useOutsetaUser();

  // File upload handler
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const postcodes = text
        .split(/[,\n\r\s]+/)
        .map(p => p.trim())
        .filter(p => /^\d{4}$/.test(p));

      if (postcodes.length === 0) {
        toast({
          title: 'Invalid File',
          description: 'No valid 4-digit Australian postcodes found',
          variant: 'destructive'
        });
        return;
      }

      if (postcodes.length > 10000) {
        toast({
          title: 'Too Many Postcodes',
          description: 'Professional tier supports up to 10,000 postcodes',
          variant: 'destructive'
        });
        return;
      }

      setPostcodeData({
        postcodes: postcodes,
        totalRecords: postcodes.length,
        uploadMethod: file.name.endsWith('.csv') ? 'csv' : 'text'
      });

      toast({
        title: 'Upload Successful',
        description: `${postcodes.length} postcodes loaded for analysis`
      });
    };
    reader.readAsText(file);
  };

  // Manual postcode input
  const handleManualInput = (text: string) => {
    const postcodes = text
      .split(/[,\n\r\s]+/)
      .map(p => p.trim())
      .filter(p => /^\d{3,4}$/.test(p));

    if (postcodes.length === 0) {
      toast({
        title: 'Invalid Input',
        description: 'No valid Australian postcodes found. Please paste 3-4 digit postcodes from Excel or data dump.',
        variant: 'destructive'
      });
      return;
    }

    if (postcodes.length > 10000) {
      toast({
        title: 'Too Many Postcodes',
        description: 'Professional tier supports up to 10,000 postcodes',
        variant: 'destructive'
      });
      return;
    }

    setPostcodeData({
      postcodes: postcodes,
      totalRecords: postcodes.length,
      uploadMethod: 'text'
    });

    // Clear the input after successful processing
    setPasteInput('');

    toast({
      title: 'Postcodes Loaded',
      description: `${postcodes.length} postcodes ready for analysis`
    });
  };

  // Run professional tier analysis
  const runAnalysis = async () => {
    if (!postcodeData || !clinicName) {
      toast({
        title: 'Missing Information',
        description: 'Please enter clinic name and upload postcode data',
        variant: 'destructive'
      });
      return;
    }

    setIsAnalysing(true);

    // Show processing notification for all analyses
    toast({
      title: 'Analysis in Progress',
      description: `Processing ${postcodeData.postcodes.length} postcodes individually for maximum accuracy. Please wait while we check each location against current disaster declarations...`,
      duration: postcodeData.postcodes.length > 100 ? 15000 : 8000
    });

    try {
      console.log('🚀 STARTING PROFESSIONAL ANALYSIS');
      console.log('📊 Input data:', {
        postcodesCount: postcodeData.postcodes.length,
        clinicName: clinicName,
        firstFewPostcodes: postcodeData.postcodes.slice(0, 5)
      });

      // Call edge function via Supabase client (no hardcoded keys)
      const { data, error } = await supabase.functions.invoke('enhanced-clinic-analysis-v2', {
        body: {
          postcodes: postcodeData.postcodes,
          clinicName: clinicName
        }
      });

      if (error) {
        console.error('🚨 EDGE FUNCTION ERROR:', error);
        throw new Error(error.message || 'Edge function failed');
      }
      console.log('📥 RAW EDGE FUNCTION RESPONSE:', { data });

      // Transform the enhanced-clinic-analysis-v2 response to match expected format
      const transformedData: AnalysisResult = {
        totalPatients: data.totalAnalyzed || 0,
        eligibilityRate: data.eligiblePercentage || 0,
        totalActiveDisasters: data.totalActiveDisasters || 0, // Total count of open disasters
        totalEligiblePatients: data.totalEligiblePatients || 0, // Total eligible patients
        nationalRemotenessBreakdown: data.nationalRemotenessBreakdown || {
          'Major Cities': 0,
          'Inner Regional': 0,
          'Outer Regional': 0,
          'Remote': 0,
          'Very Remote': 0
        },
        disasterRiskBreakdown: {
          active: data.timeBasedAnalysis?.within12Months?.count || 0,
          high: data.timeBasedAnalysis?.between12And24Months?.count || 0,
          medium: data.timeBasedAnalysis?.over24Months?.count || 0,
          low: 0, // No longer used
          none: data.ineligibleCount || 0
        },
        timeBasedAnalysis: data.timeBasedAnalysis,
        stateDistribution: data.stateBreakdown || {}, // Use stateBreakdown directly - contains remoteness data
        remotenessDistribution: {
          'Major Cities': data.demographicAnalysis?.geographic_distribution?.major_cities || 0,
          'Inner Regional': data.demographicAnalysis?.geographic_distribution?.inner_regional || 0,
          'Outer Regional': data.demographicAnalysis?.geographic_distribution?.outer_regional || 0,
          'Remote': data.demographicAnalysis?.geographic_distribution?.remote || 0,
          'Very Remote': data.demographicAnalysis?.geographic_distribution?.very_remote || 0
        },
        analysedAt: data.analysisDate || new Date().toISOString(),
        // Include original data for debugging
        ...data
      };

      console.log('🔄 TRANSFORMED DATA:', transformedData);
      console.log('📈 DISASTER RISK BREAKDOWN TRANSFORMED:', transformedData.disasterRiskBreakdown);
      console.log('🎯 ELIGIBILITY RATE TRANSFORMED:', transformedData.eligibilityRate);

      console.log('💾 SETTING ANALYSIS RESULT:', transformedData);
      setAnalysisResult(transformedData);

      toast({
        title: 'Analysis Complete',
        description: `Analysed ${transformedData.totalPatients} patients across ${Object.keys(transformedData.stateDistribution || {}).length} states`
      });

    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        title: 'Analysis Failed',
        description: error instanceof Error ? error.message : 'Unable to complete analysis',
        variant: 'destructive'
      });
    } finally {
      setIsAnalysing(false);
    }
  };

  // Save Report
  const saveReport = async () => {
    const userEmail = user?.Email || user?.email || '';
    if (!analysisResult || !clinicName || !userEmail) {
      toast({
        title: 'Save Failed',
        description: 'Please ensure you are logged in and have completed an analysis',
        variant: 'destructive'
      });
      return;
    }

    setIsSaving(true);

    try {
      const saveResult = await saveClinicReport(
        clinicName,
        analysisResult,
        userEmail
      );

      if (saveResult.success) {
        toast({
          title: 'Report Saved Successfully',
          description: 'Your clinic analysis has been saved to your profile for PSR compliance'
        });
      } else {
        throw new Error(saveResult.error);
      }
    } catch (error) {
      toast({
        title: 'Save Failed',
        description: error instanceof Error ? error.message : 'Failed to save report',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Export PDF using Supabase Edge Function + PDFShift API
  const exportPDF = () => {
    if (!analysisResult || !clinicName) return;

    try {
      toast({
        title: 'Generating PDF',
        description: 'Creating your professional clinic analysis report...',
      });

      // Use simple jsPDF generator (same as Reports page)
      // This generates the PDF instantly in the browser
      generateSimplePDF(clinicName, analysisResult, false);

      toast({
        title: 'PDF Downloaded',
        description: 'Your clinic analysis report has been saved to your downloads',
      });

    } catch (error) {
      console.error('❌ PDF generation failed:', error);
      toast({
        title: 'PDF Export Failed',
        description: `Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive'
      });
    }
  };

  // Reset analysis
  const resetAnalysis = () => {
    setPostcodeData(null);
    setAnalysisResult(null);
    setClinicName('');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 bg-slate-900 min-h-screen">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <FileBarChart className="h-8 w-8" />
          Professional Clinic Analysis
        </h1>
        <p className="text-slate-300">
          For ONE INDIVIDUAL PRACTITIONER or ONE CLINIC with ONE PRACTITIONER • Single-page data analysis • Up to 10,000 patient postcodes
        </p>
      </div>

      {!analysisResult ? (
        /* Setup Phase */
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Clinic Information */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <MapPin className="h-5 w-5" />
                Practice Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-200">
                  Clinic/Practice Name
                </label>
                <input
                  type="text"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  placeholder="Enter your practice name"
                  className="w-full p-3 border border-slate-600 rounded-lg bg-slate-700 text-white placeholder-slate-400"
                />
              </div>
            </CardContent>
          </Card>

          {/* Postcode Upload */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Upload className="h-5 w-5" />
                Patient Postcodes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-200">
                  Upload CSV/Text File
                </label>
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  className="w-full p-3 border border-slate-600 rounded-lg bg-slate-700 text-white"
                />
              </div>
              <div className="text-center">
                <span className="text-sm text-slate-400">or</span>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-200">
                  Paste Postcodes (from Excel, CSV, or any format)
                </label>
                <textarea
                  value={pasteInput}
                  onChange={(e) => setPasteInput(e.target.value)}
                  placeholder="Paste from Excel or data dump:&#10;&#10;4503&#10;2304&#10;5068&#10;820&#10;3922&#10;&#10;Any format works - line breaks, spaces, commas!"
                  className="w-full p-3 border border-slate-600 rounded-lg bg-slate-700 text-white placeholder-slate-400 h-20"
                />
                <Button
                  onClick={() => pasteInput.trim() && handleManualInput(pasteInput)}
                  disabled={!pasteInput.trim() || isAnalysing}
                  className="w-full mt-3"
                >
                  {isAnalysing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing Postcodes...
                    </>
                  ) : (
                    <>
                      <Users className="mr-2 h-4 w-4" />
                      Analyze Patient Population
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {/* Data Summary */}
      {postcodeData && !analysisResult && (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <CheckCircle className="h-6 w-6 text-green-400" />
                <div>
                  <h3 className="font-semibold text-white">Ready for Analysis</h3>
                  <p className="text-sm text-slate-300">
                    {postcodeData.totalRecords} patient postcodes loaded • Each postcode = one patient's address (no deduplication)
                  </p>
                </div>
              </div>
              <Button
                onClick={runAnalysis}
                disabled={isAnalysing || !clinicName}
                className="bg-red-600 hover:bg-red-700"
              >
                {isAnalysing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing Individual Postcodes...
                  </>
                ) : (
                  <>
                    <FileBarChart className="h-4 w-4 mr-2" />
                    Run Analysis
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Results - Single Page Display */}
      {analysisResult && (
        <div className="space-y-6" id="professional-report">
          {/* Report Header */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <img
                  src="https://pkixezdlbmzntwekchoq.supabase.co/storage/v1/object/public/URL's/telecheckFAVICON.png"
                  alt="TeleCheck"
                  className="h-12 w-12"
                />
                <div>
                  <CardTitle className="text-2xl text-white">{clinicName}</CardTitle>
                  <p className="text-slate-300">
                    Professional Clinic Analysis Report • {new Date(analysisResult.analysedAt || analysisResult.analysisDate || new Date()).toLocaleDateString('en-AU')}
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Key Metrics Grid */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                <div className="text-2xl font-bold text-white">{analysisResult.totalPatients || 0}</div>
                <div className="text-sm text-slate-300">Total Patients</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4 text-center">
                <Shield className="h-8 w-8 mx-auto mb-2 text-green-400" />
                <div className="text-2xl font-bold text-white">{analysisResult.eligibilityRate || 0}%</div>
                <div className="text-sm text-slate-300">Telehealth Eligible</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4 text-center">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-red-400" />
                <div className="text-2xl font-bold text-white">{analysisResult.totalActiveDisasters || 0}</div>
                <div className="text-sm text-slate-300">Active Disasters - Total in Australia</div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4 text-center">
                <MapPin className="h-8 w-8 mx-auto mb-2 text-purple-400" />
                <div className="text-2xl font-bold text-white">{analysisResult.totalEligiblePatients || 0}</div>
                <div className="text-sm text-slate-300">Total Eligible</div>
              </CardContent>
            </Card>
          </div>

          {/* Time since Disaster - DATA ONLY */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Clock className="h-5 w-5" />
                Time since Disaster (Eligible Patients Only)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Badge variant="secondary" className="mb-2 bg-blue-700 text-blue-100">Within 12 Months</Badge>
                  <div className="text-2xl font-bold text-white">{analysisResult.timeBasedAnalysis?.within12Months?.count || 0}</div>
                  <div className="text-xs text-slate-300">
                    {analysisResult.timeBasedAnalysis?.within12Months?.percentage || 0}% of eligible
                  </div>
                </div>
                <div className="text-center">
                  <Badge variant="secondary" className="mb-2 bg-orange-700 text-orange-100">1-2 Years</Badge>
                  <div className="text-2xl font-bold text-white">{analysisResult.timeBasedAnalysis?.between12And24Months?.count || 0}</div>
                  <div className="text-xs text-slate-300">
                    {analysisResult.timeBasedAnalysis?.between12And24Months?.percentage || 0}% of eligible
                  </div>
                </div>
                <div className="text-center">
                  <Badge variant="secondary" className="mb-2 bg-slate-600 text-slate-100">Over 2 Years</Badge>
                  <div className="text-2xl font-bold text-white">{analysisResult.timeBasedAnalysis?.over24Months?.count || 0}</div>
                  <div className="text-xs text-slate-300">
                    {analysisResult.timeBasedAnalysis?.over24Months?.percentage || 0}% of eligible
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-600">
                <div className="text-center">
                  <div className="text-sm text-slate-300">
                    Total: {(analysisResult.timeBasedAnalysis?.within12Months?.count || 0) +
                             (analysisResult.timeBasedAnalysis?.between12And24Months?.count || 0) +
                             (analysisResult.timeBasedAnalysis?.over24Months?.count || 0)} eligible patients
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Time since Disaster Disclaimer */}
          <Card className="bg-amber-900 border-amber-700">
            <CardContent className="p-4">
              <div className="flex items-start gap-2">
                <Clock className="h-5 w-5 text-amber-300 mt-0.5" />
                <div className="text-sm text-amber-100">
                  <strong>Audit Documentation Guidance:</strong> Time since disaster commencement affects Medicare audit documentation requirements.
                  Recent disasters (&lt;12 months) typically require routine documentation, while longer periods may require enhanced clinical justification and continuity-of-care evidence.
                </div>
              </div>
            </CardContent>
          </Card>

          {/* State Distribution - Full Width with Australian State Colors */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <MapPin className="h-5 w-5" />
                State Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {analysisResult?.stateDistribution && Object.entries(analysisResult.stateDistribution)
                  .filter(([, stateData]) => (typeof stateData === 'object' && stateData?.total > 0))
                  .sort(([,a], [,b]) => (b as any).total - (a as any).total)
                  .map(([state, stateData]) => {
                    const data = stateData as any;
                    const percentage = (analysisResult.totalPatients || 0) > 0 ?
                      ((data.total / (analysisResult.totalPatients || 1)) * 100).toFixed(1) : '0';


                    return (
                      <div
                        key={state}
                        className={`${getStateStyle(state)} pl-6 pr-4 py-4 rounded-r-lg transition-all duration-300 hover:shadow-lg space-y-3`}
                      >
                        {/* State Header with Total */}
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-xl">{state}</span>
                          <div className="text-right">
                            <div className="font-bold text-white text-lg">{data.total} Total</div>
                            <div className="text-sm text-slate-300">({percentage}% of patients)</div>
                          </div>
                        </div>

                        {/* Disaster Eligible Count */}
                        <div className="flex items-center justify-between pl-4 py-2 bg-green-900/20 rounded">
                          <span className="text-green-400 font-medium">Disaster Eligible</span>
                          <span className="font-semibold text-green-400 text-lg">{data.eligible || 0}</span>
                        </div>

                        {/* Remoteness Breakdown */}
                        {data.remoteness && (
                          <div className="pl-4 space-y-2 bg-slate-700/30 rounded p-3">
                            <div className="text-sm font-medium text-slate-200 mb-2">Remoteness Breakdown:</div>
                            {Object.entries(data.remoteness)
                              .filter(([, count]) => (count as number) > 0)
                              .map(([category, count]) => (
                                <div key={category} className="flex items-center justify-between text-sm py-1">
                                  <span className="text-slate-300 pl-2">• {category}</span>
                                  <span className="text-white font-medium">{count as number}</span>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    );
                  })}

                {(!analysisResult?.stateDistribution || Object.keys(analysisResult.stateDistribution).length === 0) && (
                  <div className="text-red-400 font-bold">NO STATE DISTRIBUTION DATA FOUND</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Australia Summary - National Remoteness Breakdown */}
          <Card className="bg-slate-800 border-2 border-green-600/30 bg-gradient-to-r from-green-900/10 to-yellow-900/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <MapPin className="h-5 w-5 text-green-400" />
                Australia Summary - Remoteness Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysisResult?.nationalRemotenessBreakdown && Object.entries(analysisResult.nationalRemotenessBreakdown)
                  .sort(([a], [b]) => {
                    // Sort by remoteness order: Major Cities first, Very Remote last
                    const order = ['Major Cities', 'Inner Regional', 'Outer Regional', 'Remote', 'Very Remote'];
                    return order.indexOf(a) - order.indexOf(b);
                  })
                  .map(([remotenessName, count]) => {
                    const percentage = (analysisResult.totalPatients || 0) > 0 ?
                      ((count / (analysisResult.totalPatients || 1)) * 100).toFixed(1) : '0';

                    return (
                      <div
                        key={remotenessName}
                        className={`${getRemotenessStyle(remotenessName)} pl-6 pr-4 py-3 rounded-r-lg transition-all duration-300 hover:shadow-lg`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white text-lg">{remotenessName}</span>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-white">{count}</div>
                            <div className="text-sm text-slate-300">{percentage}% of patients</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                {(!analysisResult?.nationalRemotenessBreakdown ||
                  Object.values(analysisResult.nationalRemotenessBreakdown).every(count => count === 0)) && (
                  <div className="text-amber-400 font-bold text-center py-4">
                    NO REMOTENESS DATA AVAILABLE
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button
              onClick={saveReport}
              disabled={isSaving || !(user?.Email || user?.email)}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Report
                </>
              )}
            </Button>
            <Button onClick={exportPDF} className="bg-red-600 hover:bg-red-700">
              <Download className="h-4 w-4 mr-2" />
              Download PDF Report
            </Button>
            <Button onClick={resetAnalysis} variant="outline">
              <FileBarChart className="h-4 w-4 mr-2" />
              New Analysis
            </Button>
          </div>

          {/* Data Disclaimer */}
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-slate-400 mt-0.5" />
                <div className="text-sm text-slate-300">
                  <strong>Data Analysis Only:</strong> This report provides factual data analysis based on Australian Government disaster declarations and postcode classifications.
                  No financial, medical, or business advice is provided. Data reflects the analysis date of {new Date(analysisResult.analysedAt || analysisResult.analysisDate || new Date()).toLocaleDateString('en-AU')}.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
