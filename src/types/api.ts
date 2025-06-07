
// Core API response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Authentication types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  doctor: Doctor;
  token: string;
  refreshToken: string;
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  registrationNumber: string;
  phone: string;
  email: string;
  letterheadUrl?: string;
  signatureUrl?: string;
}

// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  unitPrice: number;
  vatRate: number;
  quantityOnHand: number;
  xeroItemId?: string;
}

export interface PrescriptionProduct extends Product {
  quantity: number;
  repeatFrequency: string;
  dosageInstructions: string;
}

// Patient types
export interface Patient {
  id: string;
  fullName: string;
  idNumber: string;
  dateOfBirth?: string;
  gender?: string;
  contactNumber: string;
  email?: string;
  xeroContactId?: string;
}

// Prescription types
export interface Prescription {
  id: string;
  doctorId: string;
  patientId: string;
  products: PrescriptionProduct[];
  createdAt: string;
  status: 'draft' | 'pending_verification' | 'verified' | 'sent';
  totalAmount: number;
  pdfUrl?: string;
  xeroInvoiceId?: string;
}

export interface CreatePrescriptionRequest {
  patientIds: string[];
  products: Array<{
    productId: string;
    quantity: number;
    repeatFrequency: string;
    dosageInstructions: string;
    unitPrice?: number;
  }>;
  signature: string; // Base64 encoded signature
}

// OTP types
export interface OTPRequest {
  phoneNumber: string;
  type: 'prescription_verification';
}

export interface OTPVerificationRequest {
  phoneNumber: string;
  code: string;
  sessionId: string;
}

// Search and filter types
export interface ProductSearchParams {
  query?: string;
  category?: string;
  inStock?: boolean;
  limit?: number;
  offset?: number;
}

export interface PatientSearchParams {
  query?: string;
  limit?: number;
  offset?: number;
}
