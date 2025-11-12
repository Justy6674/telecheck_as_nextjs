import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from '@/hooks/use-toast';
import {
  Settings2,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  MapPin,
  Heart,
  Activity,
  Briefcase,
  Check,
  X,
  Plus,
  Minus,
  Eye,
  EyeOff,
  Clock,
  Sparkles
} from 'lucide-react';

interface MetricDefinition {
  id: string;
  name: string;
  category: 'geographic' | 'medicare' | 'operations' | 'business';
  description: string;
  analysisType: 'basic' | 'detailed' | 'comprehensive';
  estimatedTime?: number; // seconds
}

interface SessionDataStore {
  sessionId: string;
  uploadedAt: string;
  patientData: {
    postcodes: string[];
    totalPatients: number;
    uniquePostcodes: number;
  };
  clinicConfig: {
    practitionerCount: number;
    consultationMinutes: number;
    serviceModel: string;
    practiceName?: string;
  };
  metricCache: Map<string, any>;
  selectionHistory: Array<{
    timestamp: string;
    action: 'add' | 'remove';
    metrics: string[];
    reason?: string;
  }>;
}

interface PostReportMetricControlsProps {
  currentMetrics: string[];
  allAvailableMetrics: MetricDefinition[];
  sessionData: SessionDataStore;
  onMetricsChange: (newSelection: string[]) => Promise<void>;
  onGeneratePDF: (selectedMetrics: string[]) => void;
  isProcessing?: boolean;
  className?: string;
}

// Dark mode medical professional theme
const darkTheme = {
  background: {
    primary: '#0F172A',    // Deep medical blue
    secondary: '#1E293B',  // Elevated surfaces
    tertiary: '#334155',   // Interactive elements
  },
  text: {
    primary: '#F8FAFC',    // High contrast white
    secondary: '#CBD5E1',  // Subdued text
    accent: '#06B6D4',     // Medical cyan
  },
  medical: {
    success: '#10B981',    // Safe green
    warning: '#F59E0B',    // Attention amber
    error: '#EF4444',      // Alert red
    info: '#3B82F6',       // Information blue
  }
};

