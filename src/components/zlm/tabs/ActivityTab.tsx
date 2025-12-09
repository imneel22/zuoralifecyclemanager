import { CheckCircle2, RefreshCw, MessageSquare, Upload, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from '@/types/zlm';
import { cn } from '@/lib/utils';

interface ActivityTabProps {
  activities: Activity[];
}

const activityConfig = {
  task_completed: { icon: CheckCircle2, className: 'text-green-500 bg-green-100' },
  phase_changed: { icon: RefreshCw, className: 'text-primary bg-primary/10' },
  comment: { icon: MessageSquare, className: 'text-blue-500 bg-blue-100' },
  file_uploaded: { icon: Upload, className: 'text-purple-500 bg-purple-100' },
  alert: { icon: AlertTriangle, className: 'text-amber-500 bg-amber-100' },
};

export function ActivityTab({ activities }: ActivityTabProps) {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-6">
            {activities.map((activity) => {
              const config = activityConfig[activity.type];
              const Icon = config.icon;

              return (
                <div key={activity.id} className="relative flex gap-4">
                  <div className={cn(
                    'relative z-10 flex h-10 w-10 items-center justify-center rounded-full',
                    config.className
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="flex-1 pt-1.5">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm">{activity.title}</h4>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(activity.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      by {activity.user.name}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
