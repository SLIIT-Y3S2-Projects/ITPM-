
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, UserPreferences } from '@/models/User';
import { userService } from '@/services/userService';
import { toast } from 'sonner';

interface UserReport {
  tasksCreated: number;
  tasksCompleted: number;
  remindersSet: number;
  accountAge: number;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
  updateProfile: (profileData: Partial<{ name: string, email: string }>) => Promise<void>;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  generateUserReport: () => UserReport;
  deleteAccount: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userData = await userService.getCurrentUser();
          setUser(userData);
        }
      } catch (err) {
        console.error('Failed to fetch user:', err);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.login(email, password);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      toast.success('Login successful');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      toast.error(err.response?.data?.message || 'Login failed');
      throw err; // Re-throw the error to be caught by the form
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: Partial<User>): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.register(userData);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      toast.success('Registration successful');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
      toast.error(err.response?.data?.message || 'Registration failed');
      throw err; // Re-throw the error to be caught by the form
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateUser = async (userData: Partial<User>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedUser = await userService.updateProfile(userData);
      setUser(updatedUser);
      toast.success('Profile updated successfully');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
      toast.error(err.response?.data?.message || 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Update the updateProfile method to accept partial data
  const updateProfile = async (profileData: Partial<{ name: string, email: string }>) => {
    return updateUser(profileData);
  };
  
  const updatePreferences = async (preferences: Partial<UserPreferences>) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const updatedPreferences = {
        ...user.preferences,
        ...preferences
      };
      
      const updatedUser = await userService.updateProfile({ preferences: updatedPreferences });
      setUser(updatedUser);
      toast.success('Preferences updated successfully');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update preferences');
      toast.error(err.response?.data?.message || 'Failed to update preferences');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const generateUserReport = (): UserReport => {
    if (!user) {
      return {
        tasksCreated: 0,
        tasksCompleted: 0,
        remindersSet: 0,
        accountAge: 0
      };
    }
    
    // Calculate account age in days
    const createdAt = new Date(user.createdAt);
    const today = new Date();
    const accountAge = Math.floor((today.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
    
    // For the demo version, we'll return some example stats
    // In a real app, this would fetch data from the backend
    return {
      tasksCreated: 24,
      tasksCompleted: 18,
      remindersSet: 12,
      accountAge
    };
  };
  
  const deleteAccount = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      await userService.deleteAccount();
      localStorage.removeItem('token');
      setUser(null);
      toast.success('Account deleted successfully');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete account');
      toast.error(err.response?.data?.message || 'Failed to delete account');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      loading, 
      error, 
      login, 
      register, 
      logout, 
      updateUser,
      updateProfile,
      updatePreferences,
      generateUserReport,
      deleteAccount
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
