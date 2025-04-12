
import React, { useState } from 'react';
import { Task } from '@/models/Task';
import TaskCard from './TaskCard';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useTaskContext } from '@/context/TaskContext';
import { Search, Plus, SlidersHorizontal, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import TaskForm from './TaskForm';
import { useUserContext } from '@/context/UserContext';

const TaskList: React.FC = () => {
  const { 
    filteredTasks, 
    searchQuery, 
    setSearchQuery, 
    statusFilter, 
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    categoryFilter,
    setCategoryFilter,
    addTask
  } = useTaskContext();
  const { user } = useUserContext();
  const [showNewTask, setShowNewTask] = React.useState(false);
  const [showFilters, setShowFilters] = React.useState(false);
  
  // Get unique categories from tasks
  const categories = React.useMemo(() => {
    const uniqueCategories = new Set<string>();
    filteredTasks.forEach(task => {
      if (task.category) {
        uniqueCategories.add(task.category);
      }
    });
    return Array.from(uniqueCategories);
  }, [filteredTasks]);
  
  const handleAddTask = (task: Partial<Task>) => {
    if (user) {
      addTask({
        ...task as Omit<Task, '_id' | 'createdAt' | 'updatedAt'>,
        userId: user._id!,
      });
      setShowNewTask(false);
    }
  };
  
  const clearFilters = () => {
    setStatusFilter(null);
    setPriorityFilter(null);
    setCategoryFilter(null);
    setSearchQuery('');
  };
  
  const hasActiveFilters = statusFilter || priorityFilter || categoryFilter || searchQuery;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1 w-full sm:max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            className="flex-1 sm:flex-none"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {(statusFilter ? 1 : 0) + (priorityFilter ? 1 : 0) + (categoryFilter ? 1 : 0)}
              </span>
            )}
          </Button>
          
          <Dialog open={showNewTask} onOpenChange={setShowNewTask}>
            <DialogTrigger asChild>
              <Button className="flex-1 sm:flex-none">
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
              </DialogHeader>
              <TaskForm onSubmit={handleAddTask} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {showFilters && (
        <div className="bg-secondary/50 rounded-lg p-4 space-y-4 animate-fade-in">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Filters</h3>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Status</label>
              <Select value={statusFilter || ''} onValueChange={(value) => setStatusFilter(value || null)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="missed">Missed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Priority</label>
              <Select value={priorityFilter || ''} onValueChange={(value) => setPriorityFilter(value || null)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Priorities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Category</label>
              <Select value={categoryFilter || ''} onValueChange={(value) => setCategoryFilter(value || null)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
      
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No tasks found</h3>
          <p className="text-muted-foreground mb-6">
            {hasActiveFilters
              ? "Try changing or clearing your filters"
              : "Add your first task to get started"}
          </p>
          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
          {!hasActiveFilters && (
            <Button onClick={() => setShowNewTask(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
