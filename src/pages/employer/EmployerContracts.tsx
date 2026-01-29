import React, { useState } from 'react';
import { 
  FileText, 
  DollarSign,
  Users,
  Building2,
  Download,
  Eye,
  Plus,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const contracts = [
  { 
    id: 1, 
    candidate: 'Sarah Chen', 
    role: 'Senior React Developer',
    type: 'contract',
    startDate: '2025-02-01',
    endDate: '2025-08-01',
    rate: '₹2,500/hr',
    status: 'active',
    totalBilled: '₹4,50,000'
  },
  { 
    id: 2, 
    candidate: 'Maria Silva', 
    role: 'React Native Specialist',
    type: 'contract',
    startDate: '2025-01-15',
    endDate: '2025-04-15',
    rate: '₹2,000/hr',
    status: 'active',
    totalBilled: '₹2,80,000'
  },
  { 
    id: 3, 
    candidate: 'James Wilson', 
    role: 'Frontend Architect',
    type: 'contract',
    startDate: '2024-10-01',
    endDate: '2025-01-01',
    rate: '₹3,000/hr',
    status: 'completed',
    totalBilled: '₹9,00,000'
  },
];

const invoices = [
  { id: 'INV-001', date: '2025-01-25', amount: '₹1,50,000', status: 'paid', contractor: 'Sarah Chen' },
  { id: 'INV-002', date: '2025-01-20', amount: '₹1,00,000', status: 'paid', contractor: 'Maria Silva' },
  { id: 'INV-003', date: '2025-01-15', amount: '₹1,50,000', status: 'pending', contractor: 'Sarah Chen' },
  { id: 'INV-004', date: '2025-01-10', amount: '₹80,000', status: 'pending', contractor: 'Maria Silva' },
];

const EmployerContracts = () => {
  const [activeTab, setActiveTab] = useState('contracts');

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        <Card className="border border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">3</p>
                <p className="text-xs text-muted-foreground">Active Contracts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">₹7.3L</p>
                <p className="text-xs text-muted-foreground">Total Billed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">₹2.3L</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">2</p>
                <p className="text-xs text-muted-foreground">Active Hires</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50 rounded-xl p-1">
          <TabsTrigger value="contracts" className="rounded-lg px-6">Contracts</TabsTrigger>
          <TabsTrigger value="billing" className="rounded-lg px-6">Billing</TabsTrigger>
          <TabsTrigger value="assignments" className="rounded-lg px-6">Assignments</TabsTrigger>
          <TabsTrigger value="company" className="rounded-lg px-6">Company Profile</TabsTrigger>
        </TabsList>

        {/* Contracts */}
        <TabsContent value="contracts" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-foreground">Contract List</h2>
            <Button className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="h-4 w-4 mr-2" />
              New Contract
            </Button>
          </div>
          <div className="space-y-4">
            {contracts.map((contract) => (
              <Card key={contract.id} className="hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-6 items-center">
                    <Avatar className="h-12 w-12 bg-gradient-to-br from-primary/30 to-green-400/30">
                      <AvatarFallback className="font-semibold text-primary">
                        {contract.candidate.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-[200px]">
                      <h3 className="font-semibold">{contract.candidate}</h3>
                      <p className="text-sm text-muted-foreground">{contract.role}</p>
                    </div>

                    <div className="text-center min-w-[120px]">
                      <p className="text-xs text-muted-foreground">Duration</p>
                      <p className="font-medium text-sm">{contract.startDate} → {contract.endDate}</p>
                    </div>

                    <div className="text-center min-w-[100px]">
                      <p className="text-xs text-muted-foreground">Rate</p>
                      <p className="font-bold text-primary">{contract.rate}</p>
                    </div>

                    <div className="text-center min-w-[100px]">
                      <p className="text-xs text-muted-foreground">Total Billed</p>
                      <p className="font-bold text-green-600">{contract.totalBilled}</p>
                    </div>

                    <Badge variant={contract.status === 'active' ? 'default' : 'secondary'}>
                      {contract.status === 'active' ? 'Active' : 'Completed'}
                    </Badge>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="rounded-lg">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="ghost" size="sm" className="rounded-lg">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Billing */}
        <TabsContent value="billing" className="mt-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Invoices */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Recent Invoices</CardTitle>
                  <Button variant="outline" size="sm" className="rounded-lg">
                    <Download className="h-4 w-4 mr-2" />
                    Export All
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {invoices.map((invoice) => (
                      <div key={invoice.id} className="flex items-center justify-between p-4 border border-border rounded-xl hover:border-primary/30 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{invoice.id}</p>
                            <p className="text-xs text-muted-foreground">{invoice.contractor} • {invoice.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold">{invoice.amount}</span>
                          {invoice.status === 'paid' ? (
                            <Badge className="bg-green-500 text-white">Paid</Badge>
                          ) : (
                            <Badge variant="secondary">Pending</Badge>
                          )}
                          {invoice.status === 'pending' && (
                            <Button size="sm" className="rounded-lg">
                              <CreditCard className="h-4 w-4 mr-1" />
                              Pay Now
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Summary */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Monthly Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">January 2025</span>
                    <span className="font-bold">₹4,80,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Paid</span>
                    <span className="text-green-600">₹2,50,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pending</span>
                    <span className="text-amber-600">₹2,30,000</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    Spending Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Your spending increased by 15% compared to last month
                  </p>
                  <Button variant="link" className="p-0 mt-2 text-primary">
                    View detailed report →
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Assignments */}
        <TabsContent value="assignments" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contracts.filter(c => c.status === 'active').map((assignment) => (
                  <div key={assignment.id} className="flex items-center justify-between p-4 border border-border rounded-xl">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10 bg-gradient-to-br from-primary/30 to-green-400/30">
                        <AvatarFallback className="font-semibold text-primary text-sm">
                          {assignment.candidate.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{assignment.candidate}</p>
                        <p className="text-sm text-muted-foreground">{assignment.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Rate</p>
                        <p className="font-medium">{assignment.rate}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">End Date</p>
                        <p className="font-medium">{assignment.endDate}</p>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-lg">Manage</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Company Profile */}
        <TabsContent value="company" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-green-400/20 flex items-center justify-center">
                  <Building2 className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <Button variant="outline" size="sm" className="rounded-lg">
                    Upload Logo
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">Recommended: 400x400px, PNG or JPG</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Company Name</Label>
                  <Input defaultValue="InnovateLab Inc." className="mt-1.5" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Industry</Label>
                  <Input defaultValue="Technology / Software" className="mt-1.5" />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Company Description</Label>
                <Textarea 
                  defaultValue="We are a fast-growing technology company focused on building innovative solutions for enterprise clients."
                  rows={4}
                  className="mt-1.5 resize-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Website</Label>
                  <Input defaultValue="https://innovatelab.com" className="mt-1.5" />
                </div>
                <div>
                  <Label className="text-sm font-medium">Location</Label>
                  <Input defaultValue="Bangalore, India" className="mt-1.5" />
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="rounded-xl">Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployerContracts;
