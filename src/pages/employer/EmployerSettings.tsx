import React, { useState } from 'react';
import { 
  User, 
  Bell,
  Link2,
  Palette,
  Shield,
  Key,
  Mail,
  Smartphone,
  Globe,
  Moon,
  Sun
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const EmployerSettings = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    newCandidates: true,
    testCompleted: true,
    interviewCompleted: true,
    weeklyDigest: false
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50 rounded-xl p-1">
          <TabsTrigger value="account" className="rounded-lg px-6">Account</TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg px-6">Notifications</TabsTrigger>
          <TabsTrigger value="integrations" className="rounded-lg px-6">Integrations</TabsTrigger>
          <TabsTrigger value="appearance" className="rounded-lg px-6">Appearance</TabsTrigger>
        </TabsList>

        {/* Account */}
        <TabsContent value="account" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Personal Information
              </CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Full Name</Label>
                  <Input defaultValue="John Doe" className="mt-1.5" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Job Title</Label>
                  <Input defaultValue="Hiring Manager" className="mt-1.5" />
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Email Address</Label>
                <Input defaultValue="john@innovatelab.com" type="email" className="mt-1.5" />
              </div>
              <div>
                <Label className="text-sm font-medium">Phone Number</Label>
                <Input defaultValue="+91 98765 43210" type="tel" className="mt-1.5" />
              </div>
              <div className="flex justify-end">
                <Button className="rounded-xl">Save Changes</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Security
              </CardTitle>
              <CardDescription>Manage your password and security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Current Password</Label>
                <Input type="password" placeholder="Enter current password" className="mt-1.5" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">New Password</Label>
                  <Input type="password" placeholder="Enter new password" className="mt-1.5" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Confirm New Password</Label>
                  <Input type="password" placeholder="Confirm new password" className="mt-1.5" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" className="rounded-xl">Update Password</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Choose how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Channels</h3>
                <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive updates via email</p>
                    </div>
                  </div>
                  <Switch 
                    checked={notifications.email} 
                    onCheckedChange={(v) => setNotifications({...notifications, email: v})}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive push notifications in browser</p>
                    </div>
                  </div>
                  <Switch 
                    checked={notifications.push} 
                    onCheckedChange={(v) => setNotifications({...notifications, push: v})}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Events</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                    <div>
                      <p className="font-medium">New Candidate Matches</p>
                      <p className="text-sm text-muted-foreground">When AI finds new matching candidates</p>
                    </div>
                    <Switch 
                      checked={notifications.newCandidates} 
                      onCheckedChange={(v) => setNotifications({...notifications, newCandidates: v})}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                    <div>
                      <p className="font-medium">Test Completed</p>
                      <p className="text-sm text-muted-foreground">When a candidate completes a skill test</p>
                    </div>
                    <Switch 
                      checked={notifications.testCompleted} 
                      onCheckedChange={(v) => setNotifications({...notifications, testCompleted: v})}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                    <div>
                      <p className="font-medium">Interview Completed</p>
                      <p className="text-sm text-muted-foreground">When a candidate finishes an AI interview</p>
                    </div>
                    <Switch 
                      checked={notifications.interviewCompleted} 
                      onCheckedChange={(v) => setNotifications({...notifications, interviewCompleted: v})}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                    <div>
                      <p className="font-medium">Weekly Digest</p>
                      <p className="text-sm text-muted-foreground">Weekly summary of hiring activity</p>
                    </div>
                    <Switch 
                      checked={notifications.weeklyDigest} 
                      onCheckedChange={(v) => setNotifications({...notifications, weeklyDigest: v})}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="h-5 w-5 text-primary" />
                Connected Integrations
              </CardTitle>
              <CardDescription>Connect external services to enhance your workflow</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Globe className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium">LinkedIn</p>
                    <p className="text-sm text-muted-foreground">Import candidate profiles</p>
                  </div>
                </div>
                <Button variant="outline" className="rounded-xl">Connect</Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <Key className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium">Slack</p>
                    <p className="text-sm text-muted-foreground">Get notifications in Slack</p>
                  </div>
                </div>
                <Button variant="outline" className="rounded-xl">Connect</Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <Mail className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="font-medium">Google Calendar</p>
                    <p className="text-sm text-muted-foreground">Sync interview schedules</p>
                  </div>
                </div>
                <Button variant="outline" className="rounded-xl">Connect</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance */}
        <TabsContent value="appearance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Appearance
              </CardTitle>
              <CardDescription>Customize how the dashboard looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-sm font-medium mb-3 block">Theme</Label>
                <div className="grid grid-cols-3 gap-4">
                  <button className="p-4 border-2 border-primary rounded-xl text-center">
                    <Sun className="h-6 w-6 mx-auto mb-2 text-amber-500" />
                    <span className="text-sm font-medium">Light</span>
                  </button>
                  <button className="p-4 border border-border rounded-xl text-center hover:border-primary/50 transition-colors">
                    <Moon className="h-6 w-6 mx-auto mb-2 text-slate-500" />
                    <span className="text-sm font-medium">Dark</span>
                  </button>
                  <button className="p-4 border border-border rounded-xl text-center hover:border-primary/50 transition-colors">
                    <div className="w-6 h-6 mx-auto mb-2 rounded-full bg-gradient-to-r from-amber-400 to-slate-600" />
                    <span className="text-sm font-medium">System</span>
                  </button>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger className="mt-1.5 w-full max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                    <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                    <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Timezone</Label>
                <Select defaultValue="ist">
                  <SelectTrigger className="mt-1.5 w-full max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ist">IST (India Standard Time)</SelectItem>
                    <SelectItem value="pst">PST (Pacific Standard Time)</SelectItem>
                    <SelectItem value="est">EST (Eastern Standard Time)</SelectItem>
                    <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployerSettings;
