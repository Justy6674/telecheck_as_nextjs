/**
 * Clinic Analysis Type Definitions
 * Used by ClinicAnalysisFilter and related components
 */

export interface MetricSelection {
  geographic: Set<string>;
  medicare: Set<string>;
  operations: Set<string>;
  business: Set<string>;
}

export interface FilterConfiguration {
  selectedMetrics: MetricSelection;
  practitioners?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface WizardData {
  clinicName: string;
  ownerName?: string;
  ownerTitle?: 'Dr' | 'Ms' | 'Mr' | 'Professor' | 'Other';
  practiceStructure?: 'solo' | 'group_2_5' | 'group_6_15' | 'group_16_plus';
  serviceModel?: 'telehealth_only' | 'mixed' | 'in_person_only';
  patientCount?: number;
  analysisScope?: 'full_clinic' | 'sample_patients';
}

export interface PracticeConfig {
  practitioners?: Array<{ id: string; name: string }>;
  clinicName?: string;
  serviceModel?: string;
}

export interface AnalysisResult {
  // Core metrics
  totalAnalyzed: number;
  eligibleCount: number;
  ineligibleCount: number;
  eligiblePercentage: number;
  
  // Metric categories
  geographic_metrics?: Record<string, any>;
  medicare_metrics?: Record<string, any>;
  operations_metrics?: Record<string, any>;
  business_metrics?: Record<string, any>;
  
  // Additional data from edge function
  [key: string]: any;
}
