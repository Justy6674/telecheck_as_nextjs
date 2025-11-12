import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  RefreshCw,
  Database,
  Globe,
  Server,
  Brain,
  Sparkles,
  TrendingDown,
  TrendingUp
} from 'lucide-react';

interface SystemMetrics {
  dataQuality: {
    score: number;
    issues: number;
    lastCheck: string;
  };
  scraping: {
    successRate: number;
    failedAttempts: number;
    lastSuccess: string;
  };
  api: {
    responseTime: number;
    uptime: number;
    errors24h: number;
  };
  users: {
    active24h: number;
    failedLogins: number;
    subscriptionIssues: number;
  };
}

interface SystemIssue {
  id: string;
  type: 'critical' | 'warning' | 'info';
  component: string;
  message: string;
  timestamp: string;
  count?: number;
}

export const AdminSystemHealth = () => {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [issues, setIssues] = useState<SystemIssue[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadSystemHealth();
  }, []);

  const loadSystemHealth = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate system health metrics - in production these would come from actual monitoring
      const issues: SystemIssue[] = [];
      
      // Check for recent failed operations
      const { count: recentErrors } = await supabase
        .from('audit_logs')
        .select('*', { count: 'exact', head: true })
        .eq('severity', 'error')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if ((recentErrors || 0) > 10) {
        issues.push({
          id: 'high-error-rate',
          type: 'critical',
          component: 'API',
          message: `High error rate: ${recentErrors} errors in last 24h`,
          timestamp: new Date().toISOString(),
          count: recentErrors || 0
        });
      }

      // Check for missing disaster URLs
      const { count: missingUrls } = await supabase
        .from('disasters')
        .select('*', { count: 'exact', head: true })
        .is('url', null);

      if ((missingUrls || 0) > 100) {
        issues.push({
          id: 'missing-urls',
          type: 'warning',
          component: 'Data',
          message: `${missingUrls} disasters missing source URLs`,
          timestamp: new Date().toISOString(),
          count: missingUrls || 0
        });
      }

      // Check for stale active disasters
      const { count: staleDisasters } = await supabase
        .from('disasters')
        .select('*', { count: 'exact', head: true })
        .is('end_date', null)
        .lt('start_date', new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000).toISOString());

      if ((staleDisasters || 0) > 5) {
        issues.push({
          id: 'stale-disasters',
          type: 'warning',
          component: 'Data Quality',
          message: `${staleDisasters} disasters active for >2 years`,
          timestamp: new Date().toISOString(),
          count: staleDisasters || 0
        });
      }

      // Mock additional system metrics
      setMetrics({
        dataQuality: {
          score: 87.5,
          issues: issues.filter(i => i.component.includes('Data')).length,
          lastCheck: new Date().toISOString()
        },
        scraping: {
          successRate: 76.3, // DisasterAssist blocks many requests
          failedAttempts: 45,
          lastSuccess: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() // 6 hours ago
        },
        api: {
          responseTime: 245,
          uptime: 99.2,
          errors24h: recentErrors || 0
        },
        users: {
          active24h: 23,
          failedLogins: 3,
          subscriptionIssues: 1
        }
      });

      setIssues(issues);
    } catch (error) {
      console.error('Error loading system health:', error);
      toast({
        title: "Error",
        description: "Failed to load system health metrics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const analyzeSystemWithAI = useCallback(async () => {
    if (aiAnalyzing || !metrics) return;
    
    // Only analyze if there are system issues
    const criticalIssues = issues.filter(issue => issue.type === 'critical');
    const warningIssues = issues.filter(issue => issue.type === 'warning');
    
    if (criticalIssues.length === 0 && warningIssues.length < 2) {
      toast({
        title: "System Healthy",
        description: "AI analysis is only triggered when significant issues are detected",
      });
      return;
    }

    setAiAnalyzing(true);
    setAiRecommendations(null);

    try {
      const analysisPrompt = `
Analyze TeleCheck's system health issues and provide specific recommendations:

**System Metrics:**
- Data Quality Score: ${metrics.dataQuality.score}%
- Scraping Success Rate: ${metrics.scraping.successRate}% (DisasterAssist.gov.au blocks automated requests)
- API Response Time: ${metrics.api.responseTime}ms
- Uptime: ${metrics.api.uptime}%
- Errors (24h): ${metrics.api.errors24h}
- Active Users (24h): ${metrics.users.active24h}

**Current Issues:**
${issues.map(issue => `- ${issue.type.toUpperCase()}: ${issue.component} - ${issue.message}`).join('\n')}

**System Context:**
- TeleCheck scrapes DisasterAssist.gov.au for disaster data
- DisasterAssist.gov.au actively blocks automated requests (403 errors)
- Users rely on accurate postcode eligibility checking
- Missing URLs prevent complete data verification
- Stale disaster data affects eligibility accuracy

Please provide:
1. **Priority Fixes** - What to address first and why
2. **Root Cause Analysis** - Why these issues are occurring
3. **Technical Solutions** - Specific ways to resolve each issue
4. **Monitoring Improvements** - Better ways to detect problems early
5. **Performance Optimizations** - How to improve system reliability

Focus on practical, implementable solutions for the development team.
      `;

      const { data: functionData, error: functionError } = await supabase.functions.invoke('ai', {
        body: { message: analysisPrompt }
      });

      if (functionError) {
        throw new Error(functionError.message || "Failed to get AI analysis");
      }

      const aiResponse = functionData?.response;
      if (aiResponse) {
        setAiRecommendations(aiResponse);
        toast({
          title: "System Analysis Complete",
          description: "AI insights generated for current system issues",
        });
      } else {
        throw new Error("No response from AI");
      }
    } catch (error) {
      console.error('AI Analysis error:', error);
      toast({
        title: "Error",
        description: "Failed to analyze system with AI",
        variant: "destructive"
      });
    } finally {
      setAiAnalyzing(false);
    }
  }, [metrics, issues, aiAnalyzing, toast]);

  const getHealthColor = (value: number, isUptime: boolean = false) => {
    if (isUptime) {
      if (value >= 99.5) return 'text-green-600';
      if (value >= 98) return 'text-yellow-600';
      return 'text-red-600';
    }
    if (value >= 90) return 'text-green-600';
    if (value >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'critical': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <CheckCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  const shouldShowAIButton = issues.some(issue => issue.type === 'critical') || 
                           issues.filter(issue => issue.type === 'warning').length >= 2;

  return (
    <div className="space-y-6">
      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Quality</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getHealthColor(metrics?.dataQuality.score || 0)}`}>
              {metrics?.dataQuality.score || 0}%
            </div>
            <Progress value={metrics?.dataQuality.score || 0} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {metrics?.dataQuality.issues || 0} active issues
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scraping Success</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getHealthColor(metrics?.scraping.successRate || 0)}`}>
              {metrics?.scraping.successRate || 0}%
            </div>
            <Progress value={metrics?.scraping.successRate || 0} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {metrics?.scraping.failedAttempts || 0} failures today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Health</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getHealthColor(metrics?.api.uptime || 0, true)}`}>
              {metrics?.api.uptime || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics?.api.responseTime || 0}ms avg response
            </p>
            <p className="text-xs text-muted-foreground">
              {metrics?.api.errors24h || 0} errors (24h)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Activity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.users.active24h || 0}</div>
            <p className="text-xs text-muted-foreground">
              {metrics?.users.failedLogins || 0} failed logins
            </p>
            <p className="text-xs text-muted-foreground">
              {metrics?.users.subscriptionIssues || 0} billing issues
            </p>
          </CardContent>
        </Card>
      </div>

      {/* System Issues */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            System Issues
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={loadSystemHealth} 
              disabled={loading}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>

            {shouldShowAIButton && (
              <Button 
                onClick={analyzeSystemWithAI}
                disabled={aiAnalyzing}
                variant="secondary"
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
              >
                {aiAnalyzing ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Brain className="h-4 w-4 mr-2" />
                )}
                AI Analysis
              </Button>
            )}
          </div>

          {issues.length > 0 ? (
            <div className="space-y-3">
              {issues.map((issue) => (
                <div key={issue.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getIssueIcon(issue.type)}
                    <div>
                      <h4 className="font-medium">{issue.component}</h4>
                      <p className="text-sm text-muted-foreground">{issue.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(issue.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant={issue.type === 'critical' ? 'destructive' : 'outline'}>
                    {issue.type}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
              <p>No system issues detected</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      {aiRecommendations && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-500" />
              AI System Health Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-sm">
                {aiRecommendations}
              </div>
            </div>
            <Button 
              onClick={() => setAiRecommendations(null)}
              variant="outline"
              size="sm"
              className="mt-4"
            >
              Dismiss
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Critical Alert */}
      {issues.some(issue => issue.type === 'critical') && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Critical system issues detected. Run AI analysis for recommended fixes.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};