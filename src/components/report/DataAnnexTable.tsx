import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { BarChart3 } from 'lucide-react';
import type { DataAnnexRow } from '@/types/compliance';

interface DataAnnexTableProps {
    data: DataAnnexRow[];
    title?: string;
}

export function DataAnnexTable({ data, title = 'Data Annex' }: DataAnnexTableProps) {
    // Group data by category
    const groupedData = data.reduce((acc, row) => {
        if (!acc[row.category]) {
            acc[row.category] = [];
        }
        acc[row.category].push(row);
        return acc;
    }, {} as Record<string, DataAnnexRow[]>);

    const categories = Object.keys(groupedData);

    if (data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        {title}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-center py-8">
                        No data available for the annex.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    {title}
                </CardTitle>
                <CardDescription>
                    Quantitative metrics and disclosures in GRI-style format
                </CardDescription>
            </CardHeader>
            <CardContent>
                {categories.map((category) => (
                    <div key={category} className="mb-8 last:mb-0">
                        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                            {category}
                        </h4>
                        <div className="border rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead className="w-[120px]">Code</TableHead>
                                        <TableHead>Metric</TableHead>
                                        <TableHead className="w-[120px] text-right">Value</TableHead>
                                        <TableHead className="w-[80px]">Unit</TableHead>
                                        <TableHead className="w-[120px]">Section</TableHead>
                                        <TableHead className="w-[100px]">Disclosure</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {groupedData[category].map((row, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell className="font-mono text-xs">
                                                {row.metricCode}
                                            </TableCell>
                                            <TableCell>{row.metricName}</TableCell>
                                            <TableCell className="text-right font-medium">
                                                {typeof row.value === 'number'
                                                    ? row.value.toLocaleString()
                                                    : row.value}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {row.unit || '-'}
                                            </TableCell>
                                            <TableCell className="text-xs">
                                                {row.reportSection}
                                            </TableCell>
                                            <TableCell className="text-xs font-mono">
                                                {row.disclosureRef || '-'}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
