import { auth, db } from './firebase';

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

// AI Usage Tracking
interface AIUsageInfo {
  attempts: number;
  remaining: number;
  isBlocked: boolean;
}

// Get AI usage from Firestore
const getAIUsageFromFirestore = async (userId: string): Promise<AIUsageInfo> => {
  if (!db) {
    console.warn('Firestore not initialized, using default values');
    return { attempts: 0, remaining: 3, isBlocked: false };
  }

  try {
    const { doc, getDoc } = await import('firebase/firestore');
    const rateLimitRef = doc(db, 'ai_rate_limits', userId);
    const rateLimitDoc = await getDoc(rateLimitRef);
    
    if (rateLimitDoc.exists()) {
      const data = rateLimitDoc.data();
      const attempts = data.attempts || 0;
      const isBlocked = data.isBlocked || false;
      const remaining = Math.max(0, 3 - attempts);
      
      return { attempts, remaining, isBlocked };
    }
    
    // If document doesn't exist, user hasn't used AI yet
    return { attempts: 0, remaining: 3, isBlocked: false };
  } catch (error) {
    console.error('Error fetching AI usage from Firestore:', error);
    return { attempts: 0, remaining: 3, isBlocked: false };
  }
};

// AI Task Creation Service
export const aiTaskService = {
  async createTasksFromPrompt(prompt: string): Promise<{
    success: boolean;
    message: string;
    tasks?: any[];
    error?: string;
    remainingAttempts?: number;
  }> {
    const token = await getAuthToken();
    
    // Get current user ID
    const userId = auth?.currentUser?.uid;
    
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    // Check current usage from Firestore
    const currentUsage = await getAIUsageFromFirestore(userId);
    if (currentUsage.isBlocked) {
      throw new Error('AI task creation limit reached. You have used all 3 attempts. Please try again tomorrow.');
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/assignments/ai-create`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 401) {
          throw new Error('Authentication failed. Please sign in again.');
        }
        
        if (response.status === 400) {
          // Handle validation errors
          if (result.data?.error === 'Invalid prompt') {
            throw new Error('Please provide a valid prompt. The prompt cannot be empty.');
          }
          
          if (result.data?.error === 'Prompt parsing failed') {
            const suggestion = result.data?.suggestion || 'Try being more specific about the task details';
            throw new Error(`Could not understand your request. ${suggestion}`);
          }
          
          throw new Error(result.message || 'Invalid request. Please check your input.');
        }
        
        if (response.status === 500) {
          if (result.message?.includes('AI service not configured')) {
            throw new Error('AI service is temporarily unavailable. Please try again later.');
          }
          throw new Error('Server error occurred. Please try again later.');
        }
        
        // Handle rate limiting
        if (response.status === 429 || result.message?.includes('limit')) {
          throw new Error('AI task creation limit reached. You have used all 3 attempts. Please try again tomorrow.');
        }
        
        throw new Error(result.message || 'AI task creation failed');
      }
      
      // Get updated usage from Firestore after successful API call
      const updatedUsage = await getAIUsageFromFirestore(userId);
      result.remainingAttempts = updatedUsage.remaining;
      
      return result;
    } catch (error) {
      console.error('Error creating tasks with AI:', error);
      throw error;
    }
  },

  // Get current usage info from Firestore
  async getUsageInfo(): Promise<AIUsageInfo> {
    const userId = auth?.currentUser?.uid;
    
    if (!userId) {
      return { attempts: 0, remaining: 3, isBlocked: false };
    }
    
    return await getAIUsageFromFirestore(userId);
  }
};

// Health check
export const healthCheck = async (): Promise<{ status: string; timestamp: string }> => {
  const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
  if (!response.ok) {
    throw new Error('Backend is not available');
  }
  return response.json();
};
