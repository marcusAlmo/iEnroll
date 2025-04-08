import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  firstName?: string;
  login: (username: string, password: string) => Promise<string | undefined>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Pa-change na lang ulit to false
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  
  // First name of the student
  // Kindly modify default value during backend integration
  const [firstName, setFirstName] = useState<string>("Juan");

  // // Check if auth token is present in local storage to determine if user is authenticated
  // useEffect(() => {
  //   setIsAuthenticated(!!localStorage.getItem('authToken'));
  // }, []);

  const login = async (username: string, password: string): Promise<string | undefined> => {
    try {
      const response = await fetch('http://localhost:3000/api/user/login/attempt_login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Login failed: ' + response.statusText);
      }

      const data = await response.json();
      
      // Assuming success message or account type is returned on success
      if (data?.authToken) {
        localStorage.setItem('authToken', data.authToken); // Store token for persistent login
        setIsAuthenticated(true);
        return data.account_type || 'User';  // Return account type on successful login
      }

      return data?.message || 'An error occurred';
    } catch (error) {
      console.error('Error during login:', error);
      return 'An error occurred during login';
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, firstName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
