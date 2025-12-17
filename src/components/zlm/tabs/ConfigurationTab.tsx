import { useState } from 'react';
import { Settings, CreditCard, Wallet, PiggyBank, Building2, Users, FileText, Shield, Sparkles, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';

interface SettingDetail {
  area: string;
  setting: string;
  value: string;
  derivedValue?: string;
  confidence: number;
  rationale: string;
}

interface SettingCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  settingsInferred: number;
  totalSettings: number;
  status: string;
  details: SettingDetail[];
}

const settingCategories: SettingCategory[] = [
  {
    id: 'admin',
    title: 'Admin Settings',
    description: 'User roles, permissions, and system configuration',
    icon: Shield,
    settingsInferred: 12,
    totalSettings: 15,
    status: 'completed',
    details: [
      { area: 'User Management', setting: 'Max Users', value: '500', derivedValue: 'Enterprise Tier', confidence: 95, rationale: 'Based on current user count and growth rate' },
      { area: 'User Management', setting: 'Session Timeout', value: '30 minutes', derivedValue: '1800 seconds', confidence: 88, rationale: 'Industry standard for security compliance' },
      { area: 'Permissions', setting: 'Role Hierarchy', value: 'Admin > Manager > User', confidence: 92, rationale: 'Derived from existing permission structure' },
      { area: 'Permissions', setting: 'Default Role', value: 'User', confidence: 100, rationale: 'Most common role assignment in system' },
      { area: 'Security', setting: 'MFA Required', value: 'Yes', derivedValue: 'TOTP', confidence: 85, rationale: 'Compliance requirement detected' },
    ],
  },
  {
    id: 'billing',
    title: 'Billing Settings',
    description: 'Invoice templates, billing cycles, and rules',
    icon: FileText,
    settingsInferred: 8,
    totalSettings: 10,
    status: 'completed',
    details: [
      { area: 'Subscription Settings', setting: 'Term Type', value: 'Termed', derivedValue: 'Fixed Duration', confidence: 94, rationale: 'All subscriptions have defined end dates' },
      { area: 'Subscription Settings', setting: 'Initial Term', value: '12 months', derivedValue: '365 days', confidence: 91, rationale: 'Most common term length in contracts' },
      { area: 'Subscription Settings', setting: 'Renewal Term', value: '12 months', derivedValue: '365 days', confidence: 89, rationale: 'Matches initial term pattern' },
      { area: 'Subscription Settings', setting: 'Auto Renewal', value: 'Enabled', derivedValue: 'true', confidence: 87, rationale: 'Default behavior observed in renewals' },
      { area: 'Account Settings', setting: 'Invoice Delivery', value: 'Email', confidence: 96, rationale: 'Primary delivery method in customer preferences' },
      { area: 'Account Settings', setting: 'Payment Terms', value: 'Net 30', derivedValue: '30 days', confidence: 93, rationale: 'Standard payment terms in invoices' },
      { area: 'Invoice Settings', setting: 'Currency', value: 'USD', derivedValue: 'US Dollar', confidence: 98, rationale: 'Primary currency in all transactions' },
      { area: 'Invoice Settings', setting: 'Tax Inclusive', value: 'No', derivedValue: 'Tax calculated separately', confidence: 90, rationale: 'Tax line items present on invoices' },
    ],
  },
  {
    id: 'payment',
    title: 'Payment Settings',
    description: 'Payment gateways, methods, and processing',
    icon: CreditCard,
    settingsInferred: 5,
    totalSettings: 8,
    status: 'in_progress',
    details: [
      { area: 'Gateway Settings', setting: 'Primary Gateway', value: 'Stripe', confidence: 100, rationale: 'Gateway ID detected in payment records' },
      { area: 'Gateway Settings', setting: 'Retry Attempts', value: '3', derivedValue: 'Max retries', confidence: 82, rationale: 'Common retry pattern observed' },
      { area: 'Method Settings', setting: 'Accepted Cards', value: 'Visa, MC, Amex', confidence: 95, rationale: 'Card types in successful transactions' },
      { area: 'Method Settings', setting: 'ACH Enabled', value: 'Yes', confidence: 88, rationale: 'ACH transactions present in data' },
      { area: 'Processing', setting: 'Settlement Time', value: 'T+2', derivedValue: '2 business days', confidence: 75, rationale: 'Average settlement time calculated' },
    ],
  },
  {
    id: 'finance',
    title: 'Finance Settings',
    description: 'Revenue recognition, accounting periods',
    icon: PiggyBank,
    settingsInferred: 14,
    totalSettings: 20,
    status: 'in_progress',
    details: [
      { area: 'Revenue Recognition', setting: 'Recognition Method', value: 'Ratable', derivedValue: 'Daily proration', confidence: 92, rationale: 'Revenue spread evenly across term' },
      { area: 'Revenue Recognition', setting: 'Recognition Start', value: 'Service Start Date', confidence: 88, rationale: 'Revenue begins with service activation' },
      { area: 'Accounting Period', setting: 'Fiscal Year End', value: 'December', derivedValue: 'Calendar year', confidence: 94, rationale: 'Financial statements follow calendar year' },
      { area: 'Accounting Period', setting: 'Period Type', value: 'Monthly', confidence: 96, rationale: 'Monthly close process detected' },
      { area: 'Journal Entry', setting: 'Auto Post', value: 'Enabled', confidence: 85, rationale: 'Journal entries posted automatically' },
      { area: 'Journal Entry', setting: 'Entry Template', value: 'Standard', confidence: 80, rationale: 'Default template in use' },
    ],
  },
  {
    id: 'tenant',
    title: 'Tenant Settings',
    description: 'Multi-tenant configuration and isolation',
    icon: Building2,
    settingsInferred: 6,
    totalSettings: 6,
    status: 'completed',
    details: [
      { area: 'Isolation', setting: 'Data Isolation', value: 'Schema-based', confidence: 100, rationale: 'Separate schemas per tenant detected' },
      { area: 'Isolation', setting: 'Tenant ID Field', value: 'tenant_id', confidence: 100, rationale: 'Field present in all tables' },
      { area: 'Configuration', setting: 'Branding', value: 'Per-tenant', confidence: 90, rationale: 'Custom logos and colors per tenant' },
      { area: 'Configuration', setting: 'Feature Flags', value: 'Enabled', confidence: 88, rationale: 'Feature toggles vary by tenant' },
      { area: 'Limits', setting: 'Storage Quota', value: '100 GB', confidence: 85, rationale: 'Standard allocation per tenant' },
      { area: 'Limits', setting: 'API Rate Limit', value: '1000/min', confidence: 82, rationale: 'Rate limiting configured per tenant' },
    ],
  },
  {
    id: 'user',
    title: 'User Settings',
    description: 'User preferences and notification settings',
    icon: Users,
    settingsInferred: 3,
    totalSettings: 7,
    status: 'pending',
    details: [
      { area: 'Notifications', setting: 'Email Alerts', value: 'Enabled', confidence: 78, rationale: 'Email notifications configured' },
      { area: 'Notifications', setting: 'Alert Frequency', value: 'Immediate', confidence: 72, rationale: 'Real-time alerts observed' },
      { area: 'Preferences', setting: 'Timezone', value: 'UTC', confidence: 65, rationale: 'Default timezone in system' },
    ],
  },
];

