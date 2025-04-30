import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CustomReport } from '@/types';
import { v4 as uuidv4 } from 'uuid';

type Props = {
  existingReport: CustomReport | null;
  onSave: (report: CustomReport) => void;
  onCancel: () => void;
};

const CustomReportConfig: React.FC<Props> = ({ existingReport, onSave, onCancel }) => {
  const [name, setName] = useState(existingReport?.name || '');
  const [filters, setFilters] = useState(existingReport?.filters || {});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedReport: CustomReport = {
      id: existingReport?.id || uuidv4(),
      name,
      filters,
    };

    onSave(updatedReport);
  };

  return (
    <div className="border p-4 rounded-lg shadow-md mt-4 bg-white">
      <h2 className="text-xl font-semibold mb-4">
        {existingReport ? 'Edit Custom Report' : 'Create Custom Report'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Report Name</label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Filters (JSON)</label>
          <Input
            type="text"
            placeholder='e.g., {"priority":"high"}'
            value={JSON.stringify(filters)}
            onChange={(e) => {
              try {
                setFilters(JSON.parse(e.target.value));
              } catch {
                // Do nothing or show error (optional)
              }
            }}
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit">{existingReport ? 'Update' : 'Save'}</Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CustomReportConfig;
