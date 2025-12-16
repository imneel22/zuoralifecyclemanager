import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, TrendingUp, Layers, ArrowRight, Package, Settings, FileText, Briefcase } from 'lucide-react';

interface UseCase {
  id: string;
  rank: number;
  name: string;
  useCaseCount: number;
  sampleSubscriptions: string[];
  color: string;
  barColor: string;
}

const mockUseCases: UseCase[] = [
  {
    id: '1',
    rank: 1,
    name: 'Subscription - Saasmediafranchise',
    useCaseCount: 9,
    sampleSubscriptions: ['A-S00064681', 'A-S00063082', 'A-S00059913'],
    color: 'from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200 dark:border-blue-800',
    barColor: 'bg-blue-100 dark:bg-blue-900/50',
  },
  {
    id: '2',
    rank: 2,
    name: 'Onetime Setup And Onboarding',
    useCaseCount: 5,
    sampleSubscriptions: ['A-S00064681', 'A-S00059913', 'A-S00064132'],
    color: 'from-cyan-50 to-cyan-100 dark:from-cyan-950/30 dark:to-cyan-900/20 border-cyan-200 dark:border-cyan-800',
    barColor: 'bg-cyan-100 dark:bg-cyan-900/50',
  },
  {
    id: '3',
    rank: 3,
    name: 'Termed Professional Services Professional Mainten',
    useCaseCount: 2,
    sampleSubscriptions: ['A-S00059913', 'A-S00063149'],
    color: 'from-pink-50 to-pink-100 dark:from-pink-950/30 dark:to-pink-900/20 border-pink-200 dark:border-pink-800',
    barColor: 'bg-pink-100 dark:bg-pink-900/50',
  },
  {
    id: '4',
    rank: 4,
    name: 'Prof Services Milestone',
    useCaseCount: 1,
    sampleSubscriptions: ['A-S00064681'],
    color: 'from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/20 border-amber-200 dark:border-amber-800',
    barColor: 'bg-amber-100 dark:bg-amber-900/50',
  },
  {
    id: '5',
    rank: 5,
    name: 'Software License Termed Symbolic Ip',
    useCaseCount: 1,
    sampleSubscriptions: ['A-S00064681'],
    color: 'from-indigo-50 to-indigo-100 dark:from-indigo-950/30 dark:to-indigo-900/20 border-indigo-200 dark:border-indigo-800',
    barColor: 'bg-indigo-100 dark:bg-indigo-900/50',
  },
  {
    id: '6',
    rank: 6,
    name: 'True Up Charges Prepaid Drawdown Minimum Commit',
    useCaseCount: 1,
    sampleSubscriptions: ['A-S00064681'],
    color: 'from-rose-50 to-rose-100 dark:from-rose-950/30 dark:to-rose-900/20 border-rose-200 dark:border-rose-800',
    barColor: 'bg-rose-100 dark:bg-rose-900/50',
  },
  {
    id: '7',
    rank: 7,
    name: 'Prof Services Tm',
    useCaseCount: 1,
    sampleSubscriptions: ['A-S00064132'],
    color: 'from-violet-50 to-violet-100 dark:from-violet-950/30 dark:to-violet-900/20 border-violet-200 dark:border-violet-800',
    barColor: 'bg-violet-100 dark:bg-violet-900/50',
  },
  {
    id: '8',
    rank: 8,
    name: 'Single Outcome Based Services Audit Assessment Da',
    useCaseCount: 1,
    sampleSubscriptions: ['A-S00063149'],
    color: 'from-teal-50 to-teal-100 dark:from-teal-950/30 dark:to-teal-900/20 border-teal-200 dark:border-teal-800',
    barColor: 'bg-teal-100 dark:bg-teal-900/50',
  },
];

const getIcon = (rank: number) => {
  switch (rank % 4) {
    case 1: return <Package className="h-5 w-5 text-muted-foreground" />;
    case 2: return <Settings className="h-5 w-5 text-muted-foreground" />;
    case 3: return <FileText className="h-5 w-5 text-muted-foreground" />;
    default: return <Briefcase className="h-5 w-5 text-muted-foreground" />;
  }
};

export function UseCasesTab() {
  const productFamiliesCount = 8;
  const subscriptionsAsUseCases = 10;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Product Families & Use Cases</h2>
        </div>
        <Button variant="ghost" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="py-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{productFamiliesCount}</div>
                <p className="text-sm text-muted-foreground">Product Families</p>
              </div>
              <TrendingUp className="h-6 w-6 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="py-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">{subscriptionsAsUseCases}</div>
                <p className="text-sm text-muted-foreground">Subscriptions as Use Cases</p>
              </div>
              <Layers className="h-6 w-6 text-green-400" />
            </div>
            <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary mt-3">
              Click to view all use case subscriptions
              <ArrowRight className="h-3 w-3" />
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Use Case Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockUseCases.map((useCase) => {
          const extraCount = Math.max(0, useCase.sampleSubscriptions.length - 3 + (useCase.useCaseCount > useCase.sampleSubscriptions.length ? useCase.useCaseCount - useCase.sampleSubscriptions.length : 0));
          const displayedSubs = useCase.sampleSubscriptions.slice(0, 3);
          
          return (
            <Card key={useCase.id} className={`bg-gradient-to-br ${useCase.color}`}>
              <CardContent className="p-4 space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getIcon(useCase.rank)}
                    <div>
                      <h3 className="font-semibold text-sm leading-tight">{useCase.name}</h3>
                      <p className="text-xs text-muted-foreground">Product Family</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">#{useCase.rank}</span>
                </div>

                {/* Use Case Count */}
                <div className={`${useCase.barColor} rounded-lg py-3 text-center`}>
                  <div className="text-2xl font-bold text-primary">{useCase.useCaseCount}</div>
                  <p className="text-xs text-muted-foreground">Use Cases</p>
                </div>

                {/* Sample Subscriptions */}
                <div>
                  <p className="text-xs text-muted-foreground mb-1.5">Sample Subscriptions:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {displayedSubs.map((sub, idx) => (
                      <span key={idx} className="text-xs font-mono bg-background/60 px-2 py-0.5 rounded">
                        {sub}
                      </span>
                    ))}
                    {extraCount > 0 && (
                      <span className="text-xs text-muted-foreground">+{extraCount} more</span>
                    )}
                  </div>
                </div>

                {/* Footer Link */}
                <button className="flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-primary w-full pt-2 border-t">
                  Click to view all subscriptions
                  <ArrowRight className="h-3 w-3" />
                </button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
