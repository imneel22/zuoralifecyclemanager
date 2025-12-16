import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Lightbulb, CheckCircle2, Clock, AlertCircle, ChevronRight } from 'lucide-react';

const mockUseCases = [
  { 
    id: '1', 
    name: 'New Customer Subscription', 
    description: 'Standard subscription onboarding with implementation services',
    category: 'Subscription',
    completeness: 100,
    status: 'Complete'
  },
  { 
    id: '2', 
    name: 'Contract Modification - Upgrade', 
    description: 'Customer upgrades mid-contract with prorated billing',
    category: 'Modification',
    completeness: 85,
    status: 'In Progress'
  },
  { 
    id: '3', 
    name: 'Multi-Element Arrangement', 
    description: 'Bundle with license, services, and support',
    category: 'Bundle',
    completeness: 70,
    status: 'In Progress'
  },
  { 
    id: '4', 
    name: 'Usage-Based Revenue', 
    description: 'Variable consideration with usage tiers',
    category: 'Usage',
    completeness: 45,
    status: 'In Progress'
  },
  { 
    id: '5', 
    name: 'Contract Termination', 
    description: 'Early termination with refund handling',
    category: 'Termination',
    completeness: 0,
    status: 'Not Started'
  },
  { 
    id: '6', 
    name: 'Renewal Processing', 
    description: 'Auto-renewal with price escalation',
    category: 'Renewal',
    completeness: 30,
    status: 'In Progress'
  },
];

export function UseCasesTab() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Complete':
        return <Badge variant="default" className="bg-green-500">Complete</Badge>;
      case 'In Progress':
        return <Badge variant="secondary">In Progress</Badge>;
      case 'Not Started':
        return <Badge variant="outline">Not Started</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Complete':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'In Progress':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'Not Started':
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
      default:
        return null;
    }
  };

  const totalUseCases = mockUseCases.length;
  const completedUseCases = mockUseCases.filter(u => u.status === 'Complete').length;
  const overallProgress = Math.round(mockUseCases.reduce((sum, u) => sum + u.completeness, 0) / totalUseCases);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Use Cases</h2>
          <p className="text-muted-foreground">Track business scenario implementation progress</p>
        </div>
        <Button className="gap-2">
          <Lightbulb className="h-4 w-4" />
          Add Use Case
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{totalUseCases}</div>
            <p className="text-sm text-muted-foreground">Total Use Cases</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{completedUseCases}</div>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-amber-600">
              {mockUseCases.filter(u => u.status === 'In Progress').length}
            </div>
            <p className="text-sm text-muted-foreground">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">{overallProgress}%</div>
            <p className="text-sm text-muted-foreground">Overall Progress</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Business Scenarios</CardTitle>
          </div>
          <CardDescription>Implementation progress for each use case</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockUseCases.map((useCase) => (
              <div 
                key={useCase.id} 
                className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              >
                {getStatusIcon(useCase.status)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{useCase.name}</h4>
                    <Badge variant="outline" className="text-xs">{useCase.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{useCase.description}</p>
                  <div className="flex items-center gap-3">
                    <Progress value={useCase.completeness} className="flex-1 h-2" />
                    <span className="text-sm font-medium w-12">{useCase.completeness}%</span>
                  </div>
                </div>
                {getStatusBadge(useCase.status)}
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
