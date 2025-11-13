import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Settings, Users, MapPin, ChevronRight } from 'lucide-react';

export interface Practitioner {
  id: string;
  title: 'Dr' | 'NP' | 'Midwife' | 'Nurse' | 'Other';
  name: string;
  postcodes: string[];
}

export interface ClinicLocation {
  id: string;
  name: string;
  postcode: string;
  practitionerIds: string[];
}

export interface PracticeConfiguration {
  analysisMode: 'whole_clinic' | 'individual' | 'comparison';
  practitioners: Practitioner[];
  clinicLocations: ClinicLocation[];
  serviceModel: 'telehealth_only' | 'mixed' | 'physical_only';
  clinicName: string;
  analysisName: string;
}

interface ClinicAnalysisWizardProps {
  onConfigurationComplete: (config: PracticeConfiguration) => void;
  initialConfig?: PracticeConfiguration;
}

export const ClinicAnalysisWizard: React.FC<ClinicAnalysisWizardProps> = ({
  onConfigurationComplete,
  initialConfig
}) => {
  const [step, setStep] = useState(1);
  const [practitionerCount, setPractitionerCount] = useState<'single' | 'small' | 'medium' | 'large'>('single');
  const [config, setConfig] = useState<PracticeConfiguration>(initialConfig || {
    analysisMode: 'whole_clinic',
    practitioners: [],
    clinicLocations: [],
    serviceModel: 'mixed',
    clinicName: '',
    analysisName: `Analysis ${new Date().toLocaleDateString('en-AU')}`
  });

  // Practitioner form state
  const [newPractitioner, setNewPractitioner] = useState<Partial<Practitioner>>({
    title: 'Dr',
    name: '',
    postcodes: []
  });
  const [postcodeInput, setPostcodeInput] = useState('');

  // Clinic location form state
  const [newLocation, setNewLocation] = useState<Partial<ClinicLocation>>({
    name: '',
    postcode: '',
    practitionerIds: []
  });

  const addPractitioner = () => {
    if (newPractitioner.name && newPractitioner.postcodes?.length) {
      const practitioner: Practitioner = {
        id: `prac-${Date.now()}`,
        title: newPractitioner.title || 'Dr',
        name: newPractitioner.name,
        postcodes: newPractitioner.postcodes
      };

      setConfig(prev => ({
        ...prev,
        practitioners: [...prev.practitioners, practitioner]
      }));

      // Reset form
      setNewPractitioner({ title: 'Dr', name: '', postcodes: [] });
      setPostcodeInput('');
    }
  };

  const removePractitioner = (id: string) => {
    setConfig(prev => ({
      ...prev,
      practitioners: prev.practitioners.filter(p => p.id !== id),
      // Also remove from clinic locations
      clinicLocations: prev.clinicLocations.map(loc => ({
        ...loc,
        practitionerIds: loc.practitionerIds.filter(pid => pid !== id)
      }))
    }));
  };

  const addPostcodeToPractitioner = () => {
    const postcodes = postcodeInput.split(',').map(p => p.trim()).filter(p => /^\d{4}$/.test(p));
    if (postcodes.length > 0) {
      setNewPractitioner(prev => ({
        ...prev,
        postcodes: [...(prev.postcodes || []), ...postcodes]
      }));
      setPostcodeInput('');
    }
  };

  const addClinicLocation = () => {
    if (newLocation.name && newLocation.postcode) {
      const location: ClinicLocation = {
        id: `loc-${Date.now()}`,
        name: newLocation.name,
        postcode: newLocation.postcode,
        practitionerIds: newLocation.practitionerIds || []
      };

      setConfig(prev => ({
        ...prev,
        clinicLocations: [...prev.clinicLocations, location]
      }));

      setNewLocation({ name: '', postcode: '', practitionerIds: [] });
    }
  };

  const removeClinicLocation = (id: string) => {
    setConfig(prev => ({
      ...prev,
      clinicLocations: prev.clinicLocations.filter(l => l.id !== id)
    }));
  };

  const handleComplete = () => {
    onConfigurationComplete(config);
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="clinicName">Clinic Name</Label>
        <Input
          id="clinicName"
          value={config.clinicName}
          onChange={(e) => setConfig(prev => ({ ...prev, clinicName: e.target.value }))}
          placeholder="Enter your clinic name"
        />
      </div>

      <div className="space-y-2">
        <Label>How many treating practitioners do you have?</Label>
        <RadioGroup
          value={practitionerCount}
          onValueChange={(value: 'single' | 'small' | 'medium' | 'large') => {
            setPractitionerCount(value);
            // Auto-adjust analysis mode based on practitioner count
            if (value === 'single') {
              setConfig(prev => ({ ...prev, analysisMode: 'whole_clinic' }));
            }
          }}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="single" id="single" />
            <Label htmlFor="single">Solo practitioner</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="small" id="small" />
            <Label htmlFor="small">2-5 practitioners</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="medium" id="medium" />
            <Label htmlFor="medium">6-20 practitioners</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="large" id="large" />
            <Label htmlFor="large">21+ practitioners</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label>How would you like to analyze your data?</Label>
        <RadioGroup
          value={config.analysisMode}
          onValueChange={(value) => setConfig(prev => ({ ...prev, analysisMode: value as PracticeConfiguration['analysisMode'] }))}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="whole_clinic" id="whole_clinic" />
            <Label htmlFor="whole_clinic">Whole clinic overview (aggregated data)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="individual" id="individual" />
            <Label htmlFor="individual">Per-practitioner breakdown</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="comparison" id="comparison" />
            <Label htmlFor="comparison">Compare practitioners (side-by-side)</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="analysisName">Save this analysis as</Label>
        <Input
          id="analysisName"
          value={config.analysisName}
          onChange={(e) => setConfig(prev => ({ ...prev, analysisName: e.target.value }))}
          placeholder="Q1 2025 Full Clinic Review"
        />
      </div>

      <Button
        onClick={() => {
          // Skip to Step 3 for solo practitioners
          if (practitionerCount === 'single') {
            // Auto-add the single practitioner
            const soloPractitioner: Practitioner = {
              id: 'solo-1',
              title: 'Dr',
              name: config.clinicName.replace(/clinic|centre|medical|practice/gi, '').trim() || 'Principal',
              postcodes: []
            };
            setConfig(prev => ({
              ...prev,
              practitioners: [soloPractitioner]
            }));
            setStep(3); // Skip to service model
          } else {
            setStep(2); // Go to add practitioners
          }
        }}
        className="w-full"
        disabled={!config.clinicName || !config.analysisMode}
      >
        {practitionerCount === 'single' ? 'Next: Service Model' : 'Next: Add Practitioners'}
        <ChevronRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );

  const renderStep2 = () => {
    // Show helpful guidance based on practitioner count
    const expectedCount = {
      single: 1,
      small: '2-5',
      medium: '6-20',
      large: '21+'
    }[practitionerCount];

    return (
    <div className="space-y-4">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
        <p className="text-sm text-blue-900 dark:text-blue-200">
          You selected <strong>{expectedCount} practitioners</strong>.
          {practitionerCount !== 'single' && ' Add each practitioner with their service postcodes.'}
        </p>
      </div>

      <div className="border rounded-lg p-4 space-y-3">
        <h4 className="font-medium">Add Practitioner</h4>

        <div className="grid grid-cols-2 gap-2">
          <Select
            value={newPractitioner.title}
            onValueChange={(value) => setNewPractitioner(prev => ({ ...prev, title: value as Practitioner['title'] }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Dr">Dr</SelectItem>
              <SelectItem value="NP">NP</SelectItem>
              <SelectItem value="Midwife">Midwife</SelectItem>
              <SelectItem value="Nurse">Nurse</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Name"
            value={newPractitioner.name || ''}
            onChange={(e) => setNewPractitioner(prev => ({ ...prev, name: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Postcodes (comma-separated)"
              value={postcodeInput}
              onChange={(e) => setPostcodeInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addPostcodeToPractitioner()}
            />
            <Button onClick={addPostcodeToPractitioner} size="sm">Add</Button>
          </div>

          {newPractitioner.postcodes?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {newPractitioner.postcodes.map((pc, idx) => (
                <Badge key={idx} variant="secondary">{pc}</Badge>
              ))}
            </div>
          )}
        </div>

        <Button
          onClick={addPractitioner}
          disabled={!newPractitioner.name || !newPractitioner.postcodes?.length}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Practitioner
        </Button>
      </div>

      {config.practitioners.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Practitioners ({config.practitioners.length})</h4>
          {config.practitioners.map(prac => (
            <div key={prac.id} className="flex items-center justify-between p-2 border rounded">
              <div>
                <span className="font-medium">{prac.title} {prac.name}</span>
                <div className="text-sm text-muted-foreground">
                  {prac.postcodes.length} location{prac.postcodes.length !== 1 ? 's' : ''}: {prac.postcodes.join(', ')}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removePractitioner(prac.id)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setStep(1)} className="w-full">
          Back
        </Button>
        <Button
          onClick={() => setStep(3)}
          className="w-full"
          disabled={config.practitioners.length === 0 && config.analysisMode !== 'whole_clinic'}
        >
          Next: Service Model
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
    );
  };

  const renderStep3 = () => (
    <div className="space-y-4">
      {practitionerCount === 'single' && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-4">
          <p className="text-sm text-blue-900 dark:text-blue-200">
            <strong>Solo practitioner</strong> configuration - specify your primary service location.
          </p>
        </div>
      )}

      <div className="space-y-2">
        <Label>How do you deliver care?</Label>
        <RadioGroup
          value={config.serviceModel}
          onValueChange={(value) => setConfig(prev => ({ ...prev, serviceModel: value as PracticeConfiguration['serviceModel'] }))}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="telehealth_only" id="telehealth_only" />
            <Label htmlFor="telehealth_only">Telehealth only</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mixed" id="mixed" />
            <Label htmlFor="mixed">Mixed (physical + telehealth)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="physical_only" id="physical_only" />
            <Label htmlFor="physical_only">Physical locations only</Label>
          </div>
        </RadioGroup>
      </div>

      {practitionerCount === 'single' && config.serviceModel !== 'telehealth_only' && (
        <div className="border rounded-lg p-4 space-y-3">
          <h4 className="font-medium">Primary Service Postcode</h4>
          <Input
            placeholder="Enter your practice postcode (e.g., 2000)"
            maxLength={4}
            onChange={(e) => {
              const postcode = e.target.value;
              if (postcode && /^\d{4}$/.test(postcode)) {
                setConfig(prev => ({
                  ...prev,
                  practitioners: prev.practitioners.map(p =>
                    p.id === 'solo-1' ? { ...p, postcodes: [postcode] } : p
                  )
                }));
              }
            }}
          />
        </div>
      )}

      {practitionerCount !== 'single' && config.serviceModel !== 'telehealth_only' && (
        <div className="border rounded-lg p-4 space-y-3">
          <h4 className="font-medium">Add Clinic Location (Optional)</h4>

          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Location name"
              value={newLocation.name || ''}
              onChange={(e) => setNewLocation(prev => ({ ...prev, name: e.target.value }))}
            />
            <Input
              placeholder="Postcode"
              value={newLocation.postcode || ''}
              onChange={(e) => setNewLocation(prev => ({ ...prev, postcode: e.target.value }))}
              maxLength={4}
            />
          </div>

          <Button
            onClick={addClinicLocation}
            disabled={!newLocation.name || !newLocation.postcode}
            size="sm"
            variant="outline"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Location
          </Button>
        </div>
      )}

      {config.clinicLocations.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Clinic Locations ({config.clinicLocations.length})</h4>
          {config.clinicLocations.map(loc => (
            <div key={loc.id} className="flex items-center justify-between p-2 border rounded">
              <div>
                <span className="font-medium">{loc.name}</span>
                <span className="text-sm text-muted-foreground ml-2">({loc.postcode})</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeClinicLocation(loc.id)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setStep(2)} className="w-full">
          Back
        </Button>
        <Button
          onClick={handleComplete}
          className="w-full bg-gradient-to-r from-primary to-primary/80"
        >
          Complete Configuration
        </Button>
      </div>
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Practice Configuration - Step {step} of 3
        </CardTitle>
      </CardHeader>
      <CardContent>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </CardContent>
    </Card>
  );
};