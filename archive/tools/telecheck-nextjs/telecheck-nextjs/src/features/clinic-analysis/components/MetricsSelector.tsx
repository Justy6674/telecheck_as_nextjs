import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  MapPin, 
  DollarSign, 
  Settings,
  Target,
  CheckCircle
} from 'lucide-react';
import type { FilterConfiguration, AnalysisMetric } from '../types';

interface MetricsSelectorProps {
  onFiltersSelected: (filters: FilterConfiguration) => void;
}

// 40 Enterprise Analysis Metrics
const ALL_METRICS: AnalysisMetric[] = [
  // Geographic Metrics (10)
  { id: 'geo_1', category: 'geographic', name: 'Patient Distribution', description: 'Geographic spread of patients', computationWeight: 'light', requiresHistoricalData: false },
  { id: 'geo_2', category: 'geographic', name: 'Distance Analysis', description: 'Travel distance patterns', computationWeight: 'medium', requiresHistoricalData: false },
  { id: 'geo_3', category: 'geographic', name: 'State Breakdown', description: 'Patient distribution by state', computationWeight: 'light', requiresHistoricalData: false },
  { id: 'geo_4', category: 'geographic', name: 'Remoteness Analysis', description: 'Urban vs rural distribution', computationWeight: 'medium', requiresHistoricalData: false },
  { id: 'geo_5', category: 'geographic', name: 'LGA Distribution', description: 'Local government area analysis', computationWeight: 'medium', requiresHistoricalData: false },
  { id: 'geo_6', category: 'geographic', name: 'Suburb Clusters', description: 'High-density patient areas', computationWeight: 'heavy', requiresHistoricalData: false },
  { id: 'geo_7', category: 'geographic', name: 'Postcode Frequency', description: 'Most common postcodes', computationWeight: 'light', requiresHistoricalData: false },
  { id: 'geo_8', category: 'geographic', name: 'Population Density', description: 'Patients per geographic area', computationWeight: 'medium', requiresHistoricalData: false },
  { id: 'geo_9', category: 'geographic', name: 'Catchment Analysis', description: 'Primary service catchment', computationWeight: 'heavy', requiresHistoricalData: false },
  { id: 'geo_10', category: 'geographic', name: 'Access Patterns', description: 'Geographic access analysis', computationWeight: 'medium', requiresHistoricalData: false },

  // Medicare Metrics (10)
  { id: 'med_1', category: 'medicare', name: 'Eligibility Rate', description: 'Overall Medicare eligibility', computationWeight: 'heavy', requiresHistoricalData: false },
  { id: 'med_2', category: 'medicare', name: 'Active Disasters', description: 'Current disaster declarations', computationWeight: 'medium', requiresHistoricalData: false },
  { id: 'med_3', category: 'medicare', name: 'Time-Based Risk', description: 'Eligibility timeline analysis', computationWeight: 'heavy', requiresHistoricalData: true },
  { id: 'med_4', category: 'medicare', name: 'Disaster Types', description: 'Types of affecting disasters', computationWeight: 'light', requiresHistoricalData: false },
  { id: 'med_5', category: 'medicare', name: 'LGA Eligibility', description: 'Eligibility by local area', computationWeight: 'medium', requiresHistoricalData: false },
  { id: 'med_6', category: 'medicare', name: 'Claim Potential', description: 'Potential claim volume', computationWeight: 'heavy', requiresHistoricalData: false },
  { id: 'med_7', category: 'medicare', name: 'Compliance Timeline', description: 'Audit compliance tracking', computationWeight: 'heavy', requiresHistoricalData: true },
  { id: 'med_8', category: 'medicare', name: 'Postcode Risk', description: 'Risk assessment by postcode', computationWeight: 'medium', requiresHistoricalData: false },
  { id: 'med_9', category: 'medicare', name: 'Documentation Needs', description: 'Required documentation analysis', computationWeight: 'medium', requiresHistoricalData: false },
  { id: 'med_10', category: 'medicare', name: 'Audit Readiness', description: 'Medicare audit preparation', computationWeight: 'heavy', requiresHistoricalData: true },

  // Operations Metrics (10)
  { id: 'ops_1', category: 'operations', name: 'Patient Load', description: 'Patients per practitioner', computationWeight: 'light', requiresHistoricalData: false },
  { id: 'ops_2', category: 'operations', name: 'Utilization Rates', description: 'Service utilization patterns', computationWeight: 'medium', requiresHistoricalData: true },
  { id: 'ops_3', category: 'operations', name: 'Appointment Distribution', description: 'Scheduling optimization', computationWeight: 'medium', requiresHistoricalData: true },
  { id: 'ops_4', category: 'operations', name: 'Workflow Efficiency', description: 'Operational efficiency metrics', computationWeight: 'heavy', requiresHistoricalData: true },
  { id: 'ops_5', category: 'operations', name: 'Resource Allocation', description: 'Resource distribution analysis', computationWeight: 'medium', requiresHistoricalData: false },
  { id: 'ops_6', category: 'operations', name: 'Peak Load Analysis', description: 'High-demand period identification', computationWeight: 'medium', requiresHistoricalData: true },
  { id: 'ops_7', category: 'operations', name: 'Service Mix', description: 'Service type distribution', computationWeight: 'light', requiresHistoricalData: false },
  { id: 'ops_8', category: 'operations', name: 'Coverage Analysis', description: 'Geographic service coverage', computationWeight: 'heavy', requiresHistoricalData: false },
  { id: 'ops_9', category: 'operations', name: 'Patient Flow', description: 'Patient journey analysis', computationWeight: 'heavy', requiresHistoricalData: true },
  { id: 'ops_10', category: 'operations', name: 'Quality Metrics', description: 'Service quality indicators', computationWeight: 'medium', requiresHistoricalData: true },

  // Business Metrics (10)
  { id: 'biz_1', category: 'business', name: 'Market Segments', description: 'Patient demographic segments', computationWeight: 'medium', requiresHistoricalData: false },
  { id: 'biz_2', category: 'business', name: 'Growth Opportunities', description: 'Expansion potential analysis', computationWeight: 'heavy', requiresHistoricalData: true },
  { id: 'biz_3', category: 'business', name: 'Competitive Position', description: 'Market position analysis', computationWeight: 'heavy', requiresHistoricalData: true },
  { id: 'biz_4', category: 'business', name: 'Risk Assessment', description: 'Business risk evaluation', computationWeight: 'heavy', requiresHistoricalData: true },
  { id: 'biz_5', category: 'business', name: 'Market Insights', description: 'Healthcare market trends', computationWeight: 'medium', requiresHistoricalData: true },
  { id: 'biz_6', category: 'business', name: 'Partnership Opportunities', description: 'Collaboration potential', computationWeight: 'medium', requiresHistoricalData: false },
  { id: 'biz_7', category: 'business', name: 'Technology Readiness', description: 'Digital transformation assessment', computationWeight: 'light', requiresHistoricalData: false },
  { id: 'biz_8', category: 'business', name: 'Regulatory Compliance', description: 'Compliance readiness assessment', computationWeight: 'heavy', requiresHistoricalData: true },
  { id: 'biz_9', category: 'business', name: 'Strategic Value', description: 'Strategic positioning analysis', computationWeight: 'heavy', requiresHistoricalData: true },
  { id: 'biz_10', category: 'business', name: 'Performance Benchmarks', description: 'Industry benchmarking', computationWeight: 'medium', requiresHistoricalData: true }
];

