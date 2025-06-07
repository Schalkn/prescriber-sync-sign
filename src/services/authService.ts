
import { apiClient } from './api';
import { LoginRequest, AuthResponse, ApiResponse } from '../types/api';

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    // Mock implementation - replace with real API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockResponse: AuthResponse = {
      doctor: {
        id: '1',
        name: 'Dr. Sarah Johnson',
        title: 'General Practitioner',
        registrationNumber: 'MP123456',
        phone: '+27123456789',
        email: 'dr.johnson@clinic.com'
      },
      token: 'mock-jwt-token',
      refreshToken: 'mock-refresh-token'
    };

    // In production, this would be:
    // return apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials)
    //   .then(response => response.data);

    apiClient.setToken(mockResponse.token);
    return mockResponse;
  }

  async logout(): Promise<void> {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In production:
    // await apiClient.post('/auth/logout');
    
    apiClient.clearToken();
  }

  async refreshToken(refreshToken: string): Promise<string> {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In production:
    // const response = await apiClient.post<ApiResponse<{ token: string }>>('/auth/refresh', { refreshToken });
    // return response.data.token;
    
    return 'new-mock-jwt-token';
  }
}

export const authService = new AuthService();
