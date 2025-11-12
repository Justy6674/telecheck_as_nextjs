import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  MapPin
} from 'lucide-react';
import { parsePostcodeData } from '../utils/postcodeParser';
import type { PostcodeData } from '../types';

interface DataUploadZoneProps {
  expectedCount: number;
  onDataUploaded: (data: PostcodeData) => void;
}

/**
 * Enterprise Data Upload Component
 * 
 * Handles large CSV files (50K+ records) with:
 * - Memory-efficient streaming parsing
 * - Postcode validation and cleaning
 * - Progress tracking for large files
 * - Data quality reporting
 */
export const DataUploadZone: React.FC<DataUploadZoneProps> = ({
  expectedCount,
  onDataUploaded
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedData, setUploadedData] = useState<PostcodeData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Validate file size (max 100MB for enterprise)
      const maxSize = 100 * 1024 * 1024; // 100MB
      if (file.size > maxSize) {
        throw new Error(`File too large. Maximum size is ${maxSize / 1024 / 1024}MB`);
      }

      // Parse with progress tracking
      const data = await parsePostcodeData(file, (progress) => {
        setUploadProgress(progress);
      });

      // Validate data quality
      if (data.postcodes.length === 0) {
        throw new Error('No valid postcodes found in file');
      }

      // Check against expected count (allow 10% variance)
      const variance = Math.abs(data.totalCount - expectedCount) / expectedCount;
      if (variance > 0.1) {
        console.warn(`Patient count variance: expected ${expectedCount}, got ${data.totalCount}`);
      }

      setUploadedData(data);
      onDataUploaded(data);

    } catch (err: any) {
      console.error('File processing error:', err);
      setError(err.message || 'Failed to process file');
    } finally {
      setIsProcessing(false);
      setUploadProgress(0);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(file => 
      file.type === 'text/csv' || file.name.endsWith('.csv')
    );

    if (csvFile) {
      processFile(csvFile);
    } else {
      setError('Please upload a CSV file');
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  if (uploadedData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-green-600">
            <CheckCircle className="w-5 h-5 mr-2" />
            Data Upload Complete
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {uploadedData.totalCount.toLocaleString()}
              </div>
              <div className="text-sm text-blue-800">Total Patient Records</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {uploadedData.patientCount.toLocaleString()}
              </div>
              <div className="text-sm text-green-800">Patient Locations</div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-gray-50 rounded">
            <div className="flex items-center text-sm text-gray-600">
              <FileText className="w-4 h-4 mr-2" />
              <span>{uploadedData.fileName || 'Uploaded file'}</span>
              <span className="ml-auto">
                {uploadedData.uploadedAt.toLocaleTimeString()}
              </span>
            </div>
          </div>

          <Button 
            className="w-full mt-4" 
            onClick={() => {
              // Proceed to metrics selection
            }}
          >
            <MapPin className="w-4 h-4 mr-2" />
            Continue to Analysis Configuration
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Upload className="w-5 h-5 mr-2" />
          Upload Patient Data
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isProcessing ? (
          <div className="space-y-4">
            <Progress value={uploadProgress} className="w-full" />
            <p className="text-sm text-center text-gray-600">
              Processing large dataset... {uploadProgress.toFixed(0)}% complete
            </p>
          </div>
        ) : (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">
              Upload Patient Postcode Data
            </h3>
            <p className="text-gray-600 mb-4">
              Expected: {expectedCount.toLocaleString()} patient records
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Drag and drop your CSV file here, or click to browse
            </p>
            
            <input
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <Button asChild>
              <label htmlFor="file-upload" className="cursor-pointer">
                <FileText className="w-4 h-4 mr-2" />
                Select CSV File
              </label>
            </Button>
          </div>
        )}

        <div className="mt-4 text-xs text-gray-500 space-y-1">
          <p>• CSV format with postcode column required</p>
          <p>• Maximum file size: 100MB</p>
          <p>• Supports up to 50,000+ patient records</p>
          <p>• Data is processed securely and never stored permanently</p>
        </div>
      </CardContent>
    </Card>
  );
};