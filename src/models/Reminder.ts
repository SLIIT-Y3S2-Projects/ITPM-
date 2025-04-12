
export interface Reminder {
  _id?: string;
  taskId?: string;
  title: string;
  description?: string;
  type: 'time-based' | 'location-based' | 'recurring';
  date: Date;
  isCompleted: boolean;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  location?: {
    name: string;
    latitude: number;
    longitude: number;
  };
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
