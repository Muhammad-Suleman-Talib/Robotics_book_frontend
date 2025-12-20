import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import ChatWidget from '../components/ChatWidget';
import apiClient from '../services/apiClient';
import { useHistory } from '@docusaurus/router'; // Add this import

interface UserProfile {
  id: string;
  name?: string;
  email: string; // Made email mandatory
  provider: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  login: (provider?: string) => void; // Updated login to accept optional provider
  logout: () => void;
  isLoading: boolean;
  loginEmailPassword: (email: string, password: string) => Promise<void>; // New
  registerEmailPassword: (email: string, password: string) => Promise<void>; // New
  refreshSession: () => Promise<void>; // New
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const history = useHistory(); // Add this line
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshSession = useCallback(async () => {
    try {
      const data = await apiClient.get('/auth/session');
      if (data.is_authenticated) {
        setIsAuthenticated(true);
        setUser(data.user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking session:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const login = (provider?: string) => {
    // const p = provider || 'google';
    // window.location.href = `http://localhost:8000/api/auth/${p}`;
    history.push('/under-development');
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const loginEmailPassword = async (email: string, password: string) => {
    // setIsLoading(true);
    // try {
    //   const response = await fetch(`${apiClient.backendUrl}/api/auth/login`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ email, password }),
    //   });

    //   if (!response.ok) {
    //     const errorData = await response.json();
    //     throw new Error(errorData.detail || 'Login failed.');
    //   }
    //   await refreshSession(); // Refresh session to get user data
    // } finally {
    //   setIsLoading(false);
    // }
    history.push('/under-development');
  };

  const registerEmailPassword = async (email: string, password: string) => {
    // setIsLoading(true);
    // try {
    //   const response = await fetch(`${apiClient.backendUrl}/api/register`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ email, password }),
    //   });

    //   if (!response.ok) {
    //     const errorData = await response.json();
    //     throw new Error(errorData.detail || 'Registration failed.');
    //   }
    //   // No automatic login after registration, user needs to verify email
    //   // We might want to show a message to the user here
    //   await refreshSession();
    // } finally {
    //   setIsLoading(false);
    // }
    history.push('/under-development');
  };


  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading, loginEmailPassword, registerEmailPassword, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// --- Docusaurus Root Component ---
type RootType = React.FC<{ children: ReactNode }>;

const Root: RootType = ({ children }) => {
  return (
    <AuthProvider>
      <>
        {children}
        <ChatWidget />
      </>
    </AuthProvider>
  );
};

export default Root;
