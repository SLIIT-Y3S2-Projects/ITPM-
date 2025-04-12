import React, { useState } from 'react';
import { Task } from '@/models/Task';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, MoreVertical, Pencil, Redo, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import TaskForm from './TaskForm';
import { useTaskContext } from '@/context/TaskContext';
import { toast } from 'sonner';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { updateTask, deleteTask } = useTaskContext();
  const [showEditTask, setShowEditTask] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const [rescheduleReason, setRescheduleReason] = useState('');
  
  const handleUpdateTask = (data: Partial<Task>) => {
    updateTask(task._id, data);
    setShowEditTask(false);
  };
  
  const handleDeleteTask = () => {
    deleteTask(task._id);
  };
  
  const handleCompleteTask = () => {
    updateTask(task._id, { status: 'completed' });
  };
  
  const handleReschedule = (date: Date) => {
    updateTask(task._id, { 
      dueDate: date,
      rescheduleHistory: [
        ...(task.rescheduleHistory || []),
        { 
          suggestedDate: date, 
          reason: rescheduleReason 
        }
      ]
    });
    setShowReschedule(false);
    setRescheduleReason('');
    toast.success('Task rescheduled successfully');
  };
  
  const priorityColors: { [key: string]: string } = {
    low: 'text-green-500',
    medium: 'text-yellow-500',
    high: 'text-red-500',
  };
  
  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="line-clamp-2">
            {task.title}
            {task.priority && (
              <Badge variant="outline" className={`ml-2 ${priorityColors[task.priority]}`}>
                {task.priority}
              </Badge>
            )}
          </CardTitle>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setShowEditTask(true)}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDeleteTask}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowReschedule(true)}>
                <Redo className="h-4 w-4 mr-2" />
                Reschedule
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="line-clamp-3 text-sm text-muted-foreground">
        {task.description}
      </CardContent>
      
      <CardFooter className="flex items-center justify-between flex-wrap gap-2">
        {task.dueDate && (
          <div className="text-xs text-muted-foreground flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {format(new Date(task.dueDate), 'MMM d, yyyy')}
          </div>
        )}
        
        {task.status !== 'completed' && (
          <Button variant="outline" size="sm" onClick={handleCompleteTask}>
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Complete
          </Button>
        )}
      </CardFooter>
      
      <Dialog open={showEditTask} onOpenChange={setShowEditTask}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <TaskForm isEditing initialData={task} onSubmit={handleUpdateTask} />
        </DialogContent>
      </Dialog>
      
      <Dialog open={showReschedule} onOpenChange={setShowReschedule}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Task</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <label htmlFor="reschedule-reason" className="block text-sm font-medium text-gray-700">
              Reason for rescheduling
            </label>
            <input
              type="text"
              id="reschedule-reason"
              className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Why are you rescheduling this task?"
              value={rescheduleReason}
              onChange={(e) => setRescheduleReason(e.target.value)}
            />
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn(
                  "w-full pl-3 text-left font-normal",
                  !task.dueDate && "text-muted-foreground"
                )}>
                  {task.dueDate ? (
                    format(new Date(task.dueDate), "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  // @ts-ignore
                  selected={task.dueDate ? new Date(task.dueDate) : undefined}
                  onSelect={(date) => date && handleReschedule(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button type="button" variant="secondary" onClick={() => setShowReschedule(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TaskCard;
