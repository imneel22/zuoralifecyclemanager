import { cn } from '@/lib/utils';
import { Phase } from '@/types/zlm';

interface PhaseBadgeProps {
  phase: Phase;
  className?: string;
}

const phaseConfig: Record<Phase, { label: string; className: string }> = {
  discovery: { label: 'Discovery', className: 'phase-discovery' },
  configuration: { label: 'Configuration', className: 'phase-configuration' },
  migration: { label: 'Migration', className: 'phase-migration' },
  testing: { label: 'Testing', className: 'phase-testing' },
  golive: { label: 'Go-Live', className: 'phase-golive' },
};

export function PhaseBadge({ phase, className }: PhaseBadgeProps) {
  const config = phaseConfig[phase];
  
  return (
    <span className={cn('phase-badge', config.className, className)}>
      {config.label}
    </span>
  );
}
