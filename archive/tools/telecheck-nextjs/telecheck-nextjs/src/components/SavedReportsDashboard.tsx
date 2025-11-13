import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useOutsetaUser } from '@/hooks/useOutsetaUser';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  FileText,
  Download,
  Trash2,
  Star,
  MoreVertical,
  Search,
  Building2,
  Calendar,
  TrendingUp,
  Users,
  MapPin,
  BarChart3,
  Filter,
  Eye,
} from 'lucide-react';

interface SavedReport {
  id: string;
  clinic_name: string;
  clinic_identifier?: string;
  clinic_location?: string;
  report_date: string;
  total_patients: number;
  eligible_patients: number;
  eligibility_percentage: number;
  is_starred: boolean;
  tags?: string[];
  pdf_url?: string;
  csv_url?: string;
  major_cities_count: number;
  remote_count: number;
  very_remote_count: number;
}

interface ClinicProfile {
  id: string;
  clinic_name: string;
  clinic_identifier?: string;
  clinic_location?: string;
  is_primary: boolean;
  last_used: string;
}

export const SavedReportsDashboard = () => {
  const { user } = useOutsetaUser();
  const { toast } = useToast();

  const [reports, setReports] = useState<SavedReport[]>([]);
  const [clinics, setClinics] = useState<ClinicProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClinic, setSelectedClinic] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [showStarredOnly, setShowStarredOnly] = useState(false);

  // Load saved reports
  const loadReports = async () => {
    if (!user) return;

    try {
      let query = supabase
        .from('user_reports_outseta')
        .select('*')
        .eq('user_email', user.Email)
        .order('created_at', { ascending: false });

      // Apply filters
      if (selectedClinic !== 'all') {
        query = query.eq('clinic_name', selectedClinic);
      }

      if (showStarredOnly) {
        query = query.eq('is_starred', true);
      }

      // Date filter
      if (dateFilter !== 'all') {
        const now = new Date();
        let startDate;

        switch (dateFilter) {
          case 'today':
            startDate = new Date(now.setHours(0, 0, 0, 0));
            break;
          case 'week':
            startDate = new Date(now.setDate(now.getDate() - 7));
            break;
          case 'month':
            startDate = new Date(now.setMonth(now.getMonth() - 1));
            break;
          case 'quarter':
            startDate = new Date(now.setMonth(now.getMonth() - 3));
            break;
          case 'year':
            startDate = new Date(now.setFullYear(now.getFullYear() - 1));
            break;
        }

        if (startDate) {
          query = query.gte('created_at', startDate.toISOString());
        }
      }

      const { data, error } = await query;

      if (error) throw error;

      // Apply search filter
      let filteredData = data || [];
      if (searchTerm) {
        filteredData = filteredData.filter(report =>
          report.clinic_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.clinic_identifier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.clinic_location?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setReports(filteredData as SavedReport[]);
    } catch (error) {
      console.error('Error loading reports:', error);
      toast({
        title: 'Error',
        description: 'Failed to load saved reports',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Load user clinics
  const loadClinics = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_clinics_outseta')
        .select('*')
        .eq('user_email', user.Email)
        .order('last_used', { ascending: false });

      if (error) throw error;
      setClinics(data as ClinicProfile[] || []);
    } catch (error) {
      console.error('Error loading clinics:', error);
    }
  };

  // Toggle star status
  const toggleStar = async (reportId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('user_reports_outseta')
        .update({ is_starred: !currentStatus })
        .eq('id', reportId);

      if (error) throw error;

      toast({
        title: currentStatus ? 'Removed from starred' : 'Added to starred',
        description: 'Report star status updated',
      });

      loadReports();
    } catch (error) {
      console.error('Error updating star status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update star status',
        variant: 'destructive',
      });
    }
  };

  // Delete report
  const deleteReport = async (reportId: string) => {
    if (!confirm('Are you sure you want to delete this report?')) return;

    try {
      const { error } = await supabase
        .from('user_reports_outseta')
        .delete()
        .eq('id', reportId);

      if (error) throw error;

      toast({
        title: 'Report deleted',
        description: 'The report has been removed from your saved reports',
      });

      loadReports();
    } catch (error) {
      console.error('Error deleting report:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete report',
        variant: 'destructive',
      });
    }
  };

  // View PDF in new tab
  const viewPDF = async (report: SavedReport) => {
    try {
      toast({
        title: 'Generating PDF Preview',
        description: 'Opening report in new tab...',
      });

      // Call Edge Function to generate PDF
      const { data, error } = await supabase.functions.invoke('pdfshift-report-generator', {
        body: {
          clinicName: report.clinic_name,
          analysisResult: report.analysis_data,
          viewMode: true // Flag to indicate we want to view, not download
        }
      });

      if (error) {
        throw new Error(`Failed to generate PDF: ${error.message}`);
      }

      // The Edge Function should return the PDF URL or base64
      if (data && data.pdfUrl) {
        window.open(data.pdfUrl, '_blank');
      } else if (data && data.pdfData) {
        // If we get base64 PDF data, create a blob URL and open it
        const blob = new Blob([Uint8Array.from(atob(data.pdfData), c => c.charCodeAt(0))], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        // Clean up the URL after a delay
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }

      toast({
        title: 'PDF Opened',
        description: 'Report opened in new tab',
      });

    } catch (error) {
      console.error('❌ PDF view failed:', error);
      toast({
        title: 'PDF View Failed',
        description: error instanceof Error ? error.message : 'Failed to open PDF',
        variant: 'destructive'
      });
    }
  };

  // Download report
  const downloadReport = async (report: SavedReport, format: 'pdf' | 'csv') => {
    if (format === 'pdf') {
      // Generate PDF using Edge Function + PDFShift API
      try {
        console.log('🚨🚨🚨 GENERATING PDF FOR SAVED REPORT 🚨🚨🚨');

        toast({
          title: 'PDF Generation Started',
          description: 'Converting saved report to PDF using Edge Function + PDFShift...',
        });

        // Call our Edge Function with saved report data
        const { data, error } = await supabase.functions.invoke('pdfshift-report-generator', {
          body: {
            clinicName: report.clinic_name,
            analysisResult: report.analysis_data // This should contain the full analysis
          }
        });

        if (error) {
          console.error('❌ Edge Function Error:', error);
          throw new Error(`Edge Function failed: ${error.message}`);
        }

        console.log('✅ PDF Generated from saved report');

        toast({
          title: 'PDF Download Successful',
          description: 'Your saved report has been converted to PDF via Edge Function + PDFShift'
        });

      } catch (error) {
        console.error('❌ PDF generation failed:', error);
        toast({
          title: 'PDF Export Failed',
          description: `Edge Function error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          variant: 'destructive'
        });
      }
      return;
    }

    // CSV download (original logic)
    const url = report.csv_url;

    if (!url) {
      toast({
        title: 'Download not available',
        description: `${format.toUpperCase()} file is not available for this report`,
        variant: 'destructive',
      });
      return;
    }

    // Create download link
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.clinic_name.replace(/\s+/g, '_')}_${report.report_date}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    loadReports();
    loadClinics();
  }, [user, selectedClinic, dateFilter, showStarredOnly, searchTerm]);

  // Calculate summary statistics
  const summaryStats = {
    totalReports: reports.length,
    totalPatients: reports.reduce((sum, r) => sum + r.total_patients, 0),
    averageEligibility: reports.length > 0
      ? (reports.reduce((sum, r) => sum + r.eligibility_percentage, 0) / reports.length).toFixed(1)
      : 0,
    uniqueClinics: new Set(reports.map(r => r.clinic_name)).size,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Saved Clinic Reports</h2>
          <p className="text-muted-foreground">
            Manage and compare reports across all your clinic locations
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          {summaryStats.totalReports} Reports
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-medium">Total Clinics</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.uniqueClinics}</div>
            <p className="text-xs text-muted-foreground">Active locations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.totalPatients.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all reports</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-medium">Avg Eligibility</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.averageEligibility}%</div>
            <p className="text-xs text-muted-foreground">Across all clinics</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-medium">Reports</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryStats.totalReports}</div>
            <p className="text-xs text-muted-foreground">Total saved</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filter Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search clinic name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="min-w-[180px]">
              <Label htmlFor="clinic-filter">Clinic</Label>
              <Select value={selectedClinic} onValueChange={setSelectedClinic}>
                <SelectTrigger id="clinic-filter">
                  <SelectValue placeholder="All clinics" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All clinics</SelectItem>
                  {Array.from(new Set(reports.map(r => r.clinic_name))).map(clinic => (
                    <SelectItem key={clinic} value={clinic}>
                      {clinic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-[150px]">
              <Label htmlFor="date-filter">Date Range</Label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger id="date-filter">
                  <SelectValue placeholder="All time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 days</SelectItem>
                  <SelectItem value="month">Last month</SelectItem>
                  <SelectItem value="quarter">Last quarter</SelectItem>
                  <SelectItem value="year">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant={showStarredOnly ? 'default' : 'outline'}
                onClick={() => setShowStarredOnly(!showStarredOnly)}
              >
                <Star className={`h-4 w-4 mr-2 ${showStarredOnly ? 'fill-current' : ''}`} />
                Starred Only
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Report History</CardTitle>
          <CardDescription>
            Click on any report to view details or download
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading reports...</div>
          ) : reports.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No reports found. Run a clinic analysis to generate your first report.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8"></TableHead>
                  <TableHead>Clinic</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Patients</TableHead>
                  <TableHead>Eligibility</TableHead>
                  <TableHead>Geographic</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleStar(report.id, report.is_starred)}
                      >
                        <Star
                          className={`h-4 w-4 ${
                            report.is_starred ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
                          }`}
                        />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{report.clinic_name}</div>
                        {report.clinic_identifier && (
                          <div className="text-xs text-muted-foreground">
                            {report.clinic_identifier}
                          </div>
                        )}
                        {report.clinic_location && (
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {report.clinic_location}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {new Date(report.report_date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{report.total_patients.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">
                          {report.total_patients} patients analyzed
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="font-medium">{report.eligibility_percentage}%</div>
                        <Badge variant={report.eligibility_percentage > 80 ? 'default' : 'secondary'}>
                          {report.eligible_patients} eligible
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs space-y-1">
                        <div>Cities: {((report.major_cities_count / report.total_patients) * 100).toFixed(0)}%</div>
                        <div>Remote: {(((report.remote_count + report.very_remote_count) / report.total_patients) * 100).toFixed(0)}%</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Report Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => viewPDF(report)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => downloadReport(report, 'pdf')}>
                            <FileText className="h-4 w-4 mr-2" />
                            Download PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => downloadReport(report, 'csv')}>
                            <Download className="h-4 w-4 mr-2" />
                            Download CSV
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => deleteReport(report.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Report
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};