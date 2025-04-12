
import React, { useState } from 'react';
import { Reminder } from '@/models/Reminder';
import ReminderCard from './ReminderCard';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useReminderContext } from '@/context/ReminderContext';
import { Search, Plus, SlidersHorizontal, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ReminderForm from './ReminderForm';
import { useUserContext } from '@/context/UserContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ReminderList: React.FC = () => {
  const { 
    filteredReminders,
    upcomingReminders,
    overdueReminders,
    searchQuery, 
    setSearchQuery, 
    typeFilter, 
    setTypeFilter,
    addReminder
  } = useReminderContext();
  const { user } = useUserContext();
  const [showNewReminder, setShowNewReminder] = React.useState(false);
  const [showFilters, setShowFilters] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('all');
  
  const handleAddReminder = (reminder: Partial<Reminder>) => {
    if (user) {
      addReminder({
        ...reminder as Omit<Reminder, '_id' | 'createdAt' | 'updatedAt' | 'isCompleted'>,
        userId: user._id!,
        isCompleted: false,
      });
      setShowNewReminder(false);
    }
  };
  
  const clearFilters = () => {
    setTypeFilter(null);
    setSearchQuery('');
  };
  
  const hasActiveFilters = typeFilter || searchQuery;
  
  // Filter reminders based on active tab
  const displayedReminders = React.useMemo(() => {
    if (activeTab === 'upcoming') return upcomingReminders;
    if (activeTab === 'overdue') return overdueReminders;
    return filteredReminders;
  }, [activeTab, filteredReminders, upcomingReminders, overdueReminders]);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1 w-full sm:max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reminders..."
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
                {(typeFilter ? 1 : 0) + (searchQuery ? 1 : 0)}
              </span>
            )}
          </Button>
          
          <Dialog open={showNewReminder} onOpenChange={setShowNewReminder}>
            <DialogTrigger asChild>
              <Button className="flex-1 sm:flex-none">
                <Plus className="h-4 w-4 mr-2" />
                New Reminder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Reminder</DialogTitle>
              </DialogHeader>
              <ReminderForm onSubmit={handleAddReminder} />
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
          
          <div>
            <label className="text-sm font-medium mb-1 block">Type</label>
            <Select value={typeFilter || ''} onValueChange={(value) => setTypeFilter(value || null)}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="time-based">Time-based</SelectItem>
                <SelectItem value="location-based">Location-based</SelectItem>
                <SelectItem value="recurring">Recurring</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="upcoming" className="relative">
            Upcoming
            {upcomingReminders.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {upcomingReminders.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="overdue" className="relative">
            Overdue
            {overdueReminders.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {overdueReminders.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          {displayedReminders.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No reminders found</h3>
              <p className="text-muted-foreground mb-6">
                {hasActiveFilters
                  ? "Try changing or clearing your filters"
                  : "Add your first reminder to get started"}
              </p>
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
              {!hasActiveFilters && (
                <Button onClick={() => setShowNewReminder(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Reminder
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedReminders.map((reminder) => (
                <ReminderCard key={reminder._id} reminder={reminder} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="upcoming" className="mt-6">
          {upcomingReminders.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No upcoming reminders</h3>
              <p className="text-muted-foreground mb-6">
                You don't have any reminders scheduled for the next 24 hours
              </p>
              <Button onClick={() => setShowNewReminder(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Reminder
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingReminders.map((reminder) => (
                <ReminderCard key={reminder._id} reminder={reminder} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="overdue" className="mt-6">
          {overdueReminders.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No overdue reminders</h3>
              <p className="text-muted-foreground">
                Great job! You're caught up with all your reminders
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {overdueReminders.map((reminder) => (
                <ReminderCard key={reminder._id} reminder={reminder} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReminderList;
