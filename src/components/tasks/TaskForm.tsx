
import React, { useState } from 'react';
import { Task } from '@/models/Task';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import VoiceInput from './VoiceInput';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TaskFormProps {
  isEditing?: boolean;
  initialData?: Task;
  onSubmit: (data: Partial<Task>) => void;
}

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  dueDate: z.date().optional(),
  priority: z.enum(['low', 'medium', 'high']),
  status: z.enum(['pending', 'in-progress', 'completed', 'missed']),
  category: z.string().optional(),
  tags: z.string().optional(),
});

const TaskForm: React.FC<TaskFormProps> = ({ isEditing = false, initialData, onSubmit }) => {
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      dueDate: initialData?.dueDate ? new Date(initialData.dueDate) : undefined,
      priority: initialData?.priority || 'medium',
      status: initialData?.status || 'pending',
      category: initialData?.category || '',
      tags: initialData?.tags ? initialData.tags.join(', ') : '',
    },
  });
  
  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const formattedValues = {
      ...values,
      tags: values.tags ? values.tags.split(',').map(tag => tag.trim()) : undefined,
    };
    
    onSubmit(formattedValues);
  };
  
  // Process voice input to extract task details
  const processVoiceInput = (transcript: string) => {
    // Default values
    let title = transcript;
    let description = '';
    let dueDate: Date | undefined = undefined;
    let priority = 'medium';
    let category = '';
    
    // Extract due date if mentioned (basic pattern matching)
    const dueDatePatterns = [
      { regex: /by\s(tomorrow)/i, handler: () => { const date = new Date(); date.setDate(date.getDate() + 1); return date; } },
      { regex: /by\s(today)/i, handler: () => new Date() },
      { regex: /by\s(next\s\w+)/i, handler: (match: string) => { 
        const date = new Date();
        const day = match.toLowerCase().replace('next ', '');
        const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const targetDay = daysOfWeek.indexOf(day);
        const currentDay = date.getDay();
        const daysUntilTarget = (targetDay + 7 - currentDay) % 7 || 7;
        date.setDate(date.getDate() + daysUntilTarget);
        return date;
      }},
      { regex: /by\s(\d{1,2}\/\d{1,2}\/\d{2,4})/i, handler: (match: string) => new Date(match) },
      { regex: /by\s(\w+\s\d{1,2}(?:st|nd|rd|th)?)/i, handler: (match: string) => new Date(match) },
    ];
    
    for (const pattern of dueDatePatterns) {
      const match = transcript.match(pattern.regex);
      if (match) {
        try {
          dueDate = pattern.handler(match[1]);
          title = title.replace(match[0], '').trim();
          break;
        } catch (e) {
          console.error('Error parsing date from voice input:', e);
        }
      }
    }
    
    // Extract priority if mentioned
    if (transcript.match(/high priority|urgent|important/i)) {
      priority = 'high';
      title = title.replace(/high priority|urgent|important/i, '').trim();
    } else if (transcript.match(/low priority|not urgent|not important/i)) {
      priority = 'low';
      title = title.replace(/low priority|not urgent|not important/i, '').trim();
    }
    
    // Extract category if mentioned
    const categoryMatch = transcript.match(/category\s([a-zA-Z]+)/i);
    if (categoryMatch) {
      category = categoryMatch[1];
      title = title.replace(categoryMatch[0], '').trim();
    }
    
    // Extract description if there's a "description" or "notes" keyword
    const descMatch = transcript.match(/description\s(.*?)(?=\s(?:by|category|priority|$))/i) || 
                      transcript.match(/notes\s(.*?)(?=\s(?:by|category|priority|$))/i);
    if (descMatch) {
      description = descMatch[1];
      title = title.replace(descMatch[0], '').trim();
    }
    
    // Update form values
    form.setValue('title', title);
    if (description) form.setValue('description', description);
    if (dueDate) form.setValue('dueDate', dueDate);
    form.setValue('priority', priority as 'low' | 'medium' | 'high');
    if (category) form.setValue('category', category);
  };
  
  return (
    <Tabs defaultValue="text" onValueChange={(value) => setInputMode(value as 'text' | 'voice')}>
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="text">Text Input</TabsTrigger>
        <TabsTrigger value="voice">Voice Input</TabsTrigger>
      </TabsList>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <TabsContent value="voice" className="space-y-4">
            <div className="bg-secondary/30 p-4 rounded-lg">
              <VoiceInput onTranscript={processVoiceInput} />
            </div>
            <div className="text-sm text-muted-foreground">
              <p className="font-medium">Voice Command Examples:</p>
              <ul className="list-disc pl-5 space-y-1 mt-1">
                <li>Submit the project proposal by Friday</li>
                <li>Call John about the meeting description Discuss upcoming team event by tomorrow</li>
                <li>Buy groceries category shopping priority high by next Saturday</li>
              </ul>
            </div>
          </TabsContent>
          
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Task title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Task description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select defaultValue={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select defaultValue={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="missed">Missed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Work, Personal, Health" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. important, meeting, deadline (comma separated)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="submit" className="w-24">
              {isEditing ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Form>
    </Tabs>
  );
};

export default TaskForm;
