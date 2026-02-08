import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import type { Gap } from '@/types/compliance';

interface GapsListProps {
  gaps: Gap[];
  gapCount: number;
  criticalGapCount: number;
}

export function GapsList({ gaps, gapCount, criticalGapCount }: GapsListProps) {
  const getSeverityIcon = (severity: Gap['severity']) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'medium':
        return <Info className="w-5 h-5 text-yellow-600" />;
      case 'low':
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
    }
  };

  const getSeverityBadgeVariant = (severity: Gap['severity']) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
    }
  };

  const getReasonLabel = (reason: Gap['reason']) => {
    switch (reason) {
      case 'missing_answer':
        return 'Not Answered';
      case 'low_score':
        return 'Low Score';
      case 'missing_evidence':
        return 'Missing Evidence';
      case 'inadequate_response':
        return 'Inadequate Response';
    }
  };

  // Show top 10 gaps
  const topGaps = gaps.slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Compliance Gaps</CardTitle>
            <CardDescription>
              {gapCount === 0 ? (
                <span className="text-green-600">No significant gaps identified</span>
              ) : (
                <>
                  {gapCount} gap{gapCount !== 1 ? 's' : ''} identified
                  {criticalGapCount > 0 && (
                    <span className="text-red-600 font-semibold ml-2">
                      ({criticalGapCount} critical)
                    </span>
                  )}
                </>
              )}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {gapCount === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mb-4" />
            <p className="text-lg font-semibold text-green-900">Excellent Compliance!</p>
            <p className="text-sm text-muted-foreground mt-2">
              No significant gaps were identified in your responses.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {topGaps.map((gap, idx) => (
              <div key={gap.questionId} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{getSeverityIcon(gap.severity)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={getSeverityBadgeVariant(gap.severity)}>
                        {gap.severity.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">{getReasonLabel(gap.reason)}</Badge>
                      <span className="text-xs text-muted-foreground">
                        Score: {gap.currentScore}/100 (target: {gap.targetScore})
                      </span>
                    </div>
                    <p className="text-sm font-medium mb-1">{gap.questionText}</p>
                    <p className="text-xs text-muted-foreground">{gap.impact}</p>
                  </div>
                </div>
              </div>
            ))}

            {gapCount > 10 && (
              <div className="text-center pt-4 text-sm text-muted-foreground">
                Showing top 10 of {gapCount} gaps. Address critical gaps first.
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
