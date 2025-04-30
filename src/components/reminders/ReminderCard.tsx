// Import React and required libraries
import React from 'react';
import { Reminder } from '@/models/Reminder';
import { Bell, Calendar, CheckCircle2, Clock, Edit, MapPin, Repeat, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, isToday, isTomorrow } from 'date-fns';
import { useReminderContext } from '@/context/ReminderContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import ReminderForm from './ReminderForm';
import { cn } from '@/lib/utils';

// Props interface for ReminderCard
interface ReminderCardProps {
  reminder: Reminder;
}

// Map reminder type to corresponding icon
const typeIconMap = {
  'time-based': Clock,
  'location-based': MapPin,
  'recurring': Repeat,
};

// Format reminder date into a human-friendly string
const getDateDisplay = (date: Date) => {
  if (isToday(date)) {
    return `Today at ${format(date, 'h:mm a')}`;
  } else if (isTomorrow(date)) {
    return `Tomorrow at ${format(date, 'h:mm a')}`;
  } else {
    return format(date, 'MMM d, yyyy, h:mm a');
  }
};

// ReminderCard component
const ReminderCard: React.FC<ReminderCardProps> = ({ reminder }) => {
  // Context functions for reminder actions
  const { updateReminder, deleteReminder, markReminderComplete, snoozeReminder } = useReminderContext();

  // Local state to control dialogs
  const [showEdit, setShowEdit] = React.useState(false);
  const [showDelete, setShowDelete] = React.useState(false);

  // Handle deletion of reminder
  const handleDelete = () => {
    deleteReminder(reminder._id!);
    setShowDelete(false);
  };

  // Select appropriate icon based on reminder type
  const TypeIcon = typeIconMap[reminder.type];

  // Determine if the reminder is overdue
  const isOverdue = new Date(reminder.date) < new Date() && !reminder.isCompleted;

  return (
    <div className={cn(
      "glass-card p-5 transition-all duration-300",
      isOverdue && "border-red-300" // highlight overdue reminders
    )}>
      {/* Header: Icon + Title + Action Buttons */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-start">
          {/* Icon for reminder type */}
          <div className={cn(
            "rounded-full p-1.5 mr-3",
            isOverdue ? "bg-red-100" : "bg-blue-100"
          )}>
            <TypeIcon className={cn(
              "h-5 w-5",
              isOverdue ? "text-red-600" : "text-blue-600"
            )} />
          </div>

          {/* Title and type/frequency label */}
          <div>
            <h3 className="font-medium text-lg">{reminder.title}</h3>
            <span className="text-xs text-muted-foreground">
              {reminder.type === 'recurring' && reminder.frequency 
                ? `${reminder.frequency.charAt(0).toUpperCase() + reminder.frequency.slice(1)} reminder` 
                : reminder.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </span>
          </div>
        </div>

        {/* Edit and Delete buttons */}
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" onClick={() => setShowEdit(true)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setShowDelete(true)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Optional description */}
      {reminder.description && (
        <p className="text-sm text-muted-foreground mb-4 ml-9">{reminder.description}</p>
      )}

      {/* Date & time display */}
      <div className="flex items-center text-sm text-muted-foreground mb-4 ml-9">
        <Calendar className="h-4 w-4 mr-1" />
        <span>{getDateDisplay(new Date(reminder.date))}</span>
      </div>

      {/* Optional location info */}
      {reminder.location && (
        <div className="flex items-center text-sm text-muted-foreground mb-4 ml-9">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{reminder.location.name}</span>
        </div>
      )}

      {/* Action buttons for incomplete reminders */}
      {!reminder.isCompleted && (
        <div className="flex justify-end space-x-2">
          {/* Snooze option for overdue reminders */}
          {isOverdue && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => snoozeReminder(reminder._id!, 60)} // Snooze by 60 minutes
            >
              Snooze 1h
            </Button>
          )}
          {/* Mark as complete */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-green-600 hover:text-green-700 hover:bg-green-50"
            onClick={() => markReminderComplete(reminder._id!)}
          >
            <CheckCircle2 className="h-4 w-4 mr-1" />
            Mark Complete
          </Button>
        </div>
      )}

      {/* Edit Reminder Dialog */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Reminder</DialogTitle>
          </DialogHeader>
          <ReminderForm 
            isEditing 
            initialData={reminder} 
            onSubmit={(data) => {
              updateReminder(reminder._id!, data);
              setShowEdit(false);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Reminder</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Are you sure you want to delete this reminder? This action cannot be undone.
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowDelete(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReminderCard;
