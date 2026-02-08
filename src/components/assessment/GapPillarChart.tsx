import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { Gap, QuestionPillar } from '@/types/compliance';

interface GapPillarChartProps {
    gaps: Gap[];
}

const PILLAR_CONFIG: Record<QuestionPillar, { label: string; color: string }> = {
    governance: { label: 'Governance', color: '#6366f1' },     // indigo-500
    esg: { label: 'ESG', color: '#10b981' },                   // emerald-500
    risk_controls: { label: 'Risk Controls', color: '#f59e0b' }, // amber-500
    transparency: { label: 'Transparency', color: '#8b5cf6' },  // violet-500
};

export function GapPillarChart({ gaps }: GapPillarChartProps) {
    const pillarData = (Object.keys(PILLAR_CONFIG) as QuestionPillar[]).map(pillar => ({
        pillar,
        name: PILLAR_CONFIG[pillar].label,
        count: gaps.filter(g => g.pillar === pillar).length,
        color: PILLAR_CONFIG[pillar].color,
    }));

    const maxCount = Math.max(...pillarData.map(d => d.count), 1);
    const total = gaps.length;

    if (total === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Gaps by Pillar</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                        No gaps to display
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Gaps by Pillar</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={pillarData}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <XAxis type="number" domain={[0, maxCount]} />
                            <YAxis
                                type="category"
                                dataKey="name"
                                width={100}
                                tick={{ fontSize: 12 }}
                            />
                            <Tooltip
                                formatter={(value: number) => [`${value} gap${value !== 1 ? 's' : ''}`, 'Count']}
                            />
                            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                                {pillarData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
