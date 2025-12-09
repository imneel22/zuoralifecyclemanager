import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WizardStep } from '@/types/zlm';

interface WizardStepperProps {
  steps: WizardStep[];
  currentStep: number;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function WizardStepper({ steps, currentStep, orientation = 'horizontal', className }: WizardStepperProps) {
  return (
    <div className={cn(
      orientation === 'horizontal' ? 'flex items-center gap-2' : 'flex flex-col gap-4',
      className
    )}>
      {steps.map((step, index) => {
        const isComplete = index < currentStep;
        const isActive = index === currentStep;
        const isPending = index > currentStep;

        return (
          <div
            key={step.id}
            className={cn(
              'flex items-center gap-3',
              orientation === 'horizontal' && index < steps.length - 1 && 'flex-1'
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'flex items-center justify-center rounded-full h-8 w-8 text-sm font-medium transition-colors',
                  isComplete && 'bg-green-500 text-white',
                  isActive && 'bg-primary text-primary-foreground',
                  isPending && 'bg-muted text-muted-foreground'
                )}
              >
                {isComplete ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              
              <div className={cn(
                orientation === 'horizontal' && 'hidden lg:block'
              )}>
                <p className={cn(
                  'text-sm font-medium',
                  isActive && 'text-primary',
                  isPending && 'text-muted-foreground'
                )}>
                  {step.title}
                </p>
                {orientation === 'vertical' && (
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                )}
              </div>
            </div>
            
            {orientation === 'horizontal' && index < steps.length - 1 && (
              <div className={cn(
                'flex-1 h-0.5 mx-2',
                isComplete ? 'bg-green-500' : 'bg-muted'
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}
