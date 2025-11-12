import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FileText, Download, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

interface ReportGenerationProgressProps {
  isOpen: boolean;
  onClose: () => void;
  patientCount: number;
  onGenerate: (format: 'pdf' | 'csv') => Promise<void>;
}

export const ReportGenerationProgress = ({
  isOpen,
  onClose,
  patientCount,
  onGenerate,
}: ReportGenerationProgressProps) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'generating' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'csv' | null>(null);

  const isLargeDataset = patientCount > 1000;
  const isVeryLargeDataset = patientCount > 10000;

  useEffect(() => {
    if (status === 'generating') {
      // Simulate progress for demo
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [status]);

  const handleGenerate = async (format: 'pdf' | 'csv') => {
    setSelectedFormat(format);
    setStatus('generating');
    setProgress(0);
    setError(null);

    try {
      await onGenerate(format);
      setProgress(100);
      setStatus('success');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Generation failed');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report Generation Options</DialogTitle>
          <DialogDescription>
            {patientCount.toLocaleString()} patients to process
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Dataset size warning */}
          {isVeryLargeDataset && (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>Large Dataset Detected</strong>
                <br />
                With {patientCount.toLocaleString()} patients, we recommend CSV export for optimal performance.
                PDF will contain summary only.
              </AlertDescription>
            </Alert>
          )}

          {/* Format selection */}
          {status === 'idle' && (
            <div className="space-y-3">
              <div className="grid gap-3">
                <Button
                  onClick={() => handleGenerate('pdf')}
                  variant="outline"
                  className="justify-start h-auto p-4"
                  disabled={isVeryLargeDataset && patientCount > 50000}
                >
                  <FileText className="mr-3 h-5 w-5" />
                  <div className="text-left">
                    <div className="font-semibold">PDF Report (2 pages)</div>
                    <div className="text-sm text-muted-foreground">
                      Executive summary with charts and compliance info
                      {isLargeDataset && ' (Summary only for large datasets)'}
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={() => handleGenerate('csv')}
                  variant="outline"
                  className="justify-start h-auto p-4"
                >
                  <Download className="mr-3 h-5 w-5" />
                  <div className="text-left">
                    <div className="font-semibold">CSV Export (Full Data)</div>
                    <div className="text-sm text-muted-foreground">
                      Complete patient-level data for Excel analysis
                      {isVeryLargeDataset && ' (Recommended for 10,000+ patients)'}
                    </div>
                  </div>
                </Button>
              </div>

              <div className="text-xs text-muted-foreground">
                <strong>Industry Standard:</strong> Healthcare systems typically use CSV for datasets over 10,000 records
              </div>
            </div>
          )}

          {/* Progress indicator */}
          {status === 'generating' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">
                  Generating {selectedFormat?.toUpperCase()} report...
                </span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="text-xs text-muted-foreground">
                Processing {patientCount.toLocaleString()} patient records
                {isLargeDataset && ' (This may take a moment for large datasets)'}
              </div>
            </div>
          )}

          {/* Success message */}
          {status === 'success' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-semibold">Report Generated Successfully!</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Your {selectedFormat?.toUpperCase()} report has been downloaded.
              </div>
            </div>
          )}

          {/* Error message */}
          {status === 'error' && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error || 'Failed to generate report. Please try again.'}
              </AlertDescription>
            </Alert>
          )}

          {/* Performance metrics */}
          {isLargeDataset && status === 'idle' && (
            <div className="border rounded-lg p-3 bg-muted/50">
              <div className="text-xs font-semibold mb-2">Expected Performance:</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">PDF Generation:</span>
                  <div className="font-medium">~{Math.ceil(patientCount / 5000)} seconds</div>
                </div>
                <div>
                  <span className="text-muted-foreground">CSV Export:</span>
                  <div className="font-medium">~{Math.ceil(patientCount / 10000)} seconds</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-2 mt-4">
          {status === 'idle' && (
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          )}
          {(status === 'success' || status === 'error') && (
            <Button onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};