export const PostReportMetricControls: React.FC<PostReportMetricControlsProps> = ({
  currentMetrics,
  allAvailableMetrics,
  sessionData,
  onMetricsChange,
  onGeneratePDF,
  isProcessing = false,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedMetrics, setSelectedMetrics] = useState(new Set(currentMetrics));
  const [previewMode, setPreviewMode] = useState(false);
  const [activeCategory, setActiveCategory] = useState('geographic');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Categorize metrics
  const categorizedMetrics = useMemo(() => {
    const categories: Record<string, MetricDefinition[]> = {
      geographic: [],
      medicare: [],
      operations: [],
      business: []
    };

    allAvailableMetrics.forEach(metric => {
      categories[metric.category].push(metric);
    });

    return categories;
  }, [allAvailableMetrics]);

  // Calculate changes
  const pendingChanges = useMemo(() => {
    const toAdd = Array.from(selectedMetrics).filter(m => !currentMetrics.includes(m));
    const toRemove = currentMetrics.filter(m => !selectedMetrics.has(m));

    return { toAdd, toRemove };
  }, [selectedMetrics, currentMetrics]);

  // Smart selection modes
  const selectionModes = {
    essential: {
      name: 'Essential Analysis',
      description: '10 key metrics for quick assessment',
      metrics: [
        'patient_distribution', 'eligibility_rate', 'patients_per_practitioner', 'growth_potential',
        'distance_band', 'active_disaster', 'utilization', 'patient_segments',
        'lga_distribution', 'claim_potential'
      ]
    },
    comprehensive: {
      name: 'Comprehensive Review',
      description: 'All 40 metrics for complete analysis',
      metrics: allAvailableMetrics.map(m => m.id)
    }
  };

  const handleMetricToggle = useCallback((metricId: string) => {
    setSelectedMetrics(prev => {
      const newSet = new Set(prev);
      if (newSet.has(metricId)) {
        newSet.delete(metricId);
      } else {
        newSet.add(metricId);
      }
      return newSet;
    });
  }, []);

  const handleCategoryToggle = useCallback((category: string, selectAll: boolean) => {
    setSelectedMetrics(prev => {
      const newSet = new Set(prev);
      const categoryMetrics = categorizedMetrics[category];

      categoryMetrics.forEach(metric => {
        if (selectAll) {
          newSet.add(metric.id);
        } else {
          newSet.delete(metric.id);
        }
      });

      return newSet;
    });
  }, [categorizedMetrics]);

  const handleSelectionMode = useCallback((mode: keyof typeof selectionModes) => {
    setSelectedMetrics(new Set(selectionModes[mode].metrics));
  }, []);

  const handleApplyChanges = useCallback(async () => {
    if (pendingChanges.toAdd.length === 0 && pendingChanges.toRemove.length === 0) {
      toast({
        title: "No Changes",
        description: "No metric modifications to apply.",
      });
      return;
    }

    setIsUpdating(true);
    try {
      const newSelection = Array.from(selectedMetrics);
      await onMetricsChange(newSelection);

      // Add to history
      sessionData.selectionHistory.push({
        timestamp: new Date().toISOString(),
        action: pendingChanges.toAdd.length > pendingChanges.toRemove.length ? 'add' : 'remove',
        metrics: [...pendingChanges.toAdd, ...pendingChanges.toRemove],
      });

      toast({
        title: "Analysis Updated",
        description: `${pendingChanges.toAdd.length} metrics added, ${pendingChanges.toRemove.length} metrics removed.`,
        className: "bg-slate-900 border-slate-700 text-slate-100"
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update analysis. Please try again.",
        variant: "destructive",
        className: "bg-red-900 border-red-700 text-red-100"
      });
    } finally {
      setIsUpdating(false);
    }
  }, [selectedMetrics, pendingChanges, onMetricsChange, sessionData]);

  const handleGeneratePDF = useCallback(() => {
    const metricsToExport = Array.from(selectedMetrics);
    onGeneratePDF(metricsToExport);

    toast({
      title: "PDF Generation Started",
      description: `Generating PDF with ${metricsToExport.length} selected metrics...`,
      className: "bg-slate-900 border-slate-700 text-slate-100"
    });
  }, [selectedMetrics, onGeneratePDF]);

  const resetToOriginal = useCallback(() => {
    setSelectedMetrics(new Set(currentMetrics));
  }, [currentMetrics]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'geographic': return <MapPin className="w-4 h-4" />;
      case 'medicare': return <Heart className="w-4 h-4" />;
      case 'operations': return <Activity className="w-4 h-4" />;
      case 'business': return <Briefcase className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  const renderMetricCard = (metric: MetricDefinition) => {
    const isSelected = selectedMetrics.has(metric.id);
    const isPending = pendingChanges.toAdd.includes(metric.id) || pendingChanges.toRemove.includes(metric.id);

    return (
      <Card
        key={metric.id}
        className={`transition-all duration-300 cursor-pointer hover:shadow-xl
          ${isSelected
            ? 'bg-slate-800 border-cyan-500 ring-2 ring-cyan-500/50'
            : 'bg-slate-900 border-slate-700 hover:border-slate-600'
          }
          ${isPending ? 'ring-2 ring-amber-400/50' : ''}
        `}
        onClick={() => handleMetricToggle(metric.id)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-medium text-slate-100">
                  {metric.name}
                </h4>
                {isPending && (
                  <Badge variant="outline" className="text-xs bg-amber-500/20 text-amber-400 border-amber-400/50">
                    Pending
                  </Badge>
                )}
              </div>
              <p className="text-xs text-slate-400 mb-2">
                {metric.description}
              </p>
              {metric.estimatedTime && (
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="w-3 h-3" />
                  ~{metric.estimatedTime}s
                </div>
              )}
            </div>
            <Switch
              checked={isSelected}
              onCheckedChange={() => handleMetricToggle(metric.id)}
              className="data-[state=checked]:bg-cyan-500"
            />
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={`bg-slate-900 border border-slate-700 rounded-lg shadow-2xl ${className}`}>
      {/* Header - Always visible */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings2 className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-lg font-semibold text-slate-100">
                Modify Analysis
              </h3>
              <p className="text-sm text-slate-400">
                {selectedMetrics.size} of {allAvailableMetrics.length} metrics selected
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick actions when collapsed */}
            {!isExpanded && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGeneratePDF}
                  disabled={selectedMetrics.size === 0 || isProcessing}
                  className="bg-slate-800 border-slate-600 text-slate-100 hover:bg-slate-700"
                >
                  <Download className="w-4 h-4 mr-1" />
                  PDF
                </Button>
              </>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-slate-100 hover:bg-slate-800"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-1" />
                  Collapse
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-1" />
                  Expand
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Progress indicator for pending changes */}
        {(pendingChanges.toAdd.length > 0 || pendingChanges.toRemove.length > 0) && (
          <div className="mt-3 p-3 bg-slate-800 rounded-lg border border-amber-500/50">
            <div className="flex items-center justify-between text-sm">
              <div className="text-slate-300">
                <span className="text-green-400">+{pendingChanges.toAdd.length}</span>
                {' • '}
                <span className="text-red-400">-{pendingChanges.toRemove.length}</span>
                {' metrics to update'}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={resetToOriginal}
                  className="bg-slate-700 border-slate-600 text-slate-100 hover:bg-slate-600"
                >
                  Reset
                </Button>
                <Button
                  size="sm"
                  onClick={handleApplyChanges}
                  disabled={isUpdating}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white"
                >
                  {isUpdating ? (
                    <>
                      <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Apply Changes'
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Expandable Content */}
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleContent className="space-y-0">
          {/* Smart Selection Modes */}
          <div className="p-4 border-b border-slate-700 bg-slate-800/50">
            <h4 className="text-sm font-medium text-slate-100 mb-3">Quick Selection</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {Object.entries(selectionModes).map(([key, mode]) => (
                <Button
                  key={key}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelectionMode(key as keyof typeof selectionModes)}
                  className="justify-start bg-slate-800 border-slate-600 text-slate-100 hover:bg-slate-700"
                >
                  <Check className="w-4 h-4 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">{mode.name}</div>
                    <div className="text-xs text-slate-400">{mode.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Metric Categories */}
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <div className="px-4 pt-4">
              <TabsList className="grid w-full grid-cols-4 bg-slate-800">
                {Object.entries(categorizedMetrics).map(([category, metrics]) => {
                  const selectedInCategory = metrics.filter(m => selectedMetrics.has(m.id)).length;
                  return (
                    <TabsTrigger
                      key={category}
                      value={category}
                      className="flex items-center gap-1 data-[state=active]:bg-cyan-600 data-[state=active]:text-white"
                    >
                      {getCategoryIcon(category)}
                      <span className="hidden sm:inline capitalize">
                        {category}
                      </span>
                      <Badge variant="secondary" className="ml-1 bg-slate-700 text-slate-300 text-xs">
                        {selectedInCategory}/{metrics.length}
                      </Badge>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            <ScrollArea className="h-96">
              <div className="p-4">
                {Object.entries(categorizedMetrics).map(([category, metrics]) => (
                  <TabsContent key={category} value={category} className="mt-0">
                    <div className="space-y-4">
                      {/* Category controls */}
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-medium text-slate-100 capitalize flex items-center gap-2">
                          {getCategoryIcon(category)}
                          {category} Intelligence
                        </h4>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCategoryToggle(category, true)}
                            className="bg-slate-800 border-slate-600 text-slate-100 hover:bg-slate-700"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Select All
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCategoryToggle(category, false)}
                            className="bg-slate-800 border-slate-600 text-slate-100 hover:bg-slate-700"
                          >
                            <Minus className="w-3 h-3 mr-1" />
                            Deselect All
                          </Button>
                        </div>
                      </div>

                      {/* Metric cards */}
                      <div className="grid gap-3">
                        {metrics.map(renderMetricCard)}
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </div>
            </ScrollArea>
          </Tabs>

          {/* Action buttons */}
          <div className="p-4 border-t border-slate-700 bg-slate-800/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewMode(!previewMode)}
                  className="bg-slate-700 border-slate-600 text-slate-100 hover:bg-slate-600"
                >
                  {previewMode ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                  Preview
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHistory(!showHistory)}
                  className="bg-slate-700 border-slate-600 text-slate-100 hover:bg-slate-600"
                >
                  History
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={handleGeneratePDF}
                  disabled={selectedMetrics.size === 0 || isProcessing}
                  className="bg-slate-700 border-slate-600 text-slate-100 hover:bg-slate-600"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Generate PDF ({selectedMetrics.size} metrics)
                </Button>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};