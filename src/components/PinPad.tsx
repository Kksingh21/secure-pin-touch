
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const PIN_LENGTH = 4;

const PinPad = () => {
  const [pin, setPin] = useState<string>('');
  const { toast } = useToast();

  const handleNumberClick = (number: number) => {
    if (pin.length < PIN_LENGTH) {
      setPin(prev => prev + number);
    }
    
    if (pin.length + 1 === PIN_LENGTH) {
      setTimeout(() => {
        verifyPin();
      }, 500);
    }
  };

  const verifyPin = () => {
    // In a real app, this would verify against a secure backend
    const success = pin === '1234'; // Demo PIN
    toast({
      title: success ? "Success" : "Error",
      description: success ? "PIN verified successfully" : "Incorrect PIN",
      variant: success ? "default" : "destructive",
    });
    setPin('');
  };

  const handleClear = () => setPin('');

  return (
    <Card className="w-[380px] shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-atm-primary">Enter PIN</CardTitle>
        <CardDescription>Enter your 4-digit PIN</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center mb-6">
          {Array.from({ length: PIN_LENGTH }).map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 mx-2 rounded-full ${
                pin.length > i ? 'bg-atm-primary' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <Button
              key={num}
              variant="outline"
              className="h-14 text-xl font-semibold hover:bg-atm-accent hover:text-white"
              onClick={() => handleNumberClick(num)}
            >
              {num}
            </Button>
          ))}
          <Button
            variant="outline"
            className="h-14 text-xl font-semibold hover:bg-destructive hover:text-white"
            onClick={handleClear}
          >
            C
          </Button>
          <Button
            variant="outline"
            className="h-14 text-xl font-semibold hover:bg-atm-accent hover:text-white"
            onClick={() => handleNumberClick(0)}
          >
            0
          </Button>
          <Button
            variant="outline"
            className="h-14 text-xl font-semibold hover:bg-atm-secondary hover:text-white"
            onClick={verifyPin}
          >
            ⏎
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PinPad;
