import { useOnboarding, OnboardingType } from '@/contexts/OnboardingContext';
import { DollarSign, TrendingUp, ChevronDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function OnboardingSwitch() {
  const { onboardingType, setOnboardingType } = useOnboarding();

  return (
    <Select value={onboardingType} onValueChange={(value: OnboardingType) => setOnboardingType(value)}>
      <SelectTrigger className="w-[180px] bg-muted/50 border-0">
        <div className="flex items-center gap-2">
          {onboardingType === 'billing' ? (
            <DollarSign className="h-4 w-4 text-primary" />
          ) : (
            <TrendingUp className="h-4 w-4 text-primary" />
          )}
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="billing">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span>Billing Onboarding</span>
          </div>
        </SelectItem>
        <SelectItem value="revenue">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span>Revenue Onboarding</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
