
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PreferencesForm from '@/components/profile/PreferencesForm';
import { useUserContext } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Clock, Lock, BellRing, Eye, HelpCircle } from 'lucide-react';

const Settings: React.FC = () => {
  const { user } = useUserContext();
  
  if (!user) {
    return (
      <Layout>
        <div className="page-container">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="mt-4">Please log in to view settings.</p>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="page-container">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Settings</h1>
        
        <Tabs defaultValue="preferences" className="mb-8">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>
          
          <TabsContent value="preferences">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>User Preferences</CardTitle>
                <CardDescription>
                  Customize how you interact with the application.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PreferencesForm />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure when and how you want to be notified.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <BellRing className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-medium">Notification Overview</h3>
                      <p className="text-sm text-muted-foreground">
                        Manage your notification preferences across the application.
                      </p>
                    </div>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Notification Type</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Push</TableHead>
                        <TableHead>Silent Mode</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Task Reminders</TableCell>
                        <TableCell className="text-center">
                          <span className="inline-block w-5 h-5 bg-green-500 rounded-full"></span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="inline-block w-5 h-5 bg-green-500 rounded-full"></span>
                        </TableCell>
                        <TableCell className="text-center">
                          {user.preferences.notificationSettings.silent ? (
                            <span className="inline-block w-5 h-5 bg-green-500 rounded-full"></span>
                          ) : (
                            <span className="inline-block w-5 h-5 bg-gray-300 rounded-full"></span>
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Task Completions</TableCell>
                        <TableCell className="text-center">
                          <span className="inline-block w-5 h-5 bg-green-500 rounded-full"></span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="inline-block w-5 h-5 bg-gray-300 rounded-full"></span>
                        </TableCell>
                        <TableCell className="text-center">
                          {user.preferences.notificationSettings.silent ? (
                            <span className="inline-block w-5 h-5 bg-green-500 rounded-full"></span>
                          ) : (
                            <span className="inline-block w-5 h-5 bg-gray-300 rounded-full"></span>
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Weekly Reports</TableCell>
                        <TableCell className="text-center">
                          <span className="inline-block w-5 h-5 bg-green-500 rounded-full"></span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="inline-block w-5 h-5 bg-gray-300 rounded-full"></span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="inline-block w-5 h-5 bg-gray-300 rounded-full"></span>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  
                  <div className="pt-4">
                    <Button>
                      Save Notification Settings
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your account security and privacy settings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Lock className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-medium">Security Overview</h3>
                      <p className="text-sm text-muted-foreground">
                        Manage your security settings and account protection.
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-secondary/50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Change Password</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        We recommend changing your password regularly for increased security.
                      </p>
                      <Button variant="outline">Change Password</Button>
                    </div>
                    
                    <div className="bg-secondary/50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Add an extra layer of security to your account by enabling two-factor authentication.
                      </p>
                      <Button variant="outline">Enable 2FA</Button>
                    </div>
                    
                    <div className="bg-secondary/50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Privacy Settings</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Control what data is collected and used to personalize your experience.
                      </p>
                      <Button variant="outline">Manage Privacy</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="support">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Help & Support</CardTitle>
                <CardDescription>
                  Get help with using the application and troubleshooting issues.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <HelpCircle className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-medium">Support Resources</h3>
                      <p className="text-sm text-muted-foreground">
                        Find help and support for using IntelliTask effectively.
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-secondary/50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Documentation</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Read comprehensive guides and tutorials on using all features.
                      </p>
                      <Button variant="outline">View Documentation</Button>
                    </div>
                    
                    <div className="bg-secondary/50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">FAQ</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Find answers to commonly asked questions and troubleshooting tips.
                      </p>
                      <Button variant="outline">View FAQ</Button>
                    </div>
                    
                    <div className="bg-secondary/50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Contact Support</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Get in touch with our support team for personalized assistance.
                      </p>
                      <Button variant="outline">Contact Support</Button>
                    </div>
                    
                    <div className="bg-secondary/50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Report a Bug</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Found an issue? Let us know so we can fix it quickly.
                      </p>
                      <Button variant="outline">Report Bug</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
