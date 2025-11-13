import React from 'react';

// TEMPORARILY DISABLED FOR BUILD FIX - Admin component with missing disaster_scraping_master table
export default function DisasterScrapingManager() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Disaster Scraping Manager Temporarily Disabled</h2>
      <p className="text-gray-600 mt-2">This feature is undergoing maintenance.</p>
    </div>
  );
}

/* ORIGINAL COMPONENT - TEMPORARILY DISABLED
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  AlertCircle,
  Play,
  Square,
  RefreshCw,
  Activity,
  Database,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Download
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

// Australian states with their expected page counts (from your previous analysis)
const AUSTRALIAN_STATES = {
  'NSW': {
    name: 'New South Wales',
    pages: 13,
    baseUrl: '/Pages/results.aspx?k=disasters&s=Disasters%20Scope%3d%5c%22Incidents%5c%22%20%20State%3d%5c%22NSW%5c%22'
  },
  'VIC': {
    name: 'Victoria',
    pages: 9,
    baseUrl: '/Pages/results.aspx?k=disasters&s=Disasters%20Scope%3d%5c%22Incidents%5c%22%20%20State%3d%5c%22VIC%5c%22'
  },
  'QLD': {
    name: 'Queensland',
    pages: 8,
    baseUrl: '/Pages/results.aspx?k=disasters&s=Disasters%20Scope%3d%5c%22Incidents%5c%22%20%20State%3d%5c%22QLD%5c%22'
  },
  'WA': {
    name: 'Western Australia',
    pages: 7,
    baseUrl: '/Pages/results.aspx?k=disasters&s=Disasters%20Scope%3d%5c%22Incidents%5c%22%20%20State%3d%5c%22WA%5c%22'
  },
  'SA': {
    name: 'South Australia',
    pages: 6,
    baseUrl: '/Pages/results.aspx?k=disasters&s=Disasters%20Scope%3d%5c%22Incidents%5c%22%20%20State%3d%5c%22SA%5c%22'
  },
  'TAS': {
    name: 'Tasmania',
    pages: 5,
    baseUrl: '/Pages/results.aspx?k=disasters&s=Disasters%20Scope%3d%5c%22Incidents%5c%22%20%20State%3d%5c%22TAS%5c%22'
  },
  'ACT': {
    name: 'Australian Capital Territory',
    pages: 3,
    baseUrl: '/Pages/results.aspx?k=disasters&s=Disasters%20Scope%3d%5c%22Incidents%5c%22%20%20State%3d%5c%22ACT%5c%22'
  },
  'NT': {
    name: 'Northern Territory',
    pages: 8,
    baseUrl: '/Pages/results.aspx?k=disasters&s=Disasters%20Scope%3d%5c%22Incidents%5c%22%20%20State%3d%5c%22NT%5c%22'
  }
};

interface ScrapeJob {
  id: string;
  state: string;
  phase: 'full_scrape' | 'change_detection' | 'lga_extraction';
  status: 'pending' | 'running' | 'completed' | 'failed';
  started_at?: string;
  completed_at?: string;
  total_pages: number;
  processed_pages: number;
  disasters_found: number;
  end_dates_recovered: number;
  lgas_extracted: number;
  error_message?: string;
}

interface DisasterStats {
  total_disasters: number;
  missing_end_dates: number;
  missing_lgas: number;
  last_scrape: string;
  scrape_health: 'healthy' | 'needs_attention' | 'critical';
}

export const DisasterScrapingManager: React.FC = () => {
  const [scrapeJobs, setScrapeJobs] = useState<ScrapeJob[]>([]);
  const [disasterStats, setDisasterStats] = useState<DisasterStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedPhase, setSelectedPhase] = useState<string>('full_scrape');
  const { toast } = useToast();

  useEffect(() => {
    fetchScrapeData();
    fetchDisasterStats();

    // Set up polling for active jobs every 30 seconds
    const interval = setInterval(() => {
      fetchScrapeData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchScrapeData = async () => {
    try {
      const { data, error } = await supabase
        .from('disaster_scraping_master')
        .select('*')
        .order('started_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setScrapeJobs(data || []);
    } catch (error) {
      console.error('Error fetching scrape data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDisasterStats = async () => {
    try {
      // Get disaster statistics
      const { data: disasters, error: disastersError } = await supabase
        .from('disasters')
        .select('agrn, end_date, lgas, updated_at');

      if (disastersError) throw disastersError;

      const stats = {
        total_disasters: disasters?.length || 0,
        missing_end_dates: disasters?.filter(d => !d.end_date).length || 0,
        missing_lgas: disasters?.filter(d => !d.lgas || d.lgas.length === 0).length || 0,
        last_scrape: disasters?.[0]?.updated_at || '',
        scrape_health: 'healthy' as const
      };

      // Determine health status
      const missingEndDatePercentage = (stats.missing_end_dates / stats.total_disasters) * 100;
      const missingLgaPercentage = (stats.missing_lgas / stats.total_disasters) * 100;

      if (missingEndDatePercentage > 50 || missingLgaPercentage > 70) {
        stats.scrape_health = 'critical';
      } else if (missingEndDatePercentage > 20 || missingLgaPercentage > 40) {
        stats.scrape_health = 'needs_attention';
      }

      setDisasterStats(stats);
    } catch (error) {
      console.error('Error fetching disaster stats:', error);
    }
  };

  const startStateScrape = async (state: string, phase: string) => {
    try {
      const stateInfo = AUSTRALIAN_STATES[state as keyof typeof AUSTRALIAN_STATES];
      if (!stateInfo) {
        throw new Error('Invalid state selected');
      }

      // Create new scrape job record
      const newJob: Partial<ScrapeJob> = {
        state,
        phase: phase as ScrapeJob['phase'],
        status: 'pending',
        started_at: new Date().toISOString(),
        total_pages: stateInfo.pages,
        processed_pages: 0,
        disasters_found: 0,
        end_dates_recovered: 0,
        lgas_extracted: 0
      };

      const { data, error } = await supabase
        .from('disaster_scraping_master')
        .insert([newJob])
        .select()
        .single();

      if (error) throw error;

      // Call the appropriate scraper edge function
      const response = await supabase.functions.invoke('disaster-state-scraper', {
        body: {
          job_id: data.id,
          state,
          phase,
          pages: stateInfo.pages,
          base_url: stateInfo.baseUrl
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      toast({
        title: "Scrape Started",
        description: `${phase.replace('_', ' ')} started for ${stateInfo.name}`,
      });

      fetchScrapeData();
    } catch (error) {
      console.error('Error starting scrape:', error);
      toast({
        title: "Error",
        description: `Failed to start scrape: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const stopScrapeJob = async (jobId: string) => {
    try {
      const { error } = await supabase
        .from('disaster_scraping_master')
        .update({ status: 'failed', error_message: 'Manually stopped by admin' })
        .eq('id', jobId);

      if (error) throw error;

      toast({
        title: "Scrape Stopped",
        description: "Scrape job has been stopped",
      });

      fetchScrapeData();
    } catch (error) {
      console.error('Error stopping scrape:', error);
      toast({
        title: "Error",
        description: "Failed to stop scrape job",
        variant: "destructive",
      });
    }
  };

  const downloadJobResults = async (jobId: string) => {
    try {
      const response = await supabase.functions.invoke('export-scrape-results', {
        body: { job_id: jobId }
      });

      if (response.error) throw response.error;

      // Create download link
      const blob = new Blob([JSON.stringify(response.data, null, 2)], {
        type: 'application/json'
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `scrape-results-${jobId}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Download Started",
        description: "Scrape results are being downloaded",
      });
    } catch (error) {
      console.error('Error downloading results:', error);
      toast({
        title: "Error",
        description: "Failed to download results",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Activity className="h-4 w-4 text-blue-500 animate-pulse" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy':
        return 'bg-green-500';
      case 'needs_attention':
        return 'bg-yellow-500';
      case 'critical':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const filteredJobs = scrapeJobs.filter(job => {
    const stateMatch = selectedState === 'all' || job.state === selectedState;
    return stateMatch;
  });

  return (
    <div className="space-y-6">
      // Disaster Data Health Overview
      {disasterStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Database className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Disasters</p>
                  <p className="text-2xl font-bold">{disasterStats.total_disasters}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Missing End Dates</p>
                  <p className="text-2xl font-bold">{disasterStats.missing_end_dates}</p>
                  <p className="text-xs text-muted-foreground">
                    {((disasterStats.missing_end_dates / disasterStats.total_disasters) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MapPin className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Missing LGAs</p>
                  <p className="text-2xl font-bold">{disasterStats.missing_lgas}</p>
                  <p className="text-xs text-muted-foreground">
                    {((disasterStats.missing_lgas / disasterStats.total_disasters) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-gray-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Data Health</p>
                  <div className="flex items-center gap-2">
                    <Badge className={getHealthColor(disasterStats.scrape_health)}>
                      {disasterStats.scrape_health.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      // Scrape Controls
      <Card>
        <CardHeader>
          <CardTitle>State-Based Disaster Scraping</CardTitle>
          <CardDescription>
            Two-phase approach: Full scrapes first, then change detection. Extract start/end dates, LGAs, and disaster metadata.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Select State</label>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  {Object.entries(AUSTRALIAN_STATES).map(([code, info]) => (
                    <SelectItem key={code} value={code}>
                      {info.name} ({info.pages} pages)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Scrape Phase</label>
              <Select value={selectedPhase} onValueChange={setSelectedPhase}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose phase" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full_scrape">Phase 1: Full Scrape</SelectItem>
                  <SelectItem value="change_detection">Phase 2: Change Detection</SelectItem>
                  <SelectItem value="lga_extraction">Phase 3: LGA Extraction</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={() => {
                  if (selectedState === 'all') {
                    // Start scrape for all states
                    Object.keys(AUSTRALIAN_STATES).forEach(state => {
                      setTimeout(() => startStateScrape(state, selectedPhase), Math.random() * 5000);
                    });
                  } else {
                    startStateScrape(selectedState, selectedPhase);
                  }
                }}
                disabled={selectedState === 'all' && selectedPhase !== 'full_scrape'}
                className="w-full"
              >
                <Play className="h-4 w-4 mr-2" />
                Start {selectedState === 'all' ? 'All States' : AUSTRALIAN_STATES[selectedState as keyof typeof AUSTRALIAN_STATES]?.name}
              </Button>
            </div>
          </div>

          {selectedPhase === 'full_scrape' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-blue-800">Phase 1: Full Scrape</h4>
              <p className="text-sm text-blue-600 mt-1">
                Complete extraction of all disaster data from listing tables. Collects AGRN, title, state, start/end dates, and disaster URLs.
              </p>
            </div>
          )}

          {selectedPhase === 'change_detection' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-yellow-800">Phase 2: Change Detection</h4>
              <p className="text-sm text-yellow-600 mt-1">
                Monitors for changes since last scrape. Only processes updated or new disasters. Much faster than full scrape.
              </p>
            </div>
          )}

          {selectedPhase === 'lga_extraction' && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-purple-800">Phase 3: LGA Extraction</h4>
              <p className="text-sm text-purple-600 mt-1">
                Deep extraction from individual disaster pages. Collects Local Government Areas (LGAs) for postcode mapping.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      // Active Scrape Jobs
      <Card>
        <CardHeader>
          <CardTitle>Scrape Job Status</CardTitle>
          <CardDescription>
            Monitor active and recent scraping operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center justify-between">
            <Badge variant="outline">
              Total Jobs: {scrapeJobs.length}
            </Badge>
            <Button onClick={fetchScrapeData} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Phase</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Results</TableHead>
                  <TableHead>Started</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(job.status)}
                        <span className="capitalize">{job.status}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {AUSTRALIAN_STATES[job.state as keyof typeof AUSTRALIAN_STATES]?.name || job.state}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {job.phase.replace('_', ' ')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {job.processed_pages}/{job.total_pages} pages
                        {job.status === 'running' && (
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${(job.processed_pages / job.total_pages) * 100}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        <div>{job.disasters_found} disasters</div>
                        {job.end_dates_recovered > 0 && (
                          <div className="text-green-600">{job.end_dates_recovered} end dates</div>
                        )}
                        {job.lgas_extracted > 0 && (
                          <div className="text-purple-600">{job.lgas_extracted} LGAs</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {job.started_at && (
                        <span className="text-sm">
                          {format(new Date(job.started_at), 'MMM d, HH:mm')}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {job.status === 'running' && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => stopScrapeJob(job.id)}
                          >
                            <Square className="h-4 w-4" />
                          </Button>
                        )}
                        {job.status === 'completed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadJobResults(job.id)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No scrape jobs found. Start a new scrape to begin monitoring.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
*/ // END ORIGINAL COMPONENT