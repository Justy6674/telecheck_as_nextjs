import React, { useState } from 'react';
import { PostcodeChecker } from './PostcodeChecker';
import { ProformaToggle, ProformaType } from './ProformaToggle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export const EnhancedPostcodeChecker: React.FC = () => {
  const [proformaType, setProformaType] = useState<ProformaType>('long');

  return (
    <div className="space-y-6">
      {/* Proforma Selection */}
      <Card className="bg-white/10 border-white/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5" />
            Clinical Notes Format
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ProformaToggle 
            activeType={proformaType}
            onTypeChange={setProformaType}
            showCustom={true}
          />
          <p className="text-white/70 text-sm mt-2">
            Choose your preferred clinical notes format for eligibility documentation
          </p>
        </CardContent>
      </Card>

      {/* Enhanced Postcode Checker with Proforma Integration */}
      <PostcodeChecker proformaType={proformaType} />
    </div>
  );
};