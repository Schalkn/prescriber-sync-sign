import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, FileText } from "lucide-react";
import ProductSelection from './ProductSelection';
import PatientManagement from './PatientManagement';
import SignatureCapture from './SignatureCapture';
import SMSOTPVerification from './SMSOTPVerification';
import { useToast } from "@/hooks/use-toast";
import { authService, prescriptionService, Doctor, Patient, PrescriptionProduct } from '../services';

interface PrescriptionManagerProps {
  doctor: Doctor;
  onLogout: () => void;
}

const PrescriptionManager = ({ doctor, onLogout }: PrescriptionManagerProps) => {
  const [selectedProducts, setSelectedProducts] = useState<PrescriptionProduct[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [signature, setSignature] = useState<string | null>(null);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmitPrescription = () => {
    if (selectedProducts.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one product for the prescription.",
        variant: "destructive",
      });
      return;
    }

    if (patients.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add at least one patient.",
        variant: "destructive",
      });
      return;
    }

    if (!signature) {
      toast({
        title: "Validation Error",
        description: "Please provide your electronic signature.",
        variant: "destructive",
      });
      return;
    }

    setShowOTPVerification(true);
  };

  const handleOTPVerified = async () => {
    setIsSubmitting(true);
    setShowOTPVerification(false);

    try {
      const prescriptionRequest = {
        patientIds: patients.map(p => p.id),
        products: selectedProducts.map(p => ({
          productId: p.id,
          quantity: p.quantity,
          repeatFrequency: p.repeatFrequency,
          dosageInstructions: p.dosageInstructions,
          unitPrice: p.unitPrice
        })),
        signature: signature!
      };

      toast({
        title: "Processing Prescriptions",
        description: `Creating ${patients.length} prescription(s), generating PDFs, sending emails, and creating Xero orders...`,
      });

      const prescriptions = await prescriptionService.createPrescription(
        prescriptionRequest,
        doctor,
        patients
      );
      
      const successCount = prescriptions.filter(p => p.status === 'verified').length;
      const failureCount = prescriptions.length - successCount;

      if (failureCount === 0) {
        toast({
          title: "All Prescriptions Created Successfully",
          description: `${successCount} prescription(s) generated, PDFs emailed to hannesfuel@gmail.com, and Xero orders created.`,
        });
      } else {
        toast({
          title: "Prescriptions Partially Completed",
          description: `${successCount} successful, ${failureCount} failed. Check console for details.`,
          variant: "destructive",
        });
      }

      // Reset form
      setSelectedProducts([]);
      setPatients([]);
      setSignature(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create prescriptions. Please try again.",
        variant: "destructive",
      });
      console.error('Prescription creation failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      onLogout();
    } catch (error) {
      console.error('Logout failed:', error);
      onLogout(); // Still logout on error
    }
  };

  const calculateTotal = () => {
    return selectedProducts.reduce((total, product) => {
      const subtotal = product.unitPrice * product.quantity;
      const vat = subtotal * (product.vatRate / 100);
      return total + subtotal + vat;
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Prescription Manager</h1>
                <p className="text-sm text-gray-600">Welcome, {doctor.name}</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Products Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Product Selection</CardTitle>
              </CardHeader>
              <CardContent>
                <ProductSelection
                  selectedProducts={selectedProducts}
                  onProductsChange={setSelectedProducts}
                />
              </CardContent>
            </Card>
          </div>

          {/* Summary Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Prescription Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Products:</span>
                    <span>{selectedProducts.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Patients:</span>
                    <span>{patients.length}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total per Patient:</span>
                      <span>R{calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <SignatureCapture onSignatureChange={setSignature} />
          </div>
        </div>

        {/* Patients Section */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
            </CardHeader>
            <CardContent>
              <PatientManagement patients={patients} onPatientsChange={setPatients} />
            </CardContent>
          </Card>
        </div>

        {/* Submit Section */}
        <div className="mt-8 flex justify-end">
          <Button
            onClick={handleSubmitPrescription}
            size="lg"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? 'Processing Prescriptions...' : 'Submit Prescription'}
          </Button>
        </div>
      </div>

      {/* SMS OTP Modal */}
      {showOTPVerification && (
        <SMSOTPVerification
          doctorPhone={doctor.phone}
          onVerified={handleOTPVerified}
          onCancel={() => setShowOTPVerification(false)}
        />
      )}
    </div>
  );
};

export default PrescriptionManager;
