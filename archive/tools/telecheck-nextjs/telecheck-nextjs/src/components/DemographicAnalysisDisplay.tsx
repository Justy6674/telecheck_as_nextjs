import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, MapPin, Clock, Shield, AlertTriangle, Download, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GeographicDistribution {
  major_cities: number;
  inner_regional: number;
  outer_regional: number;
  remote: number;
  very_remote: number;
}

interface TimeBasedAnalysis {
  last12Months?: { count: number; percentage: number; description: string; };
  last2Years?: { count: number; percentage: number; description: string; };
  last5Years?: { count: number; percentage: number; description: string; };
  olderThan5Years?: { count: number; percentage: number; description: string; };
}

interface DemographicAnalysis {
  state_breakdown?: Record<string, number>;
  remoteness_breakdown?: Record<string, number>;
  geographic_distribution?: GeographicDistribution;
}

interface AnalysisData {
  totalAnalyzed: number;
  eligibleCount: number;
  eligiblePercentage: number;
  timeBasedAnalysis?: TimeBasedAnalysis;
  demographicAnalysis?: DemographicAnalysis;
  healthcarePlanning?: Record<string, unknown>;
  businessImpact?: Record<string, unknown>; // Add this missing property
}

interface DemographicAnalysisDisplayProps {
  analysisData: AnalysisData;
  onDownloadReport?: () => void;
  onRegenerateAnalysis?: () => void;
}

