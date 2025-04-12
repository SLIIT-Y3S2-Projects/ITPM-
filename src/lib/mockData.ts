
import { Task } from '../models/Task';
import { Reminder } from '../models/Reminder';
import { User } from '../models/User';

// Mock user data
export const currentUser: User = {
  _id: 'user123',
  name: 'John Doe',
  email: 'john.doe@example.com',
  password: 'hashed_password_here',
  preferences: {
    theme: 'light',
    notificationSettings: {
      email: true,
      push: true,
      silent: false,
    },
    defaultTaskView: 'list',
    defaultTaskSort: 'dueDate',
  },
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-01'),
};

// Mock tasks data
export const tasks: Task[] = [
  {
    _id: 'task1',
    title: 'Complete project proposal',
    description: 'Finalize the project proposal document for client review',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    priority: 'high',
    status: 'in-progress',
    category: 'Work',
    userId: 'user123',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 3)),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 1)),
    tags: ['proposal', 'client', 'deadline'],
  },
  {
    _id: 'task2',
    title: 'Buy groceries',
    description: 'Get milk, eggs, bread, and vegetables',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    priority: 'medium',
    status: 'pending',
    category: 'Personal',
    userId: 'user123',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 1)),
    tags: ['shopping', 'home'],
  },
  {
    _id: 'task3',
    title: 'Schedule dentist appointment',
    description: 'Call Dr. Smith for a check-up',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
    priority: 'low',
    status: 'pending',
    category: 'Health',
    userId: 'user123',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 2)),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 2)),
    tags: ['health', 'appointment'],
  },
  {
    _id: 'task4',
    title: 'Prepare for presentation',
    description: 'Finalize slides and practice delivery',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    priority: 'high',
    status: 'in-progress',
    category: 'Work',
    userId: 'user123',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 4)),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 1)),
    tags: ['presentation', 'work'],
  },
  {
    _id: 'task5',
    title: 'Review team progress',
    description: 'Check in with team members on their tasks',
    dueDate: new Date(new Date().setHours(new Date().getHours() + 5)),
    priority: 'medium',
    status: 'pending',
    category: 'Work',
    userId: 'user123',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 1)),
    tags: ['team', 'management'],
  },
  {
    _id: 'task6',
    title: 'Pay utility bills',
    description: 'Pay electricity, water, and internet bills',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    priority: 'medium',
    status: 'pending',
    category: 'Personal',
    userId: 'user123',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 2)),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 2)),
    tags: ['bills', 'finance'],
  },
  {
    _id: 'task7',
    title: 'Book flight tickets',
    description: 'Book tickets for the business trip next month',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 10)),
    priority: 'low',
    status: 'pending',
    category: 'Travel',
    userId: 'user123',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 3)),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 3)),
    tags: ['travel', 'business'],
  },
  {
    _id: 'task8',
    title: 'Gym workout',
    description: 'Complete the new workout routine',
    dueDate: new Date(new Date().setHours(new Date().getHours() + 26)),
    priority: 'medium',
    status: 'pending',
    category: 'Health',
    userId: 'user123',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 1)),
    tags: ['fitness', 'health'],
  },
  {
    _id: 'task9',
    title: 'Team meeting',
    description: 'Weekly sync with the development team',
    dueDate: new Date(new Date().setHours(new Date().getHours() + 2)),
    priority: 'high',
    status: 'pending',
    category: 'Work',
    userId: 'user123',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 1)),
    tags: ['meeting', 'team'],
  },
  {
    _id: 'task10',
    title: 'Complete online course',
    description: 'Finish the React advanced modules',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 14)),
    priority: 'low',
    status: 'in-progress',
    category: 'Education',
    userId: 'user123',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 10)),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 2)),
    tags: ['learning', 'development'],
  },
];

