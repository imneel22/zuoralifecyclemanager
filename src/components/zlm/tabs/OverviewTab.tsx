import { Calendar, FileText, Settings, Database, CheckCircle2, Clock, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Implementation, Phase, BusinessModel } from '@/types/zlm';
import { TeamAvatars } from '../TeamAvatars';
import { AIRecommendation } from '../AIRecommendation';
import { useNavigate } from 'react-router-dom';

interface OverviewTabProps {
  implementation: Implementation;
}

const phases: { id: Phase; label: string }[] = [
  { id: 'discovery', label: 'Discovery' },
  { id: 'configuration', label: 'Configuration' },
  { id: 'migration', label: 'Migration' },
  { id: 'testing', label: 'Testing' },
  { id: 'golive', label: 'Go-Live' },
];

const businessModelLabels: Record<BusinessModel, string> = {
  subscription: 'Subscription',
  usage: 'Usage-Based',
  hybrid: 'Hybrid',
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export function OverviewTab({ implementation }: OverviewTabProps) {
  const navigate = useNavigate();
  const currentPhaseIndex = phases.findIndex((p) => p.id === implementation.currentPhase);
  const progress = ((currentPhaseIndex + 1) / phases.length) * 100;

  const getPhaseDate = (phaseId: Phase) => {
    return implementation.phaseDates?.find((p) => p.phase === phaseId);
  };

  const getStatusIcon = (status: 'completed' | 'in_progress' | 'pending') => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-primary animate-pulse" />;
      case 'pending':
        return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        {/* AI Recommendation - At the very top */}
        <AIRecommendation
          title="AI Insight"
          description="Based on similar implementations, consider scheduling the data migration review earlier. Companies in the Technology sector typically need 2 extra days for API integration testing."
          onAccept={() => console.log('Accepted recommendation')}
        />

        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-3">
              <div>
                <dt className="text-sm text-muted-foreground">SFDC Opportunity ID</dt>
                <dd className="font-medium">{implementation.sfdcOpportunityId}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Industry</dt>
                <dd className="font-medium">{implementation.industry}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">ARR</dt>
                <dd className="font-medium text-green-600">
                  {implementation.arr ? formatCurrency(implementation.arr) : '—'}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Business Model</dt>
                <dd>
                  <Badge variant={
                    implementation.businessModel === 'hybrid' ? 'default' :
                    implementation.businessModel === 'subscription' ? 'secondary' : 'outline'
                  }>
                    {implementation.businessModel ? businessModelLabels[implementation.businessModel] : '—'}
                  </Badge>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Target Go-Live</dt>
                <dd className="font-medium">{formatDate(implementation.targetGoLive)}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Product Types</dt>
                <dd className="font-medium">{implementation.productTypes.join(', ')}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Detailed Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Implementation Timeline</CardTitle>
            <CardDescription>Current phase: {phases[currentPhaseIndex]?.label}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <Progress value={progress} className="h-2" />
              
              {/* Detailed Phase Timeline */}
              <div className="space-y-3">
                {phases.map((phase) => {
                  const phaseDate = getPhaseDate(phase.id);
                  const status = phaseDate?.status || 'pending';
                  
                  return (
                    <div 
                      key={phase.id} 
                      className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                        status === 'in_progress' ? 'bg-primary/5 border border-primary/20' : 
                        status === 'completed' ? 'bg-muted/50' : ''
                      }`}
                    >
                      <div className="mt-0.5">
                        {getStatusIcon(status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`font-medium ${
                            status === 'in_progress' ? 'text-primary' : 
                            status === 'completed' ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {phase.label}
                          </span>
                          <Badge variant={
                            status === 'completed' ? 'default' :
                            status === 'in_progress' ? 'secondary' : 'outline'
                          } className="text-xs">
                            {status === 'completed' ? 'Completed' : 
                             status === 'in_progress' ? 'In Progress' : 'Pending'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          {phaseDate?.startDate && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Started: {formatDate(phaseDate.startDate)}
                            </span>
                          )}
                          {phaseDate?.endDate && (
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Ended: {formatDate(phaseDate.endDate)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-3">
              <Button variant="outline" className="justify-start h-auto py-4" onClick={() => navigate('/product-catalog')}>
                <Settings className="mr-2 h-5 w-5 text-secondary" />
                <div className="text-left">
                  <p className="font-medium">Configure Products</p>
                  <p className="text-xs text-muted-foreground">Set up catalog</p>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-4">
                <Database className="mr-2 h-5 w-5 text-amber-500" />
                <div className="text-left">
                  <p className="font-medium">Migrate Data</p>
                  <p className="text-xs text-muted-foreground">Import records</p>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-4">
                <FileText className="mr-2 h-5 w-5 text-purple-500" />
                <div className="text-left">
                  <p className="font-medium">View Tasks</p>
                  <p className="text-xs text-muted-foreground">5 pending</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Team */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {implementation.team.map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {member.name.split(' ').map((n) => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Key Dates */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Key Dates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Kickoff</span>
                <span className="text-sm font-medium">{formatDate(implementation.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Target Go-Live</span>
                <span className="text-sm font-medium">{formatDate(implementation.targetGoLive)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Days Remaining</span>
                <span className="text-sm font-medium text-primary">{implementation.daysToGoLive} days</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}