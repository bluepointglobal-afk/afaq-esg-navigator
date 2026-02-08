import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TierBadge, TIER_CONFIG } from './TierBadge';
import { useCheckout } from '@/hooks/use-checkout';
import { Check, Zap, Loader2 } from 'lucide-react';
import { UserTier } from '@/types';

interface TierCardProps {
    currentTier: UserTier;
}

const TIER_BENEFITS: Record<UserTier, string[]> = {
    free: [
        'Basic ESG questionnaire',
        'Gap analysis report',
        'HTML export',
    ],
    pro: [
        'Everything in Free',
        'PDF & Excel exports',
        'AI-powered disclosure generation',
        'Priority support',
    ],
    enterprise: [
        'Everything in Pro',
        'Custom branding',
        'API access',
        'Multi-entity consolidation',
        'Dedicated account manager',
    ],
};

const TIER_PRICING: Record<UserTier, { price: string; period: string } | null> = {
    free: null,
    pro: { price: '$99', period: 'per report' },
    enterprise: { price: 'Custom', period: 'contact sales' },
};

export function TierCard({ currentTier }: TierCardProps) {
    const { checkout, isLoading } = useCheckout();
    const config = TIER_CONFIG[currentTier];
    const benefits = TIER_BENEFITS[currentTier];

    const handleUpgrade = (priceType: 'per_report' | 'annual') => {
        checkout({ priceType, returnPath: '/settings' });
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-3">
                            <Zap className="w-5 h-5" />
                            Subscription
                        </CardTitle>
                        <CardDescription>Manage your plan and billing</CardDescription>
                    </div>
                    <TierBadge tier={currentTier} variant="full" />
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h4 className="text-sm font-medium mb-3">Your plan includes:</h4>
                    <ul className="space-y-2">
                        {benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Check className={`w-4 h-4 ${config.colors}`} />
                                {benefit}
                            </li>
                        ))}
                    </ul>
                </div>

                {currentTier !== 'enterprise' && (
                    <div className="pt-4 border-t space-y-3">
                        <p className="text-sm text-muted-foreground">
                            {currentTier === 'free'
                                ? 'Upgrade to Pro for professional exports and AI-powered disclosures.'
                                : 'Need more? Contact us for Enterprise features.'}
                        </p>
                        {currentTier === 'free' && (
                            <div className="flex flex-col sm:flex-row gap-2">
                                <Button
                                    onClick={() => handleUpgrade('per_report')}
                                    disabled={isLoading}
                                    className="flex-1"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : null}
                                    Upgrade to Pro - $99/report
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => handleUpgrade('annual')}
                                    disabled={isLoading}
                                    className="flex-1"
                                >
                                    Annual Plan - $299/year
                                </Button>
                            </div>
                        )}
                        {currentTier === 'pro' && (
                            <Button variant="outline" asChild>
                                <a href="mailto:sales@afaq.com">Contact Sales for Enterprise</a>
                            </Button>
                        )}
                    </div>
                )}

                {currentTier === 'enterprise' && (
                    <div className="pt-4 border-t">
                        <p className="text-sm text-muted-foreground">
                            You have full access to all AFAQ features. Contact your account manager for support.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
