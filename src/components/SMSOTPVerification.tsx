
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SMSOTPVerificationProps {
  doctorPhone: string;
  onVerified: () => void;
  onCancel: () => void;
}

const SMSOTPVerification = ({ doctorPhone, onVerified, onCancel }: SMSOTPVerificationProps) => {
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);
  const { toast } = useToast();

  // Mock OTP for demo - in real app this would be sent via SMS
  const mockOTP = '123456';

  useEffect(() => {
    // Send initial SMS
    toast({
      title: "SMS OTP Sent",
      description: `Verification code sent to ${doctorPhone}. For demo purposes, use: ${mockOTP}`,
    });

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [doctorPhone, toast]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a 6-digit verification code.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);

    // Mock verification
    setTimeout(() => {
      if (otp === mockOTP) {
        onVerified();
      } else {
        toast({
          title: "Invalid OTP",
          description: "The verification code is incorrect. Please try again.",
          variant: "destructive",
        });
      }
      setIsVerifying(false);
    }, 1000);
  };

  const handleResendOTP = () => {
    setCountdown(300);
    setCanResend(false);
    setOtp('');
    
    toast({
      title: "OTP Resent",
      description: `New verification code sent to ${doctorPhone}. For demo purposes, use: ${mockOTP}`,
    });
  };

  return (
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            SMS Verification
          </DialogTitle>
          <DialogDescription>
            Please enter the 6-digit verification code sent to {doctorPhone}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="otp">Verification Code</Label>
            <Input
              id="otp"
              type="text"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="text-center text-2xl tracking-widest"
              maxLength={6}
            />
          </div>
          
          <div className="text-center text-sm text-gray-600">
            {countdown > 0 ? (
              <p>Code expires in {formatTime(countdown)}</p>
            ) : (
              <p className="text-red-600">Code has expired</p>
            )}
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={handleVerifyOTP} 
              disabled={otp.length !== 6 || isVerifying || countdown === 0}
              className="flex-1"
            >
              {isVerifying ? 'Verifying...' : 'Verify & Submit'}
            </Button>
            
            <Button 
              onClick={handleResendOTP} 
              variant="outline"
              disabled={!canResend}
            >
              Resend
            </Button>
          </div>
          
          <Button onClick={onCancel} variant="ghost" className="w-full">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SMSOTPVerification;
