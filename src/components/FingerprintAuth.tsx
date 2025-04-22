
import { useState } from 'react';
import { Fingerprint, Lock, UserCircle2, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import PinInput from './PinInput';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const FingerprintAuth = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showPinInput, setShowPinInput] = useState(false);
  const [userName, setUserName] = useState('');
  const [fingerprintId, setFingerprintId] = useState<string | null>(null);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const { toast } = useToast();

  const handleFingerprint = async (isVerification = false) => {
    try {
      setIsVerifying(true);
      
      if (isVerification) {
        // Verify fingerprint
        const { data, error } = await supabase
          .from('finger')
          .select('*')
          .eq('fingerprint_id', fingerprintId)
          .single();

        if (error || !data) {
          throw new Error('Fingerprint not found');
        }

        setShowPinInput(true);
        setShowVerificationDialog(false);
      } else {
        // Register new fingerprint
        const newFingerprintId = crypto.randomUUID();
        const { error } = await supabase
          .from('finger')
          .insert([
            {
              fingerprint_id: newFingerprintId,
              user_name: userName,
              created_at: new Date().toISOString(),
            }
          ]);

        if (error) throw error;

        setFingerprintId(newFingerprintId);
        setIsRegistered(true);
        setShowPinInput(true);
        
        toast({
          title: "Fingerprint Registered",
          description: "Now set your PIN for added security.",
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: isVerification ? "Verification Failed" : "Registration Failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handlePinSubmit = async (pin: string) => {
    try {
      if (!fingerprintId) throw new Error('No fingerprint ID');

      if (!isRegistered) {
        // If verifying, show fingerprint verification dialog
        setShowVerificationDialog(true);
        return;
      }

      const { error } = await supabase
        .from('finger')
        .update({ 
          pins: pin,
          is_verified: true 
        })
        .eq('fingerprint_id', fingerprintId);

      if (error) throw error;

      toast({
        title: "PIN Set Successfully",
        description: "Your fingerprint and PIN have been registered",
      });

      // Reset the form
      setShowPinInput(false);
      setUserName('');
      setFingerprintId(null);
      setIsRegistered(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process PIN. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleVerification = () => {
    setFingerprintId(prompt('Enter Fingerprint ID to verify:') || null);
    if (fingerprintId) {
      handleFingerprint(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-atm-background to-atm-accent/10">
      <Card className="w-[380px] shadow-lg backdrop-blur-sm bg-white/90 border-atm-accent/20">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold text-atm-primary flex items-center justify-center gap-2">
            {isRegistered ? <Lock className="w-6 h-6" /> : <Fingerprint className="w-6 h-6" />}
            {isRegistered ? "Set Your PIN" : "Fingerprint Authentication"}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {showPinInput
              ? "Enter your PIN for verification"
              : isRegistered
              ? "Place your finger to verify"
              : "Register your fingerprint for secure access"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          {!isRegistered && !showPinInput && (
            <div className="w-full space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userName" className="flex items-center gap-2">
                  <UserCircle2 className="w-4 h-4" />
                  Your Name
                </Label>
                <Input
                  id="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name"
                  className="border-atm-accent/20 focus:border-atm-primary"
                  required
                />
              </div>
            </div>
          )}

          {showPinInput ? (
            <PinInput 
              onPinSubmit={handlePinSubmit} 
              isRegistration={isRegistered} 
            />
          ) : (
            <>
              <Button
                variant="outline"
                size="icon"
                className={`w-24 h-24 rounded-full transition-all duration-300 hover:scale-105
                  ${isVerifying ? 'animate-pulse bg-atm-accent' : ''}
                  ${isRegistered ? 'bg-atm-primary text-white hover:bg-atm-secondary' : 'border-2 border-atm-accent/20'}
                `}
                onClick={() => handleFingerprint(isRegistered)}
                disabled={!isRegistered && !userName}
              >
                <Fingerprint className="w-12 h-12" />
              </Button>
              
              {!isRegistered && (
                <Button
                  variant="ghost"
                  onClick={handleVerification}
                  className="mt-4 text-atm-primary hover:text-atm-secondary hover:bg-atm-accent/10"
                >
                  Already registered? Verify your fingerprint
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Fingerprint Verification Required</DialogTitle>
            <DialogDescription>
              Please verify your fingerprint to complete the authentication process.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-6">
            <Button
              variant="outline"
              size="icon"
              className="w-20 h-20 rounded-full transition-all duration-300 hover:scale-105"
              onClick={() => handleFingerprint(true)}
            >
              <Fingerprint className="w-10 h-10 text-atm-primary" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FingerprintAuth;
