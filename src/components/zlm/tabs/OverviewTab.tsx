import { Calendar, FileText, Settings, Database, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Implementation, Phase } from '@/types/zlm';
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

export function OverviewTab({ implementation }: OverviewTabProps) {
  const navigate = useNavigate();
  const currentPhaseIndex = phases.findIndex((p) => p.id === implementation.currentPhase);
  const progress = ((currentPhaseIndex + 1) / phases.length) * 100;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        {/* AI Recommendation */}
        <AIRecommendation
          title="AI Insight"
          description="Based on similar implementations, consider scheduling the data migration review earlier. Companies in the Technology sector typically need 2 extra days for API integration testing."
          onAccept={() => console.log('Accepted recommendation')}
        />

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Implementation Timeline</CardTitle>
            <CardDescription>Current phase: {phases[currentPhaseIndex]?.label}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between">
                {phases.map((phase, index) => (
                  <div
                    key={phase.id}
                    className={`flex flex-col items-center ${
                      index <= currentPhaseIndex ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    <div
                      className={`h-3 w-3 rounded-full mb-1 ${
                        index < currentPhaseIndex
                          ? 'bg-green-500'
                          : index === currentPhaseIndex
                          ? 'bg-primary'
                          : 'bg-muted'
                      }`}
                    />
                    <span className="text-xs text-center hidden sm:block">{phase.label}</span>
                  </div>
                ))}
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

        {/* Customer Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-muted-foreground">SFDC Opportunity ID</dt>
                <dd className="font-medium">{implementation.sfdcOpportunityId}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Industry</dt>
                <dd className="font-medium">{implementation.industry}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Target Go-Live</dt>
                <dd className="font-medium">{new Date(implementation.targetGoLive).toLocaleDateString()}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Product Types</dt>
                <dd className="font-medium">{implementation.productTypes.join(', ')}</dd>
              </div>
            </dl>
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
                <span className="text-sm font-medium">{new Date(implementation.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Target Go-Live</span>
                <span className="text-sm font-medium">{new Date(implementation.targetGoLive).toLocaleDateString()}</span>
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
