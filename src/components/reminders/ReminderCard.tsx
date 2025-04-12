
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

interface ReminderCardProps {
  reminder: Reminder;
}

const typeIconMap = {
  'time-based': Clock,
  'location-based': MapPin,
  'recurring': Repeat,
};

const getDateDisplay = (date: Date) => {
  if (isToday(date)) {
    return `Today at ${format(date, 'h:mm a')}`;
  } else if (isTomorrow(date)) {
    return `Tomorrow at ${format(date, 'h:mm a')}`;
  } else {
    return format(date, 'MMM d, yyyy, h:mm a');
  }
};

const ReminderCard: React.FC<ReminderCardProps> = ({ reminder }) => {
  const { updateReminder, deleteReminder, markReminderComplete, snoozeReminder } = useReminderContext();
  const [showEdit, setShowEdit] = React.useState(false);
  const [showDelete, setShowDelete] = React.useState(false);
  
  const handleDelete = () => {
    deleteReminder(reminder._id!);
    setShowDelete(false);
  };
  
  const TypeIcon = typeIconMap[reminder.type];
  const isOverdue = new Date(reminder.date) < new Date() && !reminder.isCompleted;
  
  return (
    <div className={cn(
      "glass-card p-5 transition-all duration-300",
      isOverdue && "border-red-300"
    )}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-start">
          <div className={cn(
            "rounded-full p-1.5 mr-3",
            isOverdue ? "bg-red-100" : "bg-blue-100"
          )}>
            <TypeIcon className={cn(
              "h-5 w-5",
              isOverdue ? "text-red-600" : "text-blue-600"
            )} />
          </div>
          <div>
            <h3 className="font-medium text-lg">{reminder.title}</h3>
            <span className="text-xs text-muted-foreground">
              {reminder.type === 'recurring' && reminder.frequency 
                ? `${reminder.frequency.charAt(0).toUpperCase() + reminder.frequency.slice(1)} reminder` 
                : reminder.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </span>
          </div>
        </div>
        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" onClick={() => setShowEdit(true)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setShowDelete(true)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {reminder.description && (
        <p className="text-sm text-muted-foreground mb-4 ml-9">{reminder.description}</p>
      )}
      
      <div className="flex items-center text-sm text-muted-foreground mb-4 ml-9">
        <Calendar className="h-4 w-4 mr-1" />
        <span>{getDateDisplay(new Date(reminder.date))}</span>
      </div>
      
      {reminder.location && (
        <div className="flex items-center text-sm text-muted-foreground mb-4 ml-9">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{reminder.location.name}</span>
        </div>
      )}
      
      {!reminder.isCompleted && (
        <div className="flex justify-end space-x-2">
          {isOverdue && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => snoozeReminder(reminder._id!, 60)}
            >
              Snooze 1h
            </Button>
          )}
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
