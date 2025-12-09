import { AlertTriangle, Info, XCircle, Sparkles, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Alert } from '@/types/zlm';

interface AlertCardProps {
  alert: Alert;
  onViewDetails?: () => void;
  className?: string;
}

const severityConfig = {
  info: {
    icon: Info,
    className: 'border-l-4 border-l-blue-500 bg-blue-50',
    iconClassName: 'text-blue-500',
  },
  warning: {
    icon: AlertTriangle,
    className: 'border-l-4 border-l-amber-500 bg-amber-50',
    iconClassName: 'text-amber-500',
  },
  error: {
    icon: XCircle,
    className: 'border-l-4 border-l-red-500 bg-red-50',
    iconClassName: 'text-red-500',
  },
};

export function AlertCard({ alert, onViewDetails, className }: AlertCardProps) {
  const { severity, title, description, recommendation, timestamp } = alert;
  const config = severityConfig[severity];
  const Icon = config.icon;

  const formatTime = (ts: string) => {
    const date = new Date(ts);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={cn('rounded-lg p-4', config.className, className)}>
      <div className="flex items-start gap-3">
        <Icon className={cn('h-5 w-5 mt-0.5 flex-shrink-0', config.iconClassName)} />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className="font-medium text-sm text-foreground">{title}</h4>
            <span className="text-xs text-muted-foreground">{formatTime(timestamp)}</span>
          </div>
          
          <p className="text-sm text-foreground/80 mb-3">{description}</p>
          
          <div className="flex items-start gap-2 p-2 bg-white/50 rounded-md">
            <Sparkles className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
            <p className="text-xs text-foreground/70">{recommendation}</p>
          </div>
          
          {onViewDetails && (
            <Button variant="ghost" size="sm" className="mt-2 -ml-2" onClick={onViewDetails}>
              View Details
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
