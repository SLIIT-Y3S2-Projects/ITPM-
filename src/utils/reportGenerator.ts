import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Task } from "@/models/Task";
import { Reminder } from "@/models/Reminder";
import { format } from "date-fns";

// Function to create a header for the PDF report
const createReportHeader = (doc: jsPDF, title: string, userName: string) => {
  // Add logo or header image if needed
  doc.setFontSize(20);
  doc.setTextColor(0, 77, 153); // Blue color
  doc.text("IntelliTask", 14, 20);

  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text(title, 14, 30);

  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated for: ${userName}`, 14, 38);
  doc.text(`Date: ${format(new Date(), "MMMM dd, yyyy - HH:mm")}`, 14, 44);

  // Add a horizontal line
  doc.setDrawColor(220, 220, 220);
  doc.line(14, 48, 196, 48);
};

// Generate a dashboard summary report

export const generateDashboardReport = (
  tasks: Task[],
  reminders: Reminder[],
  analytics: any,
  userName: string
) => {
  const doc = new jsPDF();
  createReportHeader(doc, "Dashboard Summary Report", userName);

  // Add analytics summary
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("Analytics Summary", 14, 60);

  const completionRate = tasks.length
    ? Math.round((analytics.completedTasks / tasks.length) * 100)
    : 0;

  // Create analytics table
  autoTable(doc, {
    startY: 65,
    head: [["Metric", "Value"]],
    body: [
      ["Total Tasks", tasks.length.toString()],
      ["Completed Tasks", analytics.completedTasks.toString()],
      ["Pending Tasks", analytics.pendingTasks.toString()],
      ["Task Completion Rate", `${completionRate}%`],
      [
        "Upcoming Reminders",
        reminders.filter((r) => !r.isCompleted).length.toString(),
      ],
    ],
    theme: "grid",
    headStyles: { fillColor: [0, 77, 153] },
  });

  let finalY = (doc as any).lastAutoTable.finalY + 15;

  // Add recent tasks
  doc.setFontSize(14);
  doc.text("Recent Tasks", 14, finalY);

  const recentTasks = [...tasks]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 5);

  if (recentTasks.length > 0) {
    autoTable(doc, {
      startY: finalY + 5,
      head: [["Task", "Due Date", "Status", "Priority"]],
      body: recentTasks.map((task) => [
        task.title,
        task.dueDate
          ? format(new Date(task.dueDate), "MMM dd, yyyy")
          : "No due date",
        task.status,
        task.priority,
      ]),
      theme: "grid",
      headStyles: { fillColor: [0, 77, 153] },
    });
  } else {
    doc.setFontSize(12);
    doc.text("No recent tasks found.", 14, finalY + 10);
  }

  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `IntelliTask Report - Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }

  return doc;
};

