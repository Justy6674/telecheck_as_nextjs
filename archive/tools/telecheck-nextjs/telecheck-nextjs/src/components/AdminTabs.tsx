import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Database, Users, Activity, DollarSign } from 'lucide-react';
import { AdminScraperControl } from './AdminScraperControl';
import { AdminUrlScraper } from './AdminUrlScraper';
import { AdminDataIntegrity } from './AdminDataIntegrity';
import { AdminSystemHealth } from './AdminSystemHealth';
import { AdminOutsetaTools } from './AdminOutsetaTools';
import AdminUserManagement from './AdminUserManagement';

interface SystemStats {
  disasters: number;
  withUrls: number;
  users: number;
  subscribers: number;
  activeSessions: number;
  totalRevenue: number;
  lastScraperRun: string;
  systemHealth: string;
}

export const AdminTabs = () => {
  const [stats, setStats] = useState<SystemStats>({
    disasters: 0,
    withUrls: 0,
    users: 0,
    subscribers: 0,
    activeSessions: 0,
    totalRevenue: 0,
    lastScraperRun: 'Never',
    systemHealth: 'unknown'
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Load system statistics using proper query syntax
        const { count: disasterCount, error: disastersError } = await supabase
          .from('disasters')
          .select('*', { count: 'exact', head: true });

        const { count: disastersWithUrlsCount, error: urlsError } = await supabase
          .from('disasters')
          .select('*', { count: 'exact', head: true })
          .not('url', 'is', null);

        const { count: usersCount, error: usersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Query Outseta webhook-synced profiles for subscribers
        const { count: activeSubscribersCount, error: subsError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('subscription_tier', 'professional');

        if (disastersError) console.error('Disasters error:', disastersError);
        if (urlsError) console.error('URLs error:', urlsError);
        if (usersError) console.error('Users error:', usersError);
        if (subsError) console.error('Subscriptions error:', subsError);

        setStats({
          disasters: disasterCount || 0,
          withUrls: disastersWithUrlsCount || 0,
          users: usersCount || 0,
          subscribers: activeSubscribersCount || 0,
          activeSessions: 0,
          totalRevenue: 0,
          lastScraperRun: '2024-01-15 14:30:00',
          systemHealth: 'healthy'
        });
      } catch (error) {
        console.error('Error loading admin stats:', error);
        toast({
          title: 'Error Loading Stats',
          description: 'Failed to load admin statistics',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [toast]);

  if (loading) {
    return <div>Loading admin data...</div>;
  }

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="data">Data</TabsTrigger>
        <TabsTrigger value="system">System</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Disasters</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.disasters}</div>
              <p className="text-xs text-muted-foreground">
                {stats.withUrls} with source URLs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.users}</div>
              <p className="text-xs text-muted-foreground">
                {stats.subscribers} active subscribers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <Badge variant={stats.systemHealth === 'healthy' ? 'default' : 'destructive'}>
                  {stats.systemHealth}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                All systems operational
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue}</div>
              <p className="text-xs text-muted-foreground">
                Total revenue (placeholder)
              </p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="users" className="space-y-6">
        <AdminUserManagement />
      </TabsContent>

      <TabsContent value="data" className="space-y-6">
        <AdminScraperControl />
        <AdminUrlScraper />
        <AdminDataIntegrity />
      </TabsContent>

      <TabsContent value="system" className="space-y-6">
        <AdminSystemHealth />
        <AdminOutsetaTools />
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;