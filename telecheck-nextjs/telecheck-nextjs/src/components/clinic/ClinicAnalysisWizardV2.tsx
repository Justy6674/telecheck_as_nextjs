import React, { useState, createContext, useContext, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, ChevronLeft, Settings, Users, MapPin, Upload, Filter, FileText, Check, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ClinicAnalysisPostcodeDrop, PostcodeData } from './ClinicAnalysisPostcodeDrop';
import { ClinicAnalysisFilter } from './ClinicAnalysisFilter';

// Comprehensive wizard data structure
export interface WizardData {
  // Step 1: Clinic Details
  clinicName: string;
  ownerName: string;
  ownerTitle: 'Dr' | 'NP' | 'Midwife' | 'Nurse' | 'Other';
  ownerSpecialties: string[]; // Can be both NP and Midwife

  // Step 2: Practice Structure
  practiceType: 'solo' | 'small' | 'medium' | 'large';
  practitioners: Array<{
    id: string;
    name: string;
    title: 'Dr' | 'NP' | 'Midwife' | 'Nurse' | 'Other';
    specialties: string[];
    homePostcode?: string;
    isContractor: boolean;
  }>;

  // Step 3: Service Model
  serviceModel: 'telehealth_only' | 'physical_only' | 'mixed';
  physicalLocations: Array<{
    id: string;
    name: string;
    postcode: string;
    practitioners: string[]; // practitioner IDs
  }>;

  // Step 4: Patient Data
  patientCount: number;
  dataScope: 'full_clinic' | 'practitioner_specific' | 'comparison';
  selectedPractitioners: string[]; // for practitioner-specific analysis

  // Step 5: Data Upload (handled in separate component)
  uploadedData?: any;
  uploadMethod?: 'csv' | 'manual';

  // Step 6: Analysis Filters (New structure)
  filters?: any;
}

// LocalStorage utility functions
const STORAGE_KEY = 'clinic_analysis_config';

const saveConfigToStorage = (data: WizardData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Failed to save configuration:', error);
    return false;
  }
};

const loadConfigFromStorage = (): WizardData | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load configuration:', error);
  }
  return null;
};

const clearStoredConfig = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear configuration:', error);
    return false;
  }
};

// Context for wizard state
const WizardContext = createContext<{
  data: WizardData;
  updateData: (updates: Partial<WizardData>) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  canProceed: () => boolean;
} | null>(null);

const useWizard = () => {
  const context = useContext(WizardContext);
  if (!context) throw new Error('useWizard must be used within WizardProvider');
  return context;
};

