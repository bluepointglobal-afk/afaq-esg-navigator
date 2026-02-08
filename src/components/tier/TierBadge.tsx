import { Badge } from '@/components/ui/badge';
import { Crown, Star, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserTier } from '@/types';

interface TierBadgeProps {
    tier: UserTier;
    variant?: 'compact' | 'full';
    className?: string;
}

const TIER_CONFIG: Record<UserTier, {
    label: string;
    icon: typeof Crown;
    colors: string;
    bgColor: string;
}> = {
    free: {
        label: 'Free',
        icon: Sparkles,
        colors: 'text-slate-600',
        bgColor: 'bg-slate-100 hover:bg-slate-200',
    },
    pro: {
        label: 'Pro',
        icon: Star,
        colors: 'text-blue-600',
        bgColor: 'bg-blue-100 hover:bg-blue-200',
    },
    enterprise: {
        label: 'Enterprise',
        icon: Crown,
        colors: 'text-amber-600',
        bgColor: 'bg-amber-100 hover:bg-amber-200',
    },
};

export function TierBadge({ tier, variant = 'compact', className }: TierBadgeProps) {
    const config = TIER_CONFIG[tier];
    const Icon = config.icon;

    if (variant === 'compact') {
        return (
            <Badge
                variant="secondary"
                className={cn(
                    'gap-1 font-medium transition-colors cursor-pointer',
                    config.bgColor,
                    config.colors,
                    className
                )}
            >
                <Icon className="w-3 h-3" />
                {config.label}
            </Badge>
        );
    }

    return (
        <div
            className={cn(
                'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-colors',
                config.bgColor,
                config.colors,
                className
            )}
        >
            <Icon className="w-4 h-4" />
            <span>{config.label} Plan</span>
        </div>
    );
}

export { TIER_CONFIG };
