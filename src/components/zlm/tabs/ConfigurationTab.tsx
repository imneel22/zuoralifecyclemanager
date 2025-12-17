import { useState } from 'react';
import { CreditCard, PiggyBank, Building2, Users, FileText, Shield, Sparkles, ArrowLeft, Pencil, Check, X, Trash2, MoveRight, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface SettingDetail {
  id: string;
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

const initialSettingCategories: SettingCategory[] = [
  {
    id: 'admin',
    title: 'Admin Settings',
    description: 'User roles, permissions, and system configuration',
    icon: Shield,
    settingsInferred: 12,
    totalSettings: 15,
    status: 'completed',
    details: [
      { id: 'admin-1', area: 'User Management', setting: 'Max Users', value: '500', derivedValue: 'Enterprise Tier', confidence: 95, rationale: 'Based on current user count and growth rate' },
      { id: 'admin-2', area: 'User Management', setting: 'Session Timeout', value: '30 minutes', derivedValue: '1800 seconds', confidence: 88, rationale: 'Industry standard for security compliance' },
      { id: 'admin-3', area: 'Permissions', setting: 'Role Hierarchy', value: 'Admin > Manager > User', confidence: 92, rationale: 'Derived from existing permission structure' },
      { id: 'admin-4', area: 'Permissions', setting: 'Default Role', value: 'User', confidence: 100, rationale: 'Most common role assignment in system' },
      { id: 'admin-5', area: 'Security', setting: 'MFA Required', value: 'Yes', derivedValue: 'TOTP', confidence: 85, rationale: 'Compliance requirement detected' },
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
      { id: 'billing-1', area: 'Subscription Settings', setting: 'Term Type', value: 'Termed', derivedValue: 'Fixed Duration', confidence: 94, rationale: 'All subscriptions have defined end dates' },
      { id: 'billing-2', area: 'Subscription Settings', setting: 'Initial Term', value: '12 months', derivedValue: '365 days', confidence: 91, rationale: 'Most common term length in contracts' },
      { id: 'billing-3', area: 'Subscription Settings', setting: 'Renewal Term', value: '12 months', derivedValue: '365 days', confidence: 89, rationale: 'Matches initial term pattern' },
      { id: 'billing-4', area: 'Subscription Settings', setting: 'Auto Renewal', value: 'Enabled', derivedValue: 'true', confidence: 87, rationale: 'Default behavior observed in renewals' },
      { id: 'billing-5', area: 'Account Settings', setting: 'Invoice Delivery', value: 'Email', confidence: 96, rationale: 'Primary delivery method in customer preferences' },
      { id: 'billing-6', area: 'Account Settings', setting: 'Payment Terms', value: 'Net 30', derivedValue: '30 days', confidence: 93, rationale: 'Standard payment terms in invoices' },
      { id: 'billing-7', area: 'Invoice Settings', setting: 'Currency', value: 'USD', derivedValue: 'US Dollar', confidence: 98, rationale: 'Primary currency in all transactions' },
      { id: 'billing-8', area: 'Invoice Settings', setting: 'Tax Inclusive', value: 'No', derivedValue: 'Tax calculated separately', confidence: 90, rationale: 'Tax line items present on invoices' },
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
      { id: 'payment-1', area: 'Gateway Settings', setting: 'Primary Gateway', value: 'Stripe', confidence: 100, rationale: 'Gateway ID detected in payment records' },
      { id: 'payment-2', area: 'Gateway Settings', setting: 'Retry Attempts', value: '3', derivedValue: 'Max retries', confidence: 82, rationale: 'Common retry pattern observed' },
      { id: 'payment-3', area: 'Method Settings', setting: 'Accepted Cards', value: 'Visa, MC, Amex', confidence: 95, rationale: 'Card types in successful transactions' },
      { id: 'payment-4', area: 'Method Settings', setting: 'ACH Enabled', value: 'Yes', confidence: 88, rationale: 'ACH transactions present in data' },
      { id: 'payment-5', area: 'Processing', setting: 'Settlement Time', value: 'T+2', derivedValue: '2 business days', confidence: 75, rationale: 'Average settlement time calculated' },
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
      { id: 'finance-1', area: 'Revenue Recognition', setting: 'Recognition Method', value: 'Ratable', derivedValue: 'Daily proration', confidence: 92, rationale: 'Revenue spread evenly across term' },
      { id: 'finance-2', area: 'Revenue Recognition', setting: 'Recognition Start', value: 'Service Start Date', confidence: 88, rationale: 'Revenue begins with service activation' },
      { id: 'finance-3', area: 'Accounting Period', setting: 'Fiscal Year End', value: 'December', derivedValue: 'Calendar year', confidence: 94, rationale: 'Financial statements follow calendar year' },
      { id: 'finance-4', area: 'Accounting Period', setting: 'Period Type', value: 'Monthly', confidence: 96, rationale: 'Monthly close process detected' },
      { id: 'finance-5', area: 'Journal Entry', setting: 'Auto Post', value: 'Enabled', confidence: 85, rationale: 'Journal entries posted automatically' },
      { id: 'finance-6', area: 'Journal Entry', setting: 'Entry Template', value: 'Standard', confidence: 80, rationale: 'Default template in use' },
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
      { id: 'tenant-1', area: 'Isolation', setting: 'Data Isolation', value: 'Schema-based', confidence: 100, rationale: 'Separate schemas per tenant detected' },
      { id: 'tenant-2', area: 'Isolation', setting: 'Tenant ID Field', value: 'tenant_id', confidence: 100, rationale: 'Field present in all tables' },
      { id: 'tenant-3', area: 'Configuration', setting: 'Branding', value: 'Per-tenant', confidence: 90, rationale: 'Custom logos and colors per tenant' },
      { id: 'tenant-4', area: 'Configuration', setting: 'Feature Flags', value: 'Enabled', confidence: 88, rationale: 'Feature toggles vary by tenant' },
      { id: 'tenant-5', area: 'Limits', setting: 'Storage Quota', value: '100 GB', confidence: 85, rationale: 'Standard allocation per tenant' },
      { id: 'tenant-6', area: 'Limits', setting: 'API Rate Limit', value: '1000/min', confidence: 82, rationale: 'Rate limiting configured per tenant' },
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
      { id: 'user-1', area: 'Notifications', setting: 'Email Alerts', value: 'Enabled', confidence: 78, rationale: 'Email notifications configured' },
      { id: 'user-2', area: 'Notifications', setting: 'Alert Frequency', value: 'Immediate', confidence: 72, rationale: 'Real-time alerts observed' },
      { id: 'user-3', area: 'Preferences', setting: 'Timezone', value: 'UTC', confidence: 65, rationale: 'Default timezone in system' },
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
          updatedDetails[index] = { ...updatedDetails[index], value: editValue };
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
    if (selectedRows.size === selectedCategory.details.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(selectedCategory.details.map(d => d.id)));
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

  const otherCategories = settingCategories.filter(cat => cat.id !== selectedCategory?.id);

  // Detail View
  if (selectedCategory) {
    const Icon = selectedCategory.icon;
    const allSelected = selectedRows.size === selectedCategory.details.length && selectedCategory.details.length > 0;
    const someSelected = selectedRows.size > 0;

    return (
      <div className="space-y-6">
        {/* Header with Back Button */}
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
            {getStatusBadge(selectedCategory.status)}
            <Card className="px-4 py-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{selectedCategory.details.length}/{selectedCategory.totalSettings} Inferred</span>
              </div>
            </Card>
          </div>
        </div>

        {/* Bulk Actions Toolbar */}
        {someSelected && (
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border">
            <span className="text-sm font-medium">{selectedRows.size} selected</span>
            <div className="h-4 w-px bg-border" />
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

        {/* Settings Table */}
        <Card className="flex-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Inferred Settings Details</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px] pl-4">
                    <Checkbox 
                      checked={allSelected}
                      onCheckedChange={handleToggleAll}
                    />
                  </TableHead>
                  <TableHead className="w-[16%]">Area</TableHead>
                  <TableHead className="w-[16%]">Setting</TableHead>
                  <TableHead className="w-[18%]">Value</TableHead>
                  <TableHead className="w-[10%]">Confidence</TableHead>
                  <TableHead className="w-[30%]">Rationale</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedCategory.details.map((detail, index) => (
                  <TableRow key={detail.id} className={selectedRows.has(detail.id) ? 'bg-muted/50' : ''}>
                    <TableCell className="pl-4">
                      <Checkbox 
                        checked={selectedRows.has(detail.id)}
                        onCheckedChange={() => handleToggleRow(detail.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{detail.area}</TableCell>
                    <TableCell>{detail.setting}</TableCell>
                    <TableCell>
                      {editingRow === index ? (
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
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-7 w-7 opacity-0 group-hover/value:opacity-100 transition-opacity"
                            onClick={() => handleStartEdit(index, detail.value)}
                          >
                            <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{getConfidenceBadge(detail.confidence)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{detail.rationale}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
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
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteSingle(detail.id)}
                          >
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
                  {/* Inference Metric */}
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Settings Inferred</span>
                    </div>
                    <span className="text-lg font-bold text-primary">{category.details.length}</span>
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
