import { useState } from 'react';
import { CreditCard, PiggyBank, Building2, Users, FileText, Shield, Sparkles, ArrowLeft, Pencil, Check, X, Trash2, MoveRight, MoreHorizontal, Download, Settings, Play, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

type SettingStatus = 'configured' | 'pending' | 'not_configured';
type ValueSource = 'default' | 'inferred';

interface SettingDetail {
  id: string;
  area: string;
  setting: string;
  value: string;
  defaultValue: string;
  derivedValue?: string;
  confidence: number;
  rationale: string;
  status: SettingStatus;
  configuredSource?: ValueSource;
  isInferred: boolean;
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

// Helper to generate non-inferred settings
const generateNonInferredSettings = (categoryId: string, areaPrefix: string, startIndex: number, count: number): SettingDetail[] => {
  const settingNames = [
    'Threshold Limit', 'Timeout Duration', 'Retry Count', 'Max Connections', 'Buffer Size',
    'Cache TTL', 'Rate Limit', 'Batch Size', 'Queue Depth', 'Thread Pool Size',
    'Memory Limit', 'Disk Quota', 'Network Bandwidth', 'CPU Priority', 'Log Level',
    'Encryption Type', 'Compression Mode', 'Sync Interval', 'Backup Frequency', 'Archive Period',
    'Notification Delay', 'Alert Threshold', 'Audit Retention', 'Session Limit', 'Token Expiry',
    'Request Timeout', 'Response Buffer', 'Connection Pool', 'Worker Threads', 'Event Queue',
    'Data Partition', 'Index Strategy', 'Query Cache', 'Lock Timeout', 'Transaction Isolation',
    'Replication Lag', 'Failover Mode', 'Load Balance', 'Health Check', 'Circuit Breaker',
    'Feature Toggle', 'A/B Test Split', 'Rollout Percent', 'Canary Weight', 'Dark Launch',
    'Metric Sample', 'Trace Sample', 'Log Sample', 'Profile Interval', 'Benchmark Mode'
  ];
  const areas = ['General', 'Advanced', 'Performance', 'Security', 'Integration', 'Compliance', 'Reporting'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `${categoryId}-ni-${startIndex + i}`,
    area: `${areaPrefix} ${areas[i % areas.length]}`,
    setting: settingNames[i % settingNames.length] + (Math.floor(i / settingNames.length) > 0 ? ` ${Math.floor(i / settingNames.length) + 1}` : ''),
    value: '-',
    defaultValue: ['100', '30', '5', '1000', '256', 'Medium', 'Enabled', 'Auto', 'Standard', 'Default'][i % 10],
    confidence: 0,
    rationale: 'Awaiting AI analysis - no data available for inference',
    status: 'not_configured' as SettingStatus,
    isInferred: false,
  }));
};

