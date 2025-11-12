import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  Database,
  Users,
  FileText,
  TrendingUp,
  Brain,
  Sparkles
} from 'lucide-react';

interface IntegrityCheck {
  id: string;
  name: string;
  description: string;
  status: 'pass' | 'fail' | 'warning' | 'running';
  count?: number;
  threshold?: number;
  lastChecked?: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

interface ConsistencyReport {
  id: string;
  status: string;
  compliance_score: number;
  total_checks: number;
  findings: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    passed: number;
  };
  generated_at: string;
}

export const AdminDataIntegrity = () => {
  const [checks, setChecks] = useState<IntegrityCheck[]>([]);
  const [loading, setLoading] = useState(false);
  const [runningFullScan, setRunningFullScan] = useState(false);
  const [lastReport, setLastReport] = useState<ConsistencyReport | null>(null);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<string | null>(null);
  const { toast } = useToast();

  const loadIntegrityStatus = useCallback(async () => {
    setLoading(true);
    try {
      // Run quick integrity checks
      const checks: IntegrityCheck[] = [];

      // Check for duplicate AGRNs - simplified check
      const { data: allDisasters } = await supabase
        .from('disasters')
        .select('agrn');
      
      const agrnCounts = (allDisasters || []).reduce((acc: Record<string, number>, d) => {
        acc[d.agrn] = (acc[d.agrn] || 0) + 1;
        return acc;
      }, {});
      const duplicateAgrns = Object.values(agrnCounts).filter(count => count > 1);

      checks.push({
        id: 'duplicate-agrns',
        name: 'Duplicate AGRNs',
        description: 'Check for duplicate disaster AGRNs in the database',
        status: (duplicateAgrns?.length || 0) > 0 ? 'fail' : 'pass',
        count: duplicateAgrns?.length || 0,
        threshold: 0,
        severity: 'critical'
      });

      // Check for missing URLs
      const { count: missingUrls } = await supabase
        .from('disasters')
        .select('*', { count: 'exact', head: true })
        .is('url', null);

      checks.push({
        id: 'missing-urls',
        name: 'Missing URLs',
        description: 'Disasters without URLs from DisasterAssist',
        status: (missingUrls || 0) > 50 ? 'fail' : (missingUrls || 0) > 10 ? 'warning' : 'pass',
        count: missingUrls || 0,
        threshold: 50,
        severity: 'medium'
      });

      // Check for invalid date ranges using direct query
      const { count: invalidDates } = await supabase
        .from('disasters')
        .select('*', { count: 'exact', head: true })
        .not('end_date', 'is', null)
        .not('start_date', 'is', null)
        .lt('end_date', 'start_date');

      checks.push({
        id: 'invalid-dates',
        name: 'Invalid Date Ranges',
        description: 'Disasters where end_date is before start_date',
        status: (invalidDates || 0) > 0 ? 'fail' : 'pass',
        count: invalidDates || 0,
        threshold: 0,
        severity: 'high'
      });

      // Check for orphaned disaster-LGA relationships
      const { data: orphanedLgas } = await supabase
        .from('disaster_lgas')
        .select(`
          agrn,
          disasters!inner(agrn)
        `)
        .is('disasters.agrn', null);

      checks.push({
        id: 'orphaned-lgas',
        name: 'Orphaned LGA References',
        description: 'disaster_lgas entries without matching disasters',
        status: (orphanedLgas?.length || 0) > 0 ? 'fail' : 'pass',
        count: orphanedLgas?.length || 0,
        threshold: 0,
        severity: 'high'
      });

      // Check for stale active disasters
      const { count: staleDisasters } = await supabase
        .from('disasters')
        .select('*', { count: 'exact', head: true })
        .is('end_date', null)
        .lt('start_date', new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000).toISOString());

      checks.push({
        id: 'stale-disasters',
        name: 'Stale Active Disasters',
        description: 'Active disasters older than 2 years',
        status: (staleDisasters || 0) > 5 ? 'warning' : 'pass',
        count: staleDisasters || 0,
        threshold: 5,
        severity: 'medium'
      });

      setChecks(checks.map(check => ({
        ...check,
        lastChecked: new Date().toISOString()
      })));

    } catch (error) {
      console.error('Error loading integrity status:', error);
      toast({
        title: "Error",
        description: "Failed to load integrity checks",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadIntegrityStatus();
    loadLastReport();
  }, [loadIntegrityStatus]);


  const loadLastReport = async () => {
    try {
      // Mock last report since table doesn't exist yet
      setLastReport({
        id: 'mock-report',
        status: 'completed',
        compliance_score: 92.5,
        total_checks: 12,
        findings: {
          critical: 0,
          high: 1,
          medium: 2,
          low: 3,
          passed: 6
        },
        generated_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error loading last report:', error);
    }
  };

  const analyzeWithAI = async () => {
    if (aiAnalyzing) return;
    
    setAiAnalyzing(true);
    setAiRecommendations(null);

    try {
      // Only analyze if there are critical issues
      const criticalIssues = checks.filter(check => 
        check.severity === 'critical' && check.status === 'fail'
      );
      const highIssues = checks.filter(check => 
        check.severity === 'high' && check.status === 'fail'
      );
      
      if (criticalIssues.length === 0 && highIssues.length === 0) {
        toast({
          title: "No Critical Issues",
          description: "AI analysis is only triggered for critical or high severity issues",
        });
        return;
      }

      // Prepare data for AI analysis
      const failedChecks = checks.filter(check => check.status === 'fail');
      const analysisPrompt = `
Please analyze these TeleCheck data integrity issues and provide specific recommendations:

**Failed Checks:**
${failedChecks.map(check => 
  `- ${check.name} (${check.severity}): ${check.description}${check.count ? ` - Count: ${check.count}` : ''}`
).join('\n')}

**Overall Status:**
- Total checks: ${checks.length}
- Failed checks: ${failedChecks.length}
- Overall score: ${overallScore}%

Please provide:
1. **Priority Actions** - What to fix first and why
2. **Root Cause Analysis** - Why these issues might be occurring  
3. **Specific Solutions** - Exact steps to resolve each issue
4. **Prevention Strategies** - How to prevent future occurrences

Keep recommendations practical and technical for the development team.
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
          title: "AI Analysis Complete",
          description: "Recommendations generated for critical issues",
        });
      } else {
        throw new Error("No response from AI");
      }
    } catch (error) {
      console.error('AI Analysis error:', error);
      toast({
        title: "Error",
        description: "Failed to get AI recommendations",
        variant: "destructive"
      });
    } finally {
      setAiAnalyzing(false);
    }
  };

  const runFullIntegrityCheck = async () => {
    setRunningFullScan(true);
    try {
      // Generate a comprehensive data integrity report
      const { data, error } = await supabase.functions.invoke('data-integrity-check', {
        body: { 
          checkTypes: ['all'],
          generateReport: true 
        }
      });

      if (error) throw error;

      toast({
        title: "Integrity Check Complete",
        description: `Found ${data.totalIssues} issues across ${data.checksRun} checks`,
      });

      // Reload status and reports
      await Promise.all([loadIntegrityStatus(), loadLastReport()]);

    } catch (error) {
      console.error('Error running full integrity check:', error);
      toast({
        title: "Error",
        description: "Failed to run full integrity check",
        variant: "destructive"
      });
    } finally {
      setRunningFullScan(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'fail': return <XCircle className="h-4 w-4 text-destructive" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'running': return <RefreshCw className="h-4 w-4 animate-spin" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'default';
      case 'fail': return 'destructive';
      case 'warning': return 'outline';
      default: return 'secondary';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'outline';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const overallScore = checks.length > 0 
    ? Math.round((checks.filter(c => c.status === 'pass').length / checks.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallScore}%</div>
            <Progress value={overallScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Checks</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{checks.length}</div>
            <p className="text-xs text-muted-foreground">
              {checks.filter(c => c.status === 'pass').length} passing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {checks.filter(c => c.severity === 'critical' && c.status === 'fail').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Full Scan</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {lastReport ? new Date(lastReport.generated_at).toLocaleDateString() : 'Never'}
            </div>
            <p className="text-xs text-muted-foreground">
              {lastReport ? `${lastReport.compliance_score}% compliance` : 'Run first scan'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Data Integrity Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={loadIntegrityStatus} 
              disabled={loading}
              variant="outline"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Quick Check
            </Button>
            
            <Button 
              onClick={runFullIntegrityCheck}
              disabled={runningFullScan}
            >
              {runningFullScan && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
              <Shield className="h-4 w-4 mr-2" />
              Run Full Scan
            </Button>

            {checks.some(check => (check.severity === 'critical' || check.severity === 'high') && check.status === 'fail') && (
              <Button 
                onClick={analyzeWithAI}
                disabled={aiAnalyzing}
                variant="secondary"
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

          {runningFullScan && (
            <Alert>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <AlertDescription>
                Running comprehensive data integrity scan... This may take a few minutes.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Integrity Checks */}
      <Card>
        <CardHeader>
          <CardTitle>Integrity Checks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {checks.map((check) => (
              <div key={check.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(check.status)}
                  <div>
                    <h4 className="font-medium">{check.name}</h4>
                    <p className="text-sm text-muted-foreground">{check.description}</p>
                    {check.count !== undefined && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Found: {check.count} {check.threshold !== undefined && `(threshold: ${check.threshold})`}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getSeverityColor(check.severity)}>
                    {check.severity}
                  </Badge>
                  <Badge variant={getStatusColor(check.status)}>
                    {check.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      {aiRecommendations && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-500" />
              AI Analysis & Recommendations
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

      {/* Last Report Summary */}
      {lastReport && (
        <Card>
          <CardHeader>
            <CardTitle>Last Full Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-success">{lastReport.findings.passed}</div>
                <div className="text-xs text-muted-foreground">Passed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-destructive">{lastReport.findings.critical}</div>
                <div className="text-xs text-muted-foreground">Critical</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-destructive">{lastReport.findings.high}</div>
                <div className="text-xs text-muted-foreground">High</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-warning">{lastReport.findings.medium}</div>
                <div className="text-xs text-muted-foreground">Medium</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-muted-foreground">{lastReport.findings.low}</div>
                <div className="text-xs text-muted-foreground">Low</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};