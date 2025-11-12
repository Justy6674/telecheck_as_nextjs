import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Users, MapPin, PieChart, TrendingUp } from 'lucide-react';

interface DemographicStats {
  age_breakdown?: Record<string, number>;
  gender_breakdown?: Record<string, number>;
  eligible_by_age?: Record<string, number>;
  eligible_by_gender?: Record<string, number>;
}

interface GeographicStats {
  remoteness_breakdown?: Record<string, {
    total_patients: number;
    eligible_patients: number;
    eligible_percentage: number;
  }>;
  state_breakdown?: Record<string, {
    total_patients: number;
    eligible_patients: number;
    eligible_percentage: number;
  }>;
}

interface DemographicAnalysisReportProps {
  demographicStats?: DemographicStats;
  geographicStats?: GeographicStats;
  totalPatients: number;
  eligiblePatients: number;
}

export const DemographicAnalysisReport: React.FC<DemographicAnalysisReportProps> = ({
  demographicStats,
  geographicStats,
  totalPatients,
  eligiblePatients
}) => {
  const hasDemographics = demographicStats && (
    Object.keys(demographicStats.age_breakdown || {}).length > 0 ||
    Object.keys(demographicStats.gender_breakdown || {}).length > 0
  );

  const hasGeographics = geographicStats && (
    Object.keys(geographicStats.remoteness_breakdown || {}).length > 0 ||
    Object.keys(geographicStats.state_breakdown || {}).length > 0
  );

  const getAgeGroupColor = (ageGroup: string) => {
    switch (ageGroup) {
      case '0-17': return 'bg-blue-500';
      case '18-64': return 'bg-green-500';
      case '65+': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getGenderColor = (gender: string) => {
    switch (gender.toLowerCase()) {
      case 'male': return 'bg-blue-500';
      case 'female': return 'bg-pink-500';
      case 'other': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getRemotenessColor = (area: string) => {
    switch (area) {
      case 'Major Cities': return 'bg-emerald-500';
      case 'Inner Regional': return 'bg-yellow-500';
      case 'Outer Regional': return 'bg-orange-500';
      case 'Remote': return 'bg-red-500';
      case 'Very Remote': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  if (!hasDemographics && !hasGeographics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Enhanced Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No demographic data detected</p>
            <p className="text-sm">
              To enable demographic and geographic analysis, include age and gender data in your file.
              <br />
              Supported columns: age, gender, sex, dob, date_of_birth
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Demographic & Geographic Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="demographics" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="demographics" disabled={!hasDemographics}>
              <Users className="h-4 w-4 mr-2" />
              Demographics
            </TabsTrigger>
            <TabsTrigger value="geography" disabled={!hasGeographics}>
              <MapPin className="h-4 w-4 mr-2" />
              Geography
            </TabsTrigger>
          </TabsList>

          <TabsContent value="demographics" className="space-y-6">
            {hasDemographics && (
              <>
                {/* Age Analysis */}
                {demographicStats?.age_breakdown && Object.keys(demographicStats.age_breakdown).length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <PieChart className="h-5 w-5" />
                      Age Distribution
                    </h3>
                    <div className="grid gap-4">
                      {Object.entries(demographicStats.age_breakdown).map(([ageGroup, count]) => {
                        const percentage = (count / totalPatients * 100).toFixed(1);
                        const eligibleCount = demographicStats?.eligible_by_age?.[ageGroup] || 0;
                        const eligibilityRate = count > 0 ? (eligibleCount / count * 100).toFixed(1) : '0';
                        
                        return (
                          <div key={ageGroup} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${getAgeGroupColor(ageGroup)}`}></div>
                                <span className="font-medium">{ageGroup} years</span>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold">{count} patients ({percentage}%)</div>
                                <div className="text-sm text-muted-foreground">
                                  {eligibleCount} eligible ({eligibilityRate}%)
                                </div>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <Progress value={Number(percentage)} className="h-2" />
                              <Progress 
                                value={Number(eligibilityRate)} 
                                className="h-1" 
                                style={{ 
                                  '--progress-foreground': 'hsl(var(--destructive))' 
                                } as React.CSSProperties}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Gender Analysis */}
                {demographicStats?.gender_breakdown && Object.keys(demographicStats.gender_breakdown).length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Gender Distribution
                    </h3>
                    <div className="grid gap-4">
                      {Object.entries(demographicStats.gender_breakdown).map(([gender, count]) => {
                        const percentage = (count / totalPatients * 100).toFixed(1);
                        const eligibleCount = demographicStats?.eligible_by_gender?.[gender] || 0;
                        const eligibilityRate = count > 0 ? (eligibleCount / count * 100).toFixed(1) : '0';
                        
                        return (
                          <div key={gender} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${getGenderColor(gender)}`}></div>
                                <span className="font-medium capitalize">{gender}</span>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold">{count} patients ({percentage}%)</div>
                                <div className="text-sm text-muted-foreground">
                                  {eligibleCount} eligible ({eligibilityRate}%)
                                </div>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <Progress value={Number(percentage)} className="h-2" />
                              <Progress 
                                value={Number(eligibilityRate)} 
                                className="h-1"
                                style={{ 
                                  '--progress-foreground': 'hsl(var(--destructive))' 
                                } as React.CSSProperties}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Key Insights */}
                <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Demographic Insights
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    {demographicStats?.age_breakdown && (
                      <div>
                        <div className="font-medium">Age Groups:</div>
                        <ul className="list-disc list-inside text-muted-foreground">
                          {Object.entries(demographicStats.age_breakdown)
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 2)
                            .map(([age, count]) => (
                              <li key={age}>
                                {age} years: {((count / totalPatients) * 100).toFixed(1)}% of patients
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}
                    {demographicStats?.gender_breakdown && (
                      <div>
                        <div className="font-medium">Gender Distribution:</div>
                        <ul className="list-disc list-inside text-muted-foreground">
                          {Object.entries(demographicStats.gender_breakdown)
                            .sort((a, b) => b[1] - a[1])
                            .map(([gender, count]) => (
                              <li key={gender}>
                                {gender}: {((count / totalPatients) * 100).toFixed(1)}% of patients
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="geography" className="space-y-6">
            {hasGeographics && (
              <>
                {/* Remoteness Areas */}
                {geographicStats?.remoteness_breakdown && Object.keys(geographicStats.remoteness_breakdown).length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      ASGS Remoteness Areas
                    </h3>
                    <div className="grid gap-4">
                      {Object.entries(geographicStats.remoteness_breakdown).map(([area, stats]) => {
                        const percentage = (stats.total_patients / totalPatients * 100).toFixed(1);
                        
                        return (
                          <div key={area} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${getRemotenessColor(area)}`}></div>
                                <span className="font-medium">{area}</span>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold">{stats.total_patients} patients ({percentage}%)</div>
                                <div className="text-sm text-muted-foreground">
                                  {stats.eligible_patients} eligible ({stats.eligible_percentage}%)
                                </div>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <Progress value={Number(percentage)} className="h-2" />
                              <Progress 
                                value={stats.eligible_percentage} 
                                className="h-1"
                                style={{ 
                                  '--progress-foreground': 'hsl(var(--destructive))' 
                                } as React.CSSProperties}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* State Breakdown */}
                {geographicStats?.state_breakdown && Object.keys(geographicStats.state_breakdown).length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">State Distribution</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {Object.entries(geographicStats.state_breakdown).map(([state, stats]) => (
                        <Card key={state} className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <Badge variant="outline" className="text-sm font-semibold">
                              {state}
                            </Badge>
                            <div className="text-right">
                              <div className="font-semibold">{stats.total_patients}</div>
                              <div className="text-xs text-muted-foreground">patients</div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Eligible</span>
                              <span>{stats.eligible_patients} ({stats.eligible_percentage}%)</span>
                            </div>
                            <Progress value={stats.eligible_percentage} className="h-2" />
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Geographic Insights */}
                <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Geographic Insights
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    {geographicStats?.remoteness_breakdown && (
                      <div>
                        <div className="font-medium">Coverage by Area Type:</div>
                        <ul className="list-disc list-inside text-muted-foreground">
                          {Object.entries(geographicStats.remoteness_breakdown)
                            .sort((a, b) => b[1].total_patients - a[1].total_patients)
                            .slice(0, 3)
                            .map(([area, stats]) => (
                              <li key={area}>
                                {area}: {((stats.total_patients / totalPatients) * 100).toFixed(1)}% of patients
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}
                    {geographicStats?.state_breakdown && (
                      <div>
                        <div className="font-medium">Top States by Patient Count:</div>
                        <ul className="list-disc list-inside text-muted-foreground">
                          {Object.entries(geographicStats.state_breakdown)
                            .sort((a, b) => b[1].total_patients - a[1].total_patients)
                            .slice(0, 3)
                            .map(([state, stats]) => (
                              <li key={state}>
                                {state}: {stats.total_patients} patients ({stats.eligible_percentage}% eligible)
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DemographicAnalysisReport;