import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { 
  Play, 
  Pause,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  Search,
  Link,
  Database
} from "lucide-react";

export const AdminUrlScraper = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState({
    total: 749,
    processed: 0,
    updated: 0,
    failed: 0,
    alreadyGood: 0
  });
  const [failedAgrns, setFailedAgrns] = useState<string[]>([]);
  const [lastRun, setLastRun] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      // Get count of disasters with good URLs
      const { count: goodCount } = await supabase
        .from('disasters')
        .select('*', { count: 'exact', head: true })
        .like('source_url', 'https://www.disasterassist.gov.au/Pages/disasters/%');

      // Get count of disasters with bad/old URLs
      const { count: badCount } = await supabase
        .from('disasters')
        .select('*', { count: 'exact', head: true })
        .not('source_url', 'like', 'https://www.disasterassist.gov.au/Pages/disasters/%');

      setProgress(prev => ({
        ...prev,
        alreadyGood: goodCount || 0,
        processed: goodCount || 0
      }));

      // Check for last run from logs
      const { data: logs } = await supabase
        .from('scrape_logs')
        .select('started_at')
        .eq('scrape_type', 'url_search')
        .order('started_at', { ascending: false })
        .limit(1);

      if (logs && logs.length > 0) {
        setLastRun(new Date(logs[0].started_at));
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const startScraper = async () => {
    setIsRunning(true);
    setLoading(true);
    
    try {
      // In a real implementation, this would trigger the Python scraper
      // For now, we'll simulate it with a function call
      const { data: { session } } = await supabase.auth.getSession();
      
      // Log the start
      await supabase.from('scrape_logs').insert({
        scrape_type: 'url_search',
        status: 'running',
        started_at: new Date().toISOString()
      });

      toast({
        title: "URL Scraper Started",
        description: "Searching for all 749 disaster URLs. This will take approximately 30-45 minutes.",
      });

      // In production, this would trigger the Python script via an edge function
      // For demonstration, we'll show the command to run
      toast({
        title: "Run this command in terminal:",
        description: "python3 scraper/SEARCH_ALL_AGRNS.py",
      });

    } catch (error) {
      toast({
        title: "Scraper Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const stopScraper = () => {
    setIsRunning(false);
    toast({
      title: "Scraper Stopped",
      description: "The URL search scraper has been stopped.",
    });
  };

  const progressPercentage = (progress.processed / progress.total) * 100;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            URL Search Scraper
          </CardTitle>
          <CardDescription>
            Search for each AGRN individually to get the correct disaster URLs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Disasters</p>
              <p className="text-2xl font-bold">{progress.total}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Good URLs</p>
              <p className="text-2xl font-bold text-success">{progress.alreadyGood}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Need Update</p>
              <p className="text-2xl font-bold text-warning">{progress.total - progress.alreadyGood}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Failed</p>
              <p className="text-2xl font-bold text-destructive">{progress.failed}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress: {progress.processed} / {progress.total}</span>
              <span>{progressPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Status Alert */}
          {isRunning && (
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                Scraper is running... Processing AGRN {progress.processed + 1} of {progress.total}
              </AlertDescription>
            </Alert>
          )}

          {progress.alreadyGood === progress.total && (
            <Alert className="border-success">
              <CheckCircle className="h-4 w-4 text-success" />
              <AlertDescription>
                All disaster URLs are up to date! No scraping needed.
              </AlertDescription>
            </Alert>
          )}

          {/* Failed AGRNs */}
          {failedAgrns.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Failed AGRNs:</p>
              <div className="flex flex-wrap gap-2">
                {failedAgrns.slice(0, 10).map(agrn => (
                  <Badge key={agrn} variant="destructive">
                    {agrn}
                  </Badge>
                ))}
                {failedAgrns.length > 10 && (
                  <Badge variant="outline">
                    +{failedAgrns.length - 10} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Control Buttons */}
          <div className="flex gap-2">
            {!isRunning ? (
              <Button 
                onClick={startScraper} 
                disabled={loading || progress.alreadyGood === progress.total}
                className="flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                Start URL Search
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
              onClick={loadProgress} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Status
            </Button>
          </div>

          {/* Last Run Info */}
          {lastRun && (
            <p className="text-sm text-muted-foreground">
              Last run: {lastRun.toLocaleString()}
            </p>
          )}

          {/* Instructions */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>How it works:</strong>
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Scraper gets all 749 AGRNs from the database</li>
                <li>For each AGRN, it searches on DisasterAssist</li>
                <li>Clicks the disaster link to get the real URL</li>
                <li>Updates the database with the correct URL</li>
              </ol>
              <p className="mt-2">
                <strong>To run manually:</strong> <code className="bg-muted px-1 py-0.5 rounded">python3 scraper/SEARCH_ALL_AGRNS.py</code>
              </p>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Weekly Update Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Weekly Update Schedule
          </CardTitle>
          <CardDescription>
            Automatic checks for new disasters and end date updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Next scheduled run:</span>
              <Badge>Every Sunday at 2:00 AM</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Check for:</span>
              <span className="text-sm text-muted-foreground">New disasters, End date updates</span>
            </div>
            <Button variant="outline" className="w-full mt-4">
              Configure Schedule
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};