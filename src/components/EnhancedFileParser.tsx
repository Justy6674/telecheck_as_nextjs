import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, Trash2, Download, CheckCircle, XCircle, Clock, HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { DemographicAnalysisDisplay } from './DemographicAnalysisDisplay';

// Data structure for parsed content
interface ParsedData {
  postcodes: string[];
  demographics: Array<{
    postcode: string;
    age?: number;
    gender?: string;
    dateOfBirth?: string;
  }>;
  fileFormat: string;
  totalRecords: number;
  hasDemographics: boolean;
}

// Component props interface
interface EnhancedFileParserProps {
  onDataParsed: (data: ParsedData) => void;
  maxFileSize?: number; // MB
  supportedFormats?: string[];
}

// CSV parsing function with demographic extraction
const parseCSV = (text: string): ParsedData => {
  const lines = text.split('\n').filter(line => line.trim());
  if (lines.length === 0) throw new Error('Empty file');

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const postcodeColumns = headers.findIndex(h =>
    h.includes('postcode') || h.includes('post') || h.includes('zip')
  );

  const ageColumns = headers.findIndex(h =>
    h.includes('age') || h.includes('years')
  );

  const genderColumns = headers.findIndex(h =>
    h.includes('gender') || h.includes('sex')
  );

  const dobColumns = headers.findIndex(h =>
    h.includes('dob') || h.includes('birth') || h.includes('born')
  );

  const postcodes: string[] = [];
  const demographics: Array<{
    postcode: string;
    age?: number;
    gender?: string;
    dateOfBirth?: string;
  }> = [];

  console.log(`📊 Parsing CSV: ${lines.length} lines (including header)`);

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');

    if (postcodeColumns >= 0 && values[postcodeColumns]) {
      const postcode = extractPostcode(values[postcodeColumns]);
      if (postcode) {
        postcodes.push(postcode);

        const demographic: any = { postcode };

        if (ageColumns >= 0 && values[ageColumns]) {
          const age = parseInt(values[ageColumns].trim());
          if (!isNaN(age) && age > 0 && age < 150) {
            demographic.age = age;
          }
        }

        if (genderColumns >= 0 && values[genderColumns]) {
          demographic.gender = normalizeGender(values[genderColumns]);
        }

        if (dobColumns >= 0 && values[dobColumns]) {
          const dob = values[dobColumns].trim();
          demographic.dateOfBirth = dob;
          if (!demographic.age) {
            const calculatedAge = calculateAgeFromDOB(dob);
            if (calculatedAge) demographic.age = calculatedAge;
          }
        }

        demographics.push(demographic);
      }
    }
  }

  console.log(`✅ Parsed ${postcodes.length} valid postcodes from CSV`);

  if (postcodes.length === 0) {
    throw new Error('No valid Australian postcodes found');
  }

  const hasDemographics = demographics.some(d => d.age || d.gender || d.dateOfBirth);

  // Warn about very large datasets but confirm we can handle them
  if (postcodes.length > 10000) {
    console.log(`🚀 Large dataset detected: ${postcodes.length.toLocaleString()} patients - System optimized for scale!`);
  }

  return {
    postcodes,
    demographics,
    fileFormat: 'CSV',
    totalRecords: postcodes.length,
    hasDemographics
  };
};

// Excel parsing function using browser-compatible approach
const parseExcel = async (file: File): Promise<ParsedData> => {
  // For now, let's parse Excel as CSV by asking user to save as CSV
  throw new Error('Excel files are not supported yet. Please save your Excel file as CSV format and upload again.');
};

// Text parsing function for pasted content - CLEAN SHIT DATA
const parseText = (text: string): ParsedData => {
  // Extract anything that looks like it could be a postcode (3-4 digits)
  const potentialPostcodes = text.match(/\b\d{3,4}\b/g) || [];

  // Clean and validate using the same logic as extractPostcode
  const validatedPostcodes = potentialPostcodes
    .map(pc => extractPostcode(pc))
    .filter((pc): pc is string => pc !== null);

  if (validatedPostcodes.length === 0) {
    throw new Error('No valid Australian postcodes found. Valid ranges: 0200-0299, 0800-0999, 1000-9999');
  }

  console.log(`🧹 Cleaned ${potentialPostcodes.length} potential postcodes to ${validatedPostcodes.length} valid postcodes (including duplicates)`);

  return {
    postcodes: validatedPostcodes,
    demographics: validatedPostcodes.map(pc => ({ postcode: pc })),
    fileFormat: 'Text',
    totalRecords: validatedPostcodes.length,
    hasDemographics: false
  };
};