export const DemographicAnalysisDisplay: React.FC<DemographicAnalysisDisplayProps> = ({
  analysisData,
  onDownloadReport,
  onRegenerateAnalysis
}) => {
  // Map the edge function results to display format
  const totalPatients = analysisData?.totalAnalyzed || 0;
  const eligiblePatients = analysisData?.eligibleCount || 0;
  const nonDisasterPatients = totalPatients - eligiblePatients;
  const eligibilityRate = analysisData?.eligiblePercentage || 0;
  const timeBasedAnalysis = analysisData?.timeBasedAnalysis || {};
  
  // Extract demographic data from the analysis
  const demographicData = analysisData?.demographicAnalysis || {};
  const remotenessBreakdown = demographicData?.remoteness_breakdown || {};
  const stateBreakdown = demographicData?.state_breakdown || {};
  const businessImpact = analysisData?.businessImpact || {};
  
  // Calculate state-specific eligibility (this would ideally come from backend)
  const stateAnalysis = Object.entries(stateBreakdown).map(([state, totalCount]) => ({
    state,
    totalPatients: totalCount as number,
    eligiblePatients: Math.round((totalCount as number) * (eligibilityRate / 100)),
    eligibilityRate: Math.round(eligibilityRate)
  })).sort((a, b) => b.totalPatients - a.totalPatients);

  // Fix remoteness data display with proper property names from the fixed database function
  const geographicDistribution: GeographicDistribution = (demographicData?.geographic_distribution as GeographicDistribution) || {
    major_cities: 0,
    inner_regional: 0,
    outer_regional: 0,
    remote: 0,
    very_remote: 0
  };
  const geographicData = [
    { 
      category: 'Major Cities', 
      count: geographicDistribution.major_cities || 0,
      description: 'Primary care access area'
    },
    { 
      category: 'Inner Regional', 
      count: geographicDistribution.inner_regional || 0,
      description: 'Enhanced telehealth access needed'
    },
    { 
      category: 'Outer Regional', 
      count: geographicDistribution.outer_regional || 0,
      description: 'Critical telehealth access required'
    },
    { 
      category: 'Remote', 
      count: geographicDistribution.remote || 0,
      description: 'Essential telehealth services needed'
    },
    { 
      category: 'Very Remote', 
      count: geographicDistribution.very_remote || 0,
      description: 'Vital telehealth care provision required'
    }
  ];

  // Healthcare planning data (no billing references)
  const healthcarePlanning = analysisData?.healthcarePlanning || {};


  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Healthcare Planning Dashboard</h2>
          <p className="text-muted-foreground">Strategic analysis for patient access and Medicare compliance</p>
        </div>
        <div className="flex gap-2">
          {onDownloadReport && (
            <Button variant="outline" onClick={onDownloadReport}>
              <Download className="mr-2 h-4 w-4" />
              Export Analysis
            </Button>
          )}
          {onRegenerateAnalysis && (
            <Button onClick={onRegenerateAnalysis}>
              Refresh Data
            </Button>
          )}
        </div>
      </div>

      {/* Healthcare Planning Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Patient Population</p>
                <p className="text-3xl font-bold text-primary">{totalPatients.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">Disaster Eligibility Analysis</p>
                <p className="text-xs text-primary font-medium">Healthcare Planning Tool</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-500/20 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Disaster-Affected Patients</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{eligiblePatients.toLocaleString()}</p>
                <Badge variant="secondary" className="mt-1 bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                  {eligibilityRate}% of total
                </Badge>
              </div>
              <AlertTriangle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-500/20 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Non-Disaster Patients</p>
                <p className="text-3xl font-bold text-slate-600 dark:text-slate-400">{nonDisasterPatients.toLocaleString()}</p>
                <Badge variant="outline" className="mt-1">
                  {(100 - eligibilityRate)}% of total
                </Badge>
              </div>
              <Shield className="h-8 w-8 text-slate-600 dark:text-slate-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* State-by-State Strategic Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Patient Population by State/Territory
          </CardTitle>
          <p className="text-sm text-muted-foreground">Patient distribution and disaster eligibility analysis</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stateAnalysis.length > 0 ? 
              stateAnalysis.map(({ state, totalPatients, eligiblePatients, eligibilityRate }) => (
                <Card key={state} className="border-muted bg-card/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg text-foreground">{state}</h3>
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total Patients</span>
                        <Badge variant="outline" className="font-mono">{totalPatients.toLocaleString()}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Disaster-Affected</span>
                        <Badge variant="default" className="font-mono bg-green-600">{eligiblePatients.toLocaleString()}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Non-Disaster</span>
                        <Badge variant="secondary" className="font-mono">{(totalPatients - eligiblePatients).toLocaleString()}</Badge>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Eligibility Rate</span>
                          <Badge variant="outline" className="font-bold">{eligibilityRate}%</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )) : 
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">No state breakdown data available</p>
              </div>
            }
          </div>
        </CardContent>
      </Card>

      {/* Geographic Market Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Geographic Patient Access Analysis
          </CardTitle>
          <p className="text-sm text-muted-foreground">Patient access analysis across different geographic regions</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {geographicData.map(({ category, count, description }) => {
              const eligible = Math.round(count * (eligibilityRate / 100));
              
              return (
                <Card key={category} className="border-muted bg-card/50 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-sm text-foreground">{category}</span>
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-1">
                      {count.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">
                      {eligible} eligible for disaster telehealth provisions
                    </div>
                    <div className="text-xs text-muted-foreground italic">
                      {description}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Medicare Audit Risk & Protection Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Medicare Audit Risk Management
          </CardTitle>
          <p className="text-sm text-muted-foreground">Disaster timeline analysis for audit protection and compliance</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg border-2 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="text-sm font-semibold text-green-800 dark:text-green-200">Maximum Protection</span>
              </div>
              <div className="text-2xl font-bold text-green-800 dark:text-green-200 mb-1">
                {timeBasedAnalysis?.last12Months?.count || 0}
              </div>
              <div className="text-xs text-green-600 dark:text-green-400 mb-2">
                Recent disasters (12 months)
              </div>
              <Badge variant="outline" className="border-green-300 text-green-700 dark:border-green-700 dark:text-green-300">
                Strongest audit protection
              </Badge>
            </div>
            
            <div className="p-4 rounded-lg border-2 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-semibold text-blue-800 dark:text-blue-200">Strong Protection</span>
              </div>
              <div className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-1">
                {timeBasedAnalysis?.last2Years?.count || 0}
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400 mb-2">
                Recent disasters (2 years)
              </div>
              <Badge variant="outline" className="border-blue-300 text-blue-700 dark:border-blue-700 dark:text-blue-300">
                Excellent compliance
              </Badge>
            </div>
            
            <div className="p-4 rounded-lg border-2 border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <span className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">Moderate Risk</span>
              </div>
              <div className="text-2xl font-bold text-yellow-800 dark:text-yellow-200 mb-1">
                {timeBasedAnalysis?.last5Years?.count || 0}
              </div>
              <div className="text-xs text-yellow-600 dark:text-yellow-400 mb-2">
                Older disasters (5 years)
              </div>
              <Badge variant="outline" className="border-yellow-300 text-yellow-700 dark:border-yellow-700 dark:text-yellow-300">
                Document carefully
              </Badge>
            </div>
            
            <div className="p-4 rounded-lg border-2 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span className="text-sm font-semibold text-red-800 dark:text-red-200">Review Required</span>
              </div>
              <div className="text-2xl font-bold text-red-800 dark:text-red-200 mb-1">
                {timeBasedAnalysis?.olderThan5Years?.count || 0}
              </div>
              <div className="text-xs text-red-600 dark:text-red-400 mb-2">
                Very old disasters (5+ years)
              </div>
              <Badge variant="outline" className="border-red-300 text-red-700 dark:border-red-700 dark:text-red-300">
                Extra documentation needed
              </Badge>
            </div>
          </div>
          
          <div className="mt-6 p-4 rounded-lg border bg-muted/30">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Compliance Guidance
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-green-700 dark:text-green-300">✓ Strong Protection ({timeBasedAnalysis?.last12Months?.count + timeBasedAnalysis?.last2Years?.count || 0} patients)</p>
                <p className="text-muted-foreground">Recent disaster declarations provide excellent audit protection</p>
              </div>
              <div>
                <p className="font-medium text-yellow-700 dark:text-yellow-300">⚠ Review Needed ({timeBasedAnalysis?.last5Years?.count + timeBasedAnalysis?.olderThan5Years?.count || 0} patients)</p>
                <p className="text-muted-foreground">Older declarations may need additional documentation</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};