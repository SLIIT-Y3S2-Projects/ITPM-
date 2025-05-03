import React from "react";
import Layout from "@/components/layout/Layout";
import { useTaskContext } from "@/context/TaskContext";
import { useReminderContext } from "@/context/ReminderContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AnalyticsCard from "@/components/analytics/AnalyticsCard";
import TaskCard from "@/components/tasks/TaskCard";
import ReminderCard from "@/components/reminders/ReminderCard";
import AITaskAssistant from "@/components/tasks/AITaskAssistant";
import {
  BarChart3,
  CheckCircle2,
  Clock,
  ClipboardList,
  Download,
  ListTodo,
  Plus,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/UserContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import TaskForm from "@/components/tasks/TaskForm";
import ReminderForm from "@/components/reminders/ReminderForm";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { generateDashboardReport } from "@/utils/reportGenerator";
import { toast } from "sonner";

const Dashboard: React.FC = () => {
  const { tasks, analytics, addTask } = useTaskContext();
  const { reminders, upcomingReminders, overdueReminders, addReminder } =
    useReminderContext();
  const { user } = useUserContext();
  const [showNewTask, setShowNewTask] = React.useState(false);
  const [showNewReminder, setShowNewReminder] = React.useState(false);

  // Get tasks due today

  const todayTasks = tasks.filter((task) => {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    return (
      dueDate.getDate() === today.getDate() &&
      dueDate.getMonth() === today.getMonth() &&
      dueDate.getFullYear() === today.getFullYear() &&
      task.status !== "completed"
    );
  });

  const handleAddTask = (task: any) => {
    if (user) {
      addTask({
        ...task,
        userId: user._id!,
      });
      setShowNewTask(false);
    }
  };

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

  // Generate and download dashboard report
  const handleGenerateReport = () => {
    if (!user) return;

    const doc = generateDashboardReport(
      tasks,
      reminders,
      analytics,
      user.name || "User"
    );

    // Save the PDF
    const fileName = `intellitask-dashboard-report-${format(
      new Date(),
      "yyyy-MM-dd"
    )}.pdf`;
    doc.save(fileName);

    toast.success(`Dashboard report downloaded as ${fileName}`);
  };

  return (
    <Layout>
      <div className="page-container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.name || "User"}! Here's an overview of your
              tasks and reminders.
            </p>
          </div>

          <div className="flex gap-2 mt-4 md:mt-0">
            <Button
              variant="outline"
              onClick={handleGenerateReport}
              className="hidden md:flex"
            >
              <Download className="h-4 w-4 mr-2" />
              Generate Report
            </Button>

            <Dialog open={showNewTask} onOpenChange={setShowNewTask}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <ListTodo className="h-4 w-4 mr-2" />
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

            <Dialog open={showNewReminder} onOpenChange={setShowNewReminder}>
              <DialogTrigger asChild>
                <Button>
                  <Clock className="h-4 w-4 mr-2" />
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <AnalyticsCard
            title="Total Tasks"
            value={analytics.totalTasks}
            icon={<ClipboardList className="h-4 w-4 text-primary" />}
          />

          <AnalyticsCard
            title="Completed Tasks"
            value={analytics.completedTasks}
            icon={<CheckCircle2 className="h-4 w-4 text-green-600" />}
            trend={{
              value: analytics.totalTasks
                ? Math.round(
                    (analytics.completedTasks / analytics.totalTasks) * 100
                  )
                : 0,
              isPositive: true,
            }}
          />

          <AnalyticsCard
            title="Upcoming Reminders"
            value={upcomingReminders.length}
            icon={<Clock className="h-4 w-4 text-blue-600" />}
          />

          <AnalyticsCard
            title="Overdue Reminders"
            value={overdueReminders.length}
            icon={<Clock className="h-4 w-4 text-red-600" />}
          />
        </div>

        <div className="mb-6 flex md:hidden justify-end">
          <Button
            variant="outline"
            onClick={handleGenerateReport}
            className="w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="glass-card overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">
                Tasks Due Today
              </CardTitle>
              <Link to="/tasks">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {todayTasks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    No tasks due today
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setShowNewTask(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {todayTasks.slice(0, 3).map((task) => (
                    <TaskCard key={task._id} task={task} />
                  ))}
                  {todayTasks.length > 3 && (
                    <Link to="/tasks" className="flex justify-center mt-4">
                      <Button variant="ghost">
                        View {todayTasks.length - 3} more tasks
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="glass-card overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">
                Upcoming Reminders
              </CardTitle>
              <Link to="/reminders">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {upcomingReminders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    No upcoming reminders
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setShowNewReminder(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Reminder
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingReminders.slice(0, 3).map((reminder) => (
                    <ReminderCard key={reminder._id} reminder={reminder} />
                  ))}
                  {upcomingReminders.length > 3 && (
                    <Link to="/reminders" className="flex justify-center mt-4">
                      <Button variant="ghost">
                        View {upcomingReminders.length - 3} more reminders
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="glass-card overflow-hidden mb-8">
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute top-0 bottom-0 left-8 border-l border-muted"></div>
              <ul className="space-y-6">
                {[...tasks]
                  .sort(
                    (a, b) =>
                      new Date(b.updatedAt).getTime() -
                      new Date(a.updatedAt).getTime()
                  )
                  .slice(0, 5)
                  .map((task) => (
                    <li key={task._id} className="relative pl-12">
                      <div className="absolute left-[27px] -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-primary"></div>
                      <time className="text-xs text-muted-foreground block mb-1">
                        {format(new Date(task.updatedAt), "MMM d, h:mm a")}
                      </time>
                      <p className="font-medium">
                        Task "{task.title}" was{" "}
                        {task.status === "completed" ? "completed" : "updated"}
                      </p>
                    </li>
                  ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-card overflow-hidden md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Task Completion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Progress</span>
                <span className="text-sm font-medium">
                  {analytics.totalTasks
                    ? Math.round(
                        (analytics.completedTasks / analytics.totalTasks) * 100
                      )
                    : 0}
                  %
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{
                    width: `${
                      analytics.totalTasks
                        ? (analytics.completedTasks / analytics.totalTasks) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                <div>
                  <span className="text-3xl font-bold block">
                    {analytics.completedTasks}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Completed
                  </span>
                </div>
                <div>
                  <span className="text-3xl font-bold block">
                    {analytics.pendingTasks}
                  </span>
                  <span className="text-sm text-muted-foreground">Pending</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link to="/tasks">
                    <ListTodo className="h-4 w-4 mr-2" />
                    View All Tasks
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link to="/reminders">
                    <Clock className="h-4 w-4 mr-2" />
                    Manage Reminders
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link to="/analytics">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Reports
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setShowNewTask(true)}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create New Task
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add the AI Task Assistant */}
      <AITaskAssistant />
    </Layout>
  );
};

export default Dashboard;
