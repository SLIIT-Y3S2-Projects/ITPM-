
import api from './api';
import { Reminder } from '@/models/Reminder';

export const reminderService = {
  getAllReminders: async () => {
    const response = await api.get('/reminders');
    return response.data;
  },
  
  getReminderById: async (id: string) => {
    const response = await api.get(`/reminders/${id}`);
    return response.data;
  },
  
  createReminder: async (reminderData: Omit<Reminder, '_id' | 'createdAt' | 'updatedAt'>) => {
    const response = await api.post('/reminders', reminderData);
    return response.data;
  },
  
  updateReminder: async (id: string, reminderData: Partial<Reminder>) => {
    const response = await api.put(`/reminders/${id}`, reminderData);
    return response.data;
  },
  
  deleteReminder: async (id: string) => {
    const response = await api.delete(`/reminders/${id}`);
    return response.data;
  },
  
  getReminderAnalytics: async () => {
    const response = await api.get('/reminders/analytics');
    return response.data;
  }
};
