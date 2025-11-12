import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, MapPin, Building2, Trees, Mountain, Globe } from "lucide-react";

interface GeographicDistribution {
  major_cities: number;
  inner_regional: number;
  outer_regional: number;
  remote: number;
  very_remote: number;
}

interface StateBreakdown {
  [state: string]: number;
}

interface GeographicDistributionReportProps {
  geographicDistribution: GeographicDistribution;
  stateBreakdown: StateBreakdown;
  totalPatients: number;
}

const REMOTENESS_DEFINITIONS = {
  'Major Cities of Australia': {
    name: 'Major Cities',
    icon: Building2,
    description: 'Population clusters of 100,000+ people',
    detail: 'Excellent healthcare access, minimal transport barriers',
    color: 'bg-blue-500'
  },
  'Inner Regional Australia': {
    name: 'Inner Regional',
    icon: Trees,
    description: 'Areas 0-120km from major cities',
    detail: 'Good healthcare access, some transport considerations',
    color: 'bg-green-500'
  },
  'Outer Regional Australia': {
    name: 'Outer Regional', 
    icon: Mountain,
    description: 'Areas 120-500km from major cities',
    detail: 'Limited healthcare access, significant transport barriers',
    color: 'bg-yellow-500'
  },
  'Remote Australia': {
    name: 'Remote',
    icon: Globe,
    description: 'Areas 500km+ from major cities',
    detail: 'Very limited healthcare access, major transport challenges',
    color: 'bg-orange-500'
  },
  'Very Remote Australia': {
    name: 'Very Remote',
    icon: MapPin,
    description: 'Areas with very limited accessibility',
    detail: 'Severely limited healthcare access, extreme transport barriers',
    color: 'bg-red-500'
  }
};

const getRemotenessColor = (type: string) => {
  const colors = {
    'major_cities': 'bg-blue-500',
    'inner_regional': 'bg-green-500',
    'outer_regional': 'bg-yellow-500',
    'remote': 'bg-orange-500',
    'very_remote': 'bg-red-500'
  };
  return colors[type as keyof typeof colors] || 'bg-gray-500';
};

const getStateColor = (state: string) => {
  const colors = {
    'NSW': 'bg-blue-600',
    'VIC': 'bg-indigo-600',
    'QLD': 'bg-purple-600',
    'SA': 'bg-pink-600',
    'WA': 'bg-red-600',
    'TAS': 'bg-green-600',
    'NT': 'bg-orange-600',
    'ACT': 'bg-cyan-600'
  };
  return colors[state as keyof typeof colors] || 'bg-gray-600';
};

