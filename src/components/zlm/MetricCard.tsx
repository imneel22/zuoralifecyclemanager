import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GoLiveMetric } from '@/types/zlm';

interface MetricCardProps {
  metric: GoLiveMetric;
  className?: string;
}

export function MetricCard({ metric, className }: MetricCardProps) {
  const { label, value, change, changeType, unit } = metric;

  const formatValue = (val: number) => {
    if (val >= 1000) {
      return (val / 1000).toFixed(1) + 'K';
    }
    return val.toLocaleString();
  };

  return (
    <div className={cn('metric-card', className)}>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      
      <div className="flex items-end justify-between">
        <div className="flex items-baseline gap-1">
          {unit === '$' && <span className="text-lg text-muted-foreground">$</span>}
          <span className="text-3xl font-bold text-foreground">{formatValue(value)}</span>
          {unit === 'ms' && <span className="text-lg text-muted-foreground">ms</span>}
        </div>
        
        <div className={cn(
          'flex items-center gap-1 text-sm font-medium',
          changeType === 'positive' && 'text-green-600',
          changeType === 'negative' && 'text-red-600',
          changeType === 'neutral' && 'text-muted-foreground'
        )}>
          {changeType === 'positive' && <TrendingUp className="h-4 w-4" />}
          {changeType === 'negative' && <TrendingDown className="h-4 w-4" />}
          {changeType === 'neutral' && <Minus className="h-4 w-4" />}
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
    </div>
  );
}
