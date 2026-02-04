import React, { useState } from 'react';
import { 
  CreditCard, 
  Building2, 
  Shield, 
  Bell, 
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Save,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import SpinnerLoader from '@/components/loader/SpinnerLoader';

const ContractorSettings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [showRoutingNumber, setShowRoutingNumber] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [bankDetails, setBankDetails] = useState({
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    routingNumber: '',
    accountType: 'checking',
    swiftCode: '',
    iban: '',
  });

  const [notifications, setNotifications] = useState({
    emailJobMatches: true,
    emailInterviews: true,
    emailPayments: true,
    pushJobMatches: true,
    pushInterviews: true,
    pushPayments: false,
    weeklyDigest: true,
  });

  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    loginAlerts: true,
  });

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleBankInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBankDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveBankDetails = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast.success('Bank details saved successfully!');
  };

  const handleSaveNotifications = () => {
    toast.success('Notification preferences updated!');
  };

  const handleSaveSecurity = () => {
    toast.success('Security settings updated!');
  };

  const maskAccountNumber = (num: string) => {
    if (!num) return '';
    return '••••••' + num.slice(-4);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <SpinnerLoader className="w-10 h-10 text-primary" />
        <p className="text-muted-foreground animate-pulse">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="payment" className="w-full">
        <TabsList className="w-full justify-start bg-muted/50 p-1 rounded-xl mb-6">
          <TabsTrigger value="payment" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Payment
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Payment / Bank Details Tab */}
        <TabsContent value="payment" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    Bank Account Details
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Add your bank details to receive payments for completed contracts
                  </CardDescription>
                </div>
                {bankDetails.accountNumber && (
                  <Badge className="bg-primary/10 text-primary border-0">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="accountHolderName">Account Holder Name</Label>
                  <Input 
                    id="accountHolderName"
                    name="accountHolderName"
                    value={bankDetails.accountHolderName}
                    onChange={handleBankInputChange}
                    placeholder="Enter name as it appears on your bank account"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input 
                    id="bankName"
                    name="bankName"
                    value={bankDetails.bankName}
                    onChange={handleBankInputChange}
                    placeholder="e.g., Chase Bank, Bank of America"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <div className="relative">
                    <Input 
                      id="accountNumber"
                      name="accountNumber"
                      type={showAccountNumber ? 'text' : 'password'}
                      value={bankDetails.accountNumber}
                      onChange={handleBankInputChange}
                      placeholder="Enter account number"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAccountNumber(!showAccountNumber)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showAccountNumber ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="routingNumber">Routing Number</Label>
                  <div className="relative">
                    <Input 
                      id="routingNumber"
                      name="routingNumber"
                      type={showRoutingNumber ? 'text' : 'password'}
                      value={bankDetails.routingNumber}
                      onChange={handleBankInputChange}
                      placeholder="Enter routing number"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRoutingNumber(!showRoutingNumber)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showRoutingNumber ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountType">Account Type</Label>
                  <Select 
                    value={bankDetails.accountType} 
                    onValueChange={(value) => setBankDetails(prev => ({ ...prev, accountType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="checking">Checking</SelectItem>
                      <SelectItem value="savings">Savings</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="swiftCode">SWIFT/BIC Code (International)</Label>
                  <Input 
                    id="swiftCode"
                    name="swiftCode"
                    value={bankDetails.swiftCode}
                    onChange={handleBankInputChange}
                    placeholder="Optional for international transfers"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="iban">IBAN (International)</Label>
                  <Input 
                    id="iban"
                    name="iban"
                    value={bankDetails.iban}
                    onChange={handleBankInputChange}
                    placeholder="Optional for international transfers"
                  />
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-800 dark:text-amber-200">Security Notice</p>
                  <p className="text-amber-700 dark:text-amber-300 mt-1">
                    Your bank details are encrypted and stored securely. We never share your financial information with third parties.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSaveBankDetails} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <SpinnerLoader className="w-4 h-4 mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Bank Details
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Payment History Preview */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Payment Methods
              </CardTitle>
              <CardDescription>Manage your payout preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-6 text-center border-2 border-dashed border-border rounded-xl">
                <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="font-medium">No payment method added yet</p>
                <p className="text-sm text-muted-foreground mt-1">Add your bank details above to start receiving payments</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Email Notifications
              </CardTitle>
              <CardDescription>Choose what updates you receive via email</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Job Matches</p>
                  <p className="text-sm text-muted-foreground">Get notified when new jobs match your skills</p>
                </div>
                <Switch 
                  checked={notifications.emailJobMatches}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailJobMatches: checked }))}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Interview Updates</p>
                  <p className="text-sm text-muted-foreground">Receive updates about your interview progress</p>
                </div>
                <Switch 
                  checked={notifications.emailInterviews}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailInterviews: checked }))}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Payment Notifications</p>
                  <p className="text-sm text-muted-foreground">Get notified about payments and earnings</p>
                </div>
                <Switch 
                  checked={notifications.emailPayments}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailPayments: checked }))}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Weekly Digest</p>
                  <p className="text-sm text-muted-foreground">Receive a weekly summary of your activity</p>
                </div>
                <Switch 
                  checked={notifications.weeklyDigest}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, weeklyDigest: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Push Notifications</CardTitle>
              <CardDescription>Manage notifications on your devices</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Job Matches</p>
                  <p className="text-sm text-muted-foreground">Instant alerts for new job matches</p>
                </div>
                <Switch 
                  checked={notifications.pushJobMatches}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, pushJobMatches: checked }))}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Interview Reminders</p>
                  <p className="text-sm text-muted-foreground">Get reminded before your interviews</p>
                </div>
                <Switch 
                  checked={notifications.pushInterviews}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, pushInterviews: checked }))}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Payment Alerts</p>
                  <p className="text-sm text-muted-foreground">Real-time payment notifications</p>
                </div>
                <Switch 
                  checked={notifications.pushPayments}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, pushPayments: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSaveNotifications}>
              <Save className="w-4 h-4 mr-2" />
              Save Preferences
            </Button>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                Password
              </CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" placeholder="Enter current password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" placeholder="Enter new password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
              </div>
              <Button variant="outline">Update Password</Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Two-Factor Authentication
              </CardTitle>
              <CardDescription>Add an extra layer of security to your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Enable 2FA</p>
                  <p className="text-sm text-muted-foreground">Use an authenticator app for additional security</p>
                </div>
                <Switch 
                  checked={security.twoFactorEnabled}
                  onCheckedChange={(checked) => setSecurity(prev => ({ ...prev, twoFactorEnabled: checked }))}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Login Alerts</p>
                  <p className="text-sm text-muted-foreground">Get notified of new login attempts</p>
                </div>
                <Switch 
                  checked={security.loginAlerts}
                  onCheckedChange={(checked) => setSecurity(prev => ({ ...prev, loginAlerts: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg border-destructive/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Trash2 className="w-5 h-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>Irreversible actions for your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-destructive/5 rounded-xl">
                <div>
                  <p className="font-medium">Delete Account</p>
                  <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                </div>
                <Button variant="destructive" size="sm">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSaveSecurity}>
              <Save className="w-4 h-4 mr-2" />
              Save Security Settings
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContractorSettings;
