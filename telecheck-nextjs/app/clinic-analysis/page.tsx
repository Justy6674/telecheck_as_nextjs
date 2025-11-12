"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOutsetaUser } from '@/hooks/useOutsetaUser';
import { RequireFeature } from '@/components/RequireFeature';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClinicAnalysisProfessional } from '@/components/clinic/ClinicAnalysisProfessional';
import { Upload, ArrowLeft } from 'lucide-react';

export default function ClinicAnalysis() {
  const navigate = useNavigate();
  const { user, isLoading } = useOutsetaUser();

  const handleBackToDashboard = () => {
    navigate('/members');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <RequireFeature feature="professional">
      <div className="min-h-screen bg-slate-950">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Back to Dashboard Button */}
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={handleBackToDashboard}
                className="flex items-center gap-2 text-slate-300 hover:text-slate-100"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-slate-100 mb-4">
                Professional Clinic Analysis
              </h1>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Upload bulk patient data for Medicare telehealth disaster eligibility analysis (20 Metrics)
              </p>
            </div>

            {/* Professional Clinic Analysis - No tabs needed */}
            <div className="space-y-6">
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-2xl text-slate-100 flex items-center gap-2">
                    <Upload className="w-6 h-6" />
                    Professional Clinic Analysis (20 Metrics)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ClinicAnalysisProfessional />
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </div>
    </RequireFeature>
  );
}