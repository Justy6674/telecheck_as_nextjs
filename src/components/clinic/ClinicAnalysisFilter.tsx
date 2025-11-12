import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  Sparkles, MapPin, Heart, Briefcase, TrendingUp,
  ChevronRight, Eye, Check, X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Import types from centralized location
import type { MetricSelection, FilterConfiguration } from '@/types/clinic';

interface ClinicAnalysisFilterProps {
  onFilterChange: (filters: FilterConfiguration) => void;
  postcodeData?: any;
  onAnalyze: () => void;
  isAnalyzing?: boolean;
  practiceConfig?: any;
  allowDemoMode?: boolean;
}

// Define all 40+ metrics
const METRICS = {
  geographic: [
    { id: 'geo_patient_dist', name: 'Patient Distribution by Postcode', desc: 'Count and percentage per postcode' },
    { id: 'geo_distance_bands', name: 'Distance Band Analysis', desc: '0-2km, 2-10km, 10-30km, 30-100km, 100-500km, 500km+' },
    { id: 'geo_state_distribution', name: 'State/Territory Coverage', desc: 'NSW, VIC, QLD, SA, WA, TAS, NT, ACT breakdown' },
    { id: 'geo_remoteness', name: 'Remoteness Classification', desc: 'Major city, regional, remote analysis' },
    { id: 'geo_lga_distribution', name: 'LGA Distribution', desc: 'Local Government Area breakdown' },
    { id: 'geo_suburb_clusters', name: 'Suburb Clusters', desc: 'Top suburbs by patient concentration' },
    { id: 'geo_postcode_frequency', name: 'Postcode Frequency', desc: 'Top 20 postcodes by patient count' },
    { id: 'geo_density_map', name: 'Density Heat Map', desc: 'Patient density distribution' },
    { id: 'geo_catchment_analysis', name: 'Catchment Analysis', desc: 'Primary, secondary, tertiary catchments' },
    { id: 'geo_pattern_analysis', name: 'Pattern Analysis', desc: 'Geographic distribution patterns' }
  ],
  medicare: [
    { id: 'med_eligibility_rate', name: 'Overall Eligibility Rate', desc: 'Percentage of patients in disaster zones' },
    { id: 'med_active_disasters', name: 'Active Disaster Postcodes', desc: 'NULL end_date disasters (Medicare eligible)' },
    { id: 'med_time_based_risk', name: 'Time-Based Risk Categories', desc: '12 months, 2 years, 5+ years breakdown' },
    { id: 'med_disaster_types', name: 'Disaster Type Analysis', desc: 'Flood, fire, cyclone, storm breakdown' },
    { id: 'med_lga_eligibility', name: 'LGA Eligibility Breakdown', desc: 'Eligibility rates by LGA' },
    { id: 'med_claim_potential', name: 'Telehealth Eligibility Assessment', desc: 'Assessment of disaster zone eligibility status' },
    { id: 'med_disaster_timeline', name: 'Disaster Timeline', desc: 'Historical patterns over years' },
    { id: 'med_postcode_eligibility', name: 'Postcode Eligibility Rates', desc: 'Top 20 postcodes by eligibility' },
    { id: 'med_compliance_status', name: 'Compliance Status', desc: 'Documentation completeness' },
    { id: 'med_risk_assessment', name: 'Risk Assessment', desc: 'Confidence levels for eligibility' }
  ],
  operations: [
    { id: 'ops_per_practitioner', name: 'Patients per Practitioner', desc: 'Workload distribution analysis' },
    { id: 'ops_utilization', name: 'Practitioner Utilization Rate', desc: 'Capacity utilization percentage' },
    { id: 'ops_appointment_distribution', name: 'Appointment Distribution', desc: 'Telehealth vs in-person split' },
    { id: 'ops_workflow_efficiency', name: 'Workflow Efficiency', desc: 'Automation and streamlining potential' },
    { id: 'ops_resource_allocation', name: 'Resource Allocation', desc: 'Staff and infrastructure needs' },
    { id: 'ops_peak_load', name: 'Peak Load Analysis', desc: 'Daily and hourly volume estimates' },
    { id: 'ops_service_mix', name: 'Service Mix Optimization', desc: 'Optimal consultation type distribution' },
    { id: 'ops_geographic_coverage', name: 'Geographic Coverage', desc: 'States and LGAs covered' },
    { id: 'ops_patient_flow', name: 'Patient Flow Analysis', desc: 'Intake channels and throughput' },
    { id: 'ops_quality_metrics', name: 'Quality Metrics', desc: 'Compliance and documentation quality' }
  ],
  business: [
    { id: 'biz_patient_segments', name: 'Patient Segments', desc: 'Telehealth vs in-person segments' },
    { id: 'biz_growth_potential', name: 'Growth Potential', desc: 'Expansion opportunities' },
    { id: 'biz_competitive_position', name: 'Competitive Position', desc: 'Market positioning analysis' },
    { id: 'biz_risk_profile', name: 'Risk Profile', desc: 'Concentration and stability risks' },
    { id: 'biz_market_insights', name: 'Market Insights', desc: 'Disaster-affected market size' },
    { id: 'biz_partnership_opportunities', name: 'Partnership Opportunities', desc: 'High-volume LGA partnerships' },
    { id: 'biz_technology_leverage', name: 'Technology Leverage', desc: 'Digital and AI opportunities' },
    { id: 'biz_compliance_readiness', name: 'Compliance Readiness', desc: 'Medicare compliance status' },
    { id: 'biz_strategic_value', name: 'Strategic Value', desc: 'Market positioning value' },
    { id: 'biz_performance_benchmarks', name: 'Performance Benchmarks', desc: 'Industry comparison metrics' }
  ]
};

