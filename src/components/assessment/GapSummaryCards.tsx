import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, AlertTriangle, Info, CheckCircle, Target } from 'lucide-react';
import type { Gap } from '@/types/compliance';

interface GapSummaryCardsProps {
    gaps: Gap[];
}

interface SeverityCount {
    severity: Gap['severity'];
    count: number;
    label: string;
    icon: typeof AlertCircle;
    bgColor: string;
    textColor: string;
    iconColor: string;
}

export function GapSummaryCards({ gaps }: GapSummaryCardsProps) {
    const severityCounts: SeverityCount[] = [
        {
            severity: 'critical',
            count: gaps.filter(g => g.severity === 'critical').length,
            label: 'Critical',
            icon: AlertCircle,
            bgColor: 'bg-red-50',
            textColor: 'text-red-900',
            iconColor: 'text-red-600',
        },
        {
            severity: 'high',
            count: gaps.filter(g => g.severity === 'high').length,
            label: 'High',
            icon: AlertTriangle,
            bgColor: 'bg-orange-50',
            textColor: 'text-orange-900',
            iconColor: 'text-orange-600',
        },
        {
            severity: 'medium',
            count: gaps.filter(g => g.severity === 'medium').length,
            label: 'Medium',
            icon: Info,
            bgColor: 'bg-yellow-50',
            textColor: 'text-yellow-900',
            iconColor: 'text-yellow-600',
        },
        {
            severity: 'low',
            count: gaps.filter(g => g.severity === 'low').length,
            label: 'Low',
            icon: CheckCircle,
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-900',
            iconColor: 'text-blue-600',
        },
    ];

    const totalGaps = gaps.length;

    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {/* Total Gaps Card */}
            <Card className="bg-slate-50">
                <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-slate-200">
                            <Target className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900">{totalGaps}</p>
                            <p className="text-xs text-slate-600">Total Gaps</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Severity Cards */}
            {severityCounts.map(({ severity, count, label, icon: Icon, bgColor, textColor, iconColor }) => (
                <Card key={severity} className={bgColor}>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${bgColor}`}>
                                <Icon className={`w-5 h-5 ${iconColor}`} />
                            </div>
                            <div>
                                <p className={`text-2xl font-bold ${textColor}`}>{count}</p>
                                <p className={`text-xs ${iconColor}`}>{label}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
