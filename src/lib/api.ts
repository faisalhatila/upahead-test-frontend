import { auth } from './firebase';

const API_BASE_URL = 'http://localhost:3000/api';

// Get Firebase ID token for authentication
const getAuthToken = async (): Promise<string> => {
  if (!auth?.currentUser) {
    throw new Error('User not authenticated');
  }
  return await auth.currentUser.getIdToken();
};

// Generic API request function
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = await getAuthToken();
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

// File upload service
export const uploadService = {
  async uploadFile(file: File): Promise<{
    success: boolean;
    message: string;
    totalRows?: number;
    validRows?: number;
    invalidRows?: number;
    assignments?: any[];
    errors?: Array<{
      row: number;
      field: string;
      message: string;
      value?: string;
    }>;
  }> {
    const token = await getAuthToken();
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/assignments/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Upload failed: ${response.statusText}`);
    }

    return response.json();
  },

  async getAssignments(limit: number = 100): Promise<any[]> {
    return apiRequest(`/assignments?limit=${limit}`);
  },

  async getAssignmentStats(): Promise<any> {
    return apiRequest('/assignments/stats');
  },

  async updateAssignment(id: string, updates: any): Promise<any> {
    return apiRequest(`/assignments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
  },

  async deleteAssignment(id: string): Promise<void> {
    return apiRequest(`/assignments/${id}`, {
      method: 'DELETE',
    });
  },
};

// Health check
export const healthCheck = async (): Promise<{ status: string; timestamp: string }> => {
  const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
  if (!response.ok) {
    throw new Error('Backend is not available');
  }
  return response.json();
};