const CATEGORY_CONFIG = {
  geographic: {
    icon: MapPin,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    borderColor: 'border-blue-200 dark:border-blue-800'
  },
  medicare: {
    icon: Heart,
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
    borderColor: 'border-emerald-200 dark:border-emerald-800'
  },
  operations: {
    icon: Briefcase,
    color: 'from-orange-500 to-amber-500',
    bgColor: 'bg-orange-50 dark:bg-orange-950/20',
    borderColor: 'border-orange-200 dark:border-orange-800'
  },
  business: {
    icon: TrendingUp,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    borderColor: 'border-purple-200 dark:border-purple-800'
  }
};

export const ClinicAnalysisFilter: React.FC<ClinicAnalysisFilterProps> = ({
  onFilterChange,
  onAnalyze,
  isAnalyzing = false,
  practiceConfig,
  allowDemoMode = false,
  postcodeData
}) => {
  const { toast } = useToast();
  const [selectedMetrics, setSelectedMetrics] = useState<MetricSelection>({
    geographic: new Set(),
    medicare: new Set(),
    operations: new Set(),
    business: new Set()
  });

  const [showPreview, setShowPreview] = useState(false);

  // Calculate total selected
  const totalSelected = Object.values(selectedMetrics).reduce(
    (sum, set) => sum + set.size, 0
  );
  const totalAvailable = Object.values(METRICS).reduce(
    (sum, category) => sum + category.length, 0
  );

  // Update parent component when selection changes - debounced to prevent infinite loops
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onFilterChange({
        selectedMetrics,
        practitioners: practiceConfig?.practitioners?.map((p: any) => p.id) || [],
        dateRange: undefined
      });
    }, 100); // 100ms debounce
    
    return () => clearTimeout(timeoutId);
  }, [selectedMetrics, practiceConfig?.practitioners]); // Only depend on actual data changes

  // Toggle individual metric
  const toggleMetric = (category: keyof typeof METRICS, metricId: string) => {
    const newSelection = { ...selectedMetrics };
    const categorySet = new Set(newSelection[category]);

    if (categorySet.has(metricId)) {
      categorySet.delete(metricId);
    } else {
      categorySet.add(metricId);
    }

    newSelection[category] = categorySet;
    setSelectedMetrics(newSelection);
  };

  // Toggle entire category
  const toggleCategory = (category: keyof typeof METRICS) => {
    const newSelection = { ...selectedMetrics };
    const categoryMetrics = METRICS[category];
    const allSelected = categoryMetrics.every(m => newSelection[category].has(m.id));

    if (allSelected) {
      newSelection[category] = new Set();
    } else {
      newSelection[category] = new Set(categoryMetrics.map(m => m.id));
    }

    setSelectedMetrics(newSelection);
  };

  // Select all metrics
  const selectAll = () => {
    const allSelected = totalSelected === totalAvailable;

    if (allSelected) {
      setSelectedMetrics({
        geographic: new Set(),
        medicare: new Set(),
        operations: new Set(),
        business: new Set()
      });
    } else {
      setSelectedMetrics({
        geographic: new Set(METRICS.geographic.map(m => m.id)),
        medicare: new Set(METRICS.medicare.map(m => m.id)),
        operations: new Set(METRICS.operations.map(m => m.id)),
        business: new Set(METRICS.business.map(m => m.id))
      });
    }
  };

  // Preset templates
  const applyPreset = (preset: 'compliance' | 'growth' | 'geographic' | 'quick') => {
    const presets = {
      compliance: {
        geographic: [],
        medicare: ['med_agrn_docs', 'med_eligibility_rate', 'med_time_categories', 'med_claim_potential'],
        operations: ['ops_service_efficiency'],
        business: ['biz_compliance_risk']
      },
      growth: {
        geographic: ['geo_underserved', 'geo_service_desert'],
        medicare: ['med_active_disasters'],
        operations: ['ops_service_gaps'],
        business: ['biz_bottom10_opportunity', 'biz_growth_matrix', 'biz_expansion_ready']
      },
      geographic: {
        geographic: METRICS.geographic.map(m => m.id),
        medicare: [],
        operations: [],
        business: []
      },
      quick: {
        geographic: ['geo_patient_dist', 'geo_distance_bands'],
        medicare: ['med_active_disasters', 'med_eligibility_rate'],
        operations: [],
        business: []
      }
    };

    setSelectedMetrics({
      geographic: new Set(presets[preset].geographic),
      medicare: new Set(presets[preset].medicare),
      operations: new Set(presets[preset].operations),
      business: new Set(presets[preset].business)
    });
  };

  return (
    <div className="w-full space-y-4 pb-24">
      {/* Header Section */}
      <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-800 rounded-lg p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              Configure Your Analysis Dashboard
            </h2>
            <Badge variant="secondary" className="text-lg px-3 py-1 bg-gray-800 text-gray-200">
              {totalSelected}/{totalAvailable} selected
            </Badge>
          </div>

          {/* Master Controls */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={selectAll}
              className={`flex-1 bg-gradient-to-r ${
                totalSelected === totalAvailable
                  ? 'from-green-600 to-emerald-600'
                  : 'from-purple-600 to-pink-600'
              } hover:opacity-90 text-white font-bold`}
            >
              {totalSelected === totalAvailable ? (
                <>✅ ALL SELECTED</>
              ) : (
                <>🎯 SELECT ALL ANALYSES</>
              )}
            </Button>

            {/* Preset Templates */}
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyPreset('compliance')}
                className="text-xs border-gray-700 hover:bg-gray-800"
              >
                Compliance
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyPreset('growth')}
                className="text-xs border-gray-700 hover:bg-gray-800"
              >
                Growth
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyPreset('geographic')}
                className="text-xs border-gray-700 hover:bg-gray-800"
              >
                Geographic
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => applyPreset('quick')}
                className="text-xs border-gray-700 hover:bg-gray-800"
              >
                Quick Check
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Side - Category Accordions (spans 2 columns on desktop) */}
        <div className="lg:col-span-2">
          <Accordion type="multiple" className="space-y-3">
          {(Object.entries(METRICS) as [keyof typeof METRICS, typeof METRICS.geographic][]).map(([category, metrics]) => {
            const config = CATEGORY_CONFIG[category];
            const Icon = config.icon;
            const selectedCount = selectedMetrics[category].size;
            const allCategorySelected = selectedCount === metrics.length;

            return (
              <AccordionItem
                key={category}
                value={category}
                className="bg-gray-800/50 border border-gray-700/50 rounded-lg overflow-hidden"
              >
                <AccordionTrigger className="px-4 py-3 hover:bg-gray-800/70">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${config.color}`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-semibold capitalize">{category} Intelligence</span>
                      <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                        {selectedCount}/{metrics.length}
                      </Badge>
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCategory(category);
                      }}
                      className="text-xs hover:bg-gray-700 px-2 py-1 rounded cursor-pointer transition-colors"
                    >
                      {allCategorySelected ? 'Deselect All' : 'Select All'}
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-2 pt-2">
                    {metrics.map((metric) => {
                      const isSelected = selectedMetrics[category].has(metric.id);

                      return (
                        <div
                          key={metric.id}
                          className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-gray-700/50 ring-2 ring-purple-500/20'
                              : 'hover:bg-gray-800/50'
                          }`}
                          onClick={() => toggleMetric(category, metric.id)}
                        >
                          <Checkbox
                            checked={isSelected}
                            className="mt-0.5 border-gray-600 data-[state=checked]:bg-purple-600"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-sm">{metric.name}</div>
                            <div className="text-xs text-gray-400 mt-0.5">{metric.desc}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
          </Accordion>
        </div>

        {/* Right Side - Desktop Preview Panel (spans 1 column) */}
        <div className="hidden lg:block lg:col-span-1">
          <Card className="bg-gray-800/50 border-gray-700/50 h-fit">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              Preview
              <Badge variant="secondary">{totalSelected} metrics</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-3">
              {Object.entries(selectedMetrics).map(([category, metricIds]) => {
                if (metricIds.size === 0) return null;

                const categoryMetrics = METRICS[category as keyof typeof METRICS];
                const selectedCategoryMetrics = categoryMetrics.filter(m => metricIds.has(m.id));

                return (
                  <div key={category} className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2 capitalize">
                      {category} ({metricIds.size})
                    </h4>
                    <div className="space-y-1">
                      {selectedCategoryMetrics.map(metric => (
                        <div key={metric.id} className="text-xs text-gray-300 flex items-center gap-1">
                          <Check className="w-3 h-3 text-green-500" />
                          {metric.name}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </ScrollArea>

            {/* Desktop Generate Report Button in Sidebar - Keep for desktop */}
            <div className="hidden lg:block">
              <Button
                onClick={() => {
                  // Validate before analyzing
                  if (totalSelected === 0) {
                    toast({
                      title: 'No Metrics Selected',
                      description: 'Please select at least one metric to generate a report',
                      variant: 'destructive'
                    });
                    return;
                  }
                  if (!postcodeData || !postcodeData.postcodes || postcodeData.postcodes.length === 0) {
                    toast({
                      title: 'No Data Available',
                      description: 'Please upload postcode data before generating a report',
                      variant: 'destructive'
                    });
                    return;
                  }
                  onAnalyze();
                }}
                disabled={totalSelected === 0 || isAnalyzing}
                className="w-full mt-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90 text-white font-bold"
              >
                {isAnalyzing ? '🔄 Generating...' : '📄 Generate Report'}
              </Button>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>

      {/* Fixed Bottom Action Bar - Always Visible */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex gap-2">
          {/* Preview Button (Mobile Only) */}
          <Button
            onClick={() => setShowPreview(true)}
            disabled={totalSelected === 0}
            className="flex-1 lg:hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white font-bold py-3"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview ({totalSelected})
          </Button>

          {/* Generate Report Button - Always Visible */}
          <Button
            onClick={() => {
              // Validate before analyzing
              if (totalSelected === 0) {
                toast({
                  title: 'No Metrics Selected',
                  description: 'Please select at least one metric to generate a report',
                  variant: 'destructive'
                });
                return;
              }
              if (!postcodeData || !postcodeData.postcodes || postcodeData.postcodes.length === 0) {
                toast({
                  title: 'No Data Available',
                  description: 'Please upload postcode data before generating a report',
                  variant: 'destructive'
                });
                return;
              }
              onAnalyze();
            }}
            disabled={totalSelected === 0 || isAnalyzing}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90 text-white font-bold py-3"
          >
            {isAnalyzing ? '🔄 Generating...' : '📄 Generate Report'}
          </Button>
        </div>
      </div>

      {/* Mobile Preview Sheet */}
      {showPreview && (
        <div className="fixed inset-0 z-50 bg-black/50 lg:hidden" onClick={() => setShowPreview(false)}>
          <div className="fixed bottom-0 left-0 right-0 bg-gray-900 rounded-t-xl p-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Selected Metrics ({totalSelected})</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {Object.entries(selectedMetrics).map(([category, metricIds]) => {
              if (metricIds.size === 0) return null;

              const categoryMetrics = METRICS[category as keyof typeof METRICS];
              const selectedCategoryMetrics = categoryMetrics.filter(m => metricIds.has(m.id));

              return (
                <div key={category} className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-400 mb-2 capitalize">
                    {category} ({metricIds.size})
                  </h4>
                  <div className="space-y-1">
                    {selectedCategoryMetrics.map(metric => (
                      <div key={metric.id} className="text-xs text-gray-300 flex items-center gap-1">
                        <Check className="w-3 h-3 text-green-500" />
                        {metric.name}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            <Button
              onClick={() => {
                setShowPreview(false);
                // Validate before analyzing
                if (totalSelected === 0) {
                  toast({
                    title: 'No Metrics Selected',
                    description: 'Please select at least one metric to generate a report',
                    variant: 'destructive'
                  });
                  return;
                }
                if (!postcodeData || !postcodeData.postcodes || postcodeData.postcodes.length === 0) {
                  toast({
                    title: 'No Data Available',
                    description: 'Please upload postcode data before generating a report',
                    variant: 'destructive'
                  });
                  return;
                }
                onAnalyze();
              }}
              disabled={totalSelected === 0 || isAnalyzing}
              className="w-full mt-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90 text-white font-bold"
            >
              {isAnalyzing ? '🔄 Generating...' : '📄 Generate Report'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};