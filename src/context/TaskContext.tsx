import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { Task, TaskAnalytics } from "@/models/Task";
import { taskService } from "@/services/taskService";
import { useUserContext } from "./UserContext";
import { toast } from "sonner";
import { suggestSmartReschedule } from "@/lib/smartReschedule";

interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  analytics: TaskAnalytics;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  statusFilter: string | null;
  priorityFilter: string | null;
  categoryFilter: string | null;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string | null) => void;
  setPriorityFilter: (priority: string | null) => void;
  setCategoryFilter: (category: string | null) => void;
  fetchTasks: () => Promise<void>;
  addTask: (
    task: Omit<Task, "_id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  fetchAnalytics: () => Promise<void>;
  rescheduleTask: (taskId: string) => {
    suggestedDueDate: Date;
    reason: string;
  };
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const defaultAnalytics: TaskAnalytics = {
  totalTasks: 0,
  completedTasks: 0,
  pendingTasks: 0,
  missedTasks: 0,
  completionRate: 0,
  tasksByCategory: {},
  tasksByPriority: {},
};

export const TaskProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [analytics, setAnalytics] = useState<TaskAnalytics>(defaultAnalytics);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const { user } = useUserContext();

  // Fetch tasks when user changes
  useEffect(() => {
    if (user) {
      fetchTasks();
      fetchAnalytics();
    }
  }, [user]);

  // Filter tasks when filters change
  useEffect(() => {
    if (tasks.length > 0) {
      let result = [...tasks];

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter(
          (task) =>
            task.title.toLowerCase().includes(query) ||
            (task.description &&
              task.description.toLowerCase().includes(query)) ||
            (task.category && task.category.toLowerCase().includes(query)) ||
            (task.tags &&
              task.tags.some((tag) => tag.toLowerCase().includes(query)))
        );
      }

      if (statusFilter) {
        result = result.filter((task) => task.status === statusFilter);
      }

      if (priorityFilter) {
        result = result.filter((task) => task.priority === priorityFilter);
      }

      if (categoryFilter) {
        result = result.filter((task) => task.category === categoryFilter);
      }


      
      setFilteredTasks(result);
    } else {
      setFilteredTasks([]);
    }
  }, [tasks, searchQuery, statusFilter, priorityFilter, categoryFilter]);

  const fetchTasks = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);
    try {
      const data = await taskService.getAllTasks();
      setTasks(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch tasks");
      toast.error(err.response?.data?.message || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    if (!user) return;

    try {
      const data = await taskService.getTaskAnalytics();
      setAnalytics(data);
    } catch (err: any) {
      console.error("Failed to fetch analytics:", err);
    }
  };

  const addTask = async (
    task: Omit<Task, "_id" | "createdAt" | "updatedAt">
  ) => {
    setLoading(true);
    setError(null);
    try {
      const newTask = await taskService.createTask(task);
      setTasks((prev) => [...prev, newTask]);
      fetchAnalytics();
      toast.success("Task created successfully");
      return newTask;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create task");
      toast.error(err.response?.data?.message || "Failed to create task");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id: string, taskUpdate: Partial<Task>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedTask = await taskService.updateTask(id, taskUpdate);
      setTasks((prev) =>
        prev.map((task) => (task._id === id ? updatedTask : task))
      );
      fetchAnalytics();
      toast.success("Task updated successfully");
      return updatedTask;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update task");
      toast.error(err.response?.data?.message || "Failed to update task");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((task) => task._id !== id));
      fetchAnalytics();
      toast.success("Task deleted successfully");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete task");
      toast.error(err.response?.data?.message || "Failed to delete task");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add the missing method
  const rescheduleTask = (taskId: string) => {
    return suggestSmartReschedule(taskId, tasks);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        filteredTasks,
        analytics,
        loading,
        error,
        searchQuery,
        statusFilter,
        priorityFilter,
        categoryFilter,
        setSearchQuery,
        setStatusFilter,
        setPriorityFilter,
        setCategoryFilter,
        fetchTasks,
        addTask,
        updateTask,
        deleteTask,
        fetchAnalytics,
        rescheduleTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};
