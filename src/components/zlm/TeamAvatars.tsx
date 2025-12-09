import { cn } from '@/lib/utils';
import { TeamMember } from '@/types/zlm';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface TeamAvatarsProps {
  team: TeamMember[];
  max?: number;
  size?: 'sm' | 'md';
  className?: string;
}

const sizeClasses = {
  sm: 'h-7 w-7 text-xs',
  md: 'h-9 w-9 text-sm',
};

export function TeamAvatars({ team, max = 3, size = 'sm', className }: TeamAvatarsProps) {
  const displayedMembers = team.slice(0, max);
  const remainingCount = team.length - max;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const getColor = (name: string) => {
    const colors = [
      'bg-primary text-primary-foreground',
      'bg-secondary text-secondary-foreground',
      'bg-amber-500 text-white',
      'bg-purple-500 text-white',
      'bg-green-500 text-white',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className={cn('flex -space-x-2', className)}>
      {displayedMembers.map((member) => (
        <Tooltip key={member.id}>
          <TooltipTrigger asChild>
            <Avatar className={cn(
              sizeClasses[size],
              'border-2 border-background cursor-pointer',
              getColor(member.name)
            )}>
              <AvatarFallback className={getColor(member.name)}>
                {getInitials(member.name)}
              </AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-medium">{member.name}</p>
            <p className="text-xs text-muted-foreground">{member.role}</p>
          </TooltipContent>
        </Tooltip>
      ))}
      {remainingCount > 0 && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Avatar className={cn(
              sizeClasses[size],
              'border-2 border-background bg-muted text-muted-foreground cursor-pointer'
            )}>
              <AvatarFallback className="bg-muted text-muted-foreground">
                +{remainingCount}
              </AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>
            <p>{remainingCount} more team members</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}
