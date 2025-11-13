import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import EnhancedFileParser from '@/components/EnhancedFileParser';

export interface PostcodeData {
  postcodes: string[];
  demographics: Array<{
    postcode: string;
    age?: number;
    gender?: string;
    dateOfBirth?: string;
  }>;
  totalRecords: number;
  uploadMethod: 'csv' | 'paste' | 'manual';
  timestamp: Date;
  fileFormat?: string;
  hasDemographics?: boolean;
}

interface ClinicAnalysisPostcodeDropProps {
  onDataParsed: (data: PostcodeData) => void;
  maxRecords?: number;
}

export const ClinicAnalysisPostcodeDrop: React.FC<ClinicAnalysisPostcodeDropProps> = ({
  onDataParsed,
  maxRecords = 50000
}) => {
  const { toast } = useToast();
  const [currentData, setCurrentData] = useState<PostcodeData | null>(null);

  // Handle data from EnhancedFileParser (which handles BOTH file upload AND paste)
  const handleFileDataParsed = useCallback((data: {
    postcodes: string[];
    demographics: Array<{
      postcode: string;
      age?: number;
      gender?: string;
      dateOfBirth?: string;
    }>;
    totalRecords: number;
    fileFormat?: string;
    hasDemographics?: boolean;
  }) => {
    const postcodeData: PostcodeData = {
      postcodes: data.postcodes,
      demographics: data.demographics,
      totalRecords: data.totalRecords,
      uploadMethod: 'csv',
      timestamp: new Date(),
      fileFormat: data.fileFormat,
      hasDemographics: data.hasDemographics
    };

    setCurrentData(postcodeData);
    onDataParsed(postcodeData);

    toast({
      title: 'Patient Data Loaded Successfully',
      description: `${data.totalRecords} patients loaded for analysis - each postcode entry represents one patient`,
    });
  }, [onDataParsed, toast]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Patient Data Input
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* EnhancedFileParser handles BOTH file upload AND paste - no need for duplicate! */}
        <EnhancedFileParser onDataParsed={handleFileDataParsed} />
        <p className="text-sm text-slate-300">
          Upload CSV/Excel files or paste postcodes directly.
          The system will automatically detect and extract all valid 4-digit postcodes.
        </p>

        {/* Data Summary */}
        {currentData && (
          <div className="mt-4 p-4 bg-secondary/10 rounded-lg space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Users className="w-4 h-4" />
              Data Loaded
            </h4>
            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex flex-col gap-1">
                <div>
                  <span className="text-slate-300">Total Patients:</span>
                  <Badge variant="secondary" className="ml-2">
                    {currentData.totalRecords}
                  </Badge>
                </div>
                <p className="text-xs text-slate-300">
                  Each postcode entry = one patient • Duplicate postcodes preserved for accurate patient counts
                </p>
              </div>
              <div>
                <span className="text-slate-300">Method:</span>
                <Badge variant="outline" className="ml-2">
                  {currentData.uploadMethod.toUpperCase()}
                </Badge>
              </div>
              {currentData.hasDemographics && (
                <div>
                  <span className="text-slate-300">Demographics:</span>
                  <Badge variant="default" className="ml-2 bg-green-100 text-green-800 border-green-300">
                    Available
                  </Badge>
                </div>
              )}
            </div>

            {/* Preview first few postcodes */}
            <div className="mt-2">
              <span className="text-sm text-slate-300">Sample postcodes: </span>
              <span className="text-sm font-mono">
                {currentData.postcodes.slice(0, 5).join(', ')}
                {currentData.postcodes.length > 5 && '...'}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};