import React from 'react';
import { 
  Settings, 
  Bell, 
  Lock, 
  Palette, 
  CreditCard,
  Shield,
  Eye,
  Moon,
  Sun
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import SpinnerLoader from '@/components/loader/SpinnerLoader';

const ContractorSettings = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [notifications, setNotifications] = React.useState({
    emailJobAlerts: true,
    emailInterviews: true,
    pushNotifications: true,
    marketingEmails: false,
  });

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <SpinnerLoader className="w-10 h-10 text-primary" />
        <p className="text-muted-foreground animate-pulse">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and security</p>
      </div>

      {/* Account Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Account Security
          </CardTitle>
          <CardDescription>Manage your password and security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Current Password</Label>
            <Input type="password" placeholder="••••••••" className="rounded-xl" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input type="password" placeholder="••••••••" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Confirm Password</Label>
              <Input type="password" placeholder="••••••••" className="rounded-xl" />
            </div>
          </div>
          <Button className="rounded-xl" onClick={() => toast.success('Password updated successfully!')}>
            Update Password
          </Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Notifications
          </CardTitle>
          <CardDescription>Configure how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Job Alert Emails</p>
              <p className="text-sm text-muted-foreground">Receive emails for new job matches</p>
            </div>
            <Switch 
              checked={notifications.emailJobAlerts}
              onCheckedChange={(v) => setNotifications({...notifications, emailJobAlerts: v})}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Interview Notifications</p>
              <p className="text-sm text-muted-foreground">Get notified about interview updates</p>
            </div>
            <Switch 
              checked={notifications.emailInterviews}
              onCheckedChange={(v) => setNotifications({...notifications, emailInterviews: v})}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Push Notifications</p>
              <p className="text-sm text-muted-foreground">Browser push notifications</p>
            </div>
            <Switch 
              checked={notifications.pushNotifications}
              onCheckedChange={(v) => setNotifications({...notifications, pushNotifications: v})}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Marketing Emails</p>
              <p className="text-sm text-muted-foreground">Receive tips and product updates</p>
            </div>
            <Switch 
              checked={notifications.marketingEmails}
              onCheckedChange={(v) => setNotifications({...notifications, marketingEmails: v})}
            />
          </div>
        </CardContent>
      </Card>

      {/* Profile Visibility */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" />
            Profile Visibility
          </CardTitle>
          <CardDescription>Control who can see your profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Visible to Employers</p>
              <p className="text-sm text-muted-foreground">Allow employers to find your profile</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Show Contact Info</p>
              <p className="text-sm text-muted-foreground">Display email and phone to matched employers</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions for your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="destructive" 
            className="rounded-xl"
            onClick={() => toast.error('Account deletion requires confirmation via email')}
          >
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContractorSettings;