export const GeographicDistributionReport: React.FC<GeographicDistributionReportProps> = ({
  geographicDistribution,
  stateBreakdown,
  totalPatients
}) => {
  if (!geographicDistribution && !stateBreakdown) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Geographic Patient Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          No geographic data available for this analysis.
        </CardContent>
      </Card>
    );
  }

  // Convert geographic distribution to entries for display
  const remotenessEntries = Object.entries(geographicDistribution || {})
    .filter(([_, count]) => count > 0)
    .map(([key, count]) => {
      // Map the database keys to display names
      const displayKey = key === 'major_cities' ? 'Major Cities of Australia' :
                        key === 'inner_regional' ? 'Inner Regional Australia' :
                        key === 'outer_regional' ? 'Outer Regional Australia' :
                        key === 'remote' ? 'Remote Australia' :
                        key === 'very_remote' ? 'Very Remote Australia' : key;
      return [displayKey, count] as [string, number];
    })
    .sort((a, b) => b[1] - a[1]);

  const stateEntries = Object.entries(stateBreakdown || {})
    .filter(([_, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);

  const topRemotenessType = remotenessEntries[0];
  const topState = stateEntries[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Healthcare Planning Dashboard
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p>
                  Strategic analysis for patient access and Medicare compliance.
                  Geographic distribution based on Australian Bureau of Statistics 
                  ASGS Remoteness Areas classification. Each postcode = one patient.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        
        {/* Patient Population by State/Territory */}
        {stateEntries.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Patient Population by State/Territory
            </h3>
            <p className="text-sm text-muted-foreground">
              Patient distribution and disaster eligibility analysis across different geographic regions
            </p>
            
            <div className="grid gap-4">
              {stateEntries.map(([state, count]) => {
                const percentage = totalPatients > 0 ? ((count / totalPatients) * 100).toFixed(1) : '0.0';
                
                return (
                  <div key={state} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`${getStateColor(state)} text-white rounded-lg p-3 font-bold text-lg min-w-[60px] text-center`}>
                        {state}
                      </div>
                      <div>
                        <div className="font-semibold text-lg">{state === 'NSW' ? 'New South Wales' : 
                                                                state === 'VIC' ? 'Victoria' :
                                                                state === 'QLD' ? 'Queensland' :
                                                                state === 'SA' ? 'South Australia' :
                                                                state === 'WA' ? 'Western Australia' :
                                                                state === 'TAS' ? 'Tasmania' :
                                                                state === 'NT' ? 'Northern Territory' :
                                                                state === 'ACT' ? 'Australian Capital Territory' : state}</div>
                        <div className="text-sm text-muted-foreground">
                          Total Patients: <span className="font-medium">{count.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{percentage}%</div>
                      <div className="text-xs text-muted-foreground">of total patients</div>
                      <Badge variant="secondary" className="mt-1">
                        {((count / totalPatients) * 100 >= 25) ? 'High' : 
                         ((count / totalPatients) * 100 >= 10) ? 'Medium' : 'Low'} Concentration
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Geographic Patient Access Analysis */}
        {remotenessEntries.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Geographic Patient Access Analysis
            </h3>
            <p className="text-sm text-muted-foreground">
              Patient access analysis across different geographic regions using Australian Bureau of Statistics 
              (ABS) ASGS Remoteness Areas classification
            </p>
            
            <div className="grid gap-4">
              {remotenessEntries.map(([type, count]) => {
                const definition = REMOTENESS_DEFINITIONS[type as keyof typeof REMOTENESS_DEFINITIONS];
                const percentage = totalPatients > 0 ? ((count / totalPatients) * 100).toFixed(1) : '0.0';
                const Icon = definition?.icon || MapPin;
                
                return (
                  <div key={type} className="border rounded-lg p-4 bg-card hover:bg-accent/50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div className={`${definition?.color || 'bg-gray-500'} text-white rounded-lg p-3`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">
                            {definition?.name || type}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {definition?.description}
                          </p>
                          {definition?.detail && (
                            <p className="text-xs text-muted-foreground/80 mt-2 bg-muted/50 p-2 rounded">
                              <strong>Healthcare Access:</strong> {definition.detail}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold">{count.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">patients</div>
                        <div className="text-xl font-semibold text-primary mt-1">{percentage}%</div>
                        <div className="text-xs text-muted-foreground">of total</div>
                      </div>
                    </div>
                    <Progress 
                      value={totalPatients > 0 ? (count / totalPatients) * 100 : 0} 
                      className="h-3"
                    />
                    <div className="mt-2 text-xs text-muted-foreground">
                      Eligibility Rate: Based on disaster coverage analysis
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Summary Statistics */}
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-6 rounded-lg">
          <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Info className="w-5 h-5" />
            Medicare Audit Risk Management
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="text-xl font-bold text-green-600">
                {topRemotenessType ? ((topRemotenessType[1] / totalPatients) * 100).toFixed(1) : '0'}%
              </div>
              <div className="text-xs text-muted-foreground mt-1">Maximum Protection</div>
              <div className="text-xs text-green-600">Recent disasters (12 months)</div>
            </div>
            <div className="text-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="text-xl font-bold text-blue-600">
                {remotenessEntries.find(([type]) => type.includes('Major Cities'))?.[1] || 0}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Metropolitan</div>
              <div className="text-xs text-blue-600">Strong audit position</div>
            </div>
            <div className="text-center p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
              <div className="text-xl font-bold text-amber-600">
                {((remotenessEntries.find(([type]) => type.includes('Remote') && !type.includes('Very'))?.[1] || 0) + 
                  (remotenessEntries.find(([type]) => type.includes('Very Remote'))?.[1] || 0))}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Remote Areas</div>
              <div className="text-xs text-amber-600">Review needed (5+ years)</div>
            </div>
            <div className="text-center p-3 bg-primary/10 rounded-lg border border-primary/20">
              <div className="text-xl font-bold text-primary">
                {stateEntries.length}
              </div>
              <div className="text-xs text-muted-foreground mt-1">States/Territories</div>
              <div className="text-xs text-primary">Geographic diversity</div>
            </div>
          </div>
          
          {/* Geographic Insights */}
          <div className="mt-6 space-y-2">
            <h5 className="font-semibold text-sm">Compliance Guidance</h5>
            <div className="space-y-1 text-sm text-muted-foreground">
              {topRemotenessType && (
                <p>
                  • Most patients are in <strong>{REMOTENESS_DEFINITIONS[topRemotenessType[0] as keyof typeof REMOTENESS_DEFINITIONS]?.name}</strong> areas 
                  ({topRemotenessType[1].toLocaleString()} patients, {((topRemotenessType[1] / totalPatients) * 100).toFixed(1)}% of total)
                </p>
              )}
              {topState && (
                <p>
                  • Highest state concentration in <strong>{topState[0]}</strong> 
                  ({topState[1].toLocaleString()} patients, {((topState[1] / totalPatients) * 100).toFixed(1)}% of total)
                </p>
              )}
              <p>
                • Geographic diversity spans <strong>{remotenessEntries.length}</strong> remoteness categories 
                and <strong>{stateEntries.length}</strong> states/territories
              </p>
              <p className="text-xs bg-amber-50 dark:bg-amber-950/20 p-2 rounded border-l-4 border-amber-500">
                <strong>Medicare Compliance:</strong> Verify disaster eligibility documentation for each patient. 
                Maintain audit trail for Medicare billing compliance.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeographicDistributionReport;