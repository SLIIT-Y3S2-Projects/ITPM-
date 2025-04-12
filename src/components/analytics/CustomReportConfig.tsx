
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTaskContext } from '@/context/TaskContext';
import { toast } from 'sonner';

export interface CustomReport {
  id: string;
  name: string;
  categories: string[];
  createdAt: Date;
}

interface CustomReportConfigProps {
  onSave: (report: CustomReport) => void;
  onCancel: () => void;
}

const CustomReportConfig: React.FC<CustomReportConfigProps> = ({ onSave, onCancel }) => {
  const { analytics } = useTaskContext();
  const [reportName, setReportName] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // Get all available categories
  const availableCategories = Object.keys(analytics.tasksByCategory);
  
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  const handleSave = () => {
    if (!reportName.trim()) {
      toast.error('Please enter a report name');
      return;
    }
    
    if (selectedCategories.length === 0) {
      toast.error('Please select at least one category');
      return;
    }
    
    const newReport: CustomReport = {
      id: `report-${Date.now()}`,
      name: reportName,
      categories: selectedCategories,
      createdAt: new Date(),
    };
    
    onSave(newReport);
    toast.success('Custom report saved');
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create Custom Report</CardTitle>
        <CardDescription>
          Select specific categories to include in your custom report
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="reportName">Report Name</Label>
          <Input 
            id="reportName" 
            placeholder="e.g., Work & Health Tasks" 
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Categories</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {availableCategories.length > 0 ? (
              availableCategories.map(category => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`category-${category}`} 
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => handleCategoryToggle(category)}
                  />
                  <Label htmlFor={`category-${category}`} className="cursor-pointer">
                    {category}
                  </Label>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No categories found. Create tasks with categories first.</p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSave}>Save Custom Report</Button>
      </CardFooter>
    </Card>
  );
};

export default CustomReportConfig;
