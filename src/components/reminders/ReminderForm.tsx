import React from 'react';
import { Reminder } from '@/models/Reminder';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// UI components
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

interface ReminderFormProps {
  isEditing?: boolean; // Indicates if the form is used for editing an existing reminder
  initialData?: Reminder; // Initial data for pre-filling form when editing
  onSubmit: (data: Partial<Reminder>) => void; // Function to call on form submission
}

// Define validation schema using Zod
const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  type: z.enum(['time-based', 'location-based', 'recurring']),
  date: z.date(),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']).optional(),
  locationName: z.string().optional(),
});

const ReminderForm: React.FC<ReminderFormProps> = ({ isEditing = false, initialData, onSubmit }) => {
  // Initialize form with default values or initial data
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      type: initialData?.type || 'time-based',
      date: initialData?.date ? new Date(initialData.date) : new Date(),
      frequency: initialData?.frequency,
      locationName: initialData?.location?.name || '',
    },
  });

  const reminderType = form.watch('type'); // Watch for changes in reminder type to conditionally render fields

  // Handle form submission
  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const formattedValues: Partial<Reminder> = {
      title: values.title,
      description: values.description,
      type: values.type,
      date: values.date,
    };

    // Include frequency if reminder is recurring
    if (values.type === 'recurring' && values.frequency) {
      formattedValues.frequency = values.frequency;
    }

    // Include location data if reminder is location-based
    if (values.type === 'location-based' && values.locationName) {
      formattedValues.location = {
        name: values.locationName,
        // Static location coordinates for demo purposes
        latitude: 37.7749,
        longitude: -122.4194,
      };
    }

    onSubmit(formattedValues); // Call the parent onSubmit handler
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Title Field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Reminder title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Reminder description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Reminder Type Selection */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reminder Type</FormLabel>
              <Select defaultValue={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="time-based">Time-based</SelectItem>
                  <SelectItem value="location-based">Location-based</SelectItem>
                  <SelectItem value="recurring">Recurring</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date Picker and Conditional Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Date Field */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date & Time</FormLabel>
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
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
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

          {/* Frequency Field - shown only for recurring reminders */}
          {reminderType === 'recurring' && (
            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequency</FormLabel>
                  <Select defaultValue={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Location Name Field - shown only for location-based reminders */}
          {reminderType === 'location-based' && (
            <FormField
              control={form.control}
              name="locationName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Office, Grocery Store" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="submit" className="w-24">
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ReminderForm;

//export Form
