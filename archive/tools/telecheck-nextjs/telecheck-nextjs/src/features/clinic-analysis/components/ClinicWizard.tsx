import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import type { WizardData } from '../types';

interface ClinicWizardProps {
  onComplete: (data: WizardData) => void;
}

/**
 * Enterprise Clinic Setup Wizard
 * 
 * 6-step wizard for clinic configuration:
 * 1. Clinic Details
 * 2. Practice Structure  
 * 3. Service Model
 * 4. Patient Data
 * 5. Data Upload
 * 6. Analysis Selection
 */
export const ClinicWizard: React.FC<ClinicWizardProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<WizardData>>({});

  const totalSteps = 6;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formData as WizardData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (field: keyof WizardData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.clinicName && formData.ownerName && formData.ownerTitle;
      case 2:
        return formData.practiceStructure;
      case 3:
        return formData.serviceModel;
      case 4:
        return formData.patientCount && formData.analysisScope;
      default:
        return true;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="clinicName">Clinic Name</Label>
              <Input
                id="clinicName"
                placeholder="e.g., Sydney Medical Centre"
                value={formData.clinicName || ''}
                onChange={(e) => updateFormData('clinicName', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="ownerName">Practice Owner/Principal</Label>
              <Input
                id="ownerName"
                placeholder="e.g., Dr Jane Smith"
                value={formData.ownerName || ''}
                onChange={(e) => updateFormData('ownerName', e.target.value)}
              />
            </div>
            <div>
              <Label>Title</Label>
              <RadioGroup
                value={formData.ownerTitle}
                onValueChange={(value) => updateFormData('ownerTitle', value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Dr" id="Dr" />
                  <Label htmlFor="Dr">Doctor</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Ms" id="Ms" />
                  <Label htmlFor="Ms">Ms</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Mr" id="Mr" />
                  <Label htmlFor="Mr">Mr</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Professor" id="Professor" />
                  <Label htmlFor="Professor">Professor</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <Label>Practice Structure</Label>
            <RadioGroup
              value={formData.practiceStructure}
              onValueChange={(value) => updateFormData('practiceStructure', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="solo" id="solo" />
                <Label htmlFor="solo">Solo practitioner</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="group_2_5" id="group_2_5" />
                <Label htmlFor="group_2_5">Small group (2-5 practitioners)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="group_6_15" id="group_6_15" />
                <Label htmlFor="group_6_15">Medium group (6-15 practitioners)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="group_16_plus" id="group_16_plus" />
                <Label htmlFor="group_16_plus">Large group (16+ practitioners)</Label>
              </div>
            </RadioGroup>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <Label>Service Model</Label>
            <RadioGroup
              value={formData.serviceModel}
              onValueChange={(value) => updateFormData('serviceModel', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="telehealth_only" id="telehealth_only" />
                <Label htmlFor="telehealth_only">Telehealth only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mixed" id="mixed" />
                <Label htmlFor="mixed">Mixed (telehealth + in-person)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="in_person_only" id="in_person_only" />
                <Label htmlFor="in_person_only">In-person only</Label>
              </div>
            </RadioGroup>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="patientCount">Total Patient Count</Label>
              <Input
                id="patientCount"
                type="number"
                placeholder="e.g., 792"
                value={formData.patientCount || ''}
                onChange={(e) => updateFormData('patientCount', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label>Analysis Scope</Label>
              <RadioGroup
                value={formData.analysisScope}
                onValueChange={(value) => updateFormData('analysisScope', value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="full_clinic" id="full_clinic" />
                  <Label htmlFor="full_clinic">Full clinic analysis (all patients)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sample_patients" id="sample_patients" />
                  <Label htmlFor="sample_patients">Sample analysis (representative subset)</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Ready for Data Upload</h3>
              <p className="text-gray-600 mb-4">
                Next, you'll upload your patient postcode data (CSV format)
              </p>
              <div className="flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <div className="text-center p-8 bg-green-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-green-800">Setup Complete!</h3>
              <p className="text-green-700 mb-4">
                Your clinic analysis is configured and ready to process {formData.patientCount} patients
              </p>
              <div className="flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Clinic Setup - Step {currentStep} of {totalSteps}</CardTitle>
          <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="mt-2" />
      </CardHeader>
      
      <CardContent className="space-y-6">
        {renderStep()}
        
        <div className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!isStepValid()}
          >
            {currentStep === totalSteps ? 'Complete Setup' : 'Next'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};