export function ConfigurationTab() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<SettingCategory | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">In Progress</Badge>;
      default:
        return <Badge variant="secondary">Not Started</Badge>;
    }
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 90) {
      return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">{confidence}%</Badge>;
    } else if (confidence >= 75) {
      return <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">{confidence}%</Badge>;
    }
    return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">{confidence}%</Badge>;
  };

  const totalInferred = settingCategories.reduce((sum, cat) => sum + cat.settingsInferred, 0);
  const totalSettings = settingCategories.reduce((sum, cat) => sum + cat.totalSettings, 0);

  // Detail View
  if (selectedCategory) {
    const Icon = selectedCategory.icon;
    return (
      <div className="space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setSelectedCategory(null)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{selectedCategory.title}</h2>
              <p className="text-sm text-muted-foreground">{selectedCategory.description}</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-3">
            {getStatusBadge(selectedCategory.status)}
            <Card className="px-4 py-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{selectedCategory.settingsInferred}/{selectedCategory.totalSettings} Inferred</span>
              </div>
            </Card>
          </div>
        </div>

        {/* Settings Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Inferred Settings Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Area</TableHead>
                  <TableHead className="w-[150px]">Setting</TableHead>
                  <TableHead className="w-[120px]">Value</TableHead>
                  <TableHead className="w-[120px]">Derived Value</TableHead>
                  <TableHead className="w-[100px]">Confidence</TableHead>
                  <TableHead>Rationale</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedCategory.details.map((detail, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{detail.area}</TableCell>
                    <TableCell>{detail.setting}</TableCell>
                    <TableCell>
                      <code className="px-2 py-1 bg-muted rounded text-sm">{detail.value}</code>
                    </TableCell>
                    <TableCell>
                      {detail.derivedValue ? (
                        <span className="text-muted-foreground text-sm">{detail.derivedValue}</span>
                      ) : (
                        <span className="text-muted-foreground/50">—</span>
                      )}
                    </TableCell>
                    <TableCell>{getConfidenceBadge(detail.confidence)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{detail.rationale}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Cards View
  return (
    <div className="space-y-6">
      {/* Summary Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Configuration Settings</h2>
          <p className="text-sm text-muted-foreground">AI-inferred settings across all categories</p>
        </div>
        <Card className="px-4 py-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{totalInferred}/{totalSettings} Settings Inferred</span>
          </div>
        </Card>
      </div>

      {/* Settings Category Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {settingCategories.map((category) => {
          const Icon = category.icon;
          const inferencePercent = Math.round((category.settingsInferred / category.totalSettings) * 100);
          
          return (
            <Card 
              key={category.id} 
              className="group hover:shadow-md transition-all cursor-pointer hover:border-primary/50"
              onClick={() => setSelectedCategory(category)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  {getStatusBadge(category.status)}
                </div>
                <CardTitle className="text-base mt-3">{category.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Inference Metric */}
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Settings Inferred</span>
                    </div>
                    <span className="text-lg font-bold text-primary">{category.settingsInferred}</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Inference Progress</span>
                      <span>{inferencePercent}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${inferencePercent}%` }}
                      />
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground text-center">
                    {category.settingsInferred} of {category.totalSettings} settings configured
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
