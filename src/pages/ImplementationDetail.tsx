import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Building2, Users, Settings, Database, TestTube, Rocket, Activity, ClipboardList, Globe, Package, Layers, ShoppingCart, GitBranch, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/zlm/Header';
import { HealthScoreRing } from '@/components/zlm/HealthScoreRing';
import { PhaseBadge } from '@/components/zlm/PhaseBadge';
import { TeamAvatars } from '@/components/zlm/TeamAvatars';
import { mockImplementations, mockActivities } from '@/data/mockData';
import { OverviewTab } from '@/components/zlm/tabs/OverviewTab';
import { DiscoveryTab } from '@/components/zlm/tabs/DiscoveryTab';
import { ConfigurationTab } from '@/components/zlm/tabs/ConfigurationTab';
import { DataMigrationTab } from '@/components/zlm/tabs/DataMigrationTab';
import { TestingTab } from '@/components/zlm/tabs/TestingTab';
import { GoLiveTab } from '@/components/zlm/tabs/GoLiveTab';
import { ActivityTab } from '@/components/zlm/tabs/ActivityTab';
import { TenantConfigurationTab } from '@/components/zlm/tabs/revenue/TenantConfigurationTab';
import { WhatTheySellTab } from '@/components/zlm/tabs/revenue/WhatTheySellTab';
import { CustomFieldsTab } from '@/components/zlm/tabs/revenue/CustomFieldsTab';
import { HowTheySellTab } from '@/components/zlm/tabs/revenue/HowTheySellTab';
import { ChangeManagerTab } from '@/components/zlm/tabs/revenue/ChangeManagerTab';
import { UseCasesTab } from '@/components/zlm/tabs/revenue/UseCasesTab';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { cn } from '@/lib/utils';

export default function ImplementationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { onboardingType } = useOnboarding();
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromUrl === 'discovery' ? 'tasks' : 'overview');

  useEffect(() => {
    if (tabFromUrl === 'discovery') {
      setActiveTab('tasks');
    }
  }, [tabFromUrl]);

  // Reset to overview when switching onboarding types
  useEffect(() => {
    setActiveTab('overview');
  }, [onboardingType]);

  const implementation = mockImplementations.find((impl) => impl.id === id);

  if (!implementation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Implementation not found</h2>
          <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  // Billing navigation tabs
  const billingTabs = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'tasks', label: 'Discovery', icon: ClipboardList },
    { id: 'configuration', label: 'Configuration', icon: Settings },
    { id: 'migration', label: 'Data Migration', icon: Database },
    { id: 'testing', label: 'Testing', icon: TestTube },
    { id: 'golive', label: 'Go-Live', icon: Rocket },
    { id: 'activity', label: 'Activity', icon: Activity },
  ];

  // Revenue navigation tabs
  const revenueTabs = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'tenant-config', label: 'Tenant Level Configuration', icon: Globe },
    { id: 'what-they-sell', label: 'What They Sell', icon: Package },
    { id: 'custom-fields', label: 'Custom Fields', icon: Layers },
    { id: 'how-they-sell', label: 'How They Sell', icon: ShoppingCart },
    { id: 'change-manager', label: 'Change Manager', icon: GitBranch },
    { id: 'use-cases', label: 'Use Cases', icon: Lightbulb },
  ];

  const tabs = onboardingType === 'billing' ? billingTabs : revenueTabs;

  const renderContent = () => {
    if (onboardingType === 'billing') {
      switch (activeTab) {
        case 'overview':
          return <OverviewTab implementation={implementation} />;
        case 'tasks':
          return <DiscoveryTab />;
        case 'configuration':
          return <ConfigurationTab />;
        case 'migration':
          return <DataMigrationTab />;
        case 'testing':
          return <TestingTab />;
        case 'golive':
          return <GoLiveTab />;
        case 'activity':
          return <ActivityTab activities={mockActivities} />;
        default:
          return <OverviewTab implementation={implementation} />;
      }
    } else {
      // Revenue tabs
      switch (activeTab) {
        case 'overview':
          return <OverviewTab implementation={implementation} />;
        case 'tenant-config':
          return <TenantConfigurationTab />;
        case 'what-they-sell':
          return <WhatTheySellTab />;
        case 'custom-fields':
          return <CustomFieldsTab />;
        case 'how-they-sell':
          return <HowTheySellTab />;
        case 'change-manager':
          return <ChangeManagerTab />;
        case 'use-cases':
          return <UseCasesTab />;
        default:
          return <OverviewTab implementation={implementation} />;
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header showSearch={false} />
      
      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-56 border-r bg-muted/30 min-h-[calc(100vh-64px)] p-4">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 -ml-2 w-full justify-start"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors text-left",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <tab.icon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="flex flex-col lg:flex-row items-start gap-6 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">{implementation.customerName}</h1>
                <PhaseBadge phase={implementation.currentPhase} />
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-4 w-4" />
                  <span>{implementation.industry}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>{implementation.daysToGoLive} days to go-live</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  <TeamAvatars team={implementation.team} max={4} size="sm" />
                </div>
              </div>
            </div>

            <Card className="w-full lg:w-auto">
              <CardContent className="p-4 flex items-center gap-6">
                <HealthScoreRing score={implementation.healthScore.overall} size="lg" />
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-8">
                    <span className="text-sm text-muted-foreground">Timeline</span>
                    <span className="text-sm font-medium">{implementation.healthScore.timeline}%</span>
                  </div>
                  <div className="flex items-center justify-between gap-8">
                    <span className="text-sm text-muted-foreground">Quality</span>
                    <span className="text-sm font-medium">{implementation.healthScore.quality}%</span>
                  </div>
                  <div className="flex items-center justify-between gap-8">
                    <span className="text-sm text-muted-foreground">Engagement</span>
                    <span className="text-sm font-medium">{implementation.healthScore.engagement}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {renderContent()}
        </main>
      </div>
    </div>
  );
}