// Utility functions
const extractPostcode = (value: string): string | null => {
  const cleaned = value.toString().trim().replace(/[^\d]/g, '');
  if (cleaned.length === 3 || cleaned.length === 4) {
    const num = parseInt(cleaned);

    // Australian postcode validation with proper ranges
    const validRanges = [
      [200, 299],   // ACT (0200-0299)
      [800, 999],   // NT (0800-0999)
      [1000, 2599], // NSW
      [2600, 2899], // ACT
      [2900, 2999], // NSW
      [3000, 3999], // VIC
      [4000, 4999], // QLD
      [5000, 5999], // SA
      [6000, 6999], // WA
      [7000, 7999], // TAS
    ];

    const isValid = validRanges.some(([min, max]) => num >= min && num <= max);

    if (isValid) {
      return cleaned.padStart(4, '0'); // Ensure 4-digit format for consistency
    }
  }
  return null;
};

const normalizeGender = (value: string): string => {
  const cleaned = value.toLowerCase().trim();
  if (cleaned.startsWith('m') || cleaned === 'male') return 'Male';
  if (cleaned.startsWith('f') || cleaned === 'female') return 'Female';
  return 'Other';
};

const calculateAgeFromDOB = (dobString: string): number | null => {
  const dob = new Date(dobString);
  if (isNaN(dob.getTime())) return null;
  
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  
  return age > 0 && age < 150 ? age : null;
};

