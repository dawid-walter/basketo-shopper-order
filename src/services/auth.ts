import api from './api';

interface LoginRequest {
  email: string;
}

interface VerifyPinRequest {
  email: string;
  pin: string;
}

interface VerifyPinResponse {
  success: boolean;
  accessToken: string;
}

export const authService = {
  // Request PIN to be sent to email
  requestPin: async (email: string): Promise<void> => {
    const payload: LoginRequest = { email };
    await api.post('/api/auth/login', payload);
  },

  // Verify PIN and get access token
  verifyPin: async (email: string, pin: string): Promise<VerifyPinResponse> => {
    const payload: VerifyPinRequest = { email, pin };
    const response = await api.post<VerifyPinResponse>('/api/auth/verify', payload);

    if (response.data.success && response.data.accessToken) {
      localStorage.setItem('userToken', response.data.accessToken);
      localStorage.setItem('userEmail', email);
    }

    return response.data;
  },

  // Logout - clear localStorage
  logout: (): void => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userEmail');
  },

  // Get stored token
  getToken: (): string | null => {
    return localStorage.getItem('userToken');
  },

  // Get stored user email
  getUser: (): string | null => {
    return localStorage.getItem('userEmail');
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('userToken');
  },
};
