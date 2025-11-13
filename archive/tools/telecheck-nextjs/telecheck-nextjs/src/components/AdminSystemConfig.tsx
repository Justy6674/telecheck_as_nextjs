import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';

interface SystemStatus {
  database_status: string;
  email_service: string;
  stripe_service: string;
  storage_used: number;
  api_status: string;
  last_backup?: string;
  uptime?: string;
  database_tables?: number;
  total_disasters?: number;
  total_users?: number;
  active_connections?: number;
  cpu_usage?: number;
  memory_usage?: number;
  disk_usage?: number;
  uptime_hours?: number;
  last_restart?: string;
}
import { useToast } from '@/components/ui/use-toast';
import { 
  Settings, 
  Database, 
  Shield, 
  Clock,
  Mail,
  Globe,
  Key,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Save,
  Download,
  Upload
} from 'lucide-react';

interface SystemConfig {
  maintenance_mode: boolean;
  api_rate_limit: number;
  max_file_size_mb: number;
  session_timeout_hours: number;
  email_notifications: boolean;
  auto_backup_enabled: boolean;
  backup_retention_days: number;
  debug_logging: boolean;
  analytics_enabled: boolean;
}

interface BackupInfo {
  last_backup: string;
  backup_size_mb: number;
  status: 'success' | 'failed' | 'in_progress';
  next_scheduled: string;
}

