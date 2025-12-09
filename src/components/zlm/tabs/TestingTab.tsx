import { Play, CheckCircle2, XCircle, Clock, FileText, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const testScenarios = [
  {
    id: '1',
    name: 'Subscription Create Flow',
    description: 'Test creating new subscriptions with various rate plans',
    status: 'passed',
    duration: '2.3s',
    lastRun: '2024-02-10T14:30:00Z',
  },
  {
    id: '2',
    name: 'Invoice Generation',
    description: 'Verify invoice generation and PDF rendering',
    status: 'passed',
    duration: '4.1s',
    lastRun: '2024-02-10T14:30:00Z',
  },
  {
    id: '3',
    name: 'Payment Processing',
    description: 'Test payment collection via Stripe gateway',
    status: 'failed',
    duration: '1.8s',
    lastRun: '2024-02-10T14:30:00Z',
    error: 'Gateway timeout after 30s',
  },
  {
    id: '4',
    name: 'Usage-Based Billing',
    description: 'Validate usage aggregation and rating',
    status: 'pending',
    duration: null,
    lastRun: null,
  },
  {
    id: '5',
    name: 'Amendment Workflow',
    description: 'Test subscription upgrades and downgrades',
    status: 'pending',
    duration: null,
    lastRun: null,
  },
];

const statusConfig = {
  passed: { icon: CheckCircle2, label: 'Passed', className: 'bg-green-100 text-green-700' },
  failed: { icon: XCircle, label: 'Failed', className: 'bg-red-100 text-red-700' },
  pending: { icon: Clock, label: 'Pending', className: 'bg-slate-100 text-slate-600' },
  running: { icon: RotateCcw, label: 'Running', className: 'bg-blue-100 text-blue-600' },
};

export function TestingTab() {
  const passedCount = testScenarios.filter((t) => t.status === 'passed').length;
  const totalCount = testScenarios.length;
  const passRate = Math.round((passedCount / totalCount) * 100);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{totalCount}</div>
            <p className="text-sm text-muted-foreground">Total Scenarios</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{passedCount}</div>
            <p className="text-sm text-muted-foreground">Passed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">
              {testScenarios.filter((t) => t.status === 'failed').length}
            </div>
            <p className="text-sm text-muted-foreground">Failed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Progress value={passRate} className="h-2 flex-1" />
              <span className="text-sm font-medium">{passRate}%</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Pass Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Test Scenarios */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Test Scenarios</CardTitle>
              <CardDescription>End-to-end billing workflow tests</CardDescription>
            </div>
            <Button className="gap-2">
              <Play className="h-4 w-4" />
              Run All Tests
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {testScenarios.map((test) => {
              const status = statusConfig[test.status as keyof typeof statusConfig];
              const Icon = status.icon;
              
              return (
                <div
                  key={test.id}
                  className={cn(
                    'p-4 rounded-lg border',
                    test.status === 'failed' && 'border-red-200 bg-red-50/50'
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{test.name}</h4>
                        <Badge className={cn('gap-1', status.className)}>
                          <Icon className="h-3 w-3" />
                          {status.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{test.description}</p>
                      {test.error && (
                        <p className="text-sm text-red-600 mt-2">Error: {test.error}</p>
                      )}
                      {test.duration && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Duration: {test.duration} • Last run: {new Date(test.lastRun!).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-1" />
                        Logs
                      </Button>
                      <Button variant="outline" size="sm">
                        <Play className="h-4 w-4 mr-1" />
                        Run
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
