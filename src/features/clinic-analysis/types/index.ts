/**
 * Enterprise Clinic Analysis Types
 * 
 * Comprehensive type definitions for healthcare analysis system
 * Designed for scalability and data integrity
 */

// Core analysis phases
export type AnalysisPhase = 
  | 'idle' 
  | 'data-upload' 
  | 'filter-selection' 
  | 'analyzing' 
  | 'complete' 
  | 'error';

// Wizard configuration data
export interface WizardData {
  clinicName: string;
  ownerName: string;
  ownerTitle: 'Dr' | 'Ms' | 'Mr' | 'Professor' | 'Other';
  practiceStructure: 'solo' | 'group_2_5' | 'group_6_15' | 'group_16_plus';
  serviceModel: 'telehealth_only' | 'mixed' | 'in_person_only';
  patientCount: number;
  analysisScope: 'full_clinic' | 'sample_patients';
}

// Postcode data structure (optimized for large datasets)
export interface PostcodeData {
  postcodes: string[];
  totalCount: number;
  patientCount: number;
  source: 'csv' | 'manual' | 'api';
  fileName?: string;
  uploadedAt: Date;
  demographics?: {
    ageGroups?: Record<string, number>;
    genderDistribution?: Record<string, number>;
    hasGeographicData?: boolean;
  };
}

// Filter configuration for analysis customization
export interface FilterConfiguration {
  selectedMetrics: AnalysisMetric[];
  geographicFilters: {
    includeRemoteness: boolean;
    includeStateBreakdown: boolean;
    includeLgaAnalysis: boolean;
  };
  timeFilters: {
    includeHistoricalData: boolean;
    timeRange: '12_months' | '2_years' | '5_years' | 'all_time';
  };
  reportOptions: {
    includeCharts: boolean;
    includeDetailedBreakdown: boolean;
    exportFormat: 'pdf' | 'csv' | 'excel';
  };
}

// Analysis metric categories (40 total metrics)
export interface AnalysisMetric {
  id: string;
  category: 'geographic' | 'medicare' | 'operations' | 'business';
  name: string;
  description: string;
  computationWeight: 'light' | 'medium' | 'heavy';
  requiresHistoricalData: boolean;
}

// Comprehensive analysis result structure
export interface AnalysisResult {
  // Metadata
  analysisId: string;
  timestamp: Date;
  clinicInfo: WizardData;
  
  // Core metrics
  patientSummary: {
    totalPatients: number;
    totalEligible: number;
    totalIneligible: number;
    eligibilityRate: number;
  };
  
  // Geographic analysis
  geographicDistribution: {
    stateBreakdown: Record<string, number>;
    remotenessBreakdown: Record<string, number>;
    lgaDistribution: Record<string, number>;
    topPostcodes: Array<{
      postcode: string;
      patientCount: number;
      eligibleCount: number;
    }>;
  };
  
  // Time-based analysis
  timeBasedAnalysis: {
    eligibilityTrends: Record<string, number>;
    disasterImpactTimeline: Array<{
      period: string;
      eligiblePatients: number;
      majorDisasters: string[];
    }>;
  };
  
  // Medicare analysis
  medicareAnalysis: {
    activeDisasters: Array<{
      agrn: string;
      title: string;
      affectedPatients: number;
    }>;
    complianceRisk: 'low' | 'medium' | 'high';
    auditReadiness: number; // percentage
  };
  
  // Business metrics
  businessMetrics: {
    marketPenetration: number;
    growthOpportunities: string[];
    competitivePosition: 'strong' | 'moderate' | 'weak';
    strategicRecommendations: string[];
  };
  
  // Raw data for detailed analysis
  rawData: {
    individualPostcodeResults: Array<{
      postcode: string;
      isEligible: boolean;
      disasters: any[];
      suburb: string;
      state: string;
      lga: string;
    }>;
    processingStats: {
      totalProcessingTime: number;
      memoryUsage: number;
      databaseQueries: number;
    };
  };
}

// Main application state
export interface ClinicAnalysisState {
  phase: AnalysisPhase;
  wizardData: WizardData | null;
  postcodeData: PostcodeData | null;
  filters: FilterConfiguration | null;
  result: AnalysisResult | null;
  progress: number;
  error: string | null;
  isProcessing: boolean;
}

// Database function parameters
export interface DatabaseAnalysisParams {
  p_postcodes: string[];
  p_clinic_name: string;
  p_filters?: FilterConfiguration;
  p_user_id?: string;
}

// Performance monitoring
export interface PerformanceMetrics {
  startTime: number;
  endTime: number;
  totalRecords: number;
  memoryPeak: number;
  databaseCalls: number;
  cacheHits: number;
  errors: string[];
}