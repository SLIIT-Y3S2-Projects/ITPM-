
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, User, LogOut, Settings } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useReminderContext } from '@/context/ReminderContext';

const Header: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useUserContext();
  const { upcomingReminders, overdueReminders } = useReminderContext();
  
  const totalNotifications = upcomingReminders.length + overdueReminders.length;
  
  const navLinks = [
    { path: '/', label: 'Dashboard' },
    { path: '/tasks', label: 'Tasks' },
    { path: '/reminders', label: 'Reminders' },
    { path: '/analytics', label: 'Analytics' },
  ];
  
  return (
    <header className="bg-white shadow-sm z-10 sticky top-0">
      <div className="page-container flex items-center justify-between py-4">
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-2xl font-bold text-primary">
            IntelliTask
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? 'nav-link-active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          {user && (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {totalNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {totalNotifications}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {overdueReminders.length > 0 && (
                    <DropdownMenuItem className="flex flex-col items-start p-3">
                      <span className="font-medium text-destructive">Overdue Reminders</span>
                      <span className="text-sm text-muted-foreground">
                        You have {overdueReminders.length} overdue {overdueReminders.length === 1 ? 'reminder' : 'reminders'}
                      </span>
                    </DropdownMenuItem>
                  )}
                  
                  {upcomingReminders.length > 0 && (
                    <DropdownMenuItem className="flex flex-col items-start p-3">
                      <span className="font-medium">Upcoming Reminders</span>
                      <span className="text-sm text-muted-foreground">
                        You have {upcomingReminders.length} upcoming {upcomingReminders.length === 1 ? 'reminder' : 'reminders'}
                      </span>
                    </DropdownMenuItem>
                  )}
                  
                  {totalNotifications === 0 && (
                    <DropdownMenuItem className="flex flex-col items-start p-3">
                      <span className="text-sm text-muted-foreground">No new notifications</span>
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/reminders" className="w-full cursor-pointer text-center font-medium text-primary">
                      View All
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src="" alt={user.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex cursor-pointer w-full">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex cursor-pointer w-full">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="flex cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
          
          {!user && (
            <Link to="/login">
              <Button variant="default">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
