
// Central export for all services
export { authService } from './authService';
export { productService } from './productService';
export { patientService } from './patientService';
export { prescriptionService } from './prescriptionService';
export { otpService } from './otpService';
export { pdfService } from './pdfService';
export { emailService } from './emailService';
export { xeroService } from './xeroService';
export { apiClient } from './api';

// Re-export types for convenience
export type * from '../types/api';
