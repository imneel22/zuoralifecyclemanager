import { Settings, CreditCard, Wallet, PiggyBank, Building2, Users, FileText, Shield, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const settingCategories = [
  {
    id: 'admin',
    title: 'Admin Settings',
    description: 'User roles, permissions, and system configuration',
    icon: Shield,
    settingsInferred: 12,
    totalSettings: 15,
    status: 'completed',
  },
  {
    id: 'billing',
    title: 'Billing Settings',
    description: 'Invoice templates, billing cycles, and rules',
    icon: FileText,
    settingsInferred: 8,
    totalSettings: 10,
    status: 'completed',
  },
  {
    id: 'payment',
    title: 'Payment Settings',
    description: 'Payment gateways, methods, and processing',
    icon: CreditCard,
    settingsInferred: 5,
    totalSettings: 8,
    status: 'in_progress',
  },
  {
    id: 'finance',
    title: 'Finance Settings',
    description: 'Revenue recognition, accounting periods',
    icon: PiggyBank,
    settingsInferred: 14,
    totalSettings: 20,
    status: 'in_progress',
  },
  {
    id: 'tenant',
    title: 'Tenant Settings',
    description: 'Multi-tenant configuration and isolation',
    icon: Building2,
    settingsInferred: 6,
    totalSettings: 6,
    status: 'completed',
  },
  {
    id: 'user',
    title: 'User Settings',
    description: 'User preferences and notification settings',
    icon: Users,
    settingsInferred: 3,
    totalSettings: 7,
    status: 'pending',
  },
];

export function ConfigurationTab() {
  const navigate = useNavigate();

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

  const totalInferred = settingCategories.reduce((sum, cat) => sum + cat.settingsInferred, 0);
  const totalSettings = settingCategories.reduce((sum, cat) => sum + cat.totalSettings, 0);

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
              onClick={() => category.id === 'tenant' && navigate('/implementation/5?tab=tenant-config')}
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