
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useReminderContext } from '@/context/ReminderContext';

const ReminderCompletionChart: React.FC = () => {
  const { generateReminderReport } = useReminderContext();
  const report = generateReminderReport();
  
  // Prepare data for the completion chart
  const completionData = [
    { name: 'Completed', value: report.completed },
    { name: 'Upcoming', value: report.upcoming },
    { name: 'Overdue', value: report.overdue },
  ];
  
  // Prepare data for the type breakdown chart
  const typeData = Object.entries(report.byType).map(([type, count]) => ({
    name: type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    value: count,
  }));
  
  // Colors for the charts
  const COLORS = ['#4ADE80', '#38BDF8', '#F87171'];
  const TYPE_COLORS = ['#8B5CF6', '#EC4899', '#06B6D4'];
  
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Reminder Analytics</CardTitle>
        <CardDescription>
          Visual breakdown of your reminders
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-[300px] flex flex-col">
            <h4 className="text-sm font-medium mb-4 text-center">Reminder Status</h4>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={completionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {completionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="h-[300px] flex flex-col">
            <h4 className="text-sm font-medium mb-4 text-center">Reminder Types</h4>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={TYPE_COLORS[index % TYPE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="mt-8">
          <h4 className="text-sm font-medium mb-4">Reminder Statistics</h4>
          <dl className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-secondary/50 p-4 rounded-lg">
              <dt className="text-sm font-medium text-muted-foreground">Total Reminders</dt>
              <dd className="mt-1 text-2xl font-semibold">{report.total}</dd>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <dt className="text-sm font-medium text-green-700">Completed</dt>
              <dd className="mt-1 text-2xl font-semibold text-green-700">{report.completed}</dd>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <dt className="text-sm font-medium text-red-700">Overdue</dt>
              <dd className="mt-1 text-2xl font-semibold text-red-700">{report.overdue}</dd>
            </div>
          </dl>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReminderCompletionChart;
