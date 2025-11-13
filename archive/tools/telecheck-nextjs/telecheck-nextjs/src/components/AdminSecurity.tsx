import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { 
  Shield, 
  AlertTriangle, 
  Eye, 
  Lock,
  Key,
  Users,
  Activity,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

interface SecurityAlert {
  id: string;
  type: 'failed_login' | 'suspicious_activity' | 'data_access' | 'admin_action';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  user_email?: string;
  ip_address?: string;
  timestamp: string;
  status: 'active' | 'resolved' | 'investigating';
}

interface AccessLog {
  id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
  user_email?: string;
}

interface SecurityStats {
  totalLogins: number;
  failedLogins: number;
  activeAdmins: number;
  recentDataAccess: number;
  suspiciousActivity: number;
}

export const AdminSecurity = () => {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [stats, setStats] = useState<SecurityStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [scanningForThreats, setScanningForThreats] = useState(false);
  const { toast } = useToast();

  const loadSecurityData = useCallback(async () => {
    setLoading(true);
    try {
      // Load audit logs for access monitoring
      const { data: auditData } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      // Load data access audit
      const { data: accessData } = await supabase
        .from('data_access_audit')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      // Transform audit logs to access logs format
      const formattedAccessLogs: AccessLog[] = (auditData || []).map(log => ({
        id: log.id,
        user_id: log.user_id || 'anonymous',
        action: log.event_type,
        resource_type: log.resource_type || 'unknown',
        resource_id: log.resource_id || '',
        ip_address: (log.ip_address as string) || null,
        user_agent: log.user_agent || 'unknown',
        created_at: log.created_at
      }));

      setAccessLogs(formattedAccessLogs);

      // Generate security alerts from audit data
      const securityAlerts: SecurityAlert[] = [];
      
      // Check for failed authentication attempts
      const failedAuthLogs = (auditData || []).filter(log => 
        log.event_type === 'auth_failure' || log.result === 'failed'
      );

      if (failedAuthLogs.length > 5) {
        securityAlerts.push({
          id: 'high-failed-auth',
          type: 'failed_login',
          severity: 'high',
          message: `${failedAuthLogs.length} failed authentication attempts detected`,
          timestamp: new Date().toISOString(),
          status: 'active'
        });
      }

      // Check for admin actions
      const adminLogs = (auditData || []).filter(log => 
        log.event_type === 'admin_action' || log.resource_type === 'admin'
      );

      adminLogs.slice(0, 3).forEach((log, index) => {
        securityAlerts.push({
          id: `admin-action-${index}`,
          type: 'admin_action',
          severity: 'medium',
          message: `Admin action: ${log.event_type} by ${log.user_id}`,
          timestamp: log.created_at,
          status: 'resolved'
        });
      });

      setAlerts(securityAlerts);

      // Calculate security stats
      const now = new Date();
      const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      
      const recentLogs = (auditData || []).filter(log => 
        new Date(log.created_at) >= last24Hours
      );

      const failedLogins = recentLogs.filter(log => 
        log.event_type === 'auth_failure'
      ).length;

      const dataAccessCount = (accessData || []).filter(access => 
        new Date(access.created_at) >= last24Hours
      ).length;

      // Count active admin users
      const { count: activeAdmins } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'admin');

      setStats({
        totalLogins: recentLogs.filter(log => log.event_type === 'auth_success').length,
        failedLogins,
        activeAdmins: activeAdmins || 0,
        recentDataAccess: dataAccessCount,
        suspiciousActivity: securityAlerts.filter(a => a.severity === 'high' || a.severity === 'critical').length
      });

    } catch (error) {
      console.error('Error loading security data:', error);
      toast({
        title: "Error",
        description: "Failed to load security data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadSecurityData();
  }, [loadSecurityData]);


  const runSecurityScan = async () => {
    setScanningForThreats(true);
    try {
      // Run comprehensive security scan
      const { data, error } = await supabase.functions.invoke('security-scan', {
        body: { 
          scanType: 'comprehensive',
          includeRLS: true,
          includeDataAccess: true
        }
      });

      if (error) throw error;

      toast({
        title: "Security Scan Complete",
        description: `Found ${data.issues || 0} security issues`,
        variant: data.issues > 0 ? "destructive" : "default"
      });

      // Reload security data
      await loadSecurityData();

    } catch (error) {
      console.error('Error running security scan:', error);
      toast({
        title: "Error",
        description: "Failed to run security scan",
        variant: "destructive"
      });
    } finally {
      setScanningForThreats(false);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="h-4 w-4 text-destructive" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'medium': return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-muted-foreground" />;
      default: return <AlertTriangle className="h-4 w-4" />;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'destructive';
      case 'investigating': return 'outline';
      case 'resolved': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Logins</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalLogins || 0}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Logins</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats?.failedLogins || 0}</div>
            <p className="text-xs text-muted-foreground">Security incidents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Admins</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeAdmins || 0}</div>
            <p className="text-xs text-muted-foreground">Privileged accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Access</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.recentDataAccess || 0}</div>
            <p className="text-xs text-muted-foreground">Recent accesses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Threats</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats?.suspiciousActivity || 0}</div>
            <p className="text-xs text-muted-foreground">Active alerts</p>
          </CardContent>
        </Card>
      </div>

      {/* Security Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={loadSecurityData} 
              disabled={loading}
              variant="outline"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
            
            <Button 
              onClick={runSecurityScan}
              disabled={scanningForThreats}
            >
              {scanningForThreats && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
              <Shield className="h-4 w-4 mr-2" />
              Run Security Scan
            </Button>
          </div>

          {scanningForThreats && (
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Running comprehensive security scan... Checking RLS policies, data access patterns, and authentication logs.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Security Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Security Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getSeverityIcon(alert.severity)}
                  <div>
                    <h4 className="font-medium">{alert.message}</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(alert.timestamp).toLocaleString()}
                      {alert.user_email && ` • User: ${alert.user_email}`}
                      {alert.ip_address && ` • IP: ${alert.ip_address}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getSeverityColor(alert.severity)}>
                    {alert.severity}
                  </Badge>
                  <Badge variant={getStatusColor(alert.status)}>
                    {alert.status}
                  </Badge>
                </div>
              </div>
            ))}
            
            {alerts.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-success" />
                No active security alerts
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Access Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Access Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {accessLogs.slice(0, 10).map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{log.action}</p>
                    <p className="text-sm text-muted-foreground">
                      {log.resource_type} • {new Date(log.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{log.user_id}</p>
                  <p className="text-xs text-muted-foreground">{log.ip_address}</p>
                </div>
              </div>
            ))}
            
            {accessLogs.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No access logs found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};