export interface Task {
  _id?: string;
  title: string;
  description?: string;
  dueDate?: Date;
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed" | "missed";
  category?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  createdByVoice?: boolean;
  rescheduled?: {
    count: number;
    lastRescheduledAt: Date;
    reason: string;
  };
}
export interface TaskAnalytics {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  missedTasks: number;
  completionRate: number;
  tasksByCategory: Record<string, number>;
  tasksByPriority: Record<string, number>;
  rescheduleRate?: number;
  avgTaskCompletionTime?: number;
}
