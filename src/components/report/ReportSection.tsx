import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Leaf, Users, Building2, FileText, BarChart3, BookOpen } from 'lucide-react';
import type { ReportSection as ReportSectionType } from '@/types/compliance';

interface ReportSectionProps {
    section: ReportSectionType;
    showMetrics?: boolean;
}

const SECTION_ICONS: Record<ReportSectionType['type'], typeof Leaf> = {
    executive_summary: FileText,
    environmental: Leaf,
    social: Users,
    governance: Building2,
    methodology: BookOpen,
    data_annex: BarChart3,
};

const SECTION_COLORS: Record<ReportSectionType['type'], string> = {
    executive_summary: 'bg-slate-100 text-slate-700',
    environmental: 'bg-emerald-100 text-emerald-700',
    social: 'bg-violet-100 text-violet-700',
    governance: 'bg-blue-100 text-blue-700',
    methodology: 'bg-amber-100 text-amber-700',
    data_annex: 'bg-gray-100 text-gray-700',
};

export function ReportSection({ section, showMetrics = true }: ReportSectionProps) {
    const Icon = SECTION_ICONS[section.type];
    const colorClass = SECTION_COLORS[section.type];

    return (
        <Card className="mb-6">
            <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${colorClass}`}>
                        <Icon className="w-5 h-5" />
                    </div>
                    <div>
                        <CardTitle className="text-xl">{section.title}</CardTitle>
                        {section.titleArabic && (
                            <p className="text-sm text-muted-foreground mt-1" dir="rtl">
                                {section.titleArabic}
                            </p>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Narrative */}
                <div className="prose prose-sm max-w-none">
                    <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                        {section.narrative}
                    </p>
                    {section.narrativeArabic && (
                        <p className="text-muted-foreground mt-4 leading-relaxed" dir="rtl">
                            {section.narrativeArabic}
                        </p>
                    )}
                </div>

                {/* Metrics */}
                {showMetrics && section.metrics.length > 0 && (
                    <div className="border-t pt-4">
                        <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
                            Key Metrics
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {section.metrics.map((metric, idx) => (
                                <div
                                    key={idx}
                                    className="p-3 rounded-lg bg-muted/50 border"
                                >
                                    <div className="text-xs text-muted-foreground font-mono">
                                        {metric.code}
                                    </div>
                                    <div className="font-medium mt-1">{metric.name}</div>
                                    <div className="text-lg font-bold mt-1">
                                        {metric.value}
                                        {metric.unit && (
                                            <span className="text-sm font-normal text-muted-foreground ml-1">
                                                {metric.unit}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Disclosures addressed */}
                {section.disclosures.length > 0 && (
                    <div className="border-t pt-4">
                        <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
                            Disclosures Addressed
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {section.disclosures.map((disclosure) => (
                                <Badge
                                    key={disclosure.id}
                                    variant={disclosure.status === 'addressed' ? 'default' : 'secondary'}
                                    className="text-xs"
                                >
                                    {disclosure.framework} {disclosure.code}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
