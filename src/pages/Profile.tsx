
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ProfileForm from '@/components/profile/ProfileForm';
import PreferencesForm from '@/components/profile/PreferencesForm';
import { useUserContext } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { format } from 'date-fns';

const Profile: React.FC = () => {
  const { user, generateUserReport, deleteAccount } = useUserContext();
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  
  if (!user) {
    return (
      <Layout>
        <div className="page-container">
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="mt-4">Please log in to view your profile.</p>
        </div>
      </Layout>
    );
  }
  
  const userReport = generateUserReport();
  
  return (
    <Layout>
      <div className="page-container">
        <h1 className="text-3xl font-bold tracking-tight mb-8">User Profile</h1>
        
        <Tabs defaultValue="profile" className="mb-8">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="profile">Profile Information</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information here.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileForm />
              </CardContent>
            </Card>
          </TabsContent>
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
        </Tabs>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Activity Summary</CardTitle>
              <CardDescription>
                Your activity stats since joining
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="font-medium">Tasks Created</span>
                  <span className="text-xl font-bold">{userReport.tasksCreated}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="font-medium">Tasks Completed</span>
                  <span className="text-xl font-bold">{userReport.tasksCompleted}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="font-medium">Reminders Set</span>
                  <span className="text-xl font-bold">{userReport.remindersSet}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="font-medium">Account Age</span>
                  <span className="text-xl font-bold">{userReport.accountAge} days</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Details about your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="font-medium">Email</span>
                  <span className="text-muted-foreground">{user.email}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="font-medium">Account Created</span>
                  <span className="text-muted-foreground">{format(new Date(user.createdAt), 'MMMM d, yyyy')}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="font-medium">Last Updated</span>
                  <span className="text-muted-foreground">{format(new Date(user.updatedAt), 'MMMM d, yyyy')}</span>
                </div>
                <div className="pt-4">
                  <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <DialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        Delete Account
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-destructive" />
                          Delete Account
                        </DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently delete your account and remove all your data.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <p className="font-medium">Are you absolutely sure you want to delete your account?</p>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                          Cancel
                        </Button>
                        <Button variant="destructive" onClick={deleteAccount}>
                          Yes, Delete My Account
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
