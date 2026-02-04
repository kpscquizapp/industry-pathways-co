import React, { useState } from 'react';
import { 
  User, 
  Bell,
  Building2,
  CreditCard,
  Shield,
  Mail,
  Smartphone,
  Moon,
  Sun,
  Palette
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
import { toast } from 'sonner';

const ContractorSettings = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    jobAlerts: true,
    interviewReminders: true,
    paymentUpdates: true,
    weeklyDigest: false
  });
  
  const [bankInfo, setBankInfo] = useState({
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    accountType: 'savings',
    panNumber: '',
    gstNumber: ''
  });

  const handleBankInfoSave = () => {
    if (bankInfo.accountNumber !== bankInfo.confirmAccountNumber) {
      toast.error('Account numbers do not match');
      return;
    }
    if (!bankInfo.accountHolderName || !bankInfo.bankName || !bankInfo.accountNumber || !bankInfo.ifscCode) {
      toast.error('Please fill all required fields');
      return;
    }
    toast.success('Bank information saved successfully');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account, payments and preferences</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50 rounded-xl p-1 flex-wrap h-auto">
          <TabsTrigger value="account" className="rounded-lg px-4 py-2">Account</TabsTrigger>
          <TabsTrigger value="bank" className="rounded-lg px-4 py-2">Bank Details</TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg px-4 py-2">Notifications</TabsTrigger>
          <TabsTrigger value="appearance" className="rounded-lg px-4 py-2">Appearance</TabsTrigger>
        </TabsList>

        {/* Account Tab */}
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
                  <Label className="text-sm font-medium">Professional Title</Label>
                  <Input defaultValue="Full Stack Developer" className="mt-1.5" />
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Email Address</Label>
                <Input defaultValue="john@example.com" type="email" className="mt-1.5" />
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

        {/* Bank Details Tab */}
        <TabsContent value="bank" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Bank Account Information
              </CardTitle>
              <CardDescription>Add your bank details for receiving payments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Account Holder Name *</Label>
                <Input 
                  placeholder="Enter name as per bank account" 
                  className="mt-1.5"
                  value={bankInfo.accountHolderName}
                  onChange={(e) => setBankInfo({...bankInfo, accountHolderName: e.target.value})}
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Bank Name *</Label>
                <Input 
                  placeholder="e.g., State Bank of India" 
                  className="mt-1.5"
                  value={bankInfo.bankName}
                  onChange={(e) => setBankInfo({...bankInfo, bankName: e.target.value})}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Account Number *</Label>
                  <Input 
                    placeholder="Enter account number" 
                    className="mt-1.5"
                    type="password"
                    value={bankInfo.accountNumber}
                    onChange={(e) => setBankInfo({...bankInfo, accountNumber: e.target.value})}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Confirm Account Number *</Label>
                  <Input 
                    placeholder="Re-enter account number" 
                    className="mt-1.5"
                    value={bankInfo.confirmAccountNumber}
                    onChange={(e) => setBankInfo({...bankInfo, confirmAccountNumber: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">IFSC Code *</Label>
                  <Input 
                    placeholder="e.g., SBIN0001234" 
                    className="mt-1.5"
                    value={bankInfo.ifscCode}
                    onChange={(e) => setBankInfo({...bankInfo, ifscCode: e.target.value.toUpperCase()})}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Account Type</Label>
                  <Select 
                    value={bankInfo.accountType} 
                    onValueChange={(v) => setBankInfo({...bankInfo, accountType: v})}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="savings">Savings</SelectItem>
                      <SelectItem value="current">Current</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Tax Information
              </CardTitle>
              <CardDescription>Provide tax details for compliance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">PAN Number</Label>
                  <Input 
                    placeholder="e.g., ABCDE1234F" 
                    className="mt-1.5"
                    value={bankInfo.panNumber}
                    onChange={(e) => setBankInfo({...bankInfo, panNumber: e.target.value.toUpperCase()})}
                    maxLength={10}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">GST Number (Optional)</Label>
                  <Input 
                    placeholder="e.g., 22AAAAA0000A1Z5" 
                    className="mt-1.5"
                    value={bankInfo.gstNumber}
                    onChange={(e) => setBankInfo({...bankInfo, gstNumber: e.target.value.toUpperCase()})}
                    maxLength={15}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button className="rounded-xl" onClick={handleBankInfoSave}>
                  Save Bank Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
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
                      <p className="font-medium">Job Alerts</p>
                      <p className="text-sm text-muted-foreground">When new jobs match your profile</p>
                    </div>
                    <Switch 
                      checked={notifications.jobAlerts} 
                      onCheckedChange={(v) => setNotifications({...notifications, jobAlerts: v})}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                    <div>
                      <p className="font-medium">Interview Reminders</p>
                      <p className="text-sm text-muted-foreground">Reminders for scheduled interviews</p>
                    </div>
                    <Switch 
                      checked={notifications.interviewReminders} 
                      onCheckedChange={(v) => setNotifications({...notifications, interviewReminders: v})}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                    <div>
                      <p className="font-medium">Payment Updates</p>
                      <p className="text-sm text-muted-foreground">When payments are processed or pending</p>
                    </div>
                    <Switch 
                      checked={notifications.paymentUpdates} 
                      onCheckedChange={(v) => setNotifications({...notifications, paymentUpdates: v})}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                    <div>
                      <p className="font-medium">Weekly Digest</p>
                      <p className="text-sm text-muted-foreground">Weekly summary of activity and opportunities</p>
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

        {/* Appearance Tab */}
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

export default ContractorSettings;
