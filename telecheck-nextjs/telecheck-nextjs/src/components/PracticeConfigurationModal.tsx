import { useState } from "react";
import { X, Plus, Trash2, MapPin, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PracticeConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: PracticeConfiguration) => void;
  existingConfig?: PracticeConfiguration | null;
}

export interface PracticeConfiguration {
  practitioner_postcodes: string[];
  service_model: 'telehealth_only' | 'mixed';
}

export function PracticeConfigurationModal({
  isOpen,
  onClose,
  onSave,
  existingConfig,
}: PracticeConfigurationModalProps) {
  const { toast } = useToast();
  const [postcodes, setPostcodes] = useState<string[]>(
    existingConfig?.practitioner_postcodes || ['']
  );
  const [serviceModel, setServiceModel] = useState<'telehealth_only' | 'mixed'>(
    existingConfig?.service_model || 'mixed'
  );
  const [isSaving, setIsSaving] = useState(false);

  const addPostcode = () => {
    setPostcodes([...postcodes, '']);
  };

  const removePostcode = (index: number) => {
    setPostcodes(postcodes.filter((_, i) => i !== index));
  };

  const updatePostcode = (index: number, value: string) => {
    const updated = [...postcodes];
    updated[index] = value;
    setPostcodes(updated);
  };

  const validatePostcode = (postcode: string): boolean => {
    // Australian postcodes are 4 digits
    return /^\d{4}$/.test(postcode.trim());
  };

  const handleSave = async () => {
    // Filter out empty postcodes and validate
    const validPostcodes = postcodes
      .map(p => p.trim())
      .filter(p => p !== '');

    if (validPostcodes.length === 0) {
      toast({
        title: "Error",
        description: "Please enter at least one practitioner/clinic postcode",
        variant: "destructive",
      });
      return;
    }

    const invalidPostcodes = validPostcodes.filter(p => !validatePostcode(p));
    if (invalidPostcodes.length > 0) {
      toast({
        title: "Invalid Postcodes",
        description: `Please correct these postcodes: ${invalidPostcodes.join(', ')}. Australian postcodes must be 4 digits.`,
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      const config: PracticeConfiguration = {
        practitioner_postcodes: validPostcodes,
        service_model: serviceModel,
      };

      // Save to database
      const { error } = await supabase
        .from('practice_configurations')
        .upsert([{
          user_id: user.id,
          practitioner_postcodes: validPostcodes,
          service_model: serviceModel,
        }], {
          onConflict: 'user_id'
        });

      if (error) throw error;

      toast({
        title: "Configuration Saved",
        description: "Your practice configuration has been saved successfully",
      });

      onSave(config);
      onClose();
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast({
        title: "Error",
        description: "Failed to save configuration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Practice Configuration
          </DialogTitle>
          <DialogDescription>
            Tell us about your practice locations to enable geographic intelligence analysis
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Question 1: Practitioner/Clinic Postcodes */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              Where do you/your practitioners work from?
            </Label>
            <p className="text-sm text-muted-foreground">
              Enter the postcode(s) where practitioners are based
            </p>

            <div className="space-y-2">
              {postcodes.map((postcode, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="e.g., 4000"
                    value={postcode}
                    onChange={(e) => updatePostcode(index, e.target.value)}
                    maxLength={4}
                    pattern="\d{4}"
                    className="flex-1"
                  />
                  {postcodes.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removePostcode(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addPostcode}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add another location
            </Button>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Solo from home office: Enter your postcode</p>
              <p>• Multiple practitioners: Add each practitioner's postcode</p>
              <p>• Multi-branch clinic: Add all branch postcodes</p>
            </div>
          </div>

          {/* Question 2: Service Model */}
          <div className="space-y-3">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Stethoscope className="h-4 w-4" />
              Primary service model?
            </Label>

            <RadioGroup value={serviceModel} onValueChange={(value) => setServiceModel(value as 'telehealth_only' | 'mixed')}>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                <RadioGroupItem value="telehealth_only" id="telehealth" />
                <Label htmlFor="telehealth" className="flex-1 cursor-pointer">
                  <div>
                    <p className="font-medium">Telehealth only</p>
                    <p className="text-sm text-muted-foreground">
                      All consultations conducted remotely via video/phone
                    </p>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                <RadioGroupItem value="mixed" id="mixed" />
                <Label htmlFor="mixed" className="flex-1 cursor-pointer">
                  <div>
                    <p className="font-medium">Mixed (in-person + telehealth)</p>
                    <p className="text-sm text-muted-foreground">
                      Offer both face-to-face and remote consultations
                    </p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Configuration'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}