import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, AlertCircle, Shield } from 'lucide-react';

interface ReportConsentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (clinicName: string, privacyConfirmed: boolean) => Promise<void>;
  analysisResult: {
    totalAnalyzed: number;
    eligibleCount: number;
    eligiblePercentage: number;
  };
}

export const ReportConsentDialog = ({
  isOpen,
  onClose,
  onGenerate,
  analysisResult,
}: ReportConsentDialogProps) => {
  const [clinicName, setClinicName] = useState('');
  const [privacyConfirmed, setPrivacyConfirmed] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setError(null);

    if (!clinicName.trim()) {
      setError('Please enter your clinic name');
      return;
    }

    if (!privacyConfirmed) {
      setError('Please confirm that all patient data has been de-identified');
      return;
    }

    setIsGenerating(true);
    try {
      await onGenerate(clinicName, privacyConfirmed);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generate Healthcare Planning Report
          </DialogTitle>
          <DialogDescription>
            Complete the following information to generate your PDF report for {analysisResult.totalAnalyzed.toLocaleString()} patients
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Clinic Name Input */}
          <div className="space-y-2">
            <Label htmlFor="clinicName" className="text-sm font-medium">
              Clinic/Practice Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="clinicName"
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
              placeholder="Enter your clinic or practice name"
              className="w-full"
              disabled={isGenerating}
            />
            <p className="text-xs text-muted-foreground">
              This will appear on the report header
            </p>
          </div>

          {/* Privacy Confirmation */}
          <div className="space-y-3">
            <Alert className="bg-blue-50 border-blue-200">
              <Shield className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-sm">
                <strong className="text-blue-900">Privacy & Compliance Notice</strong>
                <div className="mt-2 space-y-1 text-blue-800">
                  <p>• Ensure all patient identifiers have been removed</p>
                  <p>• Report will contain aggregated statistics only</p>
                  <p>• Data processing complies with Privacy Act 1988</p>
                </div>
              </AlertDescription>
            </Alert>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="privacy"
                checked={privacyConfirmed}
                onCheckedChange={(checked) => setPrivacyConfirmed(checked as boolean)}
                disabled={isGenerating}
                className="mt-1"
              />
              <Label
                htmlFor="privacy"
                className="text-sm leading-relaxed cursor-pointer"
              >
                I confirm that all patient data has been de-identified and no personal
                health information (names, dates of birth, Medicare numbers, addresses)
                is included in this analysis
              </Label>
            </div>
          </div>

          {/* Analysis Summary */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Report Summary</h4>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-gray-500">Total Patients</p>
                <p className="font-semibold">{analysisResult.totalAnalyzed.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Eligible</p>
                <p className="font-semibold text-green-600">
                  {analysisResult.eligibleCount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Eligibility Rate</p>
                <p className="font-semibold">{analysisResult.eligiblePercentage}%</p>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isGenerating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !clinicName || !privacyConfirmed}
          >
            {isGenerating ? (
              <>Generating Report...</>
            ) : (
              <>Generate PDF Report</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};