
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/50 dark:to-emerald-950/70 p-4">
      <Card className="w-[420px] shadow-2xl border-emerald-200/50 dark:border-emerald-800/50 backdrop-blur-lg bg-white/80 dark:bg-emerald-950/60 transition-all duration-300 hover:shadow-emerald-300/50 dark:hover:shadow-emerald-800/50">
        <CardHeader className="text-center space-y-3 pb-2">
          <CardTitle className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-3 animate-fade-in">
            {isRegistered ? <Lock className="w-8 h-8" /> : <Fingerprint className="w-8 h-8" />}
            {isRegistered ? "Secure PIN" : "Biometric Access"}
          </CardTitle>
          <CardDescription className="text-emerald-700/80 dark:text-emerald-300/80 text-base">
            {showPinInput
              ? "Confirm your 4-digit PIN"
              : isRegistered
              ? "Verify your identity"
              : "Register for secure access"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isRegistered && !showPinInput && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="userName" className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                  <UserCircle2 className="w-5 h-5" />
                  Your Name
                </Label>
                <Input
                  id="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your full name"
                  className="border-emerald-300/50 focus:border-emerald-500 dark:border-emerald-700/50 dark:focus:border-emerald-600 
                             transition-colors duration-300 placeholder-emerald-500/50 dark:placeholder-emerald-400/50"
                  required
                />
              </div>
            </div>
          )}

          {showPinInput ? (
            <PinInput 
              onPinSubmit={handlePinSubmit} 
              isRegistration={!isRegistered} 
            />
          ) : (
            <div className="flex flex-col items-center space-y-6">
              <Button
                variant="outline"
                size="icon"
                className={`w-28 h-28 rounded-full transition-all duration-500 group 
                  ${isVerifying ? 'animate-pulse' : ''}
                  border-emerald-300 hover:border-emerald-500
                  bg-emerald-50 hover:bg-emerald-100 
                  dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50
                  dark:border-emerald-700 dark:hover:border-emerald-600
                `}
                onClick={() => handleFingerprint(isRegistered)}
                disabled={!isRegistered && !userName}
              >
                <Fingerprint className="w-14 h-14 text-emerald-600 group-hover:text-emerald-700 dark:text-emerald-400 dark:group-hover:text-emerald-300 transition-colors" />
              </Button>
              
              {!isRegistered && (
                <Button
                  variant="ghost"
                  onClick={handleVerification}
                  className="text-emerald-600 hover:text-emerald-800 
                             dark:text-emerald-400 dark:hover:text-emerald-300 
                             hover:bg-emerald-50 dark:hover:bg-emerald-900/30 
                             transition-colors"
                >
                  Already registered? Verify Fingerprint
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-emerald-950/80 backdrop-blur-lg border-emerald-200 dark:border-emerald-800">
          <DialogHeader>
            <DialogTitle className="text-emerald-700 dark:text-emerald-400">Fingerprint Verification</DialogTitle>
            <DialogDescription className="text-emerald-600 dark:text-emerald-300">
              Please verify your fingerprint to complete authentication
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-6">
            <Button
              variant="outline"
              size="icon"
              className="w-24 h-24 rounded-full 
                border-emerald-300 hover:border-emerald-500
                bg-emerald-50 hover:bg-emerald-100 
                dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50
                dark:border-emerald-700 dark:hover:border-emerald-600
                transition-all duration-300 hover:scale-105"
              onClick={() => handleFingerprint(true)}
            >
              <Fingerprint className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FingerprintAuth;
