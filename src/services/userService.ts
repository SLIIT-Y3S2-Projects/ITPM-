
import api from './api';
import { User } from '@/models/User';

export const userService = {
  register: async (userData: Partial<User>) => {
    const response = await api.post('/users', userData);
    return response.data;
  },
  
  login: async (email: string, password: string) => {
    const response = await api.post('/users/login', { email, password });
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },
  
  updateProfile: async (userData: Partial<User>) => {
    const response = await api.put('/users/me', userData);
    return response.data;
  },
  
  deleteAccount: async () => {
    const response = await api.delete('/users/me');
    return response.data;
  }
};