const initialSettingCategories: SettingCategory[] = [
  {
    id: 'admin',
    title: 'Admin Settings',
    description: 'User roles, permissions, and system configuration',
    icon: Shield,
    settingsInferred: 12,
    totalSettings: 100,
    status: 'completed',
    details: [
      { id: 'admin-1', area: 'User Management', setting: 'Max Users', value: '500', defaultValue: '100', derivedValue: 'Enterprise Tier', confidence: 95, rationale: 'Based on current user count and growth rate', status: 'configured', isInferred: true },
      { id: 'admin-2', area: 'User Management', setting: 'Session Timeout', value: '30 minutes', defaultValue: '15 minutes', derivedValue: '1800 seconds', confidence: 88, rationale: 'Industry standard for security compliance', status: 'configured', isInferred: true },
      { id: 'admin-3', area: 'Permissions', setting: 'Role Hierarchy', value: 'Admin > Manager > User', defaultValue: 'Admin > User', confidence: 92, rationale: 'Derived from existing permission structure', status: 'pending', isInferred: true },
      { id: 'admin-4', area: 'Permissions', setting: 'Default Role', value: 'User', defaultValue: 'Guest', confidence: 100, rationale: 'Most common role assignment in system', status: 'configured', isInferred: true },
      { id: 'admin-5', area: 'Security', setting: 'MFA Required', value: 'Yes', defaultValue: 'No', derivedValue: 'TOTP', confidence: 85, rationale: 'Compliance requirement detected', status: 'not_configured', isInferred: true },
      { id: 'admin-6', area: 'Security', setting: 'Password Policy', value: 'Strong', defaultValue: 'Medium', confidence: 90, rationale: 'Based on security audit requirements', status: 'configured', isInferred: true },
      { id: 'admin-7', area: 'User Management', setting: 'Auto Lockout', value: '5 attempts', defaultValue: '3 attempts', confidence: 87, rationale: 'Configured based on security standards', status: 'pending', isInferred: true },
      { id: 'admin-8', area: 'Audit', setting: 'Log Retention', value: '90 days', defaultValue: '30 days', confidence: 91, rationale: 'Compliance requirement for audit trails', status: 'configured', isInferred: true },
      { id: 'admin-9', area: 'Audit', setting: 'Activity Tracking', value: 'Enabled', defaultValue: 'Disabled', confidence: 94, rationale: 'User activity logging detected', status: 'configured', isInferred: true },
      { id: 'admin-10', area: 'Access Control', setting: 'IP Whitelist', value: 'Enabled', defaultValue: 'Disabled', confidence: 82, rationale: 'IP restrictions found in config', status: 'not_configured', isInferred: true },
      { id: 'admin-11', area: 'Access Control', setting: 'SSO Provider', value: 'Okta', defaultValue: 'None', confidence: 96, rationale: 'SSO integration detected', status: 'configured', isInferred: true },
      { id: 'admin-12', area: 'Compliance', setting: 'GDPR Mode', value: 'Enabled', defaultValue: 'Disabled', confidence: 89, rationale: 'EU customer data detected', status: 'pending', isInferred: true },
      ...generateNonInferredSettings('admin', 'Admin', 13, 88),
    ],
  },
  {
    id: 'billing',
    title: 'Billing Settings',
    description: 'Invoice templates, billing cycles, and rules',
    icon: FileText,
    settingsInferred: 8,
    totalSettings: 100,
    status: 'completed',
    details: [
      { id: 'billing-1', area: 'Subscription Settings', setting: 'Term Type', value: 'Termed', defaultValue: 'Evergreen', derivedValue: 'Fixed Duration', confidence: 94, rationale: 'All subscriptions have defined end dates', status: 'configured', isInferred: true },
      { id: 'billing-2', area: 'Subscription Settings', setting: 'Initial Term', value: '12 months', defaultValue: '1 month', derivedValue: '365 days', confidence: 91, rationale: 'Most common term length in contracts', status: 'configured', isInferred: true },
      { id: 'billing-3', area: 'Subscription Settings', setting: 'Renewal Term', value: '12 months', defaultValue: '1 month', derivedValue: '365 days', confidence: 89, rationale: 'Matches initial term pattern', status: 'pending', isInferred: true },
      { id: 'billing-4', area: 'Subscription Settings', setting: 'Auto Renewal', value: 'Enabled', defaultValue: 'Disabled', derivedValue: 'true', confidence: 87, rationale: 'Default behavior observed in renewals', status: 'configured', isInferred: true },
      { id: 'billing-5', area: 'Account Settings', setting: 'Invoice Delivery', value: 'Email', defaultValue: 'Portal', confidence: 96, rationale: 'Primary delivery method in customer preferences', status: 'configured', isInferred: true },
      { id: 'billing-6', area: 'Account Settings', setting: 'Payment Terms', value: 'Net 30', defaultValue: 'Due on Receipt', derivedValue: '30 days', confidence: 93, rationale: 'Standard payment terms in invoices', status: 'not_configured', isInferred: true },
      { id: 'billing-7', area: 'Invoice Settings', setting: 'Currency', value: 'USD', defaultValue: 'USD', derivedValue: 'US Dollar', confidence: 98, rationale: 'Primary currency in all transactions', status: 'configured', isInferred: true },
      { id: 'billing-8', area: 'Invoice Settings', setting: 'Tax Inclusive', value: 'No', defaultValue: 'No', derivedValue: 'Tax calculated separately', confidence: 90, rationale: 'Tax line items present on invoices', status: 'configured', isInferred: true },
      ...generateNonInferredSettings('billing', 'Billing', 9, 92),
    ],
  },
  {
    id: 'payment',
    title: 'Payment Settings',
    description: 'Payment gateways, methods, and processing',
    icon: CreditCard,
    settingsInferred: 5,
    totalSettings: 100,
    status: 'in_progress',
    details: [
      { id: 'payment-1', area: 'Gateway Settings', setting: 'Primary Gateway', value: 'Stripe', defaultValue: 'None', confidence: 100, rationale: 'Gateway ID detected in payment records', status: 'configured', isInferred: true },
      { id: 'payment-2', area: 'Gateway Settings', setting: 'Retry Attempts', value: '3', defaultValue: '1', derivedValue: 'Max retries', confidence: 82, rationale: 'Common retry pattern observed', status: 'pending', isInferred: true },
      { id: 'payment-3', area: 'Method Settings', setting: 'Accepted Cards', value: 'Visa, MC, Amex', defaultValue: 'Visa, MC', confidence: 95, rationale: 'Card types in successful transactions', status: 'configured', isInferred: true },
      { id: 'payment-4', area: 'Method Settings', setting: 'ACH Enabled', value: 'Yes', defaultValue: 'No', confidence: 88, rationale: 'ACH transactions present in data', status: 'not_configured', isInferred: true },
      { id: 'payment-5', area: 'Processing', setting: 'Settlement Time', value: 'T+2', defaultValue: 'T+3', derivedValue: '2 business days', confidence: 75, rationale: 'Average settlement time calculated', status: 'pending', isInferred: true },
      ...generateNonInferredSettings('payment', 'Payment', 6, 95),
    ],
  },
  {
    id: 'finance',
    title: 'Finance Settings',
    description: 'Revenue recognition, accounting periods',
    icon: PiggyBank,
    settingsInferred: 14,
    totalSettings: 100,
    status: 'in_progress',
    details: [
      { id: 'finance-1', area: 'Revenue Recognition', setting: 'Recognition Method', value: 'Ratable', defaultValue: 'Point in Time', derivedValue: 'Daily proration', confidence: 92, rationale: 'Revenue spread evenly across term', status: 'configured', isInferred: true },
      { id: 'finance-2', area: 'Revenue Recognition', setting: 'Recognition Start', value: 'Service Start Date', defaultValue: 'Contract Date', confidence: 88, rationale: 'Revenue begins with service activation', status: 'pending', isInferred: true },
      { id: 'finance-3', area: 'Accounting Period', setting: 'Fiscal Year End', value: 'December', defaultValue: 'December', derivedValue: 'Calendar year', confidence: 94, rationale: 'Financial statements follow calendar year', status: 'configured', isInferred: true },
      { id: 'finance-4', area: 'Accounting Period', setting: 'Period Type', value: 'Monthly', defaultValue: 'Monthly', confidence: 96, rationale: 'Monthly close process detected', status: 'configured', isInferred: true },
      { id: 'finance-5', area: 'Journal Entry', setting: 'Auto Post', value: 'Enabled', defaultValue: 'Disabled', confidence: 85, rationale: 'Journal entries posted automatically', status: 'not_configured', isInferred: true },
      { id: 'finance-6', area: 'Journal Entry', setting: 'Entry Template', value: 'Standard', defaultValue: 'Basic', confidence: 80, rationale: 'Default template in use', status: 'pending', isInferred: true },
      { id: 'finance-7', area: 'GL Settings', setting: 'Account Structure', value: '4-Segment', defaultValue: '3-Segment', confidence: 91, rationale: 'GL account format detected', status: 'configured', isInferred: true },
      { id: 'finance-8', area: 'GL Settings', setting: 'Currency Rounding', value: '2 decimals', defaultValue: '2 decimals', confidence: 98, rationale: 'Standard currency precision', status: 'configured', isInferred: true },
      { id: 'finance-9', area: 'Reporting', setting: 'Consolidation', value: 'Enabled', defaultValue: 'Disabled', confidence: 86, rationale: 'Multi-entity structure detected', status: 'pending', isInferred: true },
      { id: 'finance-10', area: 'Reporting', setting: 'Intercompany', value: 'Auto Eliminate', defaultValue: 'Manual', confidence: 83, rationale: 'IC transactions found', status: 'not_configured', isInferred: true },
      { id: 'finance-11', area: 'Tax', setting: 'Tax Engine', value: 'Avalara', defaultValue: 'None', confidence: 95, rationale: 'Tax integration detected', status: 'configured', isInferred: true },
      { id: 'finance-12', area: 'Tax', setting: 'Tax Calculation', value: 'Real-time', defaultValue: 'Batch', confidence: 89, rationale: 'Live tax calls observed', status: 'configured', isInferred: true },
      { id: 'finance-13', area: 'Compliance', setting: 'ASC 606', value: 'Enabled', defaultValue: 'Disabled', confidence: 92, rationale: 'Revenue recognition rules applied', status: 'configured', isInferred: true },
      { id: 'finance-14', area: 'Compliance', setting: 'SOX Controls', value: 'Enabled', defaultValue: 'Disabled', confidence: 87, rationale: 'Audit controls detected', status: 'pending', isInferred: true },
      ...generateNonInferredSettings('finance', 'Finance', 15, 86),
    ],
  },
  {
    id: 'tenant',
    title: 'Tenant Settings',
    description: 'Multi-tenant configuration and isolation',
    icon: Building2,
    settingsInferred: 6,
    totalSettings: 100,
    status: 'completed',
    details: [
      { id: 'tenant-1', area: 'Isolation', setting: 'Data Isolation', value: 'Schema-based', defaultValue: 'Row-based', confidence: 100, rationale: 'Separate schemas per tenant detected', status: 'configured', isInferred: true },
      { id: 'tenant-2', area: 'Isolation', setting: 'Tenant ID Field', value: 'tenant_id', defaultValue: 'org_id', confidence: 100, rationale: 'Field present in all tables', status: 'configured', isInferred: true },
      { id: 'tenant-3', area: 'Configuration', setting: 'Branding', value: 'Per-tenant', defaultValue: 'Global', confidence: 90, rationale: 'Custom logos and colors per tenant', status: 'configured', isInferred: true },
      { id: 'tenant-4', area: 'Configuration', setting: 'Feature Flags', value: 'Enabled', defaultValue: 'Disabled', confidence: 88, rationale: 'Feature toggles vary by tenant', status: 'pending', isInferred: true },
      { id: 'tenant-5', area: 'Limits', setting: 'Storage Quota', value: '100 GB', defaultValue: '10 GB', confidence: 85, rationale: 'Standard allocation per tenant', status: 'configured', isInferred: true },
      { id: 'tenant-6', area: 'Limits', setting: 'API Rate Limit', value: '1000/min', defaultValue: '100/min', confidence: 82, rationale: 'Rate limiting configured per tenant', status: 'configured', isInferred: true },
      ...generateNonInferredSettings('tenant', 'Tenant', 7, 94),
    ],
  },
  {
    id: 'user',
    title: 'User Settings',
    description: 'User preferences and notification settings',
    icon: Users,
    settingsInferred: 3,
    totalSettings: 100,
    status: 'pending',
    details: [
      { id: 'user-1', area: 'Notifications', setting: 'Email Alerts', value: 'Enabled', defaultValue: 'Disabled', confidence: 78, rationale: 'Email notifications configured', status: 'not_configured', isInferred: true },
      { id: 'user-2', area: 'Notifications', setting: 'Alert Frequency', value: 'Immediate', defaultValue: 'Daily Digest', confidence: 72, rationale: 'Real-time alerts observed', status: 'pending', isInferred: true },
      { id: 'user-3', area: 'Preferences', setting: 'Timezone', value: 'UTC', defaultValue: 'UTC', confidence: 65, rationale: 'Default timezone in system', status: 'not_configured', isInferred: true },
      ...generateNonInferredSettings('user', 'User', 4, 97),
    ],
  },
];

