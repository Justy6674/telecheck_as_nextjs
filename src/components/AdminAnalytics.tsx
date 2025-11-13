import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { 
  BarChart, 
  TrendingUp, 
  Users, 
  FileText,
  Calendar,
  Globe,
  MousePointer,
  RefreshCw,
  Download,
  Eye
} from 'lucide-react';

interface AnalyticsData {
  totalChecks: number;
  uniqueUsers: number;
  checksToday: number;
  checksThisWeek: number;
  checksThisMonth: number;
  averageChecksPerUser: number;
  popularPostcodes: Array<{
    postcode: string;
    count: number;
    state: string;
  }>;
  checksByDay: Array<{
    date: string;
    count: number;
  }>;
  eligibilityStats: {
    eligible: number;
    ineligible: number;
    eligibilityRate: number;
  };
}

interface BulkAnalysis {
  id: string;
  clinic_name: string;
  total_postcodes: number;
  eligible_count: number;
  ineligible_count: number;
  analysis_date: string;
  user_id: string;
}

export const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [bulkAnalyses, setBulkAnalyses] = useState<BulkAnalysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');
  const { toast } = useToast();

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const now = new Date();
      const startDate = new Date(now);
      
      switch (dateRange) {
        case '7d':
          startDate.setDate(now.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(now.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(now.getDate() - 90);
          break;
      }

      // Get total eligibility checks
      const { count: totalChecks } = await supabase
        .from('eligibility_checks')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startDate.toISOString());

      // Get unique users who made checks
      const { data: uniqueUsersData } = await supabase
        .from('eligibility_checks')
        .select('user_id')
        .gte('created_at', startDate.toISOString());

      const uniqueUsers = new Set(uniqueUsersData?.map(c => c.user_id) || []).size;

      // Get checks by time periods
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { count: checksToday } = await supabase
        .from('eligibility_checks')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString());

      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const { count: checksThisWeek } = await supabase
        .from('eligibility_checks')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekAgo.toISOString());

      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const { count: checksThisMonth } = await supabase
        .from('eligibility_checks')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', monthAgo.toISOString());

      // Get popular postcodes
      const { data: postcodeData } = await supabase
        .from('eligibility_checks')
        .select('postcode, state')
        .gte('created_at', startDate.toISOString());

      const postcodeCounts = (postcodeData || []).reduce((acc: Record<string, { postcode: string; count: number; state: string }>, check) => {
        const postcode = check.postcode ?? 'unknown';
        const key = postcode;
        if (!acc[key]) {
          acc[key] = { postcode, count: 0, state: check.state ?? 'Unknown' };
        }
        acc[key].count++;
        return acc;
      }, {});

      const popularPostcodes = Object.values(postcodeCounts)
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Get eligibility stats
      const { data: eligibilityData } = await supabase
        .from('eligibility_checks')
        .select('is_eligible')
        .gte('created_at', startDate.toISOString());

      const eligible = (eligibilityData || []).filter(c => c.is_eligible).length;
      const ineligible = (eligibilityData || []).filter(c => !c.is_eligible).length;
      const eligibilityRate = eligible + ineligible > 0 ? (eligible / (eligible + ineligible)) * 100 : 0;

      // Get checks by day for chart
      const checksByDay = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        date.setHours(0, 0, 0, 0);
        
        const nextDate = new Date(date);
        nextDate.setDate(date.getDate() + 1);

        const { count } = await supabase
          .from('eligibility_checks')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', date.toISOString())
          .lt('created_at', nextDate.toISOString());

        checksByDay.push({
          date: date.toLocaleDateString('en-US', { weekday: 'short' }),
          count: count || 0
        });
      }

      setAnalytics({
        totalChecks: totalChecks || 0,
        uniqueUsers,
        checksToday: checksToday || 0,
        checksThisWeek: checksThisWeek || 0,
        checksThisMonth: checksThisMonth || 0,
        averageChecksPerUser: uniqueUsers > 0 ? (totalChecks || 0) / uniqueUsers : 0,
        popularPostcodes,
        checksByDay,
        eligibilityStats: {
          eligible,
          ineligible,
          eligibilityRate
        }
      });

    } catch (error) {
      console.error('Error loading analytics:', error);
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [dateRange, toast]);

  const loadBulkAnalyses = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('clinic_bulk_analyses')
        .select('*')
        .order('analysis_date', { ascending: false })
        .limit(20);
 
      const sanitized = (data ?? []).map((item: any, index: number) => ({
        id: String(item.id ?? item.analysis_id ?? `bulk-${index}`),
        clinic_name: item.clinic_name ?? 'Unknown Clinic',
        total_postcodes: item.total_postcodes ?? 0,
        eligible_count: item.eligible_count ?? 0,
        ineligible_count: item.ineligible_count ?? 0,
        analysis_date: item.analysis_date ?? '',
        user_id: item.user_id ?? 'unknown'
      }));

      setBulkAnalyses(sanitized);
    } catch (error) {
      console.error('Error loading bulk analyses:', error);
    }
  }, []);

  useEffect(() => {
    loadAnalytics();
    loadBulkAnalyses();
  }, [loadAnalytics, loadBulkAnalyses]);

  const exportAnalyticsReport = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('bulk-analysis-export', {
        body: { 
          exportType: 'analytics_report',
          dateRange: dateRange
        }
      });

      if (error) throw error;

      toast({
        title: "Export Started",
        description: "Analytics report export has been initiated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export analytics report",
        variant: "destructive"
      });
    }
  };

  const getEligibilityColor = (rate: number) => {
    if (rate >= 70) return 'default';
    if (rate >= 40) return 'outline';
    return 'destructive';
  };

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Platform Analytics
          </CardTitle>
          <div className="flex gap-2">
            {['7d', '30d', '90d'].map((range) => (
              <Button
                key={range}
                variant={dateRange === range ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDateRange(range as '7d' | '30d' | '90d')}
              >
                {range === '7d' && 'Last 7 days'}
                {range === '30d' && 'Last 30 days'}
                {range === '90d' && 'Last 90 days'}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={loadAnalytics}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Checks</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalChecks || 0}</div>
            <p className="text-xs text-muted-foreground">
              {analytics?.checksToday || 0} today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.uniqueUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              {analytics?.averageChecksPerUser.toFixed(1) || 0} avg checks/user
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eligibility Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics?.eligibilityStats.eligibilityRate.toFixed(1) || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {analytics?.eligibilityStats.eligible || 0} eligible checks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.checksThisWeek || 0}</div>
            <p className="text-xs text-muted-foreground">
              {analytics?.checksThisMonth || 0} this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Daily Activity (Last 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between h-32 gap-2">
            {analytics?.checksByDay.map((day, index) => (
              <div key={index} className="flex flex-col items-center gap-2 flex-1">
                <div
                  className="bg-primary rounded-t w-full min-h-1"
                  style={{
                    height: `${Math.max((day.count / Math.max(...analytics.checksByDay.map(d => d.count))) * 100, 5)}%`
                  }}
                />
                <div className="text-xs text-muted-foreground">{day.date}</div>
                <div className="text-xs font-medium">{day.count}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Popular Postcodes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Most Checked Postcodes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {analytics?.popularPostcodes.map((postcode, index) => (
              <div key={postcode.postcode} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">#{index + 1}</Badge>
                  <div>
                    <span className="font-medium">{postcode.postcode}</span>
                    <span className="text-sm text-muted-foreground ml-2">{postcode.state}</span>
                  </div>
                </div>
                <Badge>{postcode.count} checks</Badge>
              </div>
            ))}
            
            {(!analytics?.popularPostcodes || analytics.popularPostcodes.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">
                No postcode data available
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bulk Analysis Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recent Bulk Analyses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bulkAnalyses.map((analysis) => (
              <div key={analysis.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium">{analysis.clinic_name || 'Unnamed Clinic'}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(analysis.analysis_date).toLocaleDateString()} • {analysis.total_postcodes} postcodes
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getEligibilityColor((analysis.eligible_count / analysis.total_postcodes) * 100)}>
                    {((analysis.eligible_count / analysis.total_postcodes) * 100).toFixed(1)}% eligible
                  </Badge>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {bulkAnalyses.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No bulk analyses found
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Export Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Export Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={exportAnalyticsReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Analytics Report
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};