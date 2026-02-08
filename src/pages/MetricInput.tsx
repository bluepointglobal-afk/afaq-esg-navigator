import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/layout/Logo';
import { MetricTable } from '@/components/evidence/MetricTable';

export default function MetricInput() {
    const navigate = useNavigate();
    const { reportId } = useParams<{ reportId: string }>();
    const [searchParams] = useSearchParams();
    const categoryFilter = searchParams.get('category');

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" onClick={() => navigate(`/compliance/disclosure/${reportId}`)}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Disclosure
                            </Button>
                            <Logo size="sm" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-6">
                <div className="max-w-4xl mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle>Evidence & Metric Data</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Enter quantitative data points (KPIs) to support your ESG disclosure. These will be automatically cited in your report.
                            </p>
                        </CardHeader>
                        <CardContent>
                            {reportId && <MetricTable reportId={reportId} categoryFilter={categoryFilter || undefined} />}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
