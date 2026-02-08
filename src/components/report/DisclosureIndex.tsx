import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, XCircle, FileSearch } from 'lucide-react';
import type { ReportDisclosure } from '@/types/compliance';

interface DisclosureIndexProps {
    disclosures: ReportDisclosure[];
    totalDisclosures: number;
    addressedDisclosures: number;
    partialDisclosures: number;
    omittedDisclosures: number;
}

const STATUS_CONFIG = {
    addressed: {
        icon: CheckCircle,
        label: 'Addressed',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        badgeVariant: 'default' as const,
    },
    partial: {
        icon: AlertCircle,
        label: 'Partial',
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
        badgeVariant: 'secondary' as const,
    },
    omitted: {
        icon: XCircle,
        label: 'Omitted',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        badgeVariant: 'destructive' as const,
    },
};

export function DisclosureIndex({
    disclosures,
    totalDisclosures,
    addressedDisclosures,
    partialDisclosures,
    omittedDisclosures,
}: DisclosureIndexProps) {
    // Group disclosures by framework
    const groupedByFramework = disclosures.reduce((acc, d) => {
        if (!acc[d.framework]) {
            acc[d.framework] = [];
        }
        acc[d.framework].push(d);
        return acc;
    }, {} as Record<string, ReportDisclosure[]>);

    const frameworks = Object.keys(groupedByFramework);
    const completionRate = totalDisclosures > 0
        ? Math.round((addressedDisclosures / totalDisclosures) * 100)
        : 0;

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <FileSearch className="w-5 h-5" />
                            Disclosure Index
                        </CardTitle>
                        <CardDescription>
                            Overview of addressed disclosure requirements
                        </CardDescription>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold">{completionRate}%</div>
                        <div className="text-xs text-muted-foreground">Completion</div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Summary stats */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 rounded-lg bg-green-50 text-center">
                        <div className="text-2xl font-bold text-green-700">{addressedDisclosures}</div>
                        <div className="text-xs text-green-600">Addressed</div>
                    </div>
                    <div className="p-3 rounded-lg bg-amber-50 text-center">
                        <div className="text-2xl font-bold text-amber-700">{partialDisclosures}</div>
                        <div className="text-xs text-amber-600">Partial</div>
                    </div>
                    <div className="p-3 rounded-lg bg-red-50 text-center">
                        <div className="text-2xl font-bold text-red-700">{omittedDisclosures}</div>
                        <div className="text-xs text-red-600">Omitted</div>
                    </div>
                </div>

                {/* Disclosures by framework */}
                {frameworks.map((framework) => (
                    <div key={framework} className="border-t pt-4">
                        <h4 className="text-sm font-semibold mb-3">{framework} Disclosures</h4>
                        <div className="space-y-2">
                            {groupedByFramework[framework].map((disclosure) => {
                                const config = STATUS_CONFIG[disclosure.status];
                                const Icon = config.icon;

                                return (
                                    <div
                                        key={disclosure.id}
                                        className={`p-3 rounded-lg ${config.bgColor} flex items-center justify-between`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon className={`w-4 h-4 ${config.color}`} />
                                            <div>
                                                <span className="font-mono text-xs mr-2">
                                                    {disclosure.code}
                                                </span>
                                                <span className="text-sm">{disclosure.title}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {disclosure.reference && (
                                                <span className="text-xs text-muted-foreground">
                                                    → {disclosure.reference}
                                                </span>
                                            )}
                                            <Badge variant={config.badgeVariant} className="text-xs">
                                                {config.label}
                                            </Badge>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