// Mock reminders data
export const reminders: Reminder[] = [
  {
    _id: 'reminder1',
    taskId: 'task1',
    title: 'Project proposal reminder',
    description: 'Don\'t forget to complete the project proposal',
    type: 'time-based',
    date: new Date(new Date().setHours(new Date().getHours() + 24)),
    isCompleted: false,
    userId: 'user123',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 1)),
  },
  {
    _id: 'reminder2',
    taskId: 'task2',
    title: 'Grocery shopping',
    description: 'Remember to buy groceries on your way home',
    type: 'location-based',
    date: new Date(new Date().setHours(new Date().getHours() + 4)),
    isCompleted: false,
    location: {
      name: 'Grocery Store',
      latitude: 37.7749,
      longitude: -122.4194,
    },
    userId: 'user123',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 1)),
  },
  {
    _id: 'reminder3',
    title: 'Weekly team meeting',
    description: 'Weekly sync with the development team',
    type: 'recurring',
    date: new Date(new Date().setHours(new Date().getHours() + 2)),
    isCompleted: false,
    frequency: 'weekly',
    userId: 'user123',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 7)),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 7)),
  },
  {
    _id: 'reminder4',
    taskId: 'task8',
    title: 'Gym workout',
    description: 'Time for your daily workout',
    type: 'recurring',
    date: new Date(new Date().setHours(new Date().getHours() + 1)),
    isCompleted: false,
    frequency: 'daily',
    userId: 'user123',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 5)),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 5)),
  },
  {
    _id: 'reminder5',
    taskId: 'task4',
    title: 'Presentation practice',
    description: 'Practice your presentation delivery',
    type: 'time-based',
    date: new Date(new Date().setHours(new Date().getHours() + 36)),
    isCompleted: false,
    userId: 'user123',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 2)),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 2)),
  },
];

// Filter tasks by status
export const filterTasksByStatus = (status: Task['status']) => {
  return tasks.filter(task => task.status === status);
};

// Filter tasks by priority
export const filterTasksByPriority = (priority: Task['priority']) => {
  return tasks.filter(task => task.priority === priority);
};

// Filter tasks by category
export const filterTasksByCategory = (category: string) => {
  return tasks.filter(task => task.category === category);
};

// Get upcoming reminders
export const getUpcomingReminders = () => {
  const now = new Date();
  const twentyFourHoursLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  return reminders.filter(reminder => 
    reminder.date >= now && 
    reminder.date <= twentyFourHoursLater && 
    !reminder.isCompleted
  );
};

// Get overdue reminders
export const getOverdueReminders = () => {
  const now = new Date();
  return reminders.filter(reminder => 
    reminder.date < now && 
    !reminder.isCompleted
  );
};

// Get task analytics
export const getTaskAnalytics = () => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending' || task.status === 'in-progress').length;
  const missedTasks = tasks.filter(task => task.status === 'missed').length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Tasks by category
  const tasksByCategory: Record<string, number> = {};
  tasks.forEach(task => {
    if (task.category) {
      tasksByCategory[task.category] = (tasksByCategory[task.category] || 0) + 1;
    }
  });

  // Tasks by priority
  const tasksByPriority: Record<string, number> = {
    low: 0,
    medium: 0,
    high: 0,
  };
  tasks.forEach(task => {
    tasksByPriority[task.priority] = (tasksByPriority[task.priority] || 0) + 1;
  });

  return {
    totalTasks,
    completedTasks,
    pendingTasks,
    missedTasks,
    completionRate,
    tasksByCategory,
    tasksByPriority,
  };
};

// AI-based task rescheduling suggestion
export const suggestRescheduleForMissedTask = (taskId: string) => {
  const task = tasks.find(t => t._id === taskId);
  if (!task) return null;
  
  // Simple algorithm for demonstration purposes
  // In a real application, this would use AI to analyze user patterns and schedule
  const now = new Date();
  const suggestion = new Date(now.setDate(now.getDate() + 2));
  
  return {
    taskId,
    originalDueDate: task.dueDate,
    suggestedDueDate: suggestion,
    reason: "Based on your current workload and typical completion patterns, this seems like an optimal time to reschedule."
  };
};

// Search functionality
export const searchTasks = (query: string) => {
  query = query.toLowerCase();
  return tasks.filter(task => 
    task.title.toLowerCase().includes(query) || 
    (task.description && task.description.toLowerCase().includes(query)) ||
    (task.category && task.category.toLowerCase().includes(query)) ||
    (task.tags && task.tags.some(tag => tag.toLowerCase().includes(query)))
  );
};

export const searchReminders = (query: string) => {
  query = query.toLowerCase();
  return reminders.filter(reminder => 
    reminder.title.toLowerCase().includes(query) || 
    (reminder.description && reminder.description.toLowerCase().includes(query))
  );
};
