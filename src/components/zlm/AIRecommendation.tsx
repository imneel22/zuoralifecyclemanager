import { Sparkles, ThumbsUp, ThumbsDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface AIRecommendationProps {
  title: string;
  description: string;
  onAccept?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export function AIRecommendation({ title, description, onAccept, onDismiss, className }: AIRecommendationProps) {
  const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(null);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className={cn('ai-recommendation relative', className)}>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-6 w-6"
        onClick={() => {
          setDismissed(true);
          onDismiss?.();
        }}
      >
        <X className="h-4 w-4" />
      </Button>
      
      <div className="flex items-start gap-3 pr-8">
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-base bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-1">{title}</h4>
          <p className="text-sm text-foreground/80">{description}</p>
          
          <div className="flex items-center gap-3 mt-3">
            {onAccept && (
              <Button size="sm" variant="secondary" onClick={onAccept}>
                Apply Recommendation
              </Button>
            )}
            
            <div className="flex items-center gap-1 ml-auto">
              <span className="text-xs text-muted-foreground mr-2">Helpful?</span>
              <Button
                variant="ghost"
                size="icon"
                className={cn('h-7 w-7', feedback === 'positive' && 'text-green-500')}
                onClick={() => setFeedback('positive')}
              >
                <ThumbsUp className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn('h-7 w-7', feedback === 'negative' && 'text-red-500')}
                onClick={() => setFeedback('negative')}
              >
                <ThumbsDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