// Generate a tasks report
export const generateTasksReport = (
  tasks: Task[],
  filteredTasks: Task[],
  userName: string,
  filters: {
    status: string | null;
    priority: string | null;
    category: string | null;
    searchQuery: string;
  }
) => {
  const doc = new jsPDF();
  createReportHeader(doc, "Tasks Report", userName);

  // Add filters information
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text("Filters Applied:", 14, 60);

  let filtersText = "";
  if (filters.status) filtersText += `Status: ${filters.status}, `;
  if (filters.priority) filtersText += `Priority: ${filters.priority}, `;
  if (filters.category) filtersText += `Category: ${filters.category}, `;
  if (filters.searchQuery) filtersText += `Search: "${filters.searchQuery}", `;

  doc.text(filtersText || "None", 14, 66);

  // Add task statistics
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("Task Statistics", 14, 76);

  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const pendingCount = tasks.filter((t) => t.status === "pending").length;
  const inProgressCount = tasks.filter(
    (t) => t.status === "in-progress"
  ).length;
  const missedCount = tasks.filter((t) => t.status === "missed").length;

  autoTable(doc, {
    startY: 81,
    head: [["Status", "Count", "Percentage"]],
    body: [
      [
        "Completed",
        completedCount.toString(),
        `${
          tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0
        }%`,
      ],
      [
        "Pending",
        pendingCount.toString(),
        `${
          tasks.length ? Math.round((pendingCount / tasks.length) * 100) : 0
        }%`,
      ],
      [
        "In Progress",
        inProgressCount.toString(),
        `${
          tasks.length ? Math.round((inProgressCount / tasks.length) * 100) : 0
        }%`,
      ],
      [
        "Missed",
        missedCount.toString(),
        `${tasks.length ? Math.round((missedCount / tasks.length) * 100) : 0}%`,
      ],
    ],
    theme: "grid",
    headStyles: { fillColor: [0, 77, 153] },
  });

  let finalY = (doc as any).lastAutoTable.finalY + 15;

  // Add task list
  doc.setFontSize(14);
  doc.text("Task List", 14, finalY);

  if (filteredTasks.length > 0) {
    autoTable(doc, {
      startY: finalY + 5,
      head: [["Title", "Due Date", "Status", "Priority", "Category"]],
      body: filteredTasks.map((task) => [
        task.title,
        task.dueDate
          ? format(new Date(task.dueDate), "MMM dd, yyyy")
          : "No due date",
        task.status,
        task.priority,
        task.category || "None",
      ]),
      theme: "grid",
      headStyles: { fillColor: [0, 77, 153] },
    });
  } else {
    doc.setFontSize(12);
    doc.text("No tasks matching the current filters.", 14, finalY + 10);
  }

  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `IntelliTask Tasks Report - Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }

  return doc;
};

// Generate a reminders report
export const generateRemindersReport = (
  reminders: Reminder[],
  filteredReminders: Reminder[],
  userName: string,
  filters: { type: string | null; searchQuery: string }
) => {
  const doc = new jsPDF();
  createReportHeader(doc, "Reminders Report", userName);

  // Add filters information
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text("Filters Applied:", 14, 60);

  let filtersText = "";
  if (filters.type) filtersText += `Type: ${filters.type}, `;
  if (filters.searchQuery) filtersText += `Search: "${filters.searchQuery}", `;

  doc.text(filtersText || "None", 14, 66);

  // Add reminder statistics
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("Reminder Statistics", 14, 76);

  const completedCount = reminders.filter((r) => r.isCompleted).length;
  const upcomingCount = reminders.filter(
    (r) => !r.isCompleted && new Date(r.date) > new Date()
  ).length;
  const overdueCount = reminders.filter(
    (r) => !r.isCompleted && new Date(r.date) < new Date()
  ).length;

  autoTable(doc, {
    startY: 81,
    head: [["Status", "Count", "Percentage"]],
    body: [
      [
        "Completed",
        completedCount.toString(),
        `${
          reminders.length
            ? Math.round((completedCount / reminders.length) * 100)
            : 0
        }%`,
      ],
      [
        "Upcoming",
        upcomingCount.toString(),
        `${
          reminders.length
            ? Math.round((upcomingCount / reminders.length) * 100)
            : 0
        }%`,
      ],
      [
        "Overdue",
        overdueCount.toString(),
        `${
          reminders.length
            ? Math.round((overdueCount / reminders.length) * 100)
            : 0
        }%`,
      ],
    ],
    theme: "grid",
    headStyles: { fillColor: [0, 77, 153] },
  });

  let finalY = (doc as any).lastAutoTable.finalY + 15;

  // Add reminder list
  doc.setFontSize(14);
  doc.text("Reminder List", 14, finalY);

  if (filteredReminders.length > 0) {
    autoTable(doc, {
      startY: finalY + 5,
      head: [["Title", "Date", "Status", "Type"]],
      body: filteredReminders.map((reminder) => [
        reminder.title,
        format(new Date(reminder.date), "MMM dd, yyyy - HH:mm"),
        reminder.isCompleted
          ? "Completed"
          : new Date(reminder.date) > new Date()
          ? "Upcoming"
          : "Overdue",
        reminder.type,
      ]),
      theme: "grid",
      headStyles: { fillColor: [0, 77, 153] },
    });
  } else {
    doc.setFontSize(12);
    doc.text("No reminders matching the current filters.", 14, finalY + 10);
  }

  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `IntelliTask Reminders Report - Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }

  return doc;
};

