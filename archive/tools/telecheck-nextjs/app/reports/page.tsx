"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useOutsetaUser } from '@/hooks/useOutsetaUser';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Download,
  Calendar,
  Users,
  TrendingUp,
  Trash2,
  ArrowLeft,
  Loader2,
  Search,
  Filter,
  Eye
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { generateSimplePDF } from '@/utils/simplePdfGenerator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SavedReport {
  id: string;
  clinic_name: string;
  report_type: string;
  total_patients: number;
  eligible_patients: number;
  eligible_percentage: number;
  file_name: string;
  file_size: number;
  pdf_base64: string;
  created_at: string;
  metadata: {
    version?: string;
    pages?: number;
    states_analyzed?: number;
    has_demographics?: boolean;
    generation_date?: string;
  };
}

const Reports = () => {
  const navigate = useNavigate();
  const { user } = useOutsetaUser();
  const { toast } = useToast();
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteReportId, setDeleteReportId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchReports();
    }
  }, [user]);

  const fetchReports = async () => {
    try {
      console.log('🔍 DEBUGGING Reports - user?.Email:', user?.Email);
      console.log('🔍 DEBUGGING Reports - user?.Name:', user?.Name);
      console.log('🔍 DEBUGGING Reports - full user object:', user);

      // ✅ NEW: Query saved_clinic_reports table directly using user_id
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', user?.Email)
        .single();

      const { data: reportsData, error } = await supabase
        .from('saved_clinic_reports')
        .select('*')
        .eq('user_id', profileData?.id)
        .order('created_at', { ascending: false });

      console.log('🔍 DEBUGGING Reports - query result:', { reportsData, error });

      if (error) throw error;

      const savedReports = reportsData || [];
      console.log('🔍 DEBUGGING Reports - found', savedReports.length, 'reports');

      setReports(savedReports as SavedReport[] || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast({
        title: "Error",
        description: "Failed to load your reports",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const viewPDF = (report: SavedReport) => {
    try {
      toast({
        title: "Opening PDF",
        description: "Generating PDF for viewing...",
      });

      // Use simple jsPDF generator in VIEW mode
      const analysisData = (report as any).raw_data || report.analysis_data || {};
      const pdfUrl = generateSimplePDF(report.clinic_name, analysisData, true);

      if (pdfUrl) {
        // Open PDF in new tab for viewing
        window.open(pdfUrl, '_blank');
        
        toast({
          title: "PDF Opened",
          description: "Report opened in new tab",
        });
      }
    } catch (error) {
      console.error('Error viewing PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive",
      });
    }
  };

  const downloadReport = (report: SavedReport) => {
    try {
      toast({
        title: "Downloading PDF",
        description: "Generating PDF for download...",
      });

      // Use simple jsPDF generator in DOWNLOAD mode
      const analysisData = (report as any).raw_data || report.analysis_data || {};
      generateSimplePDF(report.clinic_name, analysisData, false);

      toast({
        title: "PDF Downloaded",
        description: "Report saved to your downloads",
      });
    } catch (error) {
      console.error('Error downloading report:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive",
      });
    }
  };

  const deleteReport = async () => {
    if (!deleteReportId) return;

    setDeleting(true);
    try {
      // ✅ NEW: Delete directly from saved_clinic_reports table
      const { error } = await supabase
        .from('saved_clinic_reports')
        .delete()
        .eq('id', deleteReportId);

      if (error) throw error;

      setReports(reports.filter(r => r.id !== deleteReportId));
      toast({
        title: "Success",
        description: "Report deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting report:', error);
      toast({
        title: "Error",
        description: "Failed to delete report",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
      setDeleteReportId(null);
    }
  };

  const filteredReports = reports.filter(report =>
    report.clinic_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.file_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Please sign in to view your reports</h2>
          <Button onClick={() => navigate('/auth')}>Sign In</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/members')}
              className="text-white hover:text-cyan-400"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-xl font-bold text-white">My Reports</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Stats */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-700 text-white"
            />
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="bg-slate-700 text-white">
              <FileText className="h-4 w-4 mr-1" />
              {reports.length} Reports
            </Badge>
            <Badge variant="secondary" className="bg-slate-700 text-white">
              <Filter className="h-4 w-4 mr-1" />
              {filteredReports.length} Shown
            </Badge>
          </div>
        </div>

        {/* Reports Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
          </div>
        ) : filteredReports.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 text-slate-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                {searchTerm ? 'No reports match your search' : 'No reports generated yet'}
              </h3>
              <p className="text-slate-400 mb-4">
                {searchTerm ? 'Try a different search term' : 'Generate your first report from the Clinic Analysis page'}
              </p>
              {!searchTerm && (
                <Button onClick={() => navigate('/clinic-analysis')}>
                  Go to Clinic Analysis
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReports.map((report) => (
              <Card key={report.id} className="bg-slate-800/50 border-slate-700 hover:border-cyan-500 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white text-lg">
                        {report.clinic_name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-400">
                          {formatDate(report.created_at)}
                        </span>
                      </div>
                    </div>
                    <Badge className="bg-cyan-900 text-cyan-100">
                      v{report.metadata?.version || '2.0'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-slate-700/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                        <Users className="h-3 w-3" />
                        Total Patients
                      </div>
                      <div className="text-white font-semibold">
                        {report.total_patients.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                        <TrendingUp className="h-3 w-3" />
                        Eligible
                      </div>
                      <div className="text-green-400 font-semibold">
                        {(report.eligible_percentage || report.eligibility_percentage || 0).toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="text-xs text-slate-500 mb-4 space-y-1">
                    <div>States analyzed: {report.metadata?.states_analyzed || 'N/A'}</div>
                    <div>File size: {formatFileSize(report.file_size)}</div>
                    <div>{report.metadata?.pages || 2} pages</div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => viewPDF(report)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => downloadReport(report)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      onClick={() => setDeleteReportId(report.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteReportId} onOpenChange={() => setDeleteReportId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Report</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this report? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteReport}
              disabled={deleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Reports;