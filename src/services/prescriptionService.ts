
import { apiClient } from './api';
import { Prescription, CreatePrescriptionRequest, ApiResponse } from '../types/api';

class PrescriptionService {
  async createPrescription(request: CreatePrescriptionRequest): Promise<Prescription[]> {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockPrescriptions: Prescription[] = request.patientIds.map(patientId => ({
      id: Math.random().toString(36).substr(2, 9),
      doctorId: 'current-doctor-id',
      patientId,
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
      createdAt: new Date().toISOString(),
      status: 'verified' as const,
      totalAmount: 0
    }));

    // In production:
    // const response = await apiClient.post<ApiResponse<Prescription[]>>('/prescriptions', request);
    // return response.data;

    return mockPrescriptions;
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