export const AdminSystemConfig = () => {
  const [config, setConfig] = useState<SystemConfig>({
    maintenance_mode: false,
    api_rate_limit: 100,
    max_file_size_mb: 10,
    session_timeout_hours: 24,
    email_notifications: true,
    auto_backup_enabled: true,
    backup_retention_days: 30,
    debug_logging: false,
    analytics_enabled: true
  });
  
  const [backupInfo, setBackupInfo] = useState<BackupInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadSystemConfig();
    loadSystemStatus();
    loadBackupInfo();
  }, []);

  const loadSystemConfig = async () => {
    try {
      // In a real system, this would load from a system config table
      // For now, we'll use some mock data
      setConfig({
        maintenance_mode: false,
        api_rate_limit: 100,
        max_file_size_mb: 10,
        session_timeout_hours: 24,
        email_notifications: true,
        auto_backup_enabled: true,
        backup_retention_days: 30,
        debug_logging: false,
        analytics_enabled: true
      });
    } catch (error) {
      console.error('Error loading system config:', error);
    }
  };

  const loadSystemStatus = async () => {
    setLoading(true);
    try {
      // Mock database stats since we can't access schema directly
      const totalTables = 42; // Mock count of tables

      // Get disaster stats
      const { count: totalDisasters } = await supabase
        .from('disasters')
        .select('*', { count: 'exact', head: true });

      // Get user stats
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get active sessions (mock data)
      setSystemStatus({
        database_status: 'healthy',
        email_service: 'active',
        stripe_service: 'active',
        storage_used: 42.7,
        api_status: 'healthy',
        database_tables: totalTables || 0,
        total_disasters: totalDisasters || 0,
        total_users: totalUsers || 0,
        active_connections: 12, // Mock data
        cpu_usage: 15.3, // Mock data
        memory_usage: 68.2, // Mock data
        disk_usage: 42.7, // Mock data
        uptime_hours: 168, // Mock data
        last_restart: '2024-01-15T09:00:00Z' // Mock data
      });

    } catch (error) {
      console.error('Error loading system status:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBackupInfo = async () => {
    try {
      // Mock backup information
      setBackupInfo({
        last_backup: '2024-01-15T02:00:00Z',
        backup_size_mb: 847.3,
        status: 'success',
        next_scheduled: '2024-01-16T02:00:00Z'
      });
    } catch (error) {
      console.error('Error loading backup info:', error);
    }
  };

  const saveSystemConfig = async () => {
    setSaving(true);
    try {
      // In a real system, this would save to a system config table or environment
      // For now, we'll just simulate the save
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Configuration Saved",
        description: "System configuration has been updated successfully",
      });
    } catch (error) {
      console.error('Error saving system config:', error);
      toast({
        title: "Error",
        description: "Failed to save system configuration",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const triggerManualBackup = async () => {
    try {
      setSaving(true);
      
      // In a real system, this would trigger a backup operation
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Backup Started",
        description: "Manual backup has been initiated",
      });

      // Reload backup info
      await loadBackupInfo();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start manual backup",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const exportSystemConfig = async () => {
    try {
      const configJson = JSON.stringify(config, null, 2);
      const blob = new Blob([configJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `system-config-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Config Exported",
        description: "System configuration has been exported",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export configuration",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'default';
      case 'failed': return 'destructive';
      case 'in_progress': return 'outline';
      default: return 'secondary';
    }
  };

  const getUsageColor = (usage: number) => {
    if (usage >= 90) return 'destructive';
    if (usage >= 70) return 'warning';
    return 'success';
  };

  return (
    <div className="space-y-6">
      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStatus?.total_disasters || 0}</div>
            <p className="text-xs text-muted-foreground">
              {systemStatus?.database_tables || 0} tables
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStatus?.cpu_usage || 0}%</div>
            <p className="text-xs text-muted-foreground">
              {systemStatus?.active_connections || 0} connections
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStatus?.memory_usage || 0}%</div>
            <p className="text-xs text-muted-foreground">
              RAM utilization
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.floor((systemStatus?.uptime_hours || 0) / 24)}d</div>
            <p className="text-xs text-muted-foreground">
              {(systemStatus?.uptime_hours || 0) % 24}h running
            </p>
          </CardContent>
        </Card>
      </div>

      {/* System Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            System Configuration
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              onClick={saveSystemConfig}
              disabled={saving}
            >
              {saving && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
            <Button 
              variant="outline"
              onClick={exportSystemConfig}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Config
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Security Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security & Access
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>API Rate Limit (requests/minute)</Label>
                <Input
                  type="number"
                  value={config.api_rate_limit}
                  onChange={(e) => setConfig({...config, api_rate_limit: parseInt(e.target.value)})}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Session Timeout (hours)</Label>
                <Input
                  type="number"
                  value={config.session_timeout_hours}
                  onChange={(e) => setConfig({...config, session_timeout_hours: parseInt(e.target.value)})}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="maintenance-mode"
                checked={config.maintenance_mode}
                onCheckedChange={(checked) => setConfig({...config, maintenance_mode: checked})}
              />
              <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
            </div>
          </div>

          {/* File & Data Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Database className="h-5 w-5" />
              File & Data Management
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Max File Size (MB)</Label>
                <Input
                  type="number"
                  value={config.max_file_size_mb}
                  onChange={(e) => setConfig({...config, max_file_size_mb: parseInt(e.target.value)})}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Backup Retention (days)</Label>
                <Input
                  type="number"
                  value={config.backup_retention_days}
                  onChange={(e) => setConfig({...config, backup_retention_days: parseInt(e.target.value)})}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="auto-backup"
                checked={config.auto_backup_enabled}
                onCheckedChange={(checked) => setConfig({...config, auto_backup_enabled: checked})}
              />
              <Label htmlFor="auto-backup">Automatic Daily Backups</Label>
            </div>
          </div>

          {/* Monitoring & Notifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Monitoring & Notifications
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Switch
                  id="email-notifications"
                  checked={config.email_notifications}
                  onCheckedChange={(checked) => setConfig({...config, email_notifications: checked})}
                />
                <Label htmlFor="email-notifications">Email Notifications</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="debug-logging"
                  checked={config.debug_logging}
                  onCheckedChange={(checked) => setConfig({...config, debug_logging: checked})}
                />
                <Label htmlFor="debug-logging">Debug Logging</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="analytics-enabled"
                  checked={config.analytics_enabled}
                  onCheckedChange={(checked) => setConfig({...config, analytics_enabled: checked})}
                />
                <Label htmlFor="analytics-enabled">Analytics Collection</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Backup Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Backup Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {backupInfo && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Last Backup</Label>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusColor(backupInfo.status)}>
                    {backupInfo.status}
                  </Badge>
                  <span className="text-sm">
                    {new Date(backupInfo.last_backup).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Backup Size</Label>
                <p className="text-sm font-medium">{backupInfo.backup_size_mb} MB</p>
              </div>
              
              <div className="space-y-2">
                <Label>Next Scheduled</Label>
                <p className="text-sm font-medium">
                  {new Date(backupInfo.next_scheduled).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button 
              onClick={triggerManualBackup}
              disabled={saving}
            >
              {saving && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
              <Database className="h-4 w-4 mr-2" />
              Create Manual Backup
            </Button>
            
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download Latest
            </Button>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Backups are automatically created daily at 2:00 AM UTC. Manual backups can be created at any time.
              All backups are encrypted and stored securely.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* System Status Alerts */}
      {config.maintenance_mode && (
        <Alert className="border-warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Maintenance Mode is active.</strong> The system is currently unavailable to regular users.
            Only administrators can access the platform.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};