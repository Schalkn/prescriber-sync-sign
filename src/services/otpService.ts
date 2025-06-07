
import { apiClient } from './api';
import { OTPRequest, OTPVerificationRequest, ApiResponse } from '../types/api';

class OTPService {
  async sendOTP(request: OTPRequest): Promise<{ sessionId: string }> {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In production:
    // const response = await apiClient.post<ApiResponse<{ sessionId: string }>>('/otp/send', request);
    // return response.data;

    return { sessionId: 'mock-session-id' };
  }

  async verifyOTP(request: OTPVerificationRequest): Promise<boolean> {
    // Mock implementation - accepts '123456' as valid OTP
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In production:
    // const response = await apiClient.post<ApiResponse<{ valid: boolean }>>('/otp/verify', request);
    // return response.data.valid;

    return request.code === '123456';
  }

  async resendOTP(sessionId: string): Promise<void> {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 500));

    // In production:
    // await apiClient.post('/otp/resend', { sessionId });
  }
}

export const otpService = new OTPService();