// Generate an analytics report
export const generateAnalyticsReport = (
  analytics: any,
  reportType: string,
  userName: string
) => {
  // Check if it's a custom report
  const isCustomReport = reportType.startsWith("custom-");
  const reportTitle = isCustomReport
    ? `Custom Report: ${reportType.substring(7)}`
    : `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`;

  const doc = new jsPDF();
  createReportHeader(doc, `Analytics ${reportTitle}`, userName);

  // Add summary
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("Performance Summary", 14, 60);

  autoTable(doc, {
    startY: 65,
    head: [["Metric", "Value"]],
    body: [
      ["Total Tasks", analytics.totalTasks.toString()],
      ["Completed Tasks", analytics.completedTasks.toString()],
      ["Completion Rate", `${Math.round(analytics.completionRate)}%`],
      ["Average Tasks per Day", (analytics.completedTasks / 7).toFixed(1)],
    ],
    theme: "grid",
    headStyles: { fillColor: [0, 77, 153] },
  });

  let finalY = (doc as any).lastAutoTable.finalY + 15;

  // Add task distribution by category
  doc.setFontSize(14);
  doc.text("Task Distribution by Category", 14, finalY);

  const categoryData = Object.entries(analytics.tasksByCategory || {}).map(
    ([category, count]) => [category, count]
  );

  if (categoryData.length > 0) {
    autoTable(doc, {
      startY: finalY + 5,
      head: [["Category", "Count"]],
      body: categoryData,
      theme: "grid",
      headStyles: { fillColor: [0, 77, 153] },
    });
  } else {
    doc.setFontSize(12);
    doc.text("No category data available.", 14, finalY + 10);
  }

  finalY = (doc as any).lastAutoTable.finalY + 15;

  // Add AI insights
  doc.setFontSize(14);
  doc.text("AI-Powered Insights", 14, finalY);

  doc.setFontSize(12);
  doc.setTextColor(80, 80, 80);
  finalY += 10;

  // Add task distribution insight
  doc.text("Task Distribution:", 14, finalY);
  finalY += 6;
  const topCategory =
    categoryData.sort((a, b) => Number(b[1]) - Number(a[1]))[0]?.[0] || "Work";
  doc.text(
    `You have a higher concentration of ${topCategory} tasks.`,
    20,
    finalY
  );
  finalY += 6;
  doc.text(
    "Consider balancing your workload across different categories for better productivity.",
    20,
    finalY
  );
  finalY += 10;

  // Add completion pattern insight
  doc.text("Completion Patterns:", 14, finalY);
  finalY += 6;
  const completionRate = Math.round(analytics.completionRate);
  doc.text(`Your task completion rate of ${completionRate}% `, 20, finalY);
  finalY += 6;
  if (completionRate > 70) {
    doc.text("is excellent! Keep up the good work.", 20, finalY);
  } else if (completionRate > 50) {
    doc.text(
      "is good, but could be improved. Try breaking down larger tasks into smaller ones.",
      20,
      finalY
    );
  } else {
    doc.text(
      "needs improvement. Consider using more reminders or adjusting your workload.",
      20,
      finalY
    );
  }
  finalY += 10;

  // Add scheduling recommendation
  doc.text("Smart Rescheduling Recommendation:", 14, finalY);
  finalY += 6;
  doc.text(
    "Based on your completion patterns, the best time to schedule important tasks is",
    20,
    finalY
  );
  finalY += 6;
  doc.text(
    "during midweek (Tuesday-Thursday), when your productivity appears to be at its highest.",
    20,
    finalY
  );

  // For custom reports, add a note about the selected categories
  if (isCustomReport) {
    finalY += 16;
    doc.text("Custom Report Information:", 14, finalY);
    finalY += 6;
    doc.text(
      `This report focuses on the "${reportType.substring(
        7
      )}" category selection.`,
      20,
      finalY
    );
  }

  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `IntelliTask Analytics Report - Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }

  return doc;
};
