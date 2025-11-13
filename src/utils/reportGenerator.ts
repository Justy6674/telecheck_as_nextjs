/**
 * Database functions for saving clinic reports
 * PDF generation is handled by Supabase Edge Functions (pdfshift-report-generator)
 */

import { supabase } from '@/integrations/supabase/client';

type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

interface AnalysisResult {
  totalPatients: number;
  totalActiveDisasters?: number;
  totalEligiblePatients?: number;
  disasterRiskBreakdown: {
    active: number;
    high: number;
    medium: number;
    low: number;
    none: number;
  };
  stateDistribution: Record<string, any>;
  enhancedStateDistribution?: Record<string, any>;
  remotenessDistribution?: Record<string, number>;
  nationalRemotenessBreakdown?: {
    'Major Cities': number;
    'Inner Regional': number;
    'Outer Regional': number;
    'Remote': number;
    'Very Remote': number;
  };
  enhancedRemotenessDistribution?: Record<string, any>;
  stateEligibleBreakdown?: Record<string, number>;
  timeBasedAnalysis?: {
    within12Months?: { count: number; percentage?: number; description?: string };
    between12And24Months?: { count: number; percentage?: number; description?: string };
    over24Months?: { count: number; percentage?: number; description?: string };
  };
  eligibilityRate: number;
  analysedAt: string;
}

/**
 * Save clinic report to saved_clinic_reports table using BULLETPROOF Outseta integration pattern
 * Handles webhook sync delays, creates missing profiles, and ensures data integrity
 */
export async function saveClinicReport(
  clinicName: string,
  analysisResult: AnalysisResult,
  userEmail: string
): Promise<{ success: boolean; error?: string }> {
  console.log('🔧 BULLETPROOF OUTSETA PATTERN - Save to saved_clinic_reports table');

  if (!userEmail) {
    return { success: false, error: 'User email is required' };
  }

  try {
    // ✅ STEP 1: Get user_id with retry logic (handles webhook sync delays)
    let profile = null;
    let retryCount = 0;
    const maxRetries = 3;

    while (!profile && retryCount < maxRetries) {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', userEmail)
        .maybeSingle();

      if (error) {
        console.error(`Attempt ${retryCount + 1}: Error fetching profile:`, error);
      }

      if (data) {
        profile = data;
        break;
      }

      retryCount++;
      if (retryCount < maxRetries) {
        console.log(`Profile not found for ${userEmail}, waiting 2s before retry ${retryCount}...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    // ✅ STEP 2: If profile still not found after retries, create it
    if (!profile) {
      console.log('⚠️ Profile not found after retries, creating one...');
      
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          email: userEmail,
          full_name: userEmail.split('@')[0], // Use email prefix as name
          account_type: 'professional',
          is_active: true
        })
        .select('id')
        .single();

      if (createError) {
        console.error('Error creating profile:', createError);
        return { success: false, error: `Failed to create profile: ${createError.message}` };
      }

      profile = newProfile;
      console.log('✅ Profile created successfully:', profile.id);
    }

    // ✅ STEP 3: Now we have a user_id, save the report
    // Match the PRODUCTION schema from types.ts (src/integrations/supabase/types.ts line 2714)
    const analysisId = `clinic_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const ineligiblePatients = (analysisResult.totalPatients || 0) - (analysisResult.totalEligiblePatients || 0);
    
    const reportData = {
      // REQUIRED fields (NOT NULL in production database)
      user_id: profile.id,
      analysis_id: analysisId, // CRITICAL: Required by production schema
      clinic_name: clinicName,
      total_patients: analysisResult.totalPatients || 0,
      eligible_patients: analysisResult.totalEligiblePatients || 0,
      ineligible_patients: ineligiblePatients, // CRITICAL: Required by production schema
      eligibility_percentage: analysisResult.eligibilityRate || 0,
      
      // Optional remoteness counts
      major_cities_count: analysisResult.nationalRemotenessBreakdown?.['Major Cities'] || 0,
      inner_regional_count: analysisResult.nationalRemotenessBreakdown?.['Inner Regional'] || 0,
      outer_regional_count: analysisResult.nationalRemotenessBreakdown?.['Outer Regional'] || 0,
      remote_count: analysisResult.nationalRemotenessBreakdown?.['Remote'] || 0,
      very_remote_count: analysisResult.nationalRemotenessBreakdown?.['Very Remote'] || 0,
      
      // Time-based analysis (optional)
      last_12_months: analysisResult.timeBasedAnalysis?.within12Months?.count || 0,
      last_2_years: analysisResult.timeBasedAnalysis?.between12And24Months?.count || 0,
      last_5_years: analysisResult.timeBasedAnalysis?.over24Months?.count || 0,
      
      // JSONB fields for complete data
      raw_data: analysisResult as unknown as Json, // CRITICAL: Complete analysis for PDF generation
      state_breakdown: (analysisResult.stateDistribution || {}) as unknown as Json,
      
      // Optional metadata
      is_starred: false,
      analysis_version: 'professional_v2',
      file_format: 'bulk_postcode_analysis'
    };

    console.log('🔍 Report data to save:', reportData);

    const { error: insertError } = await supabase
      .from('saved_clinic_reports')
      .insert(reportData);

    if (insertError) {
      console.error('Error inserting clinic report:', insertError);
      return { success: false, error: insertError.message };
    }

    console.log('✅ Report saved successfully to saved_clinic_reports table');
    return { success: true };

  } catch (error) {
    console.error('Error saving clinic report:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