export function ConfigurationTab() {
  const { toast } = useToast();
  const [settingCategories, setSettingCategories] = useState<SettingCategory[]>(initialSettingCategories);
  const [selectedCategory, setSelectedCategory] = useState<SettingCategory | null>(null);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [configuringId, setConfiguringId] = useState<string | null>(null);
  const [configDialog, setConfigDialog] = useState<{ open: boolean; detail: SettingDetail | null; valueSource: ValueSource }>({ open: false, detail: null, valueSource: 'inferred' });
  const [bulkConfigDialog, setBulkConfigDialog] = useState<{ open: boolean; valueSource: ValueSource }>({ open: false, valueSource: 'inferred' });

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

  const getSettingStatusBadge = (status: SettingStatus) => {
    switch (status) {
      case 'configured':
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Configured</Badge>;
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Pending</Badge>;
      case 'not_configured':
        return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Not Configured</Badge>;
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

  const totalInferred = settingCategories.reduce((sum, cat) => sum + cat.details.length, 0);
  const totalSettings = settingCategories.reduce((sum, cat) => sum + cat.totalSettings, 0);

  const handleStartEdit = (index: number, currentValue: string) => {
    setEditingRow(index);
    setEditValue(currentValue);
  };

  const handleSaveEdit = (index: number) => {
    if (selectedCategory) {
      const updatedCategories = settingCategories.map(cat => {
        if (cat.id === selectedCategory.id) {
          const updatedDetails = [...cat.details];
          updatedDetails[index] = { 
            ...updatedDetails[index], 
            value: editValue,
            status: 'not_configured' as SettingStatus
          };
          return { ...cat, details: updatedDetails };
        }
        return cat;
      });
      setSettingCategories(updatedCategories);
      const updatedCategory = updatedCategories.find(cat => cat.id === selectedCategory.id);
      if (updatedCategory) {
        setSelectedCategory(updatedCategory);
      }
      toast({
        title: "Value updated",
        description: "Please configure the setting to apply changes.",
      });
    }
    setEditingRow(null);
    setEditValue('');
  };

  const handleCancelEdit = () => {
    setEditingRow(null);
    setEditValue('');
  };

  const handleToggleRow = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const handleToggleAll = () => {
    if (!selectedCategory) return;
    const inferredDetails = selectedCategory.details.filter(d => d.isInferred);
    const allInferredSelected = inferredDetails.every(d => selectedRows.has(d.id));
    if (allInferredSelected) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(inferredDetails.map(d => d.id)));
    }
  };

  const handleDeleteSelected = () => {
    if (!selectedCategory) return;
    const updatedCategories = settingCategories.map(cat => {
      if (cat.id === selectedCategory.id) {
        const updatedDetails = cat.details.filter(d => !selectedRows.has(d.id));
        return { ...cat, details: updatedDetails, settingsInferred: updatedDetails.length };
      }
      return cat;
    });
    setSettingCategories(updatedCategories);
    const updatedCategory = updatedCategories.find(cat => cat.id === selectedCategory.id);
    if (updatedCategory) {
      setSelectedCategory(updatedCategory);
    }
    toast({
      title: "Settings deleted",
      description: `${selectedRows.size} setting(s) have been removed.`,
    });
    setSelectedRows(new Set());
  };

  const handleDeleteSingle = (id: string) => {
    if (!selectedCategory) return;
    const updatedCategories = settingCategories.map(cat => {
      if (cat.id === selectedCategory.id) {
        const updatedDetails = cat.details.filter(d => d.id !== id);
        return { ...cat, details: updatedDetails, settingsInferred: updatedDetails.length };
      }
      return cat;
    });
    setSettingCategories(updatedCategories);
    const updatedCategory = updatedCategories.find(cat => cat.id === selectedCategory.id);
    if (updatedCategory) {
      setSelectedCategory(updatedCategory);
    }
    toast({
      title: "Setting deleted",
      description: "The setting has been removed.",
    });
  };

  const handleMoveSelected = (targetCategoryId: string) => {
    if (!selectedCategory || targetCategoryId === selectedCategory.id) return;
    const settingsToMove = selectedCategory.details.filter(d => selectedRows.has(d.id));
    const updatedCategories = settingCategories.map(cat => {
      if (cat.id === selectedCategory.id) {
        const updatedDetails = cat.details.filter(d => !selectedRows.has(d.id));
        return { ...cat, details: updatedDetails, settingsInferred: updatedDetails.length };
      }
      if (cat.id === targetCategoryId) {
        const newDetails = [...cat.details, ...settingsToMove.map(s => ({ ...s, id: `${cat.id}-${Date.now()}-${Math.random()}` }))];
        return { ...cat, details: newDetails, settingsInferred: newDetails.length };
      }
      return cat;
    });
    setSettingCategories(updatedCategories);
    const updatedCategory = updatedCategories.find(cat => cat.id === selectedCategory.id);
    if (updatedCategory) {
      setSelectedCategory(updatedCategory);
    }
    const targetCategory = updatedCategories.find(cat => cat.id === targetCategoryId);
    toast({
      title: "Settings moved",
      description: `${selectedRows.size} setting(s) moved to ${targetCategory?.title}.`,
    });
    setSelectedRows(new Set());
  };

  const handleMoveSingle = (settingId: string, targetCategoryId: string) => {
    if (!selectedCategory || targetCategoryId === selectedCategory.id) return;
    const settingToMove = selectedCategory.details.find(d => d.id === settingId);
    if (!settingToMove) return;
    const updatedCategories = settingCategories.map(cat => {
      if (cat.id === selectedCategory.id) {
        const updatedDetails = cat.details.filter(d => d.id !== settingId);
        return { ...cat, details: updatedDetails, settingsInferred: updatedDetails.length };
      }
      if (cat.id === targetCategoryId) {
        const newDetails = [...cat.details, { ...settingToMove, id: `${cat.id}-${Date.now()}` }];
        return { ...cat, details: newDetails, settingsInferred: newDetails.length };
      }
      return cat;
    });
    setSettingCategories(updatedCategories);
    const updatedCategory = updatedCategories.find(cat => cat.id === selectedCategory.id);
    if (updatedCategory) {
      setSelectedCategory(updatedCategory);
    }
    const targetCategory = updatedCategories.find(cat => cat.id === targetCategoryId);
    toast({
      title: "Setting moved",
      description: `Setting moved to ${targetCategory?.title}.`,
    });
  };

  const openConfigDialog = (detail: SettingDetail) => {
    setConfigDialog({ open: true, detail, valueSource: 'inferred' });
  };

  const handleConfigureWithSource = async (detail: SettingDetail, source: ValueSource) => {
    setConfigDialog({ open: false, detail: null, valueSource: 'inferred' });
    setConfiguringId(detail.id);
    
    toast({
      title: "Triggering configuration workflow...",
      description: `Configuring ${detail.setting} with ${source} value`,
    });

    await new Promise(resolve => setTimeout(resolve, 1500));

    if (selectedCategory) {
      const updatedCategories = settingCategories.map(cat => {
        if (cat.id === selectedCategory.id) {
          const updatedDetails = cat.details.map(d => 
            d.id === detail.id ? { ...d, status: 'configured' as SettingStatus, configuredSource: source } : d
          );
          return { ...cat, details: updatedDetails };
        }
        return cat;
      });
      setSettingCategories(updatedCategories);
      const updatedCategory = updatedCategories.find(cat => cat.id === selectedCategory.id);
      if (updatedCategory) {
        setSelectedCategory(updatedCategory);
      }
    }

    toast({
      title: "Configuration complete",
      description: `${detail.setting} configured with ${source} value.`,
    });
    setConfiguringId(null);
  };

  const handleBulkConfigure = async (source: ValueSource) => {
    setBulkConfigDialog({ open: false, valueSource: 'inferred' });
    if (!selectedCategory) return;

    const unconfiguredIds = selectedCategory.details
      .filter(d => selectedRows.has(d.id) && d.status !== 'configured')
      .map(d => d.id);

    if (unconfiguredIds.length === 0) {
      toast({
        title: "No settings to configure",
        description: "All selected settings are already configured.",
      });
      return;
    }

    toast({
      title: "Bulk configuration started...",
      description: `Configuring ${unconfiguredIds.length} settings with ${source} values`,
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

    const updatedCategories = settingCategories.map(cat => {
      if (cat.id === selectedCategory.id) {
        const updatedDetails = cat.details.map(d => 
          unconfiguredIds.includes(d.id) ? { ...d, status: 'configured' as SettingStatus, configuredSource: source } : d
        );
        return { ...cat, details: updatedDetails };
      }
      return cat;
    });
    setSettingCategories(updatedCategories);
    const updatedCategory = updatedCategories.find(cat => cat.id === selectedCategory.id);
    if (updatedCategory) {
      setSelectedCategory(updatedCategory);
    }

    toast({
      title: "Bulk configuration complete",
      description: `${unconfiguredIds.length} settings configured with ${source} values.`,
    });
    setSelectedRows(new Set());
  };

  const handleExportCSV = () => {
    if (!selectedCategory) return;

    const headers = ['Area', 'Setting', 'Default Value', 'Inferred Value', 'AI Inferred', 'Confidence', 'Status', 'Configured Source', 'Rationale'];
    const rows = selectedCategory.details.map(detail => [
      detail.area,
      detail.setting,
      detail.defaultValue,
      detail.value,
      detail.isInferred ? 'Yes' : 'No',
      detail.isInferred ? `${detail.confidence}%` : 'N/A',
      detail.status,
      detail.configuredSource || '-',
      detail.rationale
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${selectedCategory.title.replace(/\s+/g, '_')}_settings.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export complete",
      description: `${selectedCategory.title} exported to CSV.`,
    });
  };

  const otherCategories = settingCategories.filter(cat => cat.id !== selectedCategory?.id);

  if (selectedCategory) {
    const Icon = selectedCategory.icon;
    const inferredDetails = selectedCategory.details.filter(d => d.isInferred);
    const allInferredSelected = inferredDetails.length > 0 && inferredDetails.every(d => selectedRows.has(d.id));
    const someSelected = selectedRows.size > 0;

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => { setSelectedCategory(null); setSelectedRows(new Set()); }}>
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
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            {getStatusBadge(selectedCategory.status)}
            <Card className="px-4 py-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{inferredDetails.length}/{selectedCategory.totalSettings} Inferred</span>
              </div>
            </Card>
          </div>
        </div>

        {someSelected && (
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border">
            <span className="text-sm font-medium">{selectedRows.size} selected</span>
            <div className="h-4 w-px bg-border" />
            <Button variant="default" size="sm" onClick={() => setBulkConfigDialog({ open: true, valueSource: 'inferred' })}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Configure Selected
            </Button>
            <Select onValueChange={handleMoveSelected}>
              <SelectTrigger className="w-[180px] h-8">
                <div className="flex items-center gap-2">
                  <MoveRight className="h-4 w-4" />
                  <SelectValue placeholder="Move to..." />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg z-50">
                {otherCategories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="destructive" size="sm" onClick={handleDeleteSelected}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setSelectedRows(new Set())}>
              Clear selection
            </Button>
          </div>
        )}

        <Card className="flex-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">All Settings ({selectedCategory.totalSettings})</CardTitle>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <span>AI Inferred ({inferredDetails.length})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5 text-muted-foreground/50" />
                  <span>Pending Analysis ({selectedCategory.totalSettings - inferredDetails.length})</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px] pl-4">
                    <Checkbox checked={allInferredSelected} onCheckedChange={handleToggleAll} />
                  </TableHead>
                  <TableHead className="w-[10%]">Area</TableHead>
                  <TableHead className="w-[10%]">Setting</TableHead>
                  <TableHead className="w-[10%]">Default Value</TableHead>
                  <TableHead className="w-[12%]">Inferred Value</TableHead>
                  <TableHead className="w-[8%]">Confidence</TableHead>
                  <TableHead className="w-[8%]">Status</TableHead>
                  <TableHead className="w-[18%]">Rationale</TableHead>
                  <TableHead className="w-[12%]">Action</TableHead>
                  <TableHead className="w-[40px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedCategory.details.map((detail, index) => (
                  <TableRow 
                    key={detail.id} 
                    className={`${selectedRows.has(detail.id) ? 'bg-muted/50' : ''} ${!detail.isInferred ? 'opacity-60 bg-muted/20' : ''}`}
                  >
                    <TableCell className="pl-4">
                      <Checkbox 
                        checked={selectedRows.has(detail.id)} 
                        onCheckedChange={() => handleToggleRow(detail.id)} 
                        disabled={!detail.isInferred}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {!detail.isInferred && (
                          <AlertCircle className="h-3.5 w-3.5 text-muted-foreground/50" />
                        )}
                        {detail.area}
                      </div>
                    </TableCell>
                    <TableCell className={!detail.isInferred ? 'text-muted-foreground' : ''}>{detail.setting}</TableCell>
                    <TableCell>
                      <code className="px-2 py-1 bg-muted/50 rounded text-sm text-muted-foreground">{detail.defaultValue}</code>
                    </TableCell>
                    <TableCell>
                      {detail.isInferred ? (
                        editingRow === index ? (
                          <div className="flex items-center gap-2">
                            <Input
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="h-8 text-sm"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveEdit(index);
                                if (e.key === 'Escape') handleCancelEdit();
                              }}
                            />
                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleSaveEdit(index)}>
                              <Check className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleCancelEdit}>
                              <X className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 group/value">
                            <code className="px-2 py-1 bg-muted rounded text-sm">{detail.value}</code>
                            <Button size="icon" variant="ghost" className="h-7 w-7 opacity-0 group-hover/value:opacity-100 transition-opacity" onClick={() => handleStartEdit(index, detail.value)}>
                              <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                            </Button>
                          </div>
                        )
                      ) : (
                        <span className="text-muted-foreground/50 text-sm italic">Not available</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {detail.isInferred ? (
                        getConfidenceBadge(detail.confidence)
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground/50 border-muted-foreground/30">N/A</Badge>
                      )}
                    </TableCell>
                    <TableCell>{getSettingStatusBadge(detail.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{detail.rationale}</TableCell>
                    <TableCell>
                      {detail.isInferred ? (
                        detail.status === 'configured' ? (
                          <Button variant="outline" size="sm" onClick={() => handleStartEdit(index, detail.value)}>
                            <Pencil className="h-3.5 w-3.5 mr-1" />
                            Edit
                          </Button>
                        ) : (
                          <Button variant="default" size="sm" onClick={() => openConfigDialog(detail)} disabled={configuringId === detail.id}>
                            {configuringId === detail.id ? (
                              <>
                                <Play className="h-3.5 w-3.5 mr-1 animate-pulse" />
                                Running...
                              </>
                            ) : (
                              <>
                                <Settings className="h-3.5 w-3.5 mr-1" />
                                Configure
                              </>
                            )}
                          </Button>
                        )
                      ) : (
                        <Button variant="outline" size="sm" disabled className="opacity-50">
                          <AlertCircle className="h-3.5 w-3.5 mr-1" />
                          Pending AI
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8" disabled={!detail.isInferred}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-background border shadow-lg z-50">
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              <MoveRight className="h-4 w-4 mr-2" />
                              Move to
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent className="bg-background border shadow-lg z-50">
                              {otherCategories.map(cat => (
                                <DropdownMenuItem key={cat.id} onClick={() => handleMoveSingle(detail.id, cat.id)}>
                                  {cat.title}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDeleteSingle(detail.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={configDialog.open} onOpenChange={(open) => setConfigDialog({ ...configDialog, open })}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Configure Setting</DialogTitle>
              <DialogDescription>
                Choose which value to use for {configDialog.detail?.setting}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <RadioGroup value={configDialog.valueSource} onValueChange={(value) => setConfigDialog({ ...configDialog, valueSource: value as ValueSource })}>
                <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                  <RadioGroupItem value="default" id="default" />
                  <Label htmlFor="default" className="flex-1 cursor-pointer">
                    <div className="font-medium">Default Value</div>
                    <div className="text-sm text-muted-foreground">
                      <code className="px-2 py-0.5 bg-muted rounded">{configDialog.detail?.defaultValue}</code>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                  <RadioGroupItem value="inferred" id="inferred" />
                  <Label htmlFor="inferred" className="flex-1 cursor-pointer">
                    <div className="font-medium">Inferred Value</div>
                    <div className="text-sm text-muted-foreground">
                      <code className="px-2 py-0.5 bg-muted rounded">{configDialog.detail?.value}</code>
                      <span className="ml-2 text-xs">({configDialog.detail?.confidence}% confidence)</span>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfigDialog({ open: false, detail: null, valueSource: 'inferred' })}>Cancel</Button>
              <Button onClick={() => configDialog.detail && handleConfigureWithSource(configDialog.detail, configDialog.valueSource)}>Configure</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={bulkConfigDialog.open} onOpenChange={(open) => setBulkConfigDialog({ ...bulkConfigDialog, open })}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Bulk Configure Settings</DialogTitle>
              <DialogDescription>
                Choose which value type to use for {selectedRows.size} selected setting(s)
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <RadioGroup value={bulkConfigDialog.valueSource} onValueChange={(value) => setBulkConfigDialog({ ...bulkConfigDialog, valueSource: value as ValueSource })}>
                <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                  <RadioGroupItem value="default" id="bulk-default" />
                  <Label htmlFor="bulk-default" className="flex-1 cursor-pointer">
                    <div className="font-medium">Default Values</div>
                    <div className="text-sm text-muted-foreground">Use the system default value for each setting</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50">
                  <RadioGroupItem value="inferred" id="bulk-inferred" />
                  <Label htmlFor="bulk-inferred" className="flex-1 cursor-pointer">
                    <div className="font-medium">Inferred Values</div>
                    <div className="text-sm text-muted-foreground">Use the AI-inferred value for each setting</div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setBulkConfigDialog({ open: false, valueSource: 'inferred' })}>Cancel</Button>
              <Button onClick={() => handleBulkConfigure(bulkConfigDialog.valueSource)}>Configure {selectedRows.size} Settings</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {settingCategories.map((category) => {
          const Icon = category.icon;
          const inferencePercent = Math.round((category.details.length / category.totalSettings) * 100);
          
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
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Settings Inferred</span>
                    </div>
                    <span className="text-lg font-bold text-primary">{category.details.length}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Inference Progress</span>
                      <span>{inferencePercent}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${inferencePercent}%` }} />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    {category.details.length} of {category.totalSettings} settings configured
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
