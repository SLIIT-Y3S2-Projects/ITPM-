
import { Task } from '@/models/Task';

/**
 * Analyzes user schedule and suggests optimal times to reschedule missed tasks
 */
export function suggestSmartReschedule(
  taskId: string,
  existingTasks: Task[]
): { suggestedDueDate: Date; reason: string } {
  // Get the task to reschedule
  const task = existingTasks.find(t => t._id === taskId);
  
  if (!task) {
    // Fallback to tomorrow if task not found
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    return {
      suggestedDueDate: tomorrow,
      reason: "Couldn't find original task, rescheduled for tomorrow morning"
    };
  }
  
  // Get all non-completed tasks to analyze schedule
  const pendingTasks = existingTasks.filter(t => 
    t._id !== taskId && 
    t.status !== 'completed' && 
    t.dueDate
  );
  
  // Sort pending tasks by due date
  pendingTasks.sort((a, b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });
  
  // Get today and next 7 days for rescheduling window
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  // Find the best available slot in the next 7 days
  // Strategy: Look for days with fewer high-priority tasks
  const dayScores: Record<string, { score: number; date: Date }> = {};
  
  // Initialize scores for next 7 days
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const dateKey = date.toISOString().split('T')[0];
    dayScores[dateKey] = { score: 0, date: new Date(date) };
  }
  
  // Calculate schedule density for each day
  pendingTasks.forEach(t => {
    if (!t.dueDate) return;
    
    const taskDate = new Date(t.dueDate);
    const dateKey = taskDate.toISOString().split('T')[0];
    
    // Only consider tasks in the next 7 days
    if (taskDate >= today && taskDate <= nextWeek && dayScores[dateKey]) {
      // Add to the day's score based on priority
      const priorityScore = t.priority === 'high' ? 3 : t.priority === 'medium' ? 2 : 1;
      dayScores[dateKey].score += priorityScore;
    }
  });
  
  // Find the day with the lowest score (least busy)
  let bestDay = Object.entries(dayScores).sort(([, a], [, b]) => a.score - b.score)[0][1];
  
  // Set the time based on the priority of the original task
  let hour = 12; // Default to noon
  
  if (task.priority === 'high') {
    hour = 9; // Morning for high priority
  } else if (task.priority === 'medium') {
    hour = 12; // Noon for medium priority
  } else {
    hour = 15; // Afternoon for low priority
  }
  
  // Create the suggested date
  const suggestedDate = new Date(bestDay.date);
  suggestedDate.setHours(hour, 0, 0, 0);
  
  // Get day name for the reason
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = dayNames[suggestedDate.getDay()];
  
  // Generate reason based on the logic used
  let reason = `Rescheduled to ${dayName} at ${hour > 12 ? (hour - 12) + 'PM' : hour + 'AM'} `;
  
  if (bestDay.score === 0) {
    reason += "when your schedule appears to be clear.";
  } else if (bestDay.score < 3) {
    reason += "when you have few other commitments.";
  } else {
    reason += "which seems to be the least busy time in your schedule.";
  }
  
  return {
    suggestedDueDate: suggestedDate,
    reason
  };
}
