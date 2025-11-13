import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Sparkles, Check, Eye, X, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Metric {
  id: string;
  name: string;
  desc: string;
}

interface ClinicAnalysisFilterMobileProps {
  selectedMetrics: {
    geographic: Set<string>;
    medicare: Set<string>;
    operations: Set<string>;
    business: Set<string>;
  };
  onMetricToggle: (category: string, metricId: string) => void;
  onSelectAll: () => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  postcodeData: any[];
  practiceConfig: any;
}

// Mobile-optimized metric definitions with 44px minimum touch targets
const METRICS = {
  geographic: [
    { id: 'geo_patient_dist', name: 'Patient Distribution', desc: 'Geographic spread analysis' },
    { id: 'geo_distance_bands', name: 'Distance Band', desc: 'Patient proximity zones' },
    { id: 'geo_state_distribution', name: 'State Distribution', desc: 'Multi-state coverage' },
    { id: 'geo_remoteness', name: 'Remoteness', desc: 'Rural vs urban analysis' },
    { id: 'geo_lga_distribution', name: 'LGA Distribution', desc: 'Local government areas' },
    { id: 'geo_suburb_clusters', name: 'Suburb Clusters', desc: 'Concentration patterns' },
    { id: 'geo_postcode_frequency', name: 'Postcode Frequency', desc: 'Patient density' },
    { id: 'geo_density', name: 'Density', desc: 'Patients per postcode' },
    { id: 'geo_catchment', name: 'Catchment', desc: 'Service area analysis' },
    { id: 'geo_pattern_analysis', name: 'Pattern Analysis', desc: 'Distribution insights' }
  ],
  medicare: [
    { id: 'med_eligibility_rate', name: 'Eligibility Rate', desc: 'Medicare coverage %' },
    { id: 'med_active_disasters', name: 'Active Disasters', desc: 'Current disaster zones' },
    { id: 'med_time_based_risk', name: 'Time-Based Risk', desc: 'Eligibility timeline' },
    { id: 'med_disaster_type', name: 'Disaster Type', desc: 'Types of disasters' },
    { id: 'med_lga_eligibility', name: 'LGA Eligibility', desc: 'Local area coverage' },
    { id: 'med_claim_potential', name: 'Claim Potential', desc: 'Revenue opportunity' },
    { id: 'med_timeline', name: 'Timeline', desc: 'Compliance windows' },
    { id: 'med_postcode_eligibility', name: 'Postcode Eligibility', desc: 'Area-specific coverage' },
    { id: 'med_compliance', name: 'Compliance', desc: 'Audit readiness' },
    { id: 'med_risk_assessment', name: 'Risk Assessment', desc: 'Compliance confidence' }
  ],
  operations: [
    { id: 'ops_per_practitioner', name: 'Patients per Practitioner', desc: 'Load distribution' },
    { id: 'ops_utilization', name: 'Utilization', desc: 'Capacity usage' },
    { id: 'ops_appointment_distribution', name: 'Appointment Distribution', desc: 'Scheduling patterns' },
    { id: 'ops_workflow', name: 'Workflow', desc: 'Process efficiency' },
    { id: 'ops_resource_allocation', name: 'Resource Allocation', desc: 'Resource planning' },
    { id: 'ops_peak_load', name: 'Peak Load', desc: 'Maximum capacity' },
    { id: 'ops_service_mix', name: 'Service Mix', desc: 'Service diversity' },
    { id: 'ops_geographic_coverage', name: 'Geographic Coverage', desc: 'Service reach' },
    { id: 'ops_patient_flow', name: 'Patient Flow', desc: 'Throughput analysis' },
    { id: 'ops_quality_metrics', name: 'Quality Metrics', desc: 'Quality indicators' }
  ],
  business: [
    { id: 'bus_patient_segments', name: 'Patient Segments', desc: 'Market segments' },
    { id: 'bus_growth_potential', name: 'Growth Potential', desc: 'Expansion opportunities' },
    { id: 'bus_competitive_position', name: 'Competitive Position', desc: 'Market standing' },
    { id: 'bus_risk_profile', name: 'Risk Profile', desc: 'Business risks' },
    { id: 'bus_market_insights', name: 'Market Insights', desc: 'Market intelligence' },
    { id: 'bus_partnership', name: 'Partnership', desc: 'Collaboration opportunities' },
    { id: 'bus_technology', name: 'Technology', desc: 'Digital readiness' },
    { id: 'bus_compliance_readiness', name: 'Compliance Readiness', desc: 'Regulatory preparedness' },
    { id: 'bus_strategic_value', name: 'Strategic Value', desc: 'Value proposition' },
    { id: 'bus_performance_benchmarks', name: 'Performance Benchmarks', desc: 'Industry comparison' }
  ]
};

