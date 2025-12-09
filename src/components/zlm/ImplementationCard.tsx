import { Calendar, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Implementation } from '@/types/zlm';
import { HealthScoreRing } from './HealthScoreRing';
import { PhaseBadge } from './PhaseBadge';
import { TeamAvatars } from './TeamAvatars';
import { cn } from '@/lib/utils';

interface ImplementationCardProps {
  implementation: Implementation;
  onClick?: () => void;
  className?: string;
}

export function ImplementationCard({ implementation, onClick, className }: ImplementationCardProps) {
  const { customerName, currentPhase, healthScore, daysToGoLive, team, industry } = implementation;

  return (
    <Card 
      className={cn(
        'group hover:shadow-lg transition-all duration-200 cursor-pointer border-border/50 hover:border-primary/30',
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground truncate">{customerName}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{industry}</p>
            
            <div className="flex items-center gap-3 mb-4">
              <PhaseBadge phase={currentPhase} />
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{daysToGoLive} days to go-live</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <TeamAvatars team={team} max={3} />
              <Button 
                variant="ghost" 
                size="sm" 
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                View Details
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <HealthScoreRing score={healthScore.overall} size="md" />
            <span className="text-xs text-muted-foreground mt-1">Health</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
