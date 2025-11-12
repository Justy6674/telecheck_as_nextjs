import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import {
  Lightbulb,
  Plus,
  Save,
  Bot,
  GitBranch,
  Clock,
  Star,
  Trash2,
  Edit,
  ChevronRight,
  Code,
  Sparkles,
  Rocket,
  Target,
  TrendingUp
} from 'lucide-react';

interface FutureFeature {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'idea' | 'planning' | 'in-progress' | 'testing' | 'completed';
  created_at: Date;
  updated_at: Date;
  ai_refinements?: string[];
  version: number;
  estimated_effort?: string;
  business_value?: string;
  technical_notes?: string;
}

export function AdminFutureFunctionalities() {
  const [features, setFeatures] = useState<FutureFeature[]>([]);
  const [newFeature, setNewFeature] = useState<{
    title: string;
    description: string;
    category: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    estimated_effort: string;
    business_value: string;
  }>({
    title: '',
    description: '',
    category: 'feature',
    priority: 'medium',
    estimated_effort: '',
    business_value: ''
  });
  const [selectedFeature, setSelectedFeature] = useState<FutureFeature | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Load features from localStorage (or Supabase in production)
  useEffect(() => {
    loadFeatures();
  }, []);

  const loadFeatures = () => {
    const stored = localStorage.getItem('future_features');
    if (stored) {
      setFeatures(JSON.parse(stored));
    } else {
      // Initialize with some default ideas
      const defaultFeatures: FutureFeature[] = [
        {
          id: '1',
          title: 'AI-Powered Disaster Prediction',
          description: 'Use machine learning to predict which areas are likely to be declared disaster zones based on weather patterns and historical data',
          category: 'AI/ML',
          priority: 'high',
          status: 'idea',
          created_at: new Date(),
          updated_at: new Date(),
          version: 1,
          estimated_effort: '3-4 months',
          business_value: 'High - Proactive patient care'
        },
        {
          id: '2',
          title: 'Mobile App with Offline Mode',
          description: 'Native mobile app that works offline in disaster areas with poor connectivity',
          category: 'Mobile',
          priority: 'high',
          status: 'planning',
          created_at: new Date(),
          updated_at: new Date(),
          version: 1,
          estimated_effort: '2-3 months',
          business_value: 'Critical - Accessibility in disasters'
        },
        {
          id: '3',
          title: 'Bulk Clinic Import/Export',
          description: 'Allow clinics to import multiple locations via CSV and export eligibility reports',
          category: 'feature',
          priority: 'medium',
          status: 'idea',
          created_at: new Date(),
          updated_at: new Date(),
          version: 1,
          estimated_effort: '1-2 weeks',
          business_value: 'Medium - Enterprise features'
        },
        {
          id: '4',
          title: 'WhatsApp/SMS Bot Integration',
          description: 'Allow patients to check eligibility via WhatsApp or SMS without internet',
          category: 'Integration',
          priority: 'medium',
          status: 'idea',
          created_at: new Date(),
          updated_at: new Date(),
          version: 1,
          estimated_effort: '3-4 weeks',
          business_value: 'High - Accessibility'
        },
        {
          id: '5',
          title: 'Real-time Disaster Alerts',
          description: 'Push notifications when new disasters are declared in subscribed areas',
          category: 'Notification',
          priority: 'high',
          status: 'planning',
          created_at: new Date(),
          updated_at: new Date(),
          version: 1,
          estimated_effort: '2-3 weeks',
          business_value: 'High - User engagement'
        },
        {
          id: '6',
          title: 'Telehealth Service Optimizer',
          description: 'Suggest optimal telehealth services based on disaster type and patient conditions',
          category: 'AI/ML',
          priority: 'high',
          status: 'idea',
          created_at: new Date(),
          updated_at: new Date(),
          version: 1,
          estimated_effort: '1-2 months',
          business_value: 'Very High - Revenue optimization'
        },
        {
          id: '7',
          title: 'Compliance Audit Trail',
          description: 'Complete audit logging for Medicare compliance requirements',
          category: 'Compliance',
          priority: 'critical',
          status: 'planning',
          created_at: new Date(),
          updated_at: new Date(),
          version: 1,
          estimated_effort: '2-3 weeks',
          business_value: 'Critical - Legal requirement'
        },
        {
          id: '8',
          title: 'API for Practice Management Systems',
          description: 'RESTful API for integration with Medical Director, Best Practice, Genie, etc.',
          category: 'Integration',
          priority: 'high',
          status: 'idea',
          created_at: new Date(),
          updated_at: new Date(),
          version: 1,
          estimated_effort: '1-2 months',
          business_value: 'Very High - Market expansion'
        }
      ];
      setFeatures(defaultFeatures);
      localStorage.setItem('future_features', JSON.stringify(defaultFeatures));
    }
  };

  const saveFeatures = (updatedFeatures: FutureFeature[]) => {
    setFeatures(updatedFeatures);
    localStorage.setItem('future_features', JSON.stringify(updatedFeatures));
  };

  const addFeature = () => {
    if (!newFeature.title || !newFeature.description) return;

    const feature: FutureFeature = {
      id: Date.now().toString(),
      ...newFeature,
      status: 'idea',
      created_at: new Date(),
      updated_at: new Date(),
      version: 1
    };

    saveFeatures([...features, feature]);
    setNewFeature({
      title: '',
      description: '',
      category: 'feature',
      priority: 'medium',
      estimated_effort: '',
      business_value: ''
    });
  };

  const updateFeatureStatus = (id: string, status: FutureFeature['status']) => {
    const updated = features.map(f =>
      f.id === id ? { ...f, status, updated_at: new Date() } : f
    );
    saveFeatures(updated);
  };

  const deleteFeature = (id: string) => {
    if (confirm('Delete this feature idea?')) {
      saveFeatures(features.filter(f => f.id !== id));
    }
  };

  const refineWithAI = async (feature: FutureFeature) => {
    setIsProcessing(true);
    try {
      // In production, this would call an edge function with OpenAI
      const { data } = await supabase.functions.invoke('refine-feature-with-ai', {
        body: {
          feature,
          prompt: aiPrompt || 'Refine this feature idea with implementation details and potential challenges'
        }
      });

      if (data) {
        const refined = features.map(f =>
          f.id === feature.id
            ? {
                ...f,
                ai_refinements: [...(f.ai_refinements || []), data.refinement],
                version: f.version + 1,
                updated_at: new Date()
              }
            : f
        );
        saveFeatures(refined);
      }
    } catch (error) {
      // For now, simulate AI refinement
      const simulatedRefinement = `AI Analysis for "${feature.title}":

Technical Implementation:
- Backend: Create new Supabase edge functions
- Frontend: Add React components with real-time updates
- Database: New tables for ${feature.category} data

Challenges:
- Integration complexity with existing systems
- Performance optimization needed
- Security considerations for sensitive data

Recommended Approach:
1. Start with MVP implementation
2. Gather user feedback
3. Iterate based on real usage data

Estimated ROI: High - addresses key user pain point`;

      const refined = features.map(f =>
        f.id === feature.id
          ? {
              ...f,
              ai_refinements: [...(f.ai_refinements || []), simulatedRefinement],
              version: f.version + 1,
              updated_at: new Date()
            }
          : f
      );
      saveFeatures(refined);
    } finally {
      setIsProcessing(false);
      setAiPrompt('');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'in-progress': return 'secondary';
      case 'testing': return 'outline';
      case 'planning': return 'outline';
      default: return 'secondary';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'AI/ML': return <Sparkles className="h-4 w-4" />;
      case 'Mobile': return <Rocket className="h-4 w-4" />;
      case 'Integration': return <GitBranch className="h-4 w-4" />;
      case 'Compliance': return <Target className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-6 w-6" />
            Future Functionalities Lab
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <Sparkles className="h-4 w-4" />
            <AlertDescription>
              Track, refine, and version-control feature ideas. Use AI to expand concepts and estimate implementation effort.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Add New Feature */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Feature Idea
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Feature Title"
              value={newFeature.title}
              onChange={(e) => setNewFeature({...newFeature, title: e.target.value})}
            />
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
              value={newFeature.category}
              onChange={(e) => setNewFeature({...newFeature, category: e.target.value})}
            >
              <option value="feature">Feature</option>
              <option value="AI/ML">AI/ML</option>
              <option value="Mobile">Mobile</option>
              <option value="Integration">Integration</option>
              <option value="Compliance">Compliance</option>
              <option value="Notification">Notification</option>
              <option value="Analytics">Analytics</option>
              <option value="Security">Security</option>
            </select>
          </div>

          <Textarea
            placeholder="Describe the feature in detail..."
            value={newFeature.description}
            onChange={(e) => setNewFeature({...newFeature, description: e.target.value})}
            rows={3}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
              value={newFeature.priority}
              onChange={(e) => setNewFeature({...newFeature, priority: e.target.value as 'low' | 'medium' | 'high' | 'critical'})}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
              <option value="critical">Critical</option>
            </select>

            <Input
              placeholder="Estimated Effort"
              value={newFeature.estimated_effort}
              onChange={(e) => setNewFeature({...newFeature, estimated_effort: e.target.value})}
            />

            <Input
              placeholder="Business Value"
              value={newFeature.business_value}
              onChange={(e) => setNewFeature({...newFeature, business_value: e.target.value})}
            />
          </div>

          <Button onClick={addFeature} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Feature to Backlog
          </Button>
        </CardContent>
      </Card>

      {/* Features List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature) => (
          <Card key={feature.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2">
                  {getCategoryIcon(feature.category)}
                  <div className="flex-1">
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {feature.description}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge variant={getPriorityColor(feature.priority)}>
                    {feature.priority}
                  </Badge>
                  <Badge variant={getStatusColor(feature.status)}>
                    {feature.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Metadata */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Effort:</span>{' '}
                  {feature.estimated_effort || 'TBD'}
                </div>
                <div>
                  <span className="text-muted-foreground">Value:</span>{' '}
                  {feature.business_value || 'TBD'}
                </div>
                <div>
                  <span className="text-muted-foreground">Version:</span> {feature.version}
                </div>
                <div>
                  <span className="text-muted-foreground">Category:</span> {feature.category}
                </div>
              </div>

              {/* Status Update */}
              <div className="flex gap-1">
                {(['idea', 'planning', 'in-progress', 'testing', 'completed'] as const).map((status) => (
                  <Button
                    key={status}
                    size="sm"
                    variant={feature.status === status ? 'default' : 'outline'}
                    onClick={() => updateFeatureStatus(feature.id, status)}
                    className="flex-1 text-xs"
                  >
                    {status}
                  </Button>
                ))}
              </div>

              {/* AI Refinement */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="AI refinement prompt..."
                    value={selectedFeature?.id === feature.id ? aiPrompt : ''}
                    onChange={(e) => {
                      setSelectedFeature(feature);
                      setAiPrompt(e.target.value);
                    }}
                    onFocus={() => setSelectedFeature(feature)}
                    className="text-sm"
                  />
                  <Button
                    size="sm"
                    onClick={() => refineWithAI(feature)}
                    disabled={isProcessing || selectedFeature?.id !== feature.id}
                  >
                    <Bot className="h-4 w-4" />
                  </Button>
                </div>

                {feature.ai_refinements && feature.ai_refinements.length > 0 && (
                  <details className="cursor-pointer">
                    <summary className="text-xs text-muted-foreground">
                      View AI Refinements ({feature.ai_refinements.length})
                    </summary>
                    <div className="mt-2 space-y-2">
                      {feature.ai_refinements.map((refinement, index) => (
                        <div key={index} className="p-2 bg-muted rounded text-xs">
                          <pre className="whitespace-pre-wrap">{refinement}</pre>
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteFeature(feature.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Backlog Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{features.length}</div>
              <div className="text-sm text-muted-foreground">Total Features</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {features.filter(f => f.status === 'in-progress').length}
              </div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {features.filter(f => f.priority === 'high' || f.priority === 'critical').length}
              </div>
              <div className="text-sm text-muted-foreground">High Priority</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {features.filter(f => f.ai_refinements && f.ai_refinements.length > 0).length}
              </div>
              <div className="text-sm text-muted-foreground">AI Refined</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}