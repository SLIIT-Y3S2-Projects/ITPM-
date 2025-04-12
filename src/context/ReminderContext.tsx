import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Reminder } from '@/models/Reminder';
import { reminderService } from '@/services/reminderService';
import { toast } from 'sonner';

interface ReminderContextType {
  reminders: Reminder[];
  filteredReminders: Reminder[];
  upcomingReminders: Reminder[];
  overdueReminders: Reminder[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  typeFilter: string | null;
  setSearchQuery: (query: string) => void;
  setTypeFilter: (type: string | null) => void;
  addReminder: (reminder: Omit<Reminder, '_id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateReminder: (id: string, reminder: Partial<Reminder>) => Promise<void>;
  deleteReminder: (id: string) => Promise<void>;
  markAsCompleted: (id: string) => Promise<void>;
  snoozeReminder: (id: string, minutes: number) => Promise<void>;
}

const ReminderContext = createContext<ReminderContextType | undefined>(undefined);

export const ReminderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  // Fetch reminders on mount
  useEffect(() => {
    const fetchReminders = async () => {
      try {
        setLoading(true);
        const data = await reminderService.getReminders();
        
        // Convert string dates to Date objects
        const remindersWithDateObjects = data.map((reminder: Reminder) => ({
          ...reminder,
          date: new Date(reminder.date)
        }));
        
        setReminders(remindersWithDateObjects);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch reminders');
        toast.error('Failed to fetch reminders');
      } finally {
        setLoading(false);
      }
    };

    fetchReminders();
  }, []);

  // Filter reminders based on search query and type filter
  const filteredReminders = reminders.filter((reminder) => {
    const matchesSearch = 
      searchQuery === '' || 
      reminder.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (reminder.description && reminder.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = typeFilter === null || reminder.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  // Get upcoming reminders (due in the next 24 hours)
  const upcomingReminders = reminders.filter((reminder) => {
    if (reminder.isCompleted) return false;
    
    const now = new Date();
    const reminderDate = new Date(reminder.date);
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    return reminderDate > now && reminderDate <= in24Hours;
  });

  // Get overdue reminders
  const overdueReminders = reminders.filter((reminder) => {
    if (reminder.isCompleted) return false;
    
    const now = new Date();
    const reminderDate = new Date(reminder.date);
    
    return reminderDate < now;
  });

  const addReminder = async (reminder: Omit<Reminder, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      const newReminder = await reminderService.createReminder(reminder);
      
      // Convert date string to Date object
      newReminder.date = new Date(newReminder.date);
      
      setReminders([...reminders, newReminder]);
      toast.success('Reminder created successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to create reminder');
      toast.error('Failed to create reminder');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateReminder = async (id: string, reminderData: Partial<Reminder>) => {
    try {
      setLoading(true);
      const updatedReminder = await reminderService.updateReminder(id, reminderData);
      
      // Convert date string to Date object
      updatedReminder.date = new Date(updatedReminder.date);
      
      setReminders(reminders.map((reminder) => 
        reminder._id === id ? updatedReminder : reminder
      ));
      toast.success('Reminder updated successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to update reminder');
      toast.error('Failed to update reminder');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteReminder = async (id: string) => {
    try {
      setLoading(true);
      await reminderService.deleteReminder(id);
      setReminders(reminders.filter((reminder) => reminder._id !== id));
      toast.success('Reminder deleted successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to delete reminder');
      toast.error('Failed to delete reminder');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const markAsCompleted = async (id: string) => {
    try {
      setLoading(true);
      const updatedReminder = await reminderService.updateReminder(id, { isCompleted: true });
      
      // Convert date string to Date object
      updatedReminder.date = new Date(updatedReminder.date);
      
      setReminders(reminders.map((reminder) => 
        reminder._id === id ? updatedReminder : reminder
      ));
      toast.success('Reminder marked as completed');
    } catch (err: any) {
      setError(err.message || 'Failed to update reminder');
      toast.error('Failed to update reminder');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const snoozeReminder = async (id: string, minutes: number) => {
    try {
      const reminder = reminders.find((r) => r._id === id);
      if (!reminder) {
        throw new Error('Reminder not found');
      }
      
      const currentDate = new Date(reminder.date);
      const newDate = new Date(currentDate.getTime() + minutes * 60 * 1000);
      
      setLoading(true);
      const updatedReminder = await reminderService.updateReminder(id, { date: newDate });
      
      // Convert date string to Date object
      updatedReminder.date = new Date(updatedReminder.date);
      
      setReminders(reminders.map((reminder) => 
        reminder._id === id ? updatedReminder : reminder
      ));
      toast.success(`Reminder snoozed for ${minutes} minutes`);
    } catch (err: any) {
      setError(err.message || 'Failed to snooze reminder');
      toast.error('Failed to snooze reminder');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ReminderContext.Provider value={{
      reminders,
      filteredReminders,
      upcomingReminders,
      overdueReminders,
      loading,
      error,
      searchQuery,
      typeFilter,
      setSearchQuery,
      setTypeFilter,
      addReminder,
      updateReminder,
      deleteReminder,
      markAsCompleted,
      snoozeReminder,
    }}>
      {children}
    </ReminderContext.Provider>
  );
};

export const useReminderContext = () => {
  const context = useContext(ReminderContext);
  if (context === undefined) {
    throw new Error('useReminderContext must be used within a ReminderProvider');
  }
  return context;
};
