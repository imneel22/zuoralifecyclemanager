import { Header } from '@/components/zlm/Header';
import { AppSidebar } from '@/components/zlm/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { billingImplementations, revenueImplementations } from '@/data/mockData';
import { HealthScoreRing } from '@/components/zlm/HealthScoreRing';
import { AlertTriangle, CheckCircle2, Clock, FolderKanban, TrendingUp, DollarSign, FileText, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '@/contexts/OnboardingContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { onboardingType } = useOnboarding();
  
  const implementations = onboardingType === 'billing' ? billingImplementations : revenueImplementations;
  
  const totalProjects = implementations.length;
  const healthyProjects = implementations.filter(impl => impl.healthScore.overall >= 80).length;
  const atRiskProjects = implementations.filter(impl => impl.healthScore.overall >= 60 && impl.healthScore.overall < 80).length;
  const criticalProjects = implementations.filter(impl => impl.healthScore.overall < 60).length;
  const avgDaysToGoLive = Math.round(implementations.reduce((sum, impl) => sum + impl.daysToGoLive, 0) / totalProjects);

  // Revenue-specific metrics
  const totalARR = implementations.reduce((sum, impl) => sum + (impl.arr || 0), 0);
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <AppSidebar />
        
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">
              {onboardingType === 'billing' ? 'Billing' : 'Revenue'} Dashboard
            </h1>
            <p className="text-muted-foreground">
              {onboardingType === 'billing' 
                ? 'Overview of billing implementations' 
                : 'Overview of revenue recognition implementations'}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card 
              className="cursor-pointer transition-colors hover:bg-muted/50"
              onClick={() => navigate('/projects')}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                <FolderKanban className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalProjects}</div>
                <p className="text-xs text-muted-foreground">
                  {onboardingType === 'billing' ? 'Billing implementations' : 'Revenue implementations'}
                </p>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer transition-colors hover:bg-muted/50"
              onClick={() => navigate('/projects?filter=healthy')}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Healthy</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{healthyProjects}</div>
                <p className="text-xs text-muted-foreground">On track projects</p>
              </CardContent>
            </Card>

            {onboardingType === 'billing' ? (
              <Card 
                className="cursor-pointer transition-colors hover:bg-muted/50"
                onClick={() => navigate('/projects?filter=at-risk')}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">At Risk</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-600">{atRiskProjects}</div>
                  <p className="text-xs text-muted-foreground">Need attention</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total ARR</CardTitle>
                  <TrendingUp className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{formatCurrency(totalARR)}</div>
                  <p className="text-xs text-muted-foreground">Revenue under implementation</p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Days to Go-Live</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgDaysToGoLive}</div>
                <p className="text-xs text-muted-foreground">Across all projects</p>
              </CardContent>
            </Card>
          </div>

          {/* Revenue-specific metrics row */}
          {onboardingType === 'revenue' && (
            <div className="grid gap-4 md:grid-cols-3 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">ASC 606 Compliance</CardTitle>
                  <FileText className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">98%</div>
                  <p className="text-xs text-muted-foreground">Average compliance score</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Journal Entries</CardTitle>
                  <BarChart3 className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">247</div>
                  <p className="text-xs text-muted-foreground">Awaiting GL posting</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">At Risk</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-600">{atRiskProjects + criticalProjects}</div>
                  <p className="text-xs text-muted-foreground">Need attention</p>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Projects Requiring Attention</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {implementations
                  .filter(impl => impl.healthScore.overall < 80)
                  .slice(0, 4)
                  .map(impl => (
                    <div 
                      key={impl.id} 
                      className="flex items-center justify-between p-2 -mx-2 rounded-md cursor-pointer transition-colors hover:bg-muted/50"
                      onClick={() => navigate(`/implementation/${impl.id}`)}
                    >
                      <div>
                        <p className="font-medium">{impl.customerName}</p>
                        <p className="text-sm text-muted-foreground">{impl.daysToGoLive} days to go-live</p>
                      </div>
                      <HealthScoreRing score={impl.healthScore.overall} size="sm" />
                    </div>
                  ))}
                {implementations.filter(impl => impl.healthScore.overall < 80).length === 0 && (
                  <p className="text-muted-foreground text-sm">All projects are on track!</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Go-Lives</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {implementations
                  .sort((a, b) => a.daysToGoLive - b.daysToGoLive)
                  .slice(0, 4)
                  .map(impl => (
                    <div 
                      key={impl.id} 
                      className="flex items-center justify-between p-2 -mx-2 rounded-md cursor-pointer transition-colors hover:bg-muted/50"
                      onClick={() => navigate(`/implementation/${impl.id}`)}
                    >
                      <div>
                        <p className="font-medium">{impl.customerName}</p>
                        <p className="text-sm text-muted-foreground">{impl.industry}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{impl.daysToGoLive} days</p>
                        <p className="text-xs text-muted-foreground">to go-live</p>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}