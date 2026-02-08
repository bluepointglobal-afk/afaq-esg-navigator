import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { Gap } from '@/types/compliance';

interface GapSeverityChartProps {
    gaps: Gap[];
}

const SEVERITY_COLORS: Record<Gap['severity'], string> = {
    critical: '#dc2626', // red-600
    high: '#ea580c',     // orange-600
    medium: '#ca8a04',   // yellow-600
    low: '#2563eb',      // blue-600
};

const SEVERITY_LABELS: Record<Gap['severity'], string> = {
    critical: 'Critical',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
};

export function GapSeverityChart({ gaps }: GapSeverityChartProps) {
    const severityData = (['critical', 'high', 'medium', 'low'] as Gap['severity'][])
        .map(severity => ({
            name: SEVERITY_LABELS[severity],
            value: gaps.filter(g => g.severity === severity).length,
            color: SEVERITY_COLORS[severity],
        }))
        .filter(d => d.value > 0);

    const total = gaps.length;

    if (total === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Gap Severity Distribution</CardTitle>
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
                <CardTitle className="text-lg">Gap Severity Distribution</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={severityData}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                paddingAngle={2}
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                labelLine={false}
                            >
                                {severityData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: number) => [`${value} gap${value !== 1 ? 's' : ''}`, 'Count']}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
