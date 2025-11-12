import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Upload, 
  Settings, 
  AlertCircle, 
  CheckCircle,
  BarChart3,
  Users,
  MapPin
} from 'lucide-react';

import { DataUploadZone } from './DataUploadZone';
import { MetricsSelector } from './MetricsSelector';
import { ClinicAnalysisResults } from '@/components/clinic/ClinicAnalysisResults';
import type { ClinicAnalysisState } from '../types';

interface ClinicDashboardProps {
  analysisState: ClinicAnalysisState;
  onNewAnalysis: () => void;
  onStartAnalysis: (postcodeData: any, filters: any) => void;
}

/**
 * Enterprise Clinic Analysis Dashboard
 * 
 * Main operational interface for:
 * - Data upload (CSV processing)
 * - Metrics selection (40 available metrics)
 * - Analysis execution and monitoring
 * - Results visualization and export
 */
export const ClinicDashboard: React.FC<ClinicDashboardProps> = ({
  analysisState,
  onNewAnalysis,
  onStartAnalysis
}) => {
  const { phase, wizardData, isProcessing, progress, error, result } = analysisState;

  const renderPhaseContent = () => {
    switch (phase) {
      case 'data-upload':
        return (
          <div className="grid gap-6">
            {/* Clinic Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Clinic Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Clinic:</span> {wizardData?.clinicName}
                  </div>
                  <div>
                    <span className="font-medium">Owner:</span> {wizardData?.ownerTitle} {wizardData?.ownerName}
                  </div>
                  <div>
                    <span className="font-medium">Structure:</span> {wizardData?.practiceStructure?.replace('_', ' ')}
                  </div>
                  <div>
                    <span className="font-medium">Patients:</span> {wizardData?.patientCount?.toLocaleString()}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Upload */}
            <DataUploadZone 
              expectedCount={wizardData?.patientCount || 0}
              onDataUploaded={(data) => {
                // Move to filter selection
              }}
            />
          </div>
        );

      case 'filter-selection':
        return (
          <div className="grid gap-6">
            <MetricsSelector 
              onFiltersSelected={(filters) => {
                // Ready to analyze
              }}
            />
          </div>
        );

      case 'analyzing':
        return (
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Processing Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-slate-300">
                    Analyzing {analysisState.postcodeData?.totalCount.toLocaleString()} patient records...
                  </p>
                  {progress > 50 && (
                    <p className="text-sm text-blue-600">
                      Running comprehensive Medicare eligibility analysis...
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'complete':
        return (
          <div className="grid gap-6">
            <Alert>
              <CheckCircle className="w-4 h-4" />
              <AlertDescription>
                Analysis completed successfully! {result?.patientSummary.totalPatients.toLocaleString()} patients analyzed.
              </AlertDescription>
            </Alert>
            
            <ClinicAnalysisResults 
              show={true}
              onClose={() => {}}
              selectedMetrics={{
                geographic: new Set(['patient_distribution', 'distance_band', 'state', 'remoteness']),
                medicare: new Set(['eligibility_rate', 'active_disaster', 'time_based_risk']),
                operations: new Set(['patients_per_practitioner', 'utilization']),
                business: new Set(['patient_segments', 'growth_potential'])
              }}
              postcodeData={analysisState.postcodeData?.postcodes || []}
              analysisResult={result}
              onSaveToReports={() => {}}
              onExportPDF={() => {}}
              onShare={() => {}}
            />
          </div>
        );

      case 'error':
        return (
          <Alert variant="destructive">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>
              Analysis failed: {error}
            </AlertDescription>
          </Alert>
        );

      default:
        return (
          <Card>
            <CardContent className="text-center py-8">
              <p>Ready to begin analysis...</p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">
            {wizardData?.clinicName || 'Clinic Analysis'}
          </h2>
          <p className="text-slate-200">
            Phase: {phase.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={onNewAnalysis}>
            <Settings className="w-4 h-4 mr-2" />
            New Analysis
          </Button>
        </div>
      </div>

      {/* Main Content */}
      {renderPhaseContent()}
    </div>
  );
};