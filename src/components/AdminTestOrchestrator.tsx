import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { testSchedules, alertThresholds, TestSchedule } from '@/config/automated-testing';
import {
  Play,
  Pause,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Calendar,
  Bell,
  Activity,
  Settings,
  BarChart
} from 'lucide-react';

interface TestRun {
  id: string;
  scheduleId: string;
  startTime: string;
  endTime?: string;
  status: 'running' | 'completed' | 'failed';
  results?: Record<string, unknown>;
  errors?: string[];
}

interface TestMetrics {
  totalRuns: number;
  successRate: number;
  averageDuration: number;
  lastRunTime?: string;
  nextRunTime?: string;
}

export const AdminTestOrchestrator = () => {
  const [schedules, setSchedules] = useState<TestSchedule[]>(testSchedules);
  const [activeRuns, setActiveRuns] = useState<TestRun[]>([]);
  const [metrics, setMetrics] = useState<Record<string, TestMetrics>>({});
  const [orchestratorEnabled, setOrchestratorEnabled] = useState(true);
  const { toast } = useToast();

  const loadTestMetrics = useCallback(async () => {
    try {
      // Load historical test run metrics
      const { data: runs } = await supabase
        .from('audit_logs')
        .select('*')
        .in('action', ['automated_testing', 'compliance_audit', 'production_readiness_check'])
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      // Calculate metrics for each schedule
      const metricsMap: Record<string, TestMetrics> = {};

      for (const schedule of schedules) {
        const scheduleRuns = runs?.filter((r) => {
          const metadata = r.metadata as { suite?: string; summary?: { failed?: number }; duration?: number } | null;
          return metadata?.suite === schedule.parameters?.testType ||
            r.action === schedule.edgeFunction.replace('-', '_');
        }) || [];

        const successful = scheduleRuns.filter((r) => {
          const metadata = r.metadata as { summary?: { failed?: number } } | null;
          return metadata?.summary?.failed === 0;
        }).length;

        metricsMap[schedule.id] = {
          totalRuns: scheduleRuns.length,
          successRate: scheduleRuns.length > 0
            ? Math.round((successful / scheduleRuns.length) * 100)
            : 100,
          averageDuration: scheduleRuns.length > 0
            ? Math.round(scheduleRuns.reduce((sum: number, r) => {
                const metadata = r.metadata as { duration?: number } | null;
                return sum + (metadata?.duration || 0);
              }, 0) / scheduleRuns.length)
            : 0,
          lastRunTime: scheduleRuns[0]?.created_at,
          nextRunTime: getNextRunTime(schedule.schedule)
        };
      }

      setMetrics(metricsMap);
    } catch (error) {
      console.error('Error loading test metrics:', error);
    }
  }, [schedules]);

  const checkScheduledTests = useCallback(() => {
    if (!orchestratorEnabled) return;

    const now = new Date();
    for (const schedule of schedules) {
      if (schedule.enabled && shouldRunNow(schedule, now)) {
        runScheduledTest(schedule);
      }
    }
  }, [orchestratorEnabled, schedules, metrics]);

  useEffect(() => {
    loadTestMetrics();
    const interval = setInterval(checkScheduledTests, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [loadTestMetrics, checkScheduledTests]);


  const shouldRunNow = (schedule: TestSchedule, now: Date): boolean => {
    // This would use a proper cron parser in production
    // For demo, just check if it hasn't run in the expected interval
    const lastRun = metrics[schedule.id]?.lastRunTime;
    if (!lastRun) return true;

    const hoursSinceLastRun = (now.getTime() - new Date(lastRun).getTime()) / (1000 * 60 * 60);

    // Simple check based on schedule pattern
    if (schedule.schedule.includes('* * *')) return hoursSinceLastRun >= 24; // Daily
    if (schedule.schedule.includes('* *')) return hoursSinceLastRun >= 1; // Hourly
    if (schedule.schedule.includes('* * 1')) return hoursSinceLastRun >= 168; // Weekly

    return false;
  };

  const getNextRunTime = (cronExpression: string): string => {
    // Simplified next run calculation
    const now = new Date();
    if (cronExpression.includes('* * *')) {
      // Daily - next day at specified hour
      now.setDate(now.getDate() + 1);
    } else if (cronExpression.includes('* *')) {
      // Hourly
      now.setHours(now.getHours() + 1);
    } else if (cronExpression.includes('* * 1')) {
      // Weekly
      now.setDate(now.getDate() + 7);
    }
    return now.toISOString();
  };

  const runScheduledTest = async (schedule: TestSchedule) => {
    const runId = `${schedule.id}-${Date.now()}`;
    const run: TestRun = {
      id: runId,
      scheduleId: schedule.id,
      startTime: new Date().toISOString(),
      status: 'running'
    };

    setActiveRuns(prev => [...prev, run]);

    try {
      // Call the edge function
      const { data, error } = await supabase.functions.invoke(schedule.edgeFunction, {
        body: schedule.parameters || {}
      });

      if (error) throw error;

      // Update run status
      run.endTime = new Date().toISOString();
      run.status = 'completed';
      run.results = data;

      // Check for failures and send notifications if needed
      if (data.summary?.failed > 0) {
        await sendNotification(schedule, data);
      }

      toast({
        title: 'Test Completed',
        description: `${schedule.name} completed successfully`
      });

    } catch (error) {
      run.endTime = new Date().toISOString();
      run.status = 'failed';
      run.errors = [error.message];

      toast({
        title: 'Test Failed',
        description: `${schedule.name} failed: ${error.message}`,
        variant: 'destructive'
      });
    }

    // Remove from active runs
    setActiveRuns(prev => prev.filter(r => r.id !== runId));

    // Reload metrics
    await loadTestMetrics();
  };

  const sendNotification = async (schedule: TestSchedule, results: Record<string, unknown>) => {
    if (!schedule.notifications) return;

    // In production, this would send actual emails/Slack messages
    console.log('Would send notification for', schedule.name, results);
  };

  const toggleSchedule = (scheduleId: string) => {
    setSchedules(prev => prev.map(s =>
      s.id === scheduleId ? { ...s, enabled: !s.enabled } : s
    ));
  };

  const runTestNow = async (schedule: TestSchedule) => {
    await runScheduledTest(schedule);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Orchestrator Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Automated Test Orchestrator
            </span>
            <div className="flex items-center gap-4">
              <Badge variant={orchestratorEnabled ? 'default' : 'secondary'}>
                {orchestratorEnabled ? 'Active' : 'Paused'}
              </Badge>
              <Switch
                checked={orchestratorEnabled}
                onCheckedChange={setOrchestratorEnabled}
              />
            </div>
          </CardTitle>
          <CardDescription>
            Manages automated testing schedules and notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeRuns.length > 0 && (
            <Alert className="mb-4">
              <Activity className="h-4 w-4" />
              <AlertDescription>
                {activeRuns.length} test{activeRuns.length !== 1 && 's'} currently running
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            {schedules.map((schedule) => {
              const metric = metrics[schedule.id];
              const isRunning = activeRuns.some(r => r.scheduleId === schedule.id);

              return (
                <div key={schedule.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{schedule.name}</h4>
                        {isRunning && <RefreshCw className="h-4 w-4 animate-spin" />}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {schedule.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Schedule: {schedule.schedule}
                        </span>
                        {metric?.lastRunTime && (
                          <span>
                            Last run: {new Date(metric.lastRunTime).toLocaleString()}
                          </span>
                        )}
                        {metric?.nextRunTime && (
                          <span>
                            Next run: {new Date(metric.nextRunTime).toLocaleString()}
                          </span>
                        )}
                      </div>
                      {metric && (
                        <div className="flex items-center gap-4 mt-2">
                          <Badge variant="outline">
                            {metric.totalRuns} runs
                          </Badge>
                          <Badge variant={metric.successRate >= 90 ? 'default' : 'destructive'}>
                            {metric.successRate}% success
                          </Badge>
                          {metric.averageDuration > 0 && (
                            <Badge variant="secondary">
                              Avg {metric.averageDuration}ms
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={schedule.enabled}
                        onCheckedChange={() => toggleSchedule(schedule.id)}
                        disabled={isRunning}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => runTestNow(schedule)}
                        disabled={isRunning || !orchestratorEnabled}
                      >
                        {isRunning ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  {schedule.notifications && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <Bell className="h-3 w-3" />
                      Notifications: {schedule.notifications.email?.join(', ')}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Alert Thresholds */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Alert Thresholds
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="font-medium">Performance</p>
              <p className="text-xs text-muted-foreground">Query: {alertThresholds.performance.queryTime}ms</p>
              <p className="text-xs text-muted-foreground">Error Rate: {alertThresholds.performance.errorRate * 100}%</p>
            </div>
            <div>
              <p className="font-medium">Compliance</p>
              <p className="text-xs text-muted-foreground">Min Score: {alertThresholds.compliance.minimumScore}%</p>
              <p className="text-xs text-muted-foreground">Critical Issues: {alertThresholds.compliance.criticalIssuesAllowed}</p>
            </div>
            <div>
              <p className="font-medium">Data Integrity</p>
              <p className="text-xs text-muted-foreground">Duplicate AGRNs: {alertThresholds.dataIntegrity.duplicateAGRNsAllowed}</p>
              <p className="text-xs text-muted-foreground">Missing URLs: {alertThresholds.dataIntegrity.missingURLsThreshold}</p>
            </div>
            <div>
              <p className="font-medium">Availability</p>
              <p className="text-xs text-muted-foreground">Uptime: {alertThresholds.availability.minimumUptime}%</p>
              <p className="text-xs text-muted-foreground">Response: {alertThresholds.availability.maxResponseTime}ms</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};