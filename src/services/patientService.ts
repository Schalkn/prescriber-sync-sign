
import { apiClient } from './api';
import { Patient, PatientSearchParams, ApiResponse, PaginatedResponse } from '../types/api';

class PatientService {
  async searchPatients(params: PatientSearchParams = {}): Promise<Patient[]> {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 300));

    // In production:
    // const queryString = new URLSearchParams(params as any).toString();
    // const response = await apiClient.get<ApiResponse<PaginatedResponse<Patient>>>(`/patients?${queryString}`);
    // return response.data.data;

    return []; // Return empty array for mock
  }

  async createPatient(patient: Omit<Patient, 'id'>): Promise<Patient> {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 500));

    const newPatient: Patient = {
      ...patient,
      id: Math.random().toString(36).substr(2, 9)
    };

    // In production:
    // const response = await apiClient.post<ApiResponse<Patient>>('/patients', patient);
    // return response.data;

    return newPatient;
  }

  async updatePatient(id: string, updates: Partial<Patient>): Promise<Patient> {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 500));

    // In production:
    // const response = await apiClient.put<ApiResponse<Patient>>(`/patients/${id}`, updates);
    // return response.data;

    throw new Error('Mock implementation');
  }

  async deletePatient(id: string): Promise<void> {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 300));

    // In production:
    // await apiClient.delete(`/patients/${id}`);
  }

  async getPatient(id: string): Promise<Patient> {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 200));

    // In production:
    // const response = await apiClient.get<ApiResponse<Patient>>(`/patients/${id}`);
    // return response.data;

    throw new Error('Mock implementation');
  }
}

export const patientService = new PatientService();
