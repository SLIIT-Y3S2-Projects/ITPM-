import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Send, Bot, X, RotateCw } from 'lucide-react';
import { useTaskContext } from '@/context/TaskContext';
import { suggestSmartReschedule } from '@/lib/smartReschedule';
import { toast } from 'sonner';
import VoiceInput from './VoiceInput';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const AITaskAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI assistant. I can help you reschedule missed tasks or answer questions about your tasks. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { tasks, updateTask } = useTaskContext();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageText,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    setTimeout(() => {
      processMessage(messageText);
    }, 1000);
  };
  
  const processMessage = (messageText: string) => {
    const text = messageText.toLowerCase();
    
    if (text.includes('reschedule') || text.includes('missed') || text.includes('overdue')) {
      const overdueTasksCount = tasks.filter(
        task => task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'completed'
      ).length;
      
      if (overdueTasksCount === 0) {
        respondWithMessage("You don't have any overdue tasks that need rescheduling. Good job staying on top of things!");
      } else {
        const overdueTasks = tasks.filter(
          task => task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'completed'
        );
        
        let response = `You have ${overdueTasksCount} overdue task${overdueTasksCount > 1 ? 's' : ''}. `;
        
        if (overdueTasksCount <= 3) {
          response += 'Here are your overdue tasks:\n\n';
          overdueTasks.forEach((task, index) => {
            const suggestion = suggestSmartReschedule(task._id!, tasks);
            response += `${index + 1}. "${task.title}" (due ${formatDate(new Date(task.dueDate!))})\n`;
            response += `   Suggestion: Reschedule to ${formatDate(suggestion.suggestedDueDate)} - ${suggestion.reason}\n\n`;
          });
          response += 'Would you like me to automatically reschedule any of these tasks? Just let me know which one by number or title.';
        } else {
          response += 'Would you like me to suggest new times for them? Let me know which task you want to reschedule first.';
        }
        
        respondWithMessage(response);
      }
      return;
    }
    
    const rescheduleMatch = text.match(/reschedule\s+(?:task\s+)?(\d+|"[^"]+"|'[^']+'|[a-z0-9 ]+)/i);
    if (rescheduleMatch) {
      const taskIdentifier = rescheduleMatch[1].replace(/^["']|["']$/g, '');
      
      if (/^\d+$/.test(taskIdentifier)) {
        const index = parseInt(taskIdentifier) - 1;
        const overdueTasks = tasks.filter(
          task => task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'completed'
        );
        
        if (index >= 0 && index < overdueTasks.length) {
          const task = overdueTasks[index];
          rescheduleTask(task._id!);
        } else {
          respondWithMessage(`I couldn't find task number ${parseInt(taskIdentifier)}. Please try again with a valid task number.`);
        }
      } else {
        const matchingTask = tasks.find(
          task => 
            task.status !== 'completed' && 
            task.dueDate && 
            isPast(new Date(task.dueDate)) && 
            task.title.toLowerCase().includes(taskIdentifier.toLowerCase())
        );
        
        if (matchingTask) {
          rescheduleTask(matchingTask._id!);
        } else {
          respondWithMessage(`I couldn't find a task with "${taskIdentifier}" in the title. Please try again.`);
        }
      }
      return;
    }
    
    if (text.includes('status') || text.includes('progress') || text.includes('how am i doing')) {
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(task => task.status === 'completed').length;
      const pendingTasks = totalTasks - completedTasks;
      const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      
      let response = `Here's your current progress:\n\n`;
      response += `Total Tasks: ${totalTasks}\n`;
      response += `Completed: ${completedTasks}\n`;
      response += `Pending: ${pendingTasks}\n`;
      response += `Completion Rate: ${completionRate}%\n\n`;
      
      if (completionRate >= 75) {
        response += "You're doing great! Keep up the good work!";
      } else if (completionRate >= 50) {
        response += "You're making good progress. Keep going!";
      } else {
        response += "You still have tasks to complete. Is there any way I can help you prioritize?";
      }
      
      respondWithMessage(response);
      return;
    }
    
    respondWithMessage(
      "I can help you reschedule missed tasks or check your task progress. Try asking me something like 'reschedule my missed tasks' or 'what's my task status?'"
    );
  };
  
  const isPast = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };
  
  const rescheduleTask = (taskId: string) => {
    const task = tasks.find(t => t._id === taskId);
    if (!task) {
      respondWithMessage("I couldn't find that task. Please try again.");
      return;
    }
    
    const suggestion = suggestSmartReschedule(taskId, tasks);
    
    updateTask(taskId, {
      dueDate: suggestion.suggestedDueDate.toISOString(),
      status: 'pending'
    });
    
    respondWithMessage(
      `I've rescheduled "${task.title}" to ${formatDate(suggestion.suggestedDueDate)}. ${suggestion.reason}`
    );
    toast.success(`Task "${task.title}" has been rescheduled`);
  };
  
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };
  
  const respondWithMessage = (content: string) => {
    const botMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'bot',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, botMessage]);
    setIsLoading(false);
  };
  
  const handleVoiceInput = (transcript: string) => {
    setInputValue(transcript);
  };

  return (
    <>
      <div 
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-30 shadow-lg"
        style={{ opacity: isOpen ? 0 : 1, pointerEvents: isOpen ? 'none' : 'auto' }}
      >
        <Button 
          onClick={() => setIsOpen(true)} 
          size="icon" 
          className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90"
        >
          <Bot className="h-6 w-6" />
        </Button>
      </div>
      
      {isOpen && (
        <div className="fixed inset-0 md:inset-auto md:bottom-6 md:right-6 md:w-96 md:h-[500px] bg-background border rounded-lg shadow-lg z-30 flex flex-col">
          <div className="flex items-center justify-between p-3 border-b">
            <div className="flex items-center">
              <Bot className="h-5 w-5 mr-2 text-primary" />
              <h3 className="font-medium">AI Task Assistant</h3>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}
                >
                  <div className="whitespace-pre-line">{message.content}</div>
                  <div 
                    className={`text-xs mt-1 ${
                      message.sender === 'user' 
                        ? 'text-primary-foreground/70' 
                        : 'text-muted-foreground'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-lg bg-muted">
                  <div className="flex items-center space-x-2">
                    <RotateCw className="h-4 w-4 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-3 border-t">
            <VoiceInput onTranscript={handleVoiceInput} />
            <div className="flex mt-2 space-x-2">
              <Input
                placeholder="Type a message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(inputValue);
                  }
                }}
              />
              <Button 
                size="icon" 
                onClick={() => handleSendMessage(inputValue)}
                disabled={inputValue.trim() === '' || isLoading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AITaskAssistant;
