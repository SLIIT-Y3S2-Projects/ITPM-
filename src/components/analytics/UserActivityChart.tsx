
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Mock data for the user activity chart
const activityData = [
  { date: 'Mon', tasks: 4, reminders: 2 },
  { date: 'Tue', tasks: 3, reminders: 3 },
  { date: 'Wed', tasks: 5, reminders: 4 },
  { date: 'Thu', tasks: 7, reminders: 5 },
  { date: 'Fri', tasks: 6, reminders: 3 },
  { date: 'Sat', tasks: 3, reminders: 1 },
  { date: 'Sun', tasks: 2, reminders: 2 },
];

const UserActivityChart: React.FC = () => {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Weekly Activity</CardTitle>
        <CardDescription>
          Your task and reminder activity over the past week
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={activityData}
              margin={{
                top: 10,
                right: 10,
                left: 10,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} />
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
              <Line
                type="monotone"
                dataKey="tasks"
                stroke="#38BDF8"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="reminders"
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-8">
          <h4 className="text-sm font-medium mb-4">Activity Insights</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-secondary/50 p-4 rounded-lg">
              <dt className="text-sm font-medium text-muted-foreground">Most Productive Day</dt>
              <dd className="mt-1 text-lg font-semibold">Thursday</dd>
              <dd className="text-sm text-muted-foreground">7 tasks created</dd>
            </div>
            <div className="bg-secondary/50 p-4 rounded-lg">
              <dt className="text-sm font-medium text-muted-foreground">Weekly Average</dt>
              <dd className="mt-1 text-lg font-semibold">4.3 tasks per day</dd>
              <dd className="text-sm text-muted-foreground">2.9 reminders per day</dd>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserActivityChart;
