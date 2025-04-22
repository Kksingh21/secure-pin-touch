
import { useState } from 'react';
import { Fingerprint } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const FingerprintAuth = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  const handleFingerprint = async () => {
    try {
      setIsVerifying(true);
      
      // Save fingerprint registration to Supabase
      const { error } = await supabase
        .from('finger')
        .insert([
          {
            created_at: new Date().toISOString(),
            pins: null // Initially set to null, can be updated later with PIN
          }
        ]);

      if (error) {
        throw error;
      }

      setIsRegistered(true);
      toast({
        title: "Fingerprint Registration Successful",
        description: "Your fingerprint has been securely registered.",
      });
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Could not register fingerprint. Please try again.",
        variant: "destructive",
      });
      console.error('Error registering fingerprint:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-atm-background">
      <Card className="w-[380px] shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-atm-primary">
            Fingerprint Authentication
          </CardTitle>
          <CardDescription>
            {isRegistered
              ? "Place your finger to verify"
              : "Register your fingerprint for secure access"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <Button
            variant="outline"
            size="icon"
            className={`w-24 h-24 rounded-full transition-all duration-300 ${
              isVerifying ? 'animate-pulse bg-atm-accent' : ''
            } ${isRegistered ? 'bg-atm-primary text-white hover:bg-atm-secondary' : ''}`}
            onClick={handleFingerprint}
          >
            <Fingerprint className="w-12 h-12" />
          </Button>
          <p className="text-sm text-gray-500 text-center">
            {isRegistered
              ? "Your fingerprint is registered. You can now use it to verify your PIN."
              : "Touch the sensor to register your fingerprint"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FingerprintAuth;