export const ClinicAnalysisFilterMobile: React.FC<ClinicAnalysisFilterMobileProps> = ({
  selectedMetrics,
  onMetricToggle,
  onSelectAll,
  onAnalyze,
  isAnalyzing,
  postcodeData,
  practiceConfig
}) => {
  const [expandedCategories, setExpandedCategories] = React.useState<Set<string>>(new Set(['geographic']));
  const [showPreview, setShowPreview] = React.useState(false);

  const totalSelected = Object.values(selectedMetrics).reduce((sum, set) => sum + set.size, 0);
  const totalAvailable = Object.values(METRICS).reduce((sum, metrics) => sum + metrics.length, 0);

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      geographic: '🗺️',
      medicare: '🏥',
      operations: '⚙️',
      business: '💼'
    };
    return icons[category as keyof typeof icons] || '📊';
  };

  return (
    <div className="w-full space-y-4 pb-20">
      {/* Header - Mobile Optimized */}
      <Card className="bg-gray-900/95 border-gray-800">
        <CardHeader className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Analysis Setup
              </h2>
              <Badge variant="secondary" className="text-base px-2 py-1">
                {totalSelected}/{totalAvailable}
              </Badge>
            </div>

            {/* Main CTA - 48px height for optimal touch */}
            <Button
              onClick={onSelectAll}
              className={cn(
                "w-full h-12 text-base font-bold",
                totalSelected === totalAvailable
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90"
              )}
            >
              {totalSelected === totalAvailable ? '✅ All Selected' : '🎯 Select All Analyses'}
            </Button>

            {/* Quick Presets - 44px touch targets */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="h-11 text-sm border-gray-700"
                onClick={() => {/* Apply preset */}}
              >
                📋 Compliance
              </Button>
              <Button
                variant="outline"
                className="h-11 text-sm border-gray-700"
                onClick={() => {/* Apply preset */}}
              >
                📈 Growth
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Categories - Mobile Optimized with 44px+ touch targets */}
      <div className="space-y-2">
        {Object.entries(METRICS).map(([category, metrics]) => {
          const categoryMetrics = metrics as Metric[];
          const selectedCount = selectedMetrics[category as keyof typeof selectedMetrics].size;
          const isExpanded = expandedCategories.has(category);

          return (
            <Card key={category} className="bg-gray-800/50 border-gray-700">
              {/* Category Header - 48px touch target */}
              <button
                onClick={() => toggleCategory(category)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-700/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{getCategoryIcon(category)}</span>
                  <div className="text-left">
                    <div className="font-semibold capitalize">{category}</div>
                    <div className="text-xs text-gray-400">
                      {selectedCount}/{categoryMetrics.length} selected
                    </div>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {/* Metrics List - Each item 48px minimum */}
              {isExpanded && (
                <CardContent className="p-2 pt-0 space-y-1">
                  {categoryMetrics.map((metric) => {
                    const isSelected = selectedMetrics[category as keyof typeof selectedMetrics].has(metric.id);

                    return (
                      <button
                        key={metric.id}
                        onClick={() => onMetricToggle(category, metric.id)}
                        className={cn(
                          "w-full p-3 flex items-start gap-3 rounded-lg transition-all",
                          "min-h-[48px]", // Ensure 48px minimum height
                          isSelected
                            ? "bg-purple-900/30 border border-purple-600/30"
                            : "hover:bg-gray-700/30 border border-transparent"
                        )}
                      >
                        <Checkbox
                          checked={isSelected}
                          className="mt-1 h-5 w-5 border-gray-600"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="flex-1 text-left">
                          <div className="font-medium text-sm">{metric.name}</div>
                          <div className="text-xs text-gray-400">{metric.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Fixed Bottom Actions - Large touch targets */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4 z-40">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowPreview(true)}
            disabled={totalSelected === 0}
            className="flex-1 h-12 text-sm"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview ({totalSelected})
          </Button>
          <Button
            onClick={onAnalyze}
            disabled={totalSelected === 0 || isAnalyzing}
            className="flex-1 h-12 bg-gradient-to-r from-green-600 to-emerald-600 text-sm font-bold"
          >
            {isAnalyzing ? '🔄 Generating...' : '📊 Analyze'}
          </Button>
        </div>
      </div>

      {/* Mobile Preview Sheet */}
      {showPreview && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setShowPreview(false)}>
          <div
            className="fixed bottom-0 left-0 right-0 bg-gray-900 rounded-t-2xl max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h3 className="text-lg font-bold">Selected Metrics ({totalSelected})</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowPreview(false)}
                className="h-10 w-10"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Sheet Content */}
            <ScrollArea className="h-[60vh] p-4">
              {Object.entries(selectedMetrics).map(([category, metricIds]) => {
                if (metricIds.size === 0) return null;

                const categoryMetrics = METRICS[category as keyof typeof METRICS];
                const selectedCategoryMetrics = categoryMetrics.filter(m => metricIds.has(m.id));

                return (
                  <div key={category} className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{getCategoryIcon(category)}</span>
                      <h4 className="font-semibold capitalize">{category}</h4>
                      <Badge variant="secondary" className="ml-auto">
                        {metricIds.size}
                      </Badge>
                    </div>
                    <div className="space-y-2 pl-7">
                      {selectedCategoryMetrics.map(metric => (
                        <div key={metric.id} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-green-500 mt-0.5" />
                          <div>
                            <div className="text-sm font-medium">{metric.name}</div>
                            <div className="text-xs text-gray-400">{metric.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </ScrollArea>

            {/* Sheet Actions */}
            <div className="p-4 border-t border-gray-800">
              <Button
                onClick={() => {
                  setShowPreview(false);
                  onAnalyze();
                }}
                disabled={totalSelected === 0 || isAnalyzing}
                className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 font-bold"
              >
                {isAnalyzing ? '🔄 Generating Report...' : '📄 Generate Report'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};