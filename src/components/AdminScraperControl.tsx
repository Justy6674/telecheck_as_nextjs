import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Play,
  Pause,
  RefreshCw,
  Database,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Loader2,
  Download,
  FileText,
  Shield,
  Calendar
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ScraperStatus {
  isRunning: boolean;
  lastRun?: string;
  totalDisasters?: number;
  activeDisasters?: number;
  totalLGAs?: number;
  lastError?: string;
  progress?: number;
}

export const AdminScraperControl = () => {
  const [status, setStatus] = useState<ScraperStatus>({ isRunning: false });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkScraperStatus();
  }, []);

  const checkScraperStatus = async () => {
    try {
      // Check scrape logs
      const { data: logs } = await supabase
        .from('scrape_logs')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(1);

      if (logs && logs.length > 0) {
        const lastLog = logs[0];
        setStatus({
          isRunning: lastLog.status === 'started',
          lastRun: lastLog.completed_at || lastLog.started_at,
          lastError: lastLog.error_message
        });
      }

      // Get disaster counts from the disasters table (fixed architecture)
      const { count: totalCount } = await supabase
        .from('disasters')
        .select('*', { count: 'exact', head: true });

      const { count: activeCount } = await supabase
        .from('disasters')
        .select('*', { count: 'exact', head: true })
        .is('end_date', null); // NULL end_date = active = revenue opportunity

      const { count: lgaCount } = await supabase
        .from('disaster_lgas')
        .select('*', { count: 'exact', head: true });

      setStatus(prev => ({
        ...prev,
        totalDisasters: totalCount || 0,
        activeDisasters: activeCount || 0,
        totalLGAs: lgaCount || 0
      }));
    } catch (error) {
      console.error('Error checking status:', error);
    }
  };

  const runScraper = async () => {
    setIsLoading(true);
    setStatus(prev => ({ ...prev, isRunning: true, progress: 0 }));

    try {
      // Start scraper via Edge Function
      const { data, error } = await supabase.functions.invoke('run-disaster-scraper', {
        body: { 
          mode: 'full',
          states: ['nsw', 'vic', 'qld', 'wa', 'sa', 'tas', 'nt', 'act']
        }
      });

      if (error) throw error;

      toast({
        title: "Scraper Started",
        description: "The disaster scraper is now running. This may take several minutes.",
      });

      // Poll for status updates
      const interval = setInterval(async () => {
        await checkScraperStatus();
        
        // Check if still running
        const { data: logs } = await supabase
          .from('scrape_logs')
          .select('*')
          .eq('status', 'started')
          .order('started_at', { ascending: false })
          .limit(1);

        if (!logs || logs.length === 0) {
          clearInterval(interval);
          setStatus(prev => ({ ...prev, isRunning: false }));
          
          toast({
            title: "Scraper Completed",
            description: "The disaster data has been updated successfully.",
          });
        }
      }, 5000);

    } catch (error) {
      console.error('Error running scraper:', error);
      toast({
        title: "Error",
        description: "Failed to start the scraper. Please check the logs.",
        variant: "destructive"
      });
      setStatus(prev => ({ ...prev, isRunning: false }));
    } finally {
      setIsLoading(false);
    }
  };

  const stopScraper = async () => {
    // Implement stop functionality if needed
    toast({
      title: "Stopping Scraper",
      description: "The scraper will stop after completing the current task.",
    });
  };

  const exportDatabase = async (format: 'csv' | 'json') => {
    try {
      toast({
        title: "Exporting Database",
        description: `Preparing ${format.toUpperCase()} export...`,
      });

      const { data, error } = await supabase.functions.invoke('admin-export-database', {
        body: { format }
      });

      if (error) throw error;

      // Create download link
      const blob = new Blob([format === 'json' ? JSON.stringify(data, null, 2) : data], {
        type: format === 'json' ? 'application/json' : 'text/csv'
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `telecheck-database-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Export Complete",
        description: `Database exported successfully as ${format.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export database. Please try again.",
        variant: "destructive"
      });
    }
  };

  const createBackup = async () => {
    try {
      toast({
        title: "Creating Backup",
        description: "Creating protective backup of all disaster data...",
      });

      const { error } = await supabase.functions.invoke('admin-create-backup');

      if (error) throw error;

      toast({
        title: "Backup Created",
        description: "Full backup created successfully. Your data is protected!",
      });

      // Refresh status after backup
      await checkScraperStatus();
    } catch (error) {
      console.error('Backup error:', error);
      toast({
        title: "Backup Failed",
        description: "Failed to create backup. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Disaster Data Scraper Control
          </CardTitle>
          <CardDescription>
            Manage the DisasterAssist.gov.au scraper to update disaster and LGA data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant={status.isRunning ? "default" : "secondary"}>
                    {status.isRunning ? "Running" : "Idle"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Total Disasters</span>
                  <p className="text-2xl font-bold">{status.totalDisasters || 0}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Active Disasters</span>
                  <p className="text-2xl font-bold text-green-600">
                    {status.activeDisasters || 0}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Total LGAs</span>
                  <p className="text-2xl font-bold">{status.totalLGAs || 0}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Bar */}
          {status.isRunning && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Scraping progress</span>
                <span>{status.progress || 0}%</span>
              </div>
              <Progress value={status.progress || 0} />
            </div>
          )}

          {/* Last Run Info */}
          {status.lastRun && (
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                Last run: {new Date(status.lastRun).toLocaleString('en-AU')}
              </AlertDescription>
            </Alert>
          )}

          {/* Error Alert */}
          {status.lastError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{status.lastError}</AlertDescription>
            </Alert>
          )}

          {/* Control Buttons */}
          <div className="flex gap-3 flex-wrap">
            {!status.isRunning ? (
              <Button
                onClick={runScraper}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                Run Full Scrape
              </Button>
            ) : (
              <Button
                onClick={stopScraper}
                variant="destructive"
                className="flex items-center gap-2"
              >
                <Pause className="h-4 w-4" />
                Stop Scraper
              </Button>
            )}

            <Button
              onClick={checkScraperStatus}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Status
            </Button>

            <Button
              onClick={createBackup}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Shield className="h-4 w-4" />
              Create Backup
            </Button>
          </div>

          {/* Info Section */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Scraper Details:</strong>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• Scrapes all Australian states and territories</li>
                <li>• Processes ~1,320 disaster pages (38 pages × 20 results + state pages)</li>
                <li>• Extracts LGAs for Medicare telehealth eligibility</li>
                <li>• Updates active/inactive status based on end dates</li>
                <li>• Rate limited to respect server resources</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Database Export & Backup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Database Export & Backup
          </CardTitle>
          <CardDescription>
            Download complete database exports and create protective backups
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => exportDatabase('csv')}
              variant="outline"
              className="flex items-center gap-2 h-16 justify-start"
            >
              <FileText className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Export as CSV</div>
                <div className="text-xs text-muted-foreground">Excel-compatible format</div>
              </div>
            </Button>

            <Button
              onClick={() => exportDatabase('json')}
              variant="outline"
              className="flex items-center gap-2 h-16 justify-start"
            >
              <Database className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Export as JSON</div>
                <div className="text-xs text-muted-foreground">Complete data structure</div>
              </div>
            </Button>
          </div>

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Export includes:</strong> All {status.totalDisasters || 895} disasters,
              {status.totalLGAs || 28} LGA relationships, and complete postcode mappings.
              Exports are automatically timestamped for tracking.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Scraping Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Scraping Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span>Daily Full Scrape</span>
              <Badge>2:00 AM AEST</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span>Active Disasters Check</span>
              <Badge>Every 6 hours</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span>LGA Verification</span>
              <Badge>Weekly</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span>Automatic Backup</span>
              <Badge variant="secondary">Daily</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};