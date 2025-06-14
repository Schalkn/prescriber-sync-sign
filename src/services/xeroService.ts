
import { apiClient } from './api';
import { Patient, PrescriptionProduct } from '../types/api';

export interface XeroOrderRequest {
  prescriptionId: string;
  patient: Patient;
  products: PrescriptionProduct[];
  doctorId: string;
}

export interface XeroOrderResponse {
  orderId: string;
  invoiceId: string;
  status: 'created' | 'pending' | 'paid';
}

class XeroService {
  async createOrder(request: XeroOrderRequest): Promise<XeroOrderResponse> {
    // Mock implementation - in production this would call your backend API
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockResponse: XeroOrderResponse = {
      orderId: `XO-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      invoiceId: `INV-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      status: 'created'
    };

    console.log('Xero order created:', mockResponse);

    // In production, this would:
    // 1. Create a contact in Xero if it doesn't exist
    // 2. Create line items for each product
    // 3. Generate an invoice
    // 4. Return the order and invoice IDs
    //
    // const response = await apiClient.post<XeroOrderResponse>('/xero/orders', {
    //   contact: {
    //     name: request.patient.fullName,
    //     emailAddress: request.patient.email,
    //     phoneNumber: request.patient.contactNumber
    //   },
    //   lineItems: request.products.map(product => ({
    //     itemCode: product.id,
    //     description: `${product.name} - ${product.description}`,
    //     quantity: product.quantity,
    //     unitAmount: product.unitPrice,
    //     taxType: 'OUTPUT',
    //     accountCode: '200' // Sales account
    //   })),
    //   reference: request.prescriptionId,
    //   dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    // });

    return mockResponse;
  }

  async getOrderStatus(orderId: string): Promise<XeroOrderResponse> {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 500));

    // In production:
    // const response = await apiClient.get<XeroOrderResponse>(`/xero/orders/${orderId}`);
    // return response;

    return {
      orderId,
      invoiceId: `INV-${orderId.replace('XO-', '')}`,
      status: 'created'
    };
  }

  async syncContacts(): Promise<void> {
    // Mock implementation for syncing contacts from Xero
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In production:
    // await apiClient.post('/xero/sync-contacts');
  }
}

export const xeroService = new XeroService();
