import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import TaskCompletionChart from '@/components/analytics/TaskCompletionChart';
import ReminderCompletionChart from '@/components/analytics/ReminderCompletionChart';
import UserActivityChart from '@/components/analytics/UserActivityChart';
import CustomReportConfig, { CustomReport } from '@/components/analytics/CustomReportConfig';
import { useTaskContext } from '@/context/TaskContext';
import { useReminderContext } from '@/context/ReminderContext';
import { Button } from '@/components/ui/button';
import { Download, FileText, BarChart3, Plus, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserContext } from '@/context/UserContext';
import { generateAnalyticsReport } from '@/utils/reportGenerator';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

const STORAGE_KEY = 'intellitask-custom-reports';

const Analytics: React.FC = () => {
  const { analytics } = useTaskContext();
  const { generateReminderReport } = useReminderContext();
  const { user } = useUserContext();
  const [reportType, setReportType] = useState('weekly');
  const [customReports, setCustomReports] = useState<CustomReport[]>([]);
  const [showCustomReportConfig, setShowCustomReportConfig] = useState(false);
  const [selectedCustomReport, setSelectedCustomReport] = useState<CustomReport | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<CustomReport | null>(null);
  
  // Load saved custom reports from localStorage
  useEffect(() => {
    const savedReports = localStorage.getItem(STORAGE_KEY);
    if (savedReports) {
      try {
        const parsed = JSON.parse(savedReports);
        // Convert string dates back to Date objects
        const reportsWithDates = parsed.map((report: any) => ({
          ...report,
          createdAt: new Date(report.createdAt)
        }));
        setCustomReports(reportsWithDates);
      } catch (error) {
        console.error('Failed to parse saved reports', error);
      }
    }
  }, []);
  
  // Save custom reports to localStorage when updatedk
  useEffect(() => {
    if (customReports.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customReports));
    }
  }, [customReports]);
  
  // Handle saving a new custom reportl
  const handleSaveCustomReport = (report: CustomReport) => {
    setCustomReports(prev => [...prev, report]);
    setShowCustomReportConfig(false);
    setSelectedCustomReport(report);
    setReportType('custom');
  };
  
  // Handle selecting a custom report
  const handleSelectCustomReport = (reportId: string) => {
    if (reportId === 'new') {
      setShowCustomReportConfig(true);
      setSelectedCustomReport(null);
      return;
    }
    
    const report = customReports.find(r => r.id === reportId);
    if (report) {
      setSelectedCustomReport(report);
      setReportType('custom');
    }
  };
  
  // Handle delete report confirmation
  const confirmDeleteReport = (report: CustomReport) => {
    setReportToDelete(report);
    setDeleteDialogOpen(true);
  };
  
  // Delete a custom report
  const handleDeleteReport = () => {
    if (reportToDelete) {
      setCustomReports(prev => prev.filter(r => r.id !== reportToDelete.id));
      
      // If the deleted report was selected, reset selection
      if (selectedCustomReport && selectedCustomReport.id === reportToDelete.id) {
        setSelectedCustomReport(null);
        setReportType('weekly');
      }
      
      toast.success(`Report "${reportToDelete.name}" deleted`);
      setDeleteDialogOpen(false);
      setReportToDelete(null);
    }
  };
  
  // Generate and download analytics report
  const handleGenerateReport = () => {
    if (!user) return;
    
    const reportName = reportType === 'custom' && selectedCustomReport 
      ? `custom-${selectedCustomReport.name}`
      : reportType;
    
    const doc = generateAnalyticsReport(
      analytics,
      reportName,
      user.name || 'User'
    );
    
    // Save the PDF
    const fileName = `intellitask-analytics-${reportType === 'custom' && selectedCustomReport 
        ? `custom-${selectedCustomReport.name.replace(/\s+/g, '-')}` 
        : reportType}-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
    
    doc.save(fileName);
    
    toast.success(`Analytics ${reportType} report downloaded as ${fileName}`);
  };
  
  return (
    <Layout>
      <div className="page-container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics & Reports</h1>
            <p className="text-muted-foreground">
              Visualize your productivity and task completion patterns.
            </p>
          </div>
          
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-[180px] justify-between">
                  {reportType === 'custom' && selectedCustomReport 
                    ? selectedCustomReport.name 
                    : `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`}
                  <span className="ml-2">▼</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[200px]">
                <DropdownMenuItem onClick={() => setReportType('daily')}>
                  Daily Report
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setReportType('weekly')}>
                  Weekly Report
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setReportType('monthly')}>
                  Monthly Report
                </DropdownMenuItem>
                
                {customReports.length > 0 && <DropdownMenuSeparator />}
                
                {customReports.map(report => (
                  <DropdownMenuItem 
                    key={report.id}
                    className="flex justify-between items-center"
                    onClick={() => handleSelectCustomReport(report.id)}
                  >
                    <span>{report.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        confirmDeleteReport(report);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </DropdownMenuItem>
                ))}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleSelectCustomReport('new')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Custom Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button onClick={handleGenerateReport}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
        
        {showCustomReportConfig ? (
          <CustomReportConfig 
            onSave={handleSaveCustomReport}
            onCancel={() => setShowCustomReportConfig(false)}
          />
        ) : (
          <>
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 text-center">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">Tasks</h3>
                  <p className="text-3xl font-bold">{analytics.totalTasks}</p>
                  <p className="text-sm text-muted-foreground mt-1">Total tasks created</p>
                </div>
                <div className="glass-card p-6 text-center">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-50 mb-4">
                    <div className="h-6 w-6 text-green-600 font-bold">%</div>
                  </div>
                  <h3 className="text-lg font-medium mb-1">Completion Rate</h3>
                  <p className="text-3xl font-bold">
                    {analytics.totalTasks ? Math.round(analytics.completionRate) : 0}%
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Task completion percentage</p>
                </div>
                <div className="glass-card p-6 text-center">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 mb-4">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">Productivity</h3>
                  <p className="text-3xl font-bold">
                    {analytics.totalTasks ? (analytics.completedTasks / 7).toFixed(1) : 0}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Tasks completed per day</p>
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="tasks" className="mb-8">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="tasks">Task Analysis</TabsTrigger>
                <TabsTrigger value="reminders">Reminder Analysis</TabsTrigger>
                <TabsTrigger value="activity">User Activity</TabsTrigger>
              </TabsList>
              <TabsContent value="tasks">
                <TaskCompletionChart 
                  selectedCategories={reportType === 'custom' && selectedCustomReport 
                    ? selectedCustomReport.categories 
                    : undefined}
                />
              </TabsContent>
              <TabsContent value="reminders">
                <ReminderCompletionChart />
              </TabsContent>
              <TabsContent value="activity">
                <UserActivityChart />
              </TabsContent>
            </Tabs>
            
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold mb-4">AI-Powered Insights</h2>
              <div className="space-y-4">
                <div className="bg-secondary/50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Task Distribution</h3>
                  <p className="text-muted-foreground">
                    You have a higher concentration of {Object.entries(analytics.tasksByCategory).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Work'} tasks.
                    Consider balancing your workload across different categories for better productivity.
                  </p>
                </div>
                <div className="bg-secondary/50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Completion Patterns</h3>
                  <p className="text-muted-foreground">
                    Your task completion rate of {analytics.totalTasks ? Math.round(analytics.completionRate) : 0}% 
                    {analytics.completionRate > 70 
                      ? ' is excellent! Keep up the good work.' 
                      : analytics.completionRate > 50 
                        ? ' is good, but could be improved. Try breaking down larger tasks into smaller ones.' 
                        : ' needs improvement. Consider using more reminders or adjusting your workload.'}
                  </p>
                </div>
                <div className="bg-secondary/50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Smart Rescheduling Recommendation</h3>
                  <p className="text-muted-foreground">
                    Based on your completion patterns, the best time to schedule important tasks is during midweek (Tuesday-Thursday), 
                    when your productivity appears to be at its highest.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* Delete confirmation dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Custom Report</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the report "{reportToDelete?.name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteReport}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Analytics;


pages/Analytics.tsx

// // import React, { useState, useEffect } from 'react';
// // import Layout from '@/components/layout/Layout';
// // import TaskCompletionChart from '@/components/analytics/TaskCompletionChart';
// // import ReminderCompletionChart from '@/components/analytics/ReminderCompletionChart';
// // import UserActivityChart from '@/components/analytics/UserActivityChart';
// // import CustomReportConfig, { CustomReport } from '@/components/analytics/CustomReportConfig';
// // import { useTaskContext } from '@/context/TaskContext';
// // import { useReminderContext } from '@/context/ReminderContext';
// // import { useUserContext } from '@/context/UserContext';
// // import { Button } from '@/components/ui/button';
// // import { Download, FileText, BarChart3, Plus, Trash2 } from 'lucide-react';
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// // import { generateAnalyticsReport } from '@/utils/reportGenerator';
// // import { format } from 'date-fns';
// // import { toast } from 'sonner';
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogDescription,
// //   DialogHeader,
// //   DialogTitle,
// //   DialogFooter,
// // } from '@/components/ui/dialog';
// // import {
// //   DropdownMenu,
// //   DropdownMenuContent,
// //   DropdownMenuItem,
// //   DropdownMenuTrigger,
// //   DropdownMenuSeparator,
// // } from '@/components/ui/dropdown-menu';

// // const STORAGE_KEY = 'intellitask-custom-reports';

// // const Analytics: React.FC = () => {
// //   const { analytics } = useTaskContext();
// //   const { generateReminderReport } = useReminderContext();
// //   const { user } = useUserContext();

// //   const [reportType, setReportType] = useState('weekly');
// //   const [customReports, setCustomReports] = useState<CustomReport[]>([]);
// //   const [showCustomReportConfig, setShowCustomReportConfig] = useState(false);
// //   const [selectedCustomReport, setSelectedCustomReport] = useState<CustomReport | null>(null);
// //   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
// //   const [reportToDelete, setReportToDelete] = useState<CustomReport | null>(null);

// //   useEffect(() => {
// //     const savedReports = localStorage.getItem(STORAGE_KEY);
// //     if (savedReports) {
// //       try {
// //         const parsed = JSON.parse(savedReports);
// //         const reportsWithDates = parsed.map((report: any) => ({
// //           ...report,
// //           createdAt: new Date(report.createdAt),
// //         }));
// //         setCustomReports(reportsWithDates);
// //       } catch (error) {
// //         console.error('Failed to parse saved reports', error);
// //       }
// //     }
// //   }, []);

// //   useEffect(() => {
// //     if (customReports.length > 0) {
// //       localStorage.setItem(STORAGE_KEY, JSON.stringify(customReports));
// //     }
// //   }, [customReports]);

// //   const handleSaveCustomReport = (report: CustomReport) => {
// //     setCustomReports(prev => [...prev, report]);
// //     setShowCustomReportConfig(false);
// //     setSelectedCustomReport(report);
// //     setReportType('custom');
// //   };

// //   const handleSelectCustomReport = (reportId: string) => {
// //     if (reportId === 'new') {
// //       setShowCustomReportConfig(true);
// //       setSelectedCustomReport(null);
// //       return;
// //     }
// //     const report = customReports.find(r => r.id === reportId);
// //     if (report) {
// //       setSelectedCustomReport(report);
// //       setReportType('custom');
// //     }
// //   };

// //   const confirmDeleteReport = (report: CustomReport) => {
// //     setReportToDelete(report);
// //     setDeleteDialogOpen(true);
// //   };

// //   const handleDeleteReport = () => {
// //     if (reportToDelete) {
// //       setCustomReports(prev => prev.filter(r => r.id !== reportToDelete.id));
// //       if (selectedCustomReport?.id === reportToDelete.id) {
// //         setSelectedCustomReport(null);
// //         setReportType('weekly');
// //       }
// //       toast.success(`Report "${reportToDelete.name}" deleted`);
// //       setDeleteDialogOpen(false);
// //       setReportToDelete(null);
// //     }
// //   };

// //   const handleGenerateReport = () => {
// //     if (!user) return;

// //     const reportName =
// //       reportType === 'custom' && selectedCustomReport
// //         ? `custom-${selectedCustomReport.name}`
// //         : reportType;

// //     const doc = generateAnalyticsReport(
// //       analytics,
// //       reportName,
// //       user.name || 'User'
// //     );

// //     const fileName = `intellitask-analytics-${reportType === 'custom' && selectedCustomReport
// //         ? `custom-${selectedCustomReport.name.replace(/\s+/g, '-')}`
// //         : reportType}-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`;

// //     doc.save(fileName);
// //     toast.success(`Analytics ${reportType} report downloaded as ${fileName}`);
// //   };

// //   return (
// //     <Layout>
// //       <div className="page-container">
// //         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
// //           <div>
// //             <h1 className="text-3xl font-bold tracking-tight">Analytics & Reports</h1>
// //             <p className="text-muted-foreground">Visualize your productivity and task completion patterns.</p>
// //           </div>

// //           <div className="flex items-center gap-4 mt-4 md:mt-0">
// //             <DropdownMenu>
// //               <DropdownMenuTrigger asChild>
// //                 <Button variant="outline" className="w-[180px] justify-between">
// //                   {reportType === 'custom' && selectedCustomReport
// //                     ? selectedCustomReport.name
// //                     : `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`}
// //                   <span className="ml-2">▼</span>
// //                 </Button>
// //               </DropdownMenuTrigger>
// //               <DropdownMenuContent className="w-[200px]">
// //                 <DropdownMenuItem onClick={() => setReportType('daily')}>Daily Report</DropdownMenuItem>
// //                 <DropdownMenuItem onClick={() => setReportType('weekly')}>Weekly Report</DropdownMenuItem>
// //                 <DropdownMenuItem onClick={() => setReportType('monthly')}>Monthly Report</DropdownMenuItem>
// //                 {customReports.length > 0 && <DropdownMenuSeparator />}
// //                 {customReports.map(report => (
// //                   <DropdownMenuItem
// //                     key={report.id}
// //                     className="flex justify-between items-center"
// //                     onClick={() => handleSelectCustomReport(report.id)}
// //                   >
// //                     <span>{report.name}</span>
// //                     <Button
// //                       variant="ghost"
// //                       size="icon"
// //                       className="h-8 w-8"
// //                       onClick={e => {
// //                         e.stopPropagation();
// //                         confirmDeleteReport(report);
// //                       }}
// //                     >
// //                       <Trash2 className="h-4 w-4 text-destructive" />
// //                     </Button>
// //                   </DropdownMenuItem>
// //                 ))}
// //                 <DropdownMenuSeparator />
// //                 <DropdownMenuItem onClick={() => handleSelectCustomReport('new')}>
// //                   <Plus className="h-4 w-4 mr-2" />
// //                   Create Custom Report
// //                 </DropdownMenuItem>
// //               </DropdownMenuContent>
// //             </DropdownMenu>
// //             <Button onClick={handleGenerateReport}>
// //               <Download className="h-4 w-4 mr-2" />
// //               Export Report
// //             </Button>
// //           </div>
// //         </div>

// //         {showCustomReportConfig ? (
// //           <CustomReportConfig
// //             onSave={handleSaveCustomReport}
// //             onCancel={() => setShowCustomReportConfig(false)}
// //           />
// //         ) : (
// //           <>
// //             <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
// //               <div className="glass-card p-6 text-center">
// //                 <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
// //                   <FileText className="h-6 w-6 text-primary" />
// //                 </div>
// //                 <h3 className="text-lg font-medium mb-1">Tasks</h3>
// //                 <p className="text-3xl font-bold">{analytics.totalTasks}</p>
// //                 <p className="text-sm text-muted-foreground mt-1">Total tasks created</p>
// //               </div>
// //               <div className="glass-card p-6 text-center">
// //                 <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-50 mb-4">
// //                   <div className="h-6 w-6 text-green-600 font-bold">%</div>
// //                 </div>
// //                 <h3 className="text-lg font-medium mb-1">Completion Rate</h3>
// //                 <p className="text-3xl font-bold">
// //                   {analytics.totalTasks ? Math.round(analytics.completionRate) : 0}%
// //                 </p>
// //                 <p className="text-sm text-muted-foreground mt-1">Task completion percentage</p>
// //               </div>
// //               <div className="glass-card p-6 text-center">
// //                 <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 mb-4">
// //                   <BarChart3 className="h-6 w-6 text-blue-600" />
// //                 </div>
// //                 <h3 className="text-lg font-medium mb-1">Productivity</h3>
// //                 <p className="text-3xl font-bold">
// //                   {analytics.totalTasks ? (analytics.completedTasks / 7).toFixed(1) : 0}
// //                 </p>
// //                 <p className="text-sm text-muted-foreground mt-1">Tasks completed per day</p>
// //               </div>
// //             </div>

// //             <Tabs defaultValue="tasks" className="mb-8">
// //               <TabsList className="grid w-full grid-cols-3 mb-6">
// //                 <TabsTrigger value="tasks">Task Analysis</TabsTrigger>
// //                 <TabsTrigger value="reminders">Reminder Analysis</TabsTrigger>
// //                 <TabsTrigger value="activity">User Activity</TabsTrigger>
// //               </TabsList>
// //               <TabsContent value="tasks">
// //                 <TaskCompletionChart
// //                   selectedCategories={
// //                     reportType === 'custom' && selectedCustomReport
// //                       ? selectedCustomReport.categories
// //                       : undefined
// //                   }
// //                 />
// //               </TabsContent>
// //               <TabsContent value="reminders">
// //                 <ReminderCompletionChart />
// //               </TabsContent>
// //               <TabsContent value="activity">
// //                 <UserActivityChart />
// //               </TabsContent>
// //             </Tabs>

// //             <div className="glass-card p-6">
// //               <h2 className="text-xl font-bold mb-4">AI-Powered Insights</h2>
// //               <div className="space-y-4">
// //                 <div className="bg-secondary/50 p-4 rounded-lg">
// //                   <h3 className="font-medium mb-2">Task Distribution</h3>
// //                   <p className="text-muted-foreground">
// //                     You have a higher concentration of {Object.entries(analytics.tasksByCategory).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Work'} tasks.
// //                     Consider balancing your workload across different categories for better productivity.
// //                   </p>
// //                 </div>
// //                 <div className="bg-secondary/50 p-4 rounded-lg">
// //                   <h3 className="font-medium mb-2">Completion Patterns</h3>
// //                   <p className="text-muted-foreground">
// //                     Your task completion rate of {analytics.totalTasks ? Math.round(analytics.completionRate) : 0}%
// //                     {analytics.completionRate > 70
// //                       ? ' is excellent! Keep up the good work.'
// //                       : analytics.completionRate > 50
// //                         ? ' is good, but could be improved. Try breaking down larger tasks into smaller ones.'
// //                         : ' needs improvement. Consider using more reminders or adjusting your workload.'}
// //                   </p>
// //                 </div>
// //                 <div className="bg-secondary/50 p-4 rounded-lg">
// //                   <h3 className="font-medium mb-2">Smart Rescheduling Recommendation</h3>
// //                   <p className="text-muted-foreground">
// //                     Based on your completion patterns, the best time to schedule important tasks is during midweek (Tuesday–Thursday),
// //                     when your productivity appears to be at its highest.
// //                   </p>
// //                 </div>
// //               </div>
// //             </div>
// //           </>
// //         )}

// //         <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
// //           <DialogContent>
// //             <DialogHeader>
// //               <DialogTitle>Delete Custom Report</DialogTitle>
// //               <DialogDescription>
// //                 Are you sure you want to delete the report "{reportToDelete?.name}"? This action cannot be undone.
// //               </DialogDescription>
// //             </DialogHeader>
// //             <DialogFooter>
// //               <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
// //                 Cancel
// //               </Button>
// //               <Button variant="destructive" onClick={handleDeleteReport}>
// //                 Delete
// //               </Button>
// //             </DialogFooter>
// //           </DialogContent>
// //         </Dialog>
// //       </div>
// //     </Layout>
// //   );
// // };

// //// export default Analytics;

// 'use client';

// import React, { useEffect, useState } from 'react';
// import Layout from '@/components/layout/Layout';
// import TaskCompletionChart from '@/components/analytics/TaskCompletionChart';
// import ReminderCompletionChart from '@/components/analytics/ReminderCompletionChart';
// import UserActivityChart from '@/components/analytics/UserActivityChart';
// import CustomReportConfig from '@/components/analytics/CustomReportConfig';
// import { useTaskContext } from '@/context/TaskContext';
// import { useReminderContext } from '@/context/ReminderContext';
// import { useUserContext } from '@/context/UserContext';
// import { Button } from '@/components/ui/button';
// import { Calendar } from '@/components/ui/calendar';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuSeparator,
// } from '@/components/ui/dropdown-menu';
// import { Calendar as CalendarIcon, Download, Plus, Trash2 } from 'lucide-react';
// import { toast } from 'sonner';
// import { format } from 'date-fns';
// import { CustomReport, ReportType } from '@/types';
// import { generateAnalyticsReport } from '@/utils/reportGenerator';

// const STORAGE_KEY = 'customReports';

// const Analytics: React.FC = () => {
//   const { analytics } = useTaskContext();
//   const { user } = useUserContext();

//   const [reportType, setReportType] = useState<ReportType>('weekly');
//   const [date, setDate] = useState<Date | undefined>(new Date());
//   const [customReports, setCustomReports] = useState<CustomReport[]>([]);
//   const [showCustomReportConfig, setShowCustomReportConfig] = useState(false);
//   const [selectedCustomReport, setSelectedCustomReport] = useState<CustomReport | null>(null);

//   useEffect(() => {
//     const savedReports = localStorage.getItem(STORAGE_KEY);
//     if (savedReports) {
//       try {
//         const parsed = JSON.parse(savedReports);
//         setCustomReports(parsed);
//       } catch (err) {
//         console.error('Failed to parse saved custom reports');
//       }
//     }
//   }, []);

//   useEffect(() => {
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(customReports));
//   }, [customReports]);

//   const handleSaveCustomReport = (report: CustomReport) => {
//     setCustomReports(prev => {
//       const exists = prev.find(r => r.id === report.id);
//       if (exists) {
//         return prev.map(r => (r.id === report.id ? report : r));
//       } else {
//         return [...prev, report];
//       }
//     });
//     setShowCustomReportConfig(false);
//     setSelectedCustomReport(report);
//     setReportType('custom');
//   };

//   const handleDeleteReport = (report: CustomReport) => {
//     if (window.confirm(`Are you sure you want to delete "${report.name}"?`)) {
//       setCustomReports(prev => prev.filter(r => r.id !== report.id));
//       if (selectedCustomReport?.id === report.id) {
//         setSelectedCustomReport(null);
//         setReportType('weekly');
//       }
//     }
//   };

//   const handleGenerateReport = () => {
//     if (!user) return;

//     const reportName =
//       reportType === 'custom' && selectedCustomReport
//         ? `custom-${selectedCustomReport.name}`
//         : reportType;

//     const doc = generateAnalyticsReport(
//       analytics,
//       reportName,
//       user.name || 'User'
//     );

//     const fileName = `analytics-${reportName}-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
//     doc.save(fileName);
//     toast.success(`Downloaded: ${fileName}`);
//   };

//   return (
//     <Layout>
//       <div className="p-4 space-y-6">
//         <div className="flex justify-between items-center">
//           <h1 className="text-3xl font-bold">Task Analytics</h1>
//           <Button onClick={handleGenerateReport}>
//             <Download className="w-4 h-4 mr-2" />
//             Export Report
//           </Button>
//         </div>

//         <div className="flex flex-wrap gap-4 items-center">
//           <Button
//             variant={reportType === 'weekly' ? 'default' : 'outline'}
//             onClick={() => setReportType('weekly')}
//           >
//             Weekly
//           </Button>
//           <Button
//             variant={reportType === 'monthly' ? 'default' : 'outline'}
//             onClick={() => setReportType('monthly')}
//           >
//             Monthly
//           </Button>
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant={reportType === 'custom' ? 'default' : 'outline'}>
//                 Custom Reports
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent>
//               {customReports.map(report => (
//                 <DropdownMenuItem key={report.id} onClick={() => {
//                   setSelectedCustomReport(report);
//                   setReportType('custom');
//                 }}>
//                   {report.name}
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="ml-auto h-5 w-5"
//                     onClick={e => {
//                       e.stopPropagation();
//                       handleDeleteReport(report);
//                     }}
//                   >
//                     <Trash2 className="w-4 h-4 text-destructive" />
//                   </Button>
//                 </DropdownMenuItem>
//               ))}
//               <DropdownMenuSeparator />
//               <DropdownMenuItem onClick={() => {
//                 setShowCustomReportConfig(true);
//                 setSelectedCustomReport(null);
//               }}>
//                 <Plus className="w-4 h-4 mr-2" />
//                 Create Custom Report
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>

//           <div className="flex items-center space-x-2">
//             <CalendarIcon className="w-5 h-5 text-muted-foreground" />
//             <Calendar
//               mode="single"
//               selected={date}
//               onSelect={setDate}
//               className="rounded-md border"
//             />
//           </div>
//         </div>

//         {showCustomReportConfig ? (
//           <CustomReportConfig
//             onSave={handleSaveCustomReport}
//             onCancel={() => setShowCustomReportConfig(false)}
//             existing={selectedCustomReport}
//           />
//         ) : (
//           <>
//             <TaskCompletionChart
//               selectedCategories={
//                 reportType === 'custom' && selectedCustomReport
//                   ? selectedCustomReport.categories
//                   : undefined
//               }
//             />
//             <ReminderCompletionChart />
//             <UserActivityChart />
//           </>
//         )}
//       </div>
//     </Layout>
//   );
// };

// export default Analytics;
