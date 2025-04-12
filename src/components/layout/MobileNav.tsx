
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ListTodo, Bell, PieChart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navLinks = [
  { path: '/', label: 'Dashboard', icon: Home },
  { path: '/tasks', label: 'Tasks', icon: ListTodo },
  { path: '/reminders', label: 'Reminders', icon: Bell },
  { path: '/analytics', label: 'Analytics', icon: PieChart },
];

const MobileNav: React.FC = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border">
      <div className="flex justify-between items-center h-16 px-4">
        {navLinks.slice(0, 3).map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={cn(
              "flex flex-col items-center justify-center w-16 h-16 transition-colors",
              location.pathname === link.path
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <link.icon className="h-5 w-5 mb-1" />
            <span className="text-xs">{link.label}</span>
          </Link>
        ))}
        
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="flex flex-col items-center justify-center w-16 h-16">
              <Menu className="h-5 w-5 mb-1" />
              <span className="text-xs">More</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[80%] sm:w-[350px] pt-12">
            <SheetHeader className="mb-6">
              <SheetTitle className="text-2xl font-bold text-primary">IntelliTask</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center px-4 py-3 rounded-md transition-colors",
                    location.pathname === link.path
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-secondary"
                  )}
                >
                  <link.icon className="h-5 w-5 mr-3" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}
              <div className="pt-4 border-t border-border">
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center px-4 py-3 rounded-md hover:bg-secondary"
                >
                  <span className="font-medium">Profile</span>
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setOpen(false)}
                  className="flex items-center px-4 py-3 rounded-md hover:bg-secondary"
                >
                  <span className="font-medium">Settings</span>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default MobileNav;
