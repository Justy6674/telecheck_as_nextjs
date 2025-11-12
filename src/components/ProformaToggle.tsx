import React from 'react';
import { Button } from '@/components/ui/button';

export type ProformaType = 'long' | 'brief' | 'custom';

interface ProformaToggleProps {
  activeType: ProformaType;
  onTypeChange: (type: ProformaType) => void;
  showCustom?: boolean;
}

export const ProformaToggle: React.FC<ProformaToggleProps> = ({
  activeType,
  onTypeChange,
  showCustom = false
}) => {
  return (
    <div className="flex justify-center space-x-2">
      <Button
        onClick={() => onTypeChange('long')}
        variant={activeType === 'long' ? 'default' : 'outline'}
        size="sm"
      >
        Long
      </Button>
      <Button
        onClick={() => onTypeChange('brief')}
        variant={activeType === 'brief' ? 'default' : 'outline'}
        size="sm"
      >
        Brief
      </Button>
      {showCustom && (
        <Button
          onClick={() => onTypeChange('custom')}
          variant={activeType === 'custom' ? 'default' : 'outline'}
          size="sm"
        >
          Custom
        </Button>
      )}
    </div>
  );
};