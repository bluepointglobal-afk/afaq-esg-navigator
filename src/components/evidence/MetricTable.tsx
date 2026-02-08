import { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Edit, Sparkles } from 'lucide-react';
import { useMetricData, useUpdateMetricData, useDeleteMetricData, type MetricData } from '@/hooks/use-metric-data';
import { FRAMEWORK_REGISTRY, type DisclosureItem } from '@/lib/framework/registry/v0';
import { Badge } from '@/components/ui/badge';

interface MetricTableProps {
    reportId: string;
    categoryFilter?: string;
}

export function MetricTable({ reportId, categoryFilter }: MetricTableProps) {
    const { data: allMetrics, isLoading } = useMetricData(reportId);

    // Filter metrics
    const metrics = categoryFilter
        ? allMetrics?.filter(m => m.category === categoryFilter)
        : allMetrics;

    const updateMutation = useUpdateMetricData();
    const deleteMutation = useDeleteMetricData();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingMetric, setEditingMetric] = useState<MetricData | null>(null);

    // Form State
    const [formData, setFormData] = useState<Partial<MetricData>>({
        category: (categoryFilter as MetricData['category']) || 'environmental',
        unit: '',
    });

    // Guided Mode: Pre-populate suggestions
    useEffect(() => {
        // Logic updated to just use the UI suggestions below
    }, [metrics, isLoading]);

    const handleEdit = (metric: MetricData) => {
        setEditingMetric(metric);
        setFormData(metric);
        setIsDialogOpen(true);
    };

    const handleAddNew = () => {
        setEditingMetric(null);
        setFormData({ reportId, category: (categoryFilter as MetricData['category']) || 'environmental', unit: '' });
        setIsDialogOpen(true);
    };

    const handleFillSuggestion = (item: DisclosureItem) => {
        setEditingMetric(null);
        setFormData({
            reportId,
            metricCode: item.title,
            category: item.topic === 'SOCIAL' ? 'social' : item.topic === 'GOV' ? 'governance' : 'environmental',
            unit: '',
            notes: `Required by ${item.framework}`
        });
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this metric?')) {
            await deleteMutation.mutateAsync(id);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateMutation.mutateAsync({
            ...formData,
            reportId, // Ensure reportId
        } as MetricData);
        setIsDialogOpen(false);
    };

    if (isLoading) return <div>Loading metrics...</div>;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Quantitative Metrics</h3>
                <Button onClick={handleAddNew} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Metric
                </Button>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Metric Code</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead>Unit</TableHead>
                            <TableHead>Source</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {metrics?.length === 0 && (
                            <>
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-muted-foreground h-12 bg-blue-50/50">
                                        <div className="flex flex-col items-center justify-center p-4">
                                            <Sparkles className="w-8 h-8 text-blue-500 mb-2" />
                                            <h4 className="font-semibold text-blue-900">Get Started with Guided Metrics</h4>
                                            <p className="text-sm text-blue-700 mb-4">We've identified key metrics based on your frameworks. Click "Add" to start filling them.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                                {FRAMEWORK_REGISTRY
                                    .filter(i => i.required_evidence.includes('metric'))
                                    .filter(i => !categoryFilter || (categoryFilter === 'social' && i.topic === 'SOCIAL') || (categoryFilter === 'environmental' && (i.topic === 'CLIMATE' || i.topic === 'METRICS')) || (categoryFilter === 'governance' && i.topic === 'GOV'))
                                    .slice(0, 5) // Just show top 5 suggestions to avoid overwhelm
                                    .map((item) => (
                                        <TableRow key={item.id} className="bg-blue-50/20 hover:bg-blue-50/40 border-l-4 border-l-blue-200">
                                            <TableCell className="font-medium">
                                                {item.title}
                                                <Badge variant="outline" className="ml-2 text-[10px]">{item.framework}</Badge>
                                            </TableCell>
                                            <TableCell className="capitalize">{item.topic}</TableCell>
                                            <TableCell className="text-muted-foreground italic">Missing</TableCell>
                                            <TableCell>-</TableCell>
                                            <TableCell>-</TableCell>
                                            <TableCell className="text-right">
                                                <Button size="sm" variant="secondary" onClick={() => handleFillSuggestion(item)}>
                                                    <Plus className="w-3 h-3 mr-1" /> Add
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </>
                        )}
                        {metrics?.map((metric) => (
                            <TableRow key={metric.id}>
                                <TableCell className="font-medium">{metric.metricCode}</TableCell>
                                <TableCell className="capitalize">{metric.category}</TableCell>
                                <TableCell>{metric.valueNumeric ?? metric.valueText ?? '-'}</TableCell>
                                <TableCell>{metric.unit}</TableCell>
                                <TableCell>{metric.dataSource || '-'}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(metric)}>
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(metric.id!)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{editingMetric ? 'Edit Metric' : 'Add Metric'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="code">Metric Code / Name</Label>
                            <Input
                                id="code"
                                placeholder="e.g., E1. GHG Scope 1"
                                value={formData.metricCode || ''}
                                onChange={(e) => setFormData({ ...formData, metricCode: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="category">Category</Label>
                            <Select
                                value={formData.category}
                                onValueChange={(val: MetricData['category']) => setFormData({ ...formData, category: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="environmental">Environmental</SelectItem>
                                    <SelectItem value="social">Social</SelectItem>
                                    <SelectItem value="governance">Governance</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="value">Numeric Value</Label>
                                <Input
                                    id="value"
                                    type="number"
                                    step="any"
                                    value={formData.valueNumeric || ''}
                                    onChange={(e) => setFormData({ ...formData, valueNumeric: e.target.value ? parseFloat(e.target.value) : null })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="unit">Unit</Label>
                                <Input
                                    id="unit"
                                    placeholder="e.g., tCO2e"
                                    value={formData.unit || ''}
                                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="source">Data Source</Label>
                            <Input
                                id="source"
                                placeholder="e.g., Electricity Bills"
                                value={formData.dataSource || ''}
                                onChange={(e) => setFormData({ ...formData, dataSource: e.target.value })}
                            />
                        </div>
                        <Button type="submit" disabled={updateMutation.isPending}>
                            {updateMutation.isPending ? 'Saving...' : 'Save Metric'}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
