import { apiClient } from './api';
import { pdfService } from './pdfService';
import { emailService } from './emailService';
import { xeroService } from './xeroService';
import { Prescription, CreatePrescriptionRequest, ApiResponse, Doctor, Patient } from '../types/api';

class PrescriptionService {
  async createPrescription(
    request: CreatePrescriptionRequest,
    doctor: Doctor,
    patients: Patient[]
  ): Promise<Prescription[]> {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 1000));

    const prescriptions: Prescription[] = [];

    // Create prescription for each patient
    for (const patient of patients) {
      const prescriptionId = Math.random().toString(36).substr(2, 9).toUpperCase();
      const createdAt = new Date().toISOString();

      const prescription: Prescription = {
        id: prescriptionId,
        doctorId: doctor.id,
        patientId: patient.id,
        products: request.products.map(p => ({
          id: p.productId,
          name: 'Mock Product',
          description: 'Mock Description',
          unitPrice: p.unitPrice || 0,
          vatRate: 15,
          quantityOnHand: 100,
          quantity: p.quantity,
          repeatFrequency: p.repeatFrequency,
          dosageInstructions: p.dosageInstructions
        })),
        createdAt,
        status: 'verified' as const,
        totalAmount: 0
      };

      console.log(`Processing prescription ${prescriptionId} for patient ${patient.fullName}`);

      try {
        // 1. Generate PDF
        console.log('Generating PDF...');
        const pdfBlob = await pdfService.generatePrescriptionPDF({
          doctor,
          patient,
          products: prescription.products,
          prescriptionId,
          createdAt,
          signature: request.signature
        });

        // 2. Send email with PDF
        console.log('Sending email...');
        await emailService.sendPrescriptionEmail(
          `${doctor.title} ${doctor.name}`,
          patient.fullName,
          prescriptionId,
          pdfBlob
        );

        // 3. Create Xero order
        console.log('Creating Xero order...');
        const xeroOrder = await xeroService.createOrder({
          prescriptionId,
          patient,
          products: prescription.products,
          doctorId: doctor.id
        });

        prescription.xeroInvoiceId = xeroOrder.invoiceId;
        prescriptions.push(prescription);

        console.log(`✅ Completed prescription ${prescriptionId} for ${patient.fullName}`);
      } catch (error) {
        console.error(`❌ Failed to process prescription for ${patient.fullName}:`, error);
        // Still add the prescription but mark it as failed
        prescription.status = 'draft';
        prescriptions.push(prescription);
      }
    }

    // In production:
    // const response = await apiClient.post<ApiResponse<Prescription[]>>('/prescriptions', request);
    // return response.data;

    return prescriptions;
  }

  async getPrescription(id: string): Promise<Prescription> {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 300));

    // In production:
    // const response = await apiClient.get<ApiResponse<Prescription>>(`/prescriptions/${id}`);
    // return response.data;

    throw new Error('Mock implementation');
  }

  async getPrescriptions(filters?: any): Promise<Prescription[]> {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 300));

    // In production:
    // const queryString = new URLSearchParams(filters).toString();
    // const response = await apiClient.get<ApiResponse<Prescription[]>>(`/prescriptions?${queryString}`);
    // return response.data;

    return [];
  }
}

export const prescriptionService = new PrescriptionService();