// Step 1: Clinic Details
const Step1ClinicDetails = () => {
  const { data, updateData } = useWizard();
  const [specialties, setSpecialties] = useState<string[]>(data.ownerSpecialties || []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Let's start with your clinic details</h2>
        <p className="text-muted-foreground">This information helps us personalise your analysis</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="clinicName">What is the name of your clinic?</Label>
          <Input
            id="clinicName"
            value={data.clinicName}
            onChange={(e) => updateData({ clinicName: e.target.value })}
            placeholder="e.g., Sydney Medical Centre"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="ownerName">Your name</Label>
          <Input
            id="ownerName"
            value={data.ownerName}
            onChange={(e) => updateData({ ownerName: e.target.value })}
            placeholder="e.g., Dr Jane Smith"
            className="mt-1"
          />
        </div>

        <div>
          <Label>What is your professional title?</Label>
          <RadioGroup
            value={data.ownerTitle}
            onValueChange={(value) => updateData({ ownerTitle: value as any })}
            className="mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Dr" id="Dr" />
              <Label htmlFor="Dr">Doctor</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="NP" id="NP" />
              <Label htmlFor="NP">Nurse Practitioner</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Midwife" id="Midwife" />
              <Label htmlFor="Midwife">Midwife</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Nurse" id="Nurse" />
              <Label htmlFor="Nurse">Nurse</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Other" id="Other" />
              <Label htmlFor="Other">Other Healthcare Professional</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Only show multiple qualifications for NP or Midwife */}
        {(data.ownerTitle === 'NP' || data.ownerTitle === 'Midwife') && (
          <div>
            <Label>Do you hold multiple qualifications? (Select all that apply)</Label>
            <div className="mt-2 space-y-2">
              {/* If they're an NP, offer Midwife as additional qualification */}
              {data.ownerTitle === 'NP' && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="also-midwife"
                    checked={specialties.includes('Midwife')}
                    onCheckedChange={(checked) => {
                      const updated = checked
                        ? [...specialties, 'Midwife']
                        : specialties.filter(s => s !== 'Midwife');
                      setSpecialties(updated);
                      updateData({ ownerSpecialties: updated });
                    }}
                  />
                  <Label htmlFor="also-midwife">Also a Midwife</Label>
                </div>
              )}

              {/* If they're a Midwife, offer NP as additional qualification */}
              {data.ownerTitle === 'Midwife' && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="also-np"
                    checked={specialties.includes('NP')}
                    onCheckedChange={(checked) => {
                      const updated = checked
                        ? [...specialties, 'NP']
                        : specialties.filter(s => s !== 'NP');
                      setSpecialties(updated);
                      updateData({ ownerSpecialties: updated });
                    }}
                  />
                  <Label htmlFor="also-np">Also a Nurse Practitioner</Label>
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                Many practitioners hold dual NP/Midwife qualifications
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Step 2: Practice Structure
const Step2PracticeStructure = () => {
  const { data, updateData } = useWizard();

  const handlePracticeTypeChange = (type: string) => {
    console.log('Practice type changing to:', type);
    // Combine updates into a single call to avoid re-render issues
    if (type === 'solo') {
      updateData({
        practiceType: type as any,
        practitioners: []
      });
    } else {
      updateData({ practiceType: type as any });
    }
  };

  const addPractitioner = () => {
    const newPractitioner = {
      id: `prac-${Date.now()}`,
      name: '',
      title: 'Dr' as const,
      specialties: [],
      homePostcode: '',
      isContractor: false
    };
    updateData({
      practitioners: [...(data.practitioners || []), newPractitioner]
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Tell us about your practice structure</h2>
        <p className="text-muted-foreground">This helps us understand your operational model</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Are you the only practitioner, or do you have staff/contractors?</Label>
          <RadioGroup
            value={data.practiceType}
            onValueChange={handlePracticeTypeChange}
            className="mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="solo" id="solo" />
              <Label htmlFor="solo">I'm the only practitioner</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="small" id="small" />
              <Label htmlFor="small">2-5 practitioners (including me)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="medium" />
              <Label htmlFor="medium">6-20 practitioners</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="large" id="large" />
              <Label htmlFor="large">21+ practitioners (enterprise)</Label>
            </div>
          </RadioGroup>
        </div>

        {data.practiceType !== 'solo' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Add your practitioners (use pseudonyms if preferred)</Label>
              <Button onClick={addPractitioner} size="sm">
                Add Practitioner
              </Button>
            </div>

            {data.practitioners?.map((prac, index) => (
              <Card key={prac.id} className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Name/Pseudonym</Label>
                    <Input
                      value={prac.name}
                      onChange={(e) => {
                        const updated = [...data.practitioners];
                        updated[index].name = e.target.value;
                        updateData({ practitioners: updated });
                      }}
                      placeholder="e.g., Dr Smith or Practitioner A"
                    />
                  </div>
                  <div>
                    <Label>Title</Label>
                    <Select
                      value={prac.title}
                      onValueChange={(value) => {
                        const updated = [...data.practitioners];
                        updated[index].title = value as any;
                        updateData({ practitioners: updated });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Dr">Doctor</SelectItem>
                        <SelectItem value="NP">Nurse Practitioner</SelectItem>
                        <SelectItem value="Midwife">Midwife</SelectItem>
                        <SelectItem value="Nurse">Nurse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Home Postcode (Optional)</Label>
                    <Input
                      value={prac.homePostcode}
                      onChange={(e) => {
                        const updated = [...data.practitioners];
                        updated[index].homePostcode = e.target.value;
                        updateData({ practitioners: updated });
                      }}
                      placeholder="e.g., 2000"
                      maxLength={4}
                    />
                  </div>
                  <div className="flex items-center space-x-2 mt-6">
                    <Checkbox
                      id={`contractor-${prac.id}`}
                      checked={prac.isContractor}
                      onCheckedChange={(checked) => {
                        const updated = [...data.practitioners];
                        updated[index].isContractor = checked as boolean;
                        updateData({ practitioners: updated });
                      }}
                    />
                    <Label htmlFor={`contractor-${prac.id}`}>Contractor</Label>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Step 3: Service Model
const Step3ServiceModel = () => {
  const { data, updateData } = useWizard();

  const addLocation = () => {
    const newLocation = {
      id: `loc-${Date.now()}`,
      name: '',
      postcode: '',
      practitioners: []
    };
    updateData({
      physicalLocations: [...(data.physicalLocations || []), newLocation]
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">How do you deliver healthcare?</h2>
        <p className="text-muted-foreground">Tell us about your service delivery model</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Are you telehealth only or do you have physical locations?</Label>
          <RadioGroup
            value={data.serviceModel}
            onValueChange={(value) => updateData({ serviceModel: value as any })}
            className="mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="telehealth_only" id="telehealth_only" />
              <Label htmlFor="telehealth_only">Telehealth only</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="physical_only" id="physical_only" />
              <Label htmlFor="physical_only">Physical locations only</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mixed" id="mixed" />
              <Label htmlFor="mixed">Mixed model (both telehealth and physical)</Label>
            </div>
          </RadioGroup>
        </div>

        {(data.serviceModel === 'physical_only' || data.serviceModel === 'mixed') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Add your clinic locations</Label>
              <Button onClick={addLocation} size="sm">
                Add Location
              </Button>
            </div>

            {data.physicalLocations?.map((loc, index) => (
              <Card key={loc.id} className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Location Name</Label>
                    <Input
                      value={loc.name}
                      onChange={(e) => {
                        const updated = [...data.physicalLocations];
                        updated[index].name = e.target.value;
                        updateData({ physicalLocations: updated });
                      }}
                      placeholder="e.g., Main Clinic"
                    />
                  </div>
                  <div>
                    <Label>Postcode</Label>
                    <Input
                      value={loc.postcode}
                      onChange={(e) => {
                        const updated = [...data.physicalLocations];
                        updated[index].postcode = e.target.value;
                        updateData({ physicalLocations: updated });
                      }}
                      placeholder="e.g., 2000"
                      maxLength={4}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Step 4: Patient Data
const Step4PatientData = () => {
  const { data, updateData } = useWizard();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Patient information</h2>
        <p className="text-muted-foreground">Help us understand your patient base</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="patientCount">Approximately how many patients do you have?</Label>
          <Input
            id="patientCount"
            type="number"
            value={data.patientCount || ''}
            onChange={(e) => updateData({ patientCount: parseInt(e.target.value) || 0 })}
            placeholder="e.g., 5000"
            className="mt-1"
          />
        </div>

        <div>
          <Label>What type of analysis would you like?</Label>
          <RadioGroup
            value={data.dataScope}
            onValueChange={(value) => updateData({ dataScope: value as any })}
            className="mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="full_clinic" id="full_clinic" />
              <Label htmlFor="full_clinic">Full clinic analysis</Label>
            </div>
            {data.practiceType !== 'solo' && (
              <>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="practitioner_specific" id="practitioner_specific" />
                  <Label htmlFor="practitioner_specific">Specific practitioners only</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="comparison" id="comparison" />
                  <Label htmlFor="comparison">Compare practitioners</Label>
                </div>
              </>
            )}
          </RadioGroup>
        </div>

        {data.dataScope === 'practitioner_specific' && data.practitioners.length > 0 && (
          <div>
            <Label>Select practitioners to analyze</Label>
            <div className="mt-2 space-y-2">
              {data.practitioners.map(prac => (
                <div key={prac.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`select-${prac.id}`}
                    checked={data.selectedPractitioners?.includes(prac.id)}
                    onCheckedChange={(checked) => {
                      const selected = data.selectedPractitioners || [];
                      const updated = checked
                        ? [...selected, prac.id]
                        : selected.filter(id => id !== prac.id);
                      updateData({ selectedPractitioners: updated });
                    }}
                  />
                  <Label htmlFor={`select-${prac.id}`}>
                    {prac.title} {prac.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Wizard Component
export const ClinicAnalysisWizardV2: React.FC<{
  onComplete: (data: WizardData) => void;
}> = ({ onComplete }) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [hasLoadedConfig, setHasLoadedConfig] = useState(false);

  // Initialize with default or saved config
  const [wizardData, setWizardData] = useState<WizardData>(() => {
    const saved = loadConfigFromStorage();
    if (saved && saved.practiceType) {
      setHasLoadedConfig(true);
      return saved;
    }
    return {
      clinicName: '',
      ownerName: '',
      ownerTitle: 'Dr',
      ownerSpecialties: [],
      practiceType: 'solo', // Default to solo to satisfy type
      practitioners: [],
      serviceModel: 'mixed',
      physicalLocations: [],
      patientCount: 0,
      dataScope: 'full_clinic',
      selectedPractitioners: [],
      filters: {
        enableHeatmap: false,
        disasterAnalysis: false,
        marketingAnalysis: false,
        fundingAnalysis: false,
        performanceMetrics: false,
        patientFlow: false
      }
    };
  });

  // Load saved config on mount
  useEffect(() => {
    const saved = loadConfigFromStorage();
    if (saved && !hasLoadedConfig) {
      setWizardData(saved);
      setHasLoadedConfig(true);
      toast({
        title: 'Configuration Loaded',
        description: 'Your previous clinic configuration has been restored',
      });
    }
  }, [hasLoadedConfig, toast]);

  // Dynamic step count: Skip analysis step if no data uploaded
  const totalSteps = 6; // Always 6 steps - users can explore without data

  const updateData = (updates: Partial<WizardData>) => {
    setWizardData(prev => {
      const updated = { ...prev, ...updates };
      // Auto-save on every update
      saveConfigToStorage(updated);
      return updated;
    });
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1:
        return !!(wizardData.clinicName && wizardData.ownerName && wizardData.ownerTitle);
      case 2:
        return !!(wizardData.practiceType && (
          wizardData.practiceType === 'solo' ||
          wizardData.practitioners.every(p => p.name)
        ));
      case 3:
        return !!(wizardData.serviceModel && (
          wizardData.serviceModel === 'telehealth_only' ||
          wizardData.physicalLocations.some(loc => loc.postcode)
        ));
      case 4:
        return !!(wizardData.patientCount > 0 && wizardData.dataScope);
      case 5:
        return true; // Data upload step
      case 6:
        // Allow exploration without data - users can select metrics to see what's available
        // Only check if metrics are selected (doesn't require uploaded data)
        if (!wizardData.filters?.selectedMetrics) {
          return false;
        }
        // Check if any category has selected metrics
        const metrics = wizardData.filters.selectedMetrics;
        return (
          (metrics.geographic && metrics.geographic.size > 0) ||
          (metrics.medicare && metrics.medicare.size > 0) ||
          (metrics.operations && metrics.operations.size > 0) ||
          (metrics.business && metrics.business.size > 0)
        );
      default:
        return false;
    }
  };

  const handleNext = () => {
    // Special case: if we're on step 5 and have uploaded data, we should go to step 6
    if (currentStep === 5 && wizardData.uploadedData) {
      setCurrentStep(6);
    } else if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save final configuration and complete
      saveConfigToStorage(wizardData);
      toast({
        title: 'Configuration Complete',
        description: 'Your clinic settings have been saved and can be amended in settings',
      });
      onComplete(wizardData);
    }
  };

  const handleCompleteSetup = () => {
    // Skip data upload but CONTINUE TO ANALYSIS OPTIONS
    const dataForCompletion = {
      ...wizardData,
      uploadedData: null // Set to null but allow continuation
    };

    updateData({ uploadedData: null });
    saveConfigToStorage(dataForCompletion);

    // Move to Step 6 (Analysis Options) instead of completing
    setCurrentStep(6);

    toast({
      title: '📊 Exploration Mode',
      description: 'You can explore analysis options without data. Upload data anytime to generate real reports.',
    });
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const stepTitles = [
    'Clinic Details',
    'Practice Structure',
    'Service Model',
    'Patient Data',
    'Upload Data',
    'Analysis Options'
  ];

  return (
    <WizardContext.Provider value={{
      data: wizardData,
      updateData,
      currentStep,
      setCurrentStep,
      canProceed
    }}>
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold">Clinic Analysis Setup</h1>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (clearStoredConfig()) {
                      setWizardData({
                        clinicName: '',
                        ownerName: '',
                        ownerTitle: 'Dr',
                        ownerSpecialties: [],
                        practiceType: 'solo',
                        practitioners: [],
                        serviceModel: 'mixed',
                        physicalLocations: [],
                        patientCount: 0,
                        dataScope: 'full_clinic',
                        selectedPractitioners: [],
                        filters: {
                          enableHeatmap: false,
                          disasterAnalysis: false,
                          marketingAnalysis: false,
                          fundingAnalysis: false,
                          performanceMetrics: false,
                          patientFlow: false
                        }
                      });
                      setCurrentStep(1);
                      toast({
                        title: 'Configuration Cleared',
                        description: 'Starting fresh with a new configuration',
                      });
                    }
                  }}
                  title="Clear saved configuration and start fresh"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Clear Config
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    saveConfigToStorage(wizardData);
                    toast({
                      title: 'Configuration Saved',
                      description: 'Your clinic settings will be remembered',
                    });
                  }}
                  title="Save current configuration"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <span className="text-sm text-muted-foreground">
                  Step {currentStep} of {totalSteps}
                </span>
              </div>
            </div>

            <Progress value={(currentStep / totalSteps) * 100} className="h-2" />

            <div className="flex justify-between mt-2">
              {stepTitles.map((title, index) => (
                <div
                  key={index}
                  className={`text-xs ${
                    index + 1 === currentStep
                      ? 'font-bold text-primary'
                      : index + 1 < currentStep
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  {title}
                </div>
              ))}
            </div>
          </div>

          {/* Main Content Card */}
          <Card className="p-8">
            {currentStep === 1 && <Step1ClinicDetails />}
            {currentStep === 2 && <Step2PracticeStructure />}
            {currentStep === 3 && <Step3ServiceModel />}
            {currentStep === 4 && <Step4PatientData />}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Upload Patient Postcodes</h2>
                  <p className="text-muted-foreground">Upload your patient data for analysis</p>
                </div>

                <ClinicAnalysisPostcodeDrop
                  onDataParsed={(postcodeData: PostcodeData) => {
                    // Store the raw postcode data
                    updateData({ uploadedData: postcodeData });
                    toast({
                      title: 'Data Loaded Successfully',
                      description: `${postcodeData.totalRecords} patients loaded for analysis`,
                    });
                  }}
                  maxRecords={50000}
                />

                <div className="text-center mt-4">
                  <p className="text-sm text-muted-foreground">
                    Don't have your data ready?
                  </p>
                  <Button
                    variant="link"
                    onClick={() => {
                      // Skip data upload - complete wizard immediately
                      handleCompleteSetup();
                    }}
                    className="text-primary"
                  >
                    Skip for Now
                  </Button>
                </div>
              </div>
            )}
            {currentStep === 6 && (
              <ClinicAnalysisFilter
                onFilterChange={(filters) => {
                  updateData({ filters });
                }}
                onAnalyze={() => {
                  // Ensure uploadedData is in PostcodeData format before completing
                  const dataToComplete = {
                    ...wizardData,
                    uploadedData: wizardData.uploadedData && !wizardData.uploadedData.postcodes ?
                      // Convert array to PostcodeData format if needed
                      {
                        postcodes: Array.isArray(wizardData.uploadedData) ?
                          wizardData.uploadedData.map((item: any) => ({
                            postcode: typeof item === 'string' ? item : (item.postcode || item),
                            patients: typeof item === 'object' ? (item.patients || item.patientCount || 1) : 1
                          })) :
                          [],
                        totalRecords: Array.isArray(wizardData.uploadedData) ? wizardData.uploadedData.length : 0,
                        uploadMethod: wizardData.uploadMethod || 'csv'
                      } :
                      wizardData.uploadedData
                  };
                  onComplete(dataToComplete);
                }}
                postcodeData={wizardData.uploadedData ?
                  (wizardData.uploadedData.postcodes ?
                    // Already in PostcodeData format
                    wizardData.uploadedData :
                    // Convert array to PostcodeData format
                    {
                      postcodes: Array.isArray(wizardData.uploadedData) ?
                        wizardData.uploadedData.map((item: any) => ({
                          postcode: typeof item === 'string' ? item : (item.postcode || item),
                          patients: typeof item === 'object' ? (item.patients || item.patientCount || 1) : 1
                        })) :
                        [],
                      totalRecords: Array.isArray(wizardData.uploadedData) ? wizardData.uploadedData.length : 0,
                      uploadMethod: wizardData.uploadMethod || 'csv'
                    }
                  ) : null}
                practiceConfig={wizardData}
              />
            )}
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {currentStep < totalSteps && (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </WizardContext.Provider>
  );
};