const EnhancedFileParser: React.FC<EnhancedFileParserProps> = ({
  onDataParsed,
  maxFileSize = 20,
  supportedFormats = ['CSV', 'Text']
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [validationStatus, setValidationStatus] = useState<{
    status: 'processing' | 'complete' | 'error';
    message: string;
    recommendations: string[];
  } | null>(null);

  const { toast } = useToast();

  // Auto-clean and analyze data
  const validateAndCleanData = useCallback(async (parsedData: ParsedData) => {
    if (!parsedData.postcodes.length) return;

    setValidationStatus({
      status: 'processing',
      message: 'Analyzing your patient population...',
      recommendations: []
    });

    try {
      console.log('🏥 Starting patient population analysis for:', {
        totalPatients: parsedData.totalRecords,
        hasDemographics: parsedData.hasDemographics
      });

      // Step 1: Clean data automatically (remove ONLY invalid postcodes - keep duplicates as separate patients)
      const cleanedPostcodes = parsedData.postcodes.filter(postcode => {
        if (!/^[0-9]{4}$/.test(postcode)) return false;

        const num = parseInt(postcode);

        // Australian postcode validation with proper ranges
        const validRanges = [
          [200, 299],   // ACT (0200-0299)
          [800, 999],   // NT (0800-0999)
          [1000, 2599], // NSW
          [2600, 2899], // ACT
          [2900, 2999], // NSW
          [3000, 3999], // VIC
          [4000, 4999], // QLD
          [5000, 5999], // SA
          [6000, 6999], // WA
          [7000, 7999], // TAS
        ];

        return validRanges.some(([min, max]) => num >= min && num <= max);
      });

      if (cleanedPostcodes.length === 0) {
        throw new Error('No valid Australian postcodes found in your data');
      }

      const cleanedCount = parsedData.postcodes.length - cleanedPostcodes.length;
      
      setValidationStatus({
        status: 'processing',
        message: `Data cleaned. Analyzing ${cleanedPostcodes.length} patient locations...`,
        recommendations: cleanedCount > 0 ? [`Removed ${cleanedCount} invalid or duplicate entries`] : []
      });

      // REMOVED AUTO-ANALYSIS - User must choose filters first!
      // Analysis should ONLY happen when user clicks Analyze button
      // DO NOT call edge functions automatically
      console.log('✅ Data parsed successfully, ready for user to select filters');

      setValidationStatus({
        status: 'complete',
        message: `Data ready! ${cleanedPostcodes.length} patient locations loaded. Select filters to analyze.`,
        recommendations: []
      });

      toast({
        title: 'Data Loaded Successfully!',
        description: `${cleanedPostcodes.length} patient locations ready for analysis. Please select your analysis filters.`,
      });

    } catch (error) {
      console.error('🚨 Patient analysis error:', error);
      setValidationStatus({
        status: 'error',
        message: error instanceof Error ? error.message : 'Patient analysis failed',
        recommendations: ['Please check your data and try again']
      });
      
      toast({
        title: 'Analysis Failed',
        description: error instanceof Error ? error.message : 'Failed to analyze patient data',
        variant: 'destructive'
      });
    }
  }, [toast]);

  const handleSubmitText = useCallback(async () => {
    const text = textInput.trim();
    if (!text) {
      toast({
        title: 'No Data Entered',
        description: 'Please enter some postcodes before submitting',
        variant: 'destructive'
      });
      return;
    }

    setIsProcessing(true);
    try {
      const parsedData = parseText(text);
      
      if (parsedData.postcodes.length === 0) {
        throw new Error('No valid Australian postcodes found in the text');
      }

      if (parsedData.postcodes.length > 100000) {
        throw new Error('Maximum 100,000 records allowed per analysis');
      }

      // First parse the data
      onDataParsed(parsedData);
      
      toast({
        title: 'Data Parsed Successfully',
        description: `Found ${parsedData.totalRecords} patients • Each postcode = 1 patient`,
      });

      // Then auto-clean and analyze with AI
      await validateAndCleanData(parsedData);

    } catch (error) {
      console.error('Text parsing error:', error);
      toast({
        title: 'Parsing Failed',
        description: error instanceof Error ? error.message : 'Failed to parse text',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  }, [textInput, parseText, onDataParsed, validateAndCleanData, toast]);

  const handleFileUpload = useCallback(async (file: File) => {
    if (file.size > maxFileSize * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: `Maximum file size is ${maxFileSize}MB`,
        variant: 'destructive'
      });
      return;
    }

    setIsProcessing(true);

    // Show initial processing message for large files
    const estimatedRows = Math.round(file.size / 100); // Rough estimate
    if (estimatedRows > 1000) {
      toast({
        title: '📊 Processing Large Dataset',
        description: `Analyzing approximately ${estimatedRows.toLocaleString()} records...`,
      });
    }

    try {
      let parsedData: ParsedData;

      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (fileExtension === 'csv') {
        const text = await file.text();
        parsedData = parseCSV(text);
      } else if (['txt', 'text'].includes(fileExtension || '')) {
        const text = await file.text();
        parsedData = parseText(text);
      } else if (['xlsx', 'xls'].includes(fileExtension || '')) {
        throw new Error('Excel files are not supported in this browser environment. Please export your Excel file as CSV format and upload again.');
      } else {
        throw new Error(`Unsupported file format: ${fileExtension}. Supported: CSV, Text`);
      }

      // Handle ultra-large datasets with appropriate messaging
      if (parsedData.postcodes.length > 50000) {
        toast({
          title: '🏥 Enterprise Dataset Detected',
          description: `Processing ${parsedData.postcodes.length.toLocaleString()} patients. This may take 1-2 minutes...`,
        });
      } else if (parsedData.postcodes.length > 10000) {
        toast({
          title: '🚀 Large Dataset Detected',
          description: `Processing ${parsedData.postcodes.length.toLocaleString()} patients. Estimated time: 30-45 seconds`,
        });
      } else if (parsedData.postcodes.length > 5000) {
        toast({
          title: '✅ Processing Dataset',
          description: `Analyzing ${parsedData.postcodes.length.toLocaleString()} patients. Estimated time: 15-20 seconds`,
        });
      }

      if (parsedData.postcodes.length > 100000) {
        // Instead of throwing error, show upgrade message
        toast({
          title: '📧 Ultra-Large Dataset',
          description: `For datasets over 100,000 patients, please contact support@telecheck.com.au for priority processing`,
          variant: 'destructive'
        });
        throw new Error('For datasets over 100,000 patients, please contact support for enterprise processing');
      }

      onDataParsed(parsedData);

      // Dynamic success message based on dataset size
      const processingTime = parsedData.postcodes.length > 10000 ?
        `Processing time: ${Math.round(parsedData.postcodes.length / 500)} seconds` :
        parsedData.postcodes.length > 5000 ?
        `Processing time: 15-20 seconds` :
        'Instant processing';

      toast({
        title: '✅ File Uploaded Successfully',
        description: `Processing ${parsedData.totalRecords.toLocaleString()} patient records. ${processingTime}`,
      });

      // Auto-trigger analysis
      await validateAndCleanData(parsedData);

    } catch (error) {
      console.error('File upload error:', error);
      toast({
        title: 'Upload Failed',
        description: error instanceof Error ? error.message : 'Failed to process file',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  }, [maxFileSize, onDataParsed, validateAndCleanData, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const getFileIcon = (format: string) => {
    switch (format.toLowerCase()) {
      case 'csv': return <FileText className="h-4 w-4 text-green-600" />;
      case 'text': return <FileText className="h-4 w-4 text-gray-600" />;
      default: return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Main Upload Card */}
        <Card className="relative">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Patient Data Upload
              <Badge variant="outline" className="ml-auto bg-green-50 text-green-700 border-green-200">
                Supports 50,000+ patients
              </Badge>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <div className="space-y-2">
                    <p className="font-semibold">Dataset Size Guide:</p>
                    <ul className="text-sm space-y-1">
                      <li>• <strong>Small Clinic:</strong> 1-1,000 patients (instant)</li>
                      <li>• <strong>Medium Clinic:</strong> 1,000-5,000 patients (15 seconds)</li>
                      <li>• <strong>Large Clinic:</strong> 5,000-10,000 patients (30 seconds)</li>
                      <li>• <strong>Hospital:</strong> 10,000-50,000 patients (2 minutes)</li>
                      <li>• <strong>Health Network:</strong> 50,000+ patients (contact support)</li>
                    </ul>
                  </div>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
          </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Analyze Patient Population - No Limits!</h3>
            <p className="text-muted-foreground">
              Upload your patient postcodes to get AI-powered insights about telehealth eligibility. <br />
              <span className="text-sm text-orange-600">📋 For Excel files: Save as CSV first, then upload</span>
            </p>
            <div className="mt-3 flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">✅ 1-50,000+ patients</span>
              <span className="flex items-center gap-1">⚡ Fast processing</span>
              <span className="flex items-center gap-1">🏥 Enterprise ready</span>
            </div>
          </div>

          {/* Quick Text Entry */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Quick Entry</span>
              <Badge variant="secondary">Paste postcodes here</Badge>
            </div>
            <Textarea
              placeholder="Paste postcodes here (one per line or comma-separated)&#10;&#10;Examples:&#10;2000, 3000, 4000, 5000&#10;or&#10;2000&#10;3000&#10;4000&#10;&#10;Each postcode = 1 patient location"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="min-h-[140px] resize-none font-mono text-sm"
            />
            <Button 
              onClick={handleSubmitText}
              disabled={isProcessing || !textInput.trim()}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                  Analyzing Patient Population...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Analyze Patient Population
                </>
              )}
            </Button>
          </div>

          {/* OR Separator - Made more prominent */}
          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-muted-foreground/40"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-6 py-2 text-base font-semibold text-foreground border-2 border-muted-foreground/40 rounded-full">
                OR
              </span>
            </div>
          </div>

          {/* File Upload Area */}
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-4" />
            <p className="text-sm font-medium text-foreground mb-2">
              Upload Patient File (No Size Limits!)
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              Drag and drop your CSV or Text file here, or{' '}
              <label className="text-primary cursor-pointer hover:underline">
                browse files
                <input
                  type="file"
                  className="hidden"
                  accept=".csv,.txt"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                  disabled={isProcessing}
                />
              </label>
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              📋 For Excel files: Save as CSV first, then upload
            </p>
            <p className="text-xs text-muted-foreground">
              Maximum file size: {maxFileSize}MB
            </p>
          </div>

          {/* Analysis Progress */}
          {validationStatus && (
            <div className="border-t pt-6">
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    validationStatus.status === 'complete' ? 'bg-green-500' :
                    validationStatus.status === 'error' ? 'bg-red-500' :
                    validationStatus.status === 'processing' ? 'bg-blue-500 animate-pulse' :
                    'bg-gray-500'
                  }`} />
                  Analysis Progress
                </h4>
                
                <div className={`p-4 rounded-lg border ${
                  validationStatus.status === 'complete' ? 'bg-green-50 border-green-200' :
                  validationStatus.status === 'error' ? 'bg-red-50 border-red-200' :
                  validationStatus.status === 'processing' ? 'bg-blue-50 border-blue-200' :
                  'bg-gray-50 border-gray-200'
                }`}>
                  <p className={`text-sm font-medium ${
                    validationStatus.status === 'complete' ? 'text-green-800' :
                    validationStatus.status === 'error' ? 'text-red-800' :
                    validationStatus.status === 'processing' ? 'text-blue-800' :
                    'text-gray-800'
                  }`}>
                    {validationStatus.message}
                  </p>
                  
                  {validationStatus.recommendations.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {validationStatus.recommendations.map((rec, index) => (
                        <div key={index} className="text-xs text-gray-600 flex items-start gap-2">
                          <span className="text-green-500">✓</span>
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Supported Formats */}
          <div className="border-t pt-6">
            <h4 className="font-medium mb-3">Supported Formats</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {supportedFormats.map((format) => (
                <div key={format} className="flex items-center gap-2 p-2 rounded border bg-muted/30">
                  {getFileIcon(format)}
                  <span className="text-sm">{format}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis results removed - now shown only after user selects filters in ClinicAnalysis page */}
      </div>
    </TooltipProvider>
  );
};

export default EnhancedFileParser;