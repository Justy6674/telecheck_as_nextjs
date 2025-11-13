import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Database,
  FileSearch,
  TrendingUp,
  TrendingDown,
  Calendar,
  Globe,
  Link,
  Eye,
  Save
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface DisasterChange {
  agrn: string;
  title: string;
  state: string;
  start_date: string;
  end_date: string | null;
  url: string;
  status: 'new' | 'updated' | 'unchanged' | 'ended';
  changes?: string[];
}

interface ScanReport {
  timestamp: string;
  scraped_count: number;
  existing_count: number;
  new_disasters: DisasterChange[];
  updated_disasters: DisasterChange[];
  ended_disasters: DisasterChange[];
  unchanged_count: number;
  summary: {
    total_changes: number;
    new_count: number;
    updated_count: number;
    ended_count: number;
  };
}

export function DisasterDataManager() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanReport, setScanReport] = useState<ScanReport | null>(null);
  const [removedDisasters, setRemovedDisasters] = useState<DisasterChange[]>([]);
  const [selectedChanges, setSelectedChanges] = useState<{
    new_disasters: DisasterChange[];
    updated_disasters: DisasterChange[];
  }>({
    new_disasters: [],
    updated_disasters: []
  });
  const [isApplying, setIsApplying] = useState(false);

  const handleScan = async () => {
    setIsScanning(true);
    setScanReport(null);
    setSelectedChanges({ new_disasters: [], updated_disasters: [] });

    try {
      const { data, error } = await supabase.functions.invoke('admin-disaster-scanner', {
        body: { action: 'scan' }
      });

      if (error) throw error;

      if (data.success && data.report) {
        setScanReport(data.report);
        setRemovedDisasters(data.removed_disasters || []);

        // Pre-select all changes by default
        setSelectedChanges({
          new_disasters: data.report.new_disasters || [],
          updated_disasters: data.report.updated_disasters || []
        });

        toast({
          title: "Scan Complete",
          description: `Found ${data.report.summary.total_changes} changes`,
        });
      }
    } catch (error) {
      console.error('Scan error:', error);
      toast({
        title: "Scan Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleApplyChanges = async () => {
    if (!scanReport) return;

    const confirmMessage = `Apply ${selectedChanges.new_disasters.length} new and ${selectedChanges.updated_disasters.length} updated disasters?`;

    if (!confirm(confirmMessage)) return;

    setIsApplying(true);

    try {
      const { data, error } = await supabase.functions.invoke('admin-disaster-scanner', {
        body: {
          action: 'apply_changes',
          apply_changes: {
            changes_to_apply: selectedChanges
          }
        }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Changes Applied Successfully",
          description: data.message,
        });

        // Clear report after successful application
        setScanReport(null);
        setSelectedChanges({ new_disasters: [], updated_disasters: [] });
      }
    } catch (error) {
      console.error('Apply error:', error);
      toast({
        title: "Failed to Apply Changes",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsApplying(false);
    }
  };

  const toggleDisasterSelection = (disaster: DisasterChange, type: 'new' | 'updated') => {
    setSelectedChanges(prev => {
      const key = type === 'new' ? 'new_disasters' : 'updated_disasters';
      const isSelected = prev[key].some(d => d.agrn === disaster.agrn);

      return {
        ...prev,
        [key]: isSelected
          ? prev[key].filter(d => d.agrn !== disaster.agrn)
          : [...prev[key], disaster]
      };
    });
  };

  const selectAll = (type: 'new' | 'updated') => {
    if (!scanReport) return;

    const key = type === 'new' ? 'new_disasters' : 'updated_disasters';
    const disasters = type === 'new' ? scanReport.new_disasters : scanReport.updated_disasters;

    setSelectedChanges(prev => ({
      ...prev,
      [key]: disasters
    }));
  };

  const deselectAll = (type: 'new' | 'updated') => {
    const key = type === 'new' ? 'new_disasters' : 'updated_disasters';

    setSelectedChanges(prev => ({
      ...prev,
      [key]: []
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Disaster Data Management
        </CardTitle>
        <CardDescription>
          Scan DRFA for updates and manage disaster database
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Scan Button */}
        <div className="flex gap-2">
          <Button
            onClick={handleScan}
            disabled={isScanning}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'Scanning DRFA...' : 'Scan for Updates'}
          </Button>

          {scanReport && (selectedChanges.new_disasters.length > 0 || selectedChanges.updated_disasters.length > 0) && (
            <Button
              onClick={handleApplyChanges}
              disabled={isApplying}
              variant="default"
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isApplying ? 'Applying...' : `Apply Selected (${selectedChanges.new_disasters.length + selectedChanges.updated_disasters.length})`}
            </Button>
          )}
        </div>

        {/* Scan Report */}
        {scanReport && (
          <div className="space-y-4">
            {/* Summary */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Scan Results</AlertTitle>
              <AlertDescription>
                <div className="mt-2 space-y-1">
                  <div>Scanned: {scanReport.scraped_count} disasters from DRFA</div>
                  <div>Existing: {scanReport.existing_count} disasters in database</div>
                  <div className="flex gap-4 mt-2">
                    <Badge variant="default" className="gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {scanReport.summary.new_count} New
                    </Badge>
                    <Badge variant="secondary" className="gap-1">
                      <RefreshCw className="h-3 w-3" />
                      {scanReport.summary.updated_count} Updated
                    </Badge>
                    <Badge variant="destructive" className="gap-1">
                      <Calendar className="h-3 w-3" />
                      {scanReport.summary.ended_count} Ended
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      {scanReport.unchanged_count} Unchanged
                    </Badge>
                  </div>
                </div>
              </AlertDescription>
            </Alert>

            {/* Changes Tabs */}
            <Tabs defaultValue="new" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="new" className="gap-1">
                  New ({scanReport.new_disasters.length})
                </TabsTrigger>
                <TabsTrigger value="updated" className="gap-1">
                  Updated ({scanReport.updated_disasters.length})
                </TabsTrigger>
                <TabsTrigger value="ended" className="gap-1">
                  Ended ({scanReport.ended_disasters.length})
                </TabsTrigger>
                <TabsTrigger value="removed" className="gap-1">
                  Removed ({removedDisasters.length})
                </TabsTrigger>
              </TabsList>

              {/* New Disasters */}
              <TabsContent value="new" className="space-y-2">
                <div className="flex gap-2 mb-2">
                  <Button size="sm" variant="outline" onClick={() => selectAll('new')}>
                    Select All
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => deselectAll('new')}>
                    Deselect All
                  </Button>
                </div>
                {scanReport.new_disasters.map(disaster => (
                  <Card key={disaster.agrn} className="p-3">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedChanges.new_disasters.some(d => d.agrn === disaster.agrn)}
                        onChange={() => toggleDisasterSelection(disaster, 'new')}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="default">NEW</Badge>
                          <span className="font-mono text-sm">AGRN {disaster.agrn}</span>
                          <Badge variant="outline">{disaster.state}</Badge>
                        </div>
                        <div className="mt-1 font-medium">{disaster.title}</div>
                        <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {disaster.start_date}
                          </span>
                          {disaster.url && (
                            <a href={disaster.url} target="_blank" rel="noopener noreferrer"
                               className="flex items-center gap-1 hover:text-primary">
                              <Link className="h-3 w-3" />
                              View
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              {/* Updated Disasters */}
              <TabsContent value="updated" className="space-y-2">
                <div className="flex gap-2 mb-2">
                  <Button size="sm" variant="outline" onClick={() => selectAll('updated')}>
                    Select All
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => deselectAll('updated')}>
                    Deselect All
                  </Button>
                </div>
                {scanReport.updated_disasters.map(disaster => (
                  <Card key={disaster.agrn} className="p-3">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedChanges.updated_disasters.some(d => d.agrn === disaster.agrn)}
                        onChange={() => toggleDisasterSelection(disaster, 'updated')}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">UPDATED</Badge>
                          <span className="font-mono text-sm">AGRN {disaster.agrn}</span>
                          <Badge variant="outline">{disaster.state}</Badge>
                        </div>
                        <div className="mt-1 font-medium">{disaster.title}</div>
                        {disaster.changes && disaster.changes.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {disaster.changes.map((change, idx) => (
                              <div key={idx} className="text-sm text-muted-foreground flex items-center gap-1">
                                <RefreshCw className="h-3 w-3" />
                                {change}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              {/* Ended Disasters */}
              <TabsContent value="ended" className="space-y-2">
                <Alert className="mb-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Disasters with New End Dates</AlertTitle>
                  <AlertDescription>
                    These disasters now have end dates and will affect telehealth eligibility
                  </AlertDescription>
                </Alert>
                {scanReport.ended_disasters.map(disaster => (
                  <Card key={disaster.agrn} className="p-3 border-orange-200">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="destructive">ENDED</Badge>
                          <span className="font-mono text-sm">AGRN {disaster.agrn}</span>
                          <Badge variant="outline">{disaster.state}</Badge>
                        </div>
                        <div className="mt-1 font-medium">{disaster.title}</div>
                        <div className="mt-2 text-sm">
                          <span className="text-muted-foreground">End Date: </span>
                          <span className="font-medium text-destructive">{disaster.end_date}</span>
                        </div>
                        {disaster.changes && disaster.changes.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {disaster.changes.map((change, idx) => (
                              <div key={idx} className="text-sm text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {change}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              {/* Removed Disasters */}
              <TabsContent value="removed" className="space-y-2">
                <Alert className="mb-2" variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertTitle>Disasters Not Found in DRFA</AlertTitle>
                  <AlertDescription>
                    These disasters exist in database but weren't found in the latest scan. They may have been removed from DRFA.
                  </AlertDescription>
                </Alert>
                {removedDisasters.map(disaster => (
                  <Card key={disaster.agrn} className="p-3 border-red-200">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="destructive">REMOVED</Badge>
                          <span className="font-mono text-sm">AGRN {disaster.agrn}</span>
                          <Badge variant="outline">{disaster.state}</Badge>
                        </div>
                        <div className="mt-1 font-medium">{disaster.title}</div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          This disaster no longer appears on the DRFA page
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
}