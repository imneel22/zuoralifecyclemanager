import { useOnboarding, OnboardingType } from '@/contexts/OnboardingContext';
import { cn } from '@/lib/utils';
import { DollarSign, TrendingUp } from 'lucide-react';

export function OnboardingSwitch() {
  const { onboardingType, setOnboardingType } = useOnboarding();

  const options: { value: OnboardingType; label: string; icon: React.ReactNode }[] = [
    { value: 'billing', label: 'Billing', icon: <DollarSign className="h-4 w-4" /> },
    { value: 'revenue', label: 'Revenue', icon: <TrendingUp className="h-4 w-4" /> },
  ];

  return (
    <div className="flex items-center bg-muted rounded-lg p-1">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => setOnboardingType(option.value)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all',
            onboardingType === option.value
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {option.icon}
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  );
}
