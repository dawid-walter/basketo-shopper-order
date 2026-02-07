import { useState, useCallback } from 'react';
import { authService } from '../services/auth';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const [userEmail, setUserEmail] = useState(authService.getUser());

  const login = useCallback(async (email: string, pin: string) => {
    const response = await authService.verifyPin(email, pin);

    if (response.success) {
      setIsAuthenticated(true);
      setUserEmail(email);
    }

    return response;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setIsAuthenticated(false);
    setUserEmail(null);
  }, []);

  return {
    isAuthenticated,
    userEmail,
    login,
    logout,
  };
};
