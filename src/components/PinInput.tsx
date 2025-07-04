
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock } from 'lucide-react';

interface PinInputProps {
  onPinSubmit: (pin: string) => void;
  isRegistration?: boolean;
}

const PinInput = ({ onPinSubmit, isRegistration = false }: PinInputProps) => {
  const [pin, setPin] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length >= 4) {
      onPinSubmit(pin);
      setPin('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <div className="space-y-2">
        <Label htmlFor="pin" className="flex items-center gap-2">
          <Lock className="w-4 h-4" />
          {isRegistration ? 'Create your PIN' : 'Enter your PIN'}
        </Label>
        <Input
          id="pin"
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="Enter 4-digit PIN"
          minLength={4}
          maxLength={4}
          pattern="[0-9]*"
          inputMode="numeric"
          className="text-center text-2xl tracking-widest border-atm-accent/20 focus:border-atm-primary"
          required
        />
      </div>
      <Button 
        type="submit" 
        className="w-full bg-atm-primary hover:bg-atm-secondary transition-colors"
        disabled={pin.length !== 4}
      >
        {isRegistration ? 'Set PIN' : 'Verify PIN'}
      </Button>
    </form>
  );
};

export default PinInput;