export const MetricsSelector: React.FC<MetricsSelectorProps> = ({ onFiltersSelected }) => {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { id: 'geographic', name: 'Geographic Analysis', icon: MapPin, color: 'blue' },
    { id: 'medicare', name: 'Medicare Compliance', icon: Target, color: 'green' },
    { id: 'operations', name: 'Operations', icon: BarChart3, color: 'purple' },
    { id: 'business', name: 'Business Intelligence', icon: DollarSign, color: 'orange' }
  ];

  const handleSelectAll = () => {
    setSelectedMetrics(ALL_METRICS.map(m => m.id));
  };

  const handleSelectCategory = (category: string) => {
    const categoryMetrics = ALL_METRICS.filter(m => m.category === category).map(m => m.id);
    setSelectedMetrics(prev => {
      const withoutCategory = prev.filter(id => !categoryMetrics.includes(id));
      return [...withoutCategory, ...categoryMetrics];
    });
  };

  const handleMetricToggle = (metricId: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metricId) 
        ? prev.filter(id => id !== metricId)
        : [...prev, metricId]
    );
  };

  const handleProceed = () => {
    const filters: FilterConfiguration = {
      selectedMetrics: ALL_METRICS.filter(m => selectedMetrics.includes(m.id)),
      geographicFilters: {
        includeRemoteness: true,
        includeStateBreakdown: true,
        includeLgaAnalysis: true
      },
      timeFilters: {
        includeHistoricalData: true,
        timeRange: '5_years'
      },
      reportOptions: {
        includeCharts: true,
        includeDetailedBreakdown: true,
        exportFormat: 'pdf'
      }
    };
    
    onFiltersSelected(filters);
  };

  const getFilteredMetrics = () => {
    return selectedCategory 
      ? ALL_METRICS.filter(m => m.category === selectedCategory)
      : ALL_METRICS;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Analysis Configuration
          </span>
          <Badge variant="outline">
            {selectedMetrics.length}/40 metrics selected
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button onClick={handleSelectAll} variant="outline" size="sm">
            <CheckCircle className="w-4 h-4 mr-2" />
            Select All 40 Metrics
          </Button>
          {categories.map(category => (
            <Button
              key={category.id}
              onClick={() => handleSelectCategory(category.id)}
              variant="outline"
              size="sm"
              className={selectedCategory === category.id ? 'bg-blue-50' : ''}
            >
              <category.icon className="w-4 h-4 mr-2" />
              {category.name}
            </Button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="grid grid-cols-4 gap-2">
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(
                selectedCategory === category.id ? null : category.id
              )}
            >
              <category.icon className="w-4 h-4 mr-2" />
              {category.name}
            </Button>
          ))}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
          {getFilteredMetrics().map(metric => (
            <div
              key={metric.id}
              className={`p-3 border rounded-lg cursor-pointer transition-all ${
                selectedMetrics.includes(metric.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleMetricToggle(metric.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedMetrics.includes(metric.id)}
                      onChange={() => handleMetricToggle(metric.id)}
                    />
                    <span className="font-medium text-sm">{metric.name}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{metric.description}</p>
                  <div className="flex gap-1 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {metric.category}
                    </Badge>
                    <Badge 
                      variant={metric.computationWeight === 'heavy' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {metric.computationWeight}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Proceed Button */}
        <Button 
          onClick={handleProceed} 
          disabled={selectedMetrics.length === 0}
          className="w-full"
          size="lg"
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Generate Analysis ({selectedMetrics.length} metrics)
        </Button>
      </CardContent>
    </Card>
  );
};