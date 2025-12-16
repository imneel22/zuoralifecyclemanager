import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Percent, Clock, XCircle, RefreshCw, TrendingUp, Edit, ArrowRight } from 'lucide-react';

interface BehaviorItem {
  name: string;
  count: number;
}

interface BehaviorCard {
  id: string;
  title: string;
  icon: React.ReactNode;
  totalCount: number;
  allTypesLabel: string;
  items: BehaviorItem[];
  footerText: string;
  color: string;
}

const behaviorCards: BehaviorCard[] = [
  {
    id: 'discount',
    title: 'Discount Behaviors',
    icon: <Percent className="h-5 w-5" />,
    totalCount: 446,
    allTypesLabel: 'All Discount Types',
    items: [
      { name: 'Stacked Discounts', count: 0 },
      { name: '% Discounts', count: 0 },
      { name: 'Fixed Amount', count: 0 },
      { name: 'Negative Charge', count: 0 },
    ],
    footerText: 'Includes all discount patterns',
    color: 'from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20',
  },
  {
    id: 'term-type',
    title: 'Term Type Behaviors',
    icon: <Clock className="h-5 w-5" />,
    totalCount: 24954,
    allTypesLabel: 'All Term Types',
    items: [
      { name: 'Termed', count: 13808 },
      { name: 'Evergreen', count: 11146 },
    ],
    footerText: 'Includes all term type patterns',
    color: 'from-indigo-50 to-indigo-100 dark:from-indigo-950/30 dark:to-indigo-900/20',
  },
  {
    id: 'cancellation',
    title: 'Cancellation Behaviors',
    icon: <XCircle className="h-5 w-5" />,
    totalCount: 3419,
    allTypesLabel: 'All Cancellation Types',
    items: [
      { name: 'General Cancellation', count: 9 },
      { name: 'Early - No Fees', count: 3 },
      { name: 'Early - With Fees', count: 0 },
      { name: 'Payment Issues', count: 0 },
      { name: 'Early - With Credit', count: 3 },
    ],
    footerText: 'Includes all cancellation patterns',
    color: 'from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/20',
  },
  {
    id: 'renewal',
    title: 'Renewal Behaviors',
    icon: <RefreshCw className="h-5 w-5" />,
    totalCount: 7895,
    allTypesLabel: 'All Renewal Types',
    items: [
      { name: 'Auto Renewals On Time', count: 0 },
      { name: 'On Time Manual', count: 3 },
      { name: 'Early Manual Override', count: 0 },
      { name: 'Early Manual', count: 3 },
      { name: 'Late Manual', count: 0 },
    ],
    footerText: 'Includes all renewal patterns',
    color: 'from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20',
  },
  {
    id: 'subscription-change',
    title: 'Subscription Change Behaviors',
    icon: <TrendingUp className="h-5 w-5" />,
    totalCount: 7300,
    allTypesLabel: 'All Change Types',
    items: [
      { name: 'Upsells', count: 44 },
      { name: 'Downsells', count: 17 },
      { name: 'Quantity Increases', count: 8 },
      { name: 'Quantity Decreases', count: 8 },
      { name: 'Price Changes', count: 5 },
    ],
    footerText: 'Includes all subscription modification patterns',
    color: 'from-cyan-50 to-cyan-100 dark:from-cyan-950/30 dark:to-cyan-900/20',
  },
  {
    id: 'term-modification',
    title: 'Term Modification Behaviors',
    icon: <Edit className="h-5 w-5" />,
    totalCount: 220,
    allTypesLabel: 'All Term Modifications',
    items: [
      { name: 'Term Extensions', count: 0 },
      { name: 'Term Reductions', count: 0 },
      { name: 'Start Date Changes', count: 0 },
      { name: 'Billing Timing Changes', count: 0 },
      { name: 'Billing Period Changes', count: 0 },
    ],
    footerText: 'Includes all term modification patterns',
    color: 'from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20',
  },
];

export function HowTheySellTab() {
  const totalSubscriptions = 24954;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Badge variant="default" className="gap-1.5 px-3 py-1.5">
          <span className="grid grid-cols-2 gap-0.5">
            <span className="w-1.5 h-1.5 bg-current rounded-sm" />
            <span className="w-1.5 h-1.5 bg-current rounded-sm" />
            <span className="w-1.5 h-1.5 bg-current rounded-sm" />
            <span className="w-1.5 h-1.5 bg-current rounded-sm" />
          </span>
          Overview
        </Badge>
      </div>

      {/* Total Subscriptions Banner */}
      <Card className="bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-950/50 dark:to-blue-900/30 border-blue-200 dark:border-blue-800">
        <CardContent className="py-6">
          <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">{totalSubscriptions.toLocaleString()}</div>
          <p className="text-sm text-muted-foreground">Total Subscriptions</p>
        </CardContent>
      </Card>

      {/* Behavior Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {behaviorCards.map((card) => (
          <Card key={card.id} className={`bg-gradient-to-br ${card.color} border`}>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="text-primary">{card.icon}</div>
                <div>
                  <CardTitle className="text-base font-semibold">{card.title}</CardTitle>
                  <p className="text-xs text-muted-foreground">Subscription Behavior</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Total Count */}
              <div>
                <div className="text-3xl font-bold text-primary">{card.totalCount.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Total Subscriptions</p>
              </div>

              {/* Items List */}
              <div className="space-y-1">
                <div className="flex items-center justify-between py-1.5 border-b">
                  <span className="text-sm font-medium">{card.allTypesLabel}</span>
                  <Badge variant="secondary" className="font-semibold">
                    {card.totalCount.toLocaleString()}
                  </Badge>
                </div>
                {card.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-1.5">
                    <span className="text-sm text-muted-foreground">{item.name}</span>
                    <span className="text-sm font-medium">{item.count.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="pt-2 border-t space-y-2">
                <p className="text-xs text-muted-foreground text-center">{card.footerText}</p>
                <button className="flex items-center justify-center gap-1 text-xs text-primary hover:underline w-full">
                  Click to view details
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
