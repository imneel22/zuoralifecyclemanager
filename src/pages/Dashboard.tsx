import { Header } from '@/components/zlm/Header';
import { AppSidebar } from '@/components/zlm/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockImplementations } from '@/data/mockData';
import { HealthScoreRing } from '@/components/zlm/HealthScoreRing';
import { AlertTriangle, CheckCircle2, Clock, FolderKanban } from 'lucide-react';

export default function Dashboard() {
  const totalProjects = mockImplementations.length;
  const healthyProjects = mockImplementations.filter(impl => impl.healthScore.overall >= 80).length;
  const atRiskProjects = mockImplementations.filter(impl => impl.healthScore.overall >= 60 && impl.healthScore.overall < 80).length;
  const criticalProjects = mockImplementations.filter(impl => impl.healthScore.overall < 60).length;
  const avgDaysToGoLive = Math.round(mockImplementations.reduce((sum, impl) => sum + impl.daysToGoLive, 0) / totalProjects);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <AppSidebar />
        
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Overview of all implementations</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                <FolderKanban className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalProjects}</div>
                <p className="text-xs text-muted-foreground">Active implementations</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Healthy</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{healthyProjects}</div>
                <p className="text-xs text-muted-foreground">On track projects</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">At Risk</CardTitle>
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">{atRiskProjects}</div>
                <p className="text-xs text-muted-foreground">Need attention</p>
              </CardContent>
            </Card>

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

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Projects Requiring Attention</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockImplementations
                  .filter(impl => impl.healthScore.overall < 80)
                  .slice(0, 4)
                  .map(impl => (
                    <div key={impl.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{impl.customerName}</p>
                        <p className="text-sm text-muted-foreground">{impl.daysToGoLive} days to go-live</p>
                      </div>
                      <HealthScoreRing score={impl.healthScore.overall} size="sm" />
                    </div>
                  ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Go-Lives</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockImplementations
                  .sort((a, b) => a.daysToGoLive - b.daysToGoLive)
                  .slice(0, 4)
                  .map(impl => (
                    <div key={impl.id} className="flex items-center justify-between">
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
