
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Legend } from 'recharts';
import { useTaskContext } from '@/context/TaskContext';

interface TaskCompletionChartProps {
  selectedCategories?: string[];
}

const TaskCompletionChart: React.FC<TaskCompletionChartProps> = ({ selectedCategories }) => {
  const { analytics } = useTaskContext();
  
  // Filter analytics data based on selected categories if provided
  const filteredCategoryData = selectedCategories && selectedCategories.length > 0
    ? Object.entries(analytics.tasksByCategory)
        .filter(([name]) => selectedCategories.includes(name))
        .map(([name, value]) => ({ name, value }))
    : Object.entries(analytics.tasksByCategory).map(([name, value]) => ({
        name,
        value,
      }));
  
  // Prepare data for the chart
  const data = [
    {
      name: 'Tasks',
      Completed: analytics.completedTasks,
      Pending: analytics.pendingTasks,
      Missed: analytics.missedTasks,
    },
  ];
  
  const priorityData = Object.entries(analytics.tasksByPriority).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));
  
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Task Overview</CardTitle>
        <CardDescription>
          Visual breakdown of your task completion status
          {selectedCategories && selectedCategories.length > 0 && (
            <span className="ml-1">
              for {selectedCategories.join(', ')} categories
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                }}
              />
              <Legend />
              <Bar dataKey="Completed" fill="#4ADE80" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Pending" fill="#38BDF8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Missed" fill="#F87171" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div>
            <h4 className="text-sm font-medium mb-4">Tasks by Category</h4>
            <div className="space-y-4">
              {filteredCategoryData.map((item) => (
                <div key={item.name} className="flex items-center">
                  <div className="w-32 truncate">{item.name}</div>
                  <div className="w-full">
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{
                          width: `${(item.value / analytics.totalTasks) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-12 text-right text-muted-foreground">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-4">Tasks by Priority</h4>
            <div className="space-y-4">
              {priorityData.map((item) => (
                <div key={item.name} className="flex items-center">
                  <div className="w-32">{item.name}</div>
                  <div className="w-full">
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(item.value / analytics.totalTasks) * 100}%`,
                          backgroundColor: 
                            item.name === 'High' 
                              ? '#F87171' 
                              : item.name === 'Medium'
                                ? '#FBBF24'
                                : '#38BDF8',
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-12 text-right text-muted-foreground">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCompletionChart;
