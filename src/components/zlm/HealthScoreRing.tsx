import { cn } from '@/lib/utils';
import { HealthStatus } from '@/types/zlm';

interface HealthScoreRingProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const getHealthStatus = (score: number): HealthStatus => {
  if (score >= 80) return 'green';
  if (score >= 60) return 'amber';
  return 'red';
};

const statusColors: Record<HealthStatus, string> = {
  green: 'stroke-green-500',
  amber: 'stroke-amber-500',
  red: 'stroke-red-500',
};

const statusBgColors: Record<HealthStatus, string> = {
  green: 'text-green-600',
  amber: 'text-amber-600',
  red: 'text-red-600',
};

const sizeConfig = {
  sm: { size: 48, strokeWidth: 4, fontSize: 'text-sm' },
  md: { size: 72, strokeWidth: 5, fontSize: 'text-lg' },
  lg: { size: 96, strokeWidth: 6, fontSize: 'text-2xl' },
};

export function HealthScoreRing({ score, size = 'md', showLabel = true, className }: HealthScoreRingProps) {
  const status = getHealthStatus(score);
  const config = sizeConfig[size];
  const radius = (config.size - config.strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={config.size}
        height={config.size}
        className="transform -rotate-90"
      >
        <circle
          cx={config.size / 2}
          cy={config.size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={config.strokeWidth}
          className="text-muted/30"
        />
        <circle
          cx={config.size / 2}
          cy={config.size / 2}
          r={radius}
          fill="none"
          strokeWidth={config.strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn('transition-all duration-500', statusColors[status])}
        />
      </svg>
      {showLabel && (
        <span className={cn(
          'absolute font-semibold',
          config.fontSize,
          statusBgColors[status]
        )}>
          {score}
        </span>
      )}
    </div>
  );
}
