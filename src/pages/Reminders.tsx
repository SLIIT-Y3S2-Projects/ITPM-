
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useReminderContext } from '@/context/ReminderContext';
import ReminderList from '@/components/reminders/ReminderList';
import { Button } from '@/components/ui/button';
import { Download, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import ReminderForm from '@/components/reminders/ReminderForm';
import { useUserContext } from '@/context/UserContext';
import { generateRemindersReport } from '@/utils/reportGenerator';
import { format } from 'date-fns';
import { toast } from 'sonner';

const Reminders: React.FC = () => {
  const [showNewReminder, setShowNewReminder] = useState(false);
  const { 
    reminders, 
    filteredReminders, 
    addReminder, 
    searchQuery, 
    typeFilter 
  } = useReminderContext();
  const { user } = useUserContext();

  const handleAddReminder = (reminder: any) => {
    if (user) {
      addReminder({
        ...reminder,
        userId: user._id!,
        isCompleted: false,
      });
      setShowNewReminder(false);
    }
  };
  
  // Generate and download reminders report
  const handleGenerateReport = () => {
    if (!user) return;
    
    const doc = generateRemindersReport(
      reminders,
      filteredReminders,
      user.name || 'User',
      {
        type: typeFilter,
        searchQuery
      }
    );
    
    // Save the PDF
    const fileName = `intellitask-reminders-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
    doc.save(fileName);
    
    toast.success(`Reminders report downloaded as ${fileName}`);
  };

  return (
    <Layout>
      <div className="page-container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reminders</h1>
            <p className="text-muted-foreground">
              Set reminders to help you stay on track with your tasks.
            </p>
          </div>
          
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button 
              variant="outline"
              onClick={handleGenerateReport}
            >
              <Download className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
            
            <Dialog open={showNewReminder} onOpenChange={setShowNewReminder}>
              <DialogTrigger asChild>
                <Button>
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
        
        <ReminderList />
      </div>
    </Layout>
  );
};

export default Reminders;
