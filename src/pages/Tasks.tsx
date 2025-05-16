import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import TaskList from "@/components/tasks/TaskList";
import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import TaskForm from "@/components/tasks/TaskForm";
import { useTaskContext } from "@/context/TaskContext";
import { useUserContext } from "@/context/UserContext";
import AITaskAssistant from "@/components/tasks/AITaskAssistant";
import { generateTasksReport } from "@/utils/reportGenerator";
import { format } from "date-fns";
import { toast } from "sonner";

const Tasks: React.FC = () => {
  const [showNewTask, setShowNewTask] = useState(false);
  const {
    tasks,
    filteredTasks,
    addTask,
    searchQuery,
    statusFilter,
    priorityFilter,
    categoryFilter,
  } = useTaskContext();
  const { user } = useUserContext();

  const handleAddTask = (task: any) => {
    if (user) {
      addTask({
        ...task,
        userId: user._id!,
      });
      setShowNewTask(false);
    }
  };

  // Generate and download tasks report
  const handleGenerateReport = () => {
    if (!user) return;

    const doc = generateTasksReport(tasks, filteredTasks, user.name || "User", {
      status: statusFilter,
      priority: priorityFilter,
      category: categoryFilter,
      searchQuery,
    });

    

    // Save the PDF material
    const fileName = `intellitask-tasks-report-${format(
      new Date(),
      "yyyy-MM-dd"
    )}.pdf`;
    doc.save(fileName);

    toast.success(`Tasks report downloaded as ${fileName}`);
  };

  return (
    <Layout>
      <div className="page-container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Task Management
            </h1>
            <p className="text-muted-foreground">
              Create, organize, and manage your tasks efficiently.
            </p>
          </div>

          <div className="flex gap-2 mt-4 md:mt-0">
            <Button variant="outline" onClick={handleGenerateReport}>
              <Download className="h-4 w-4 mr-2" />
              Generate Report
            </Button>

            <Dialog open={showNewTask} onOpenChange={setShowNewTask}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                </DialogHeader>
                <TaskForm onSubmit={handleAddTask} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <TaskList />
      </div>

      <AITaskAssistant />
    </Layout>
  );
};

export default Tasks;
