import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, TrendingUp, Clock } from 'lucide-react';
import type { Recommendation } from '@/types/compliance';

interface RecommendationsListProps {
  recommendations: Recommendation[];
}

export function RecommendationsList({ recommendations }: RecommendationsListProps) {
  const getPriorityColor = (priority: number) => {
    if (priority <= 2) return 'destructive';
    if (priority <= 3) return 'default';
    return 'secondary';
  };

  const getEffortBadge = (effort: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800',
    };
    return (
      <Badge variant="outline" className={colors[effort as keyof typeof colors]}>
        {effort.charAt(0).toUpperCase() + effort.slice(1)} Effort
      </Badge>
    );
  };

  const getImpactBadge = (impact: string) => {
    const colors = {
      high: 'bg-blue-100 text-blue-800',
      medium: 'bg-indigo-100 text-indigo-800',
      low: 'bg-purple-100 text-purple-800',
    };
    return (
      <Badge variant="outline" className={colors[impact as keyof typeof colors]}>
        {impact.charAt(0).toUpperCase() + impact.slice(1)} Impact
      </Badge>
    );
  };

  const getTimeframeLabel = (timeframe: string) => {
    switch (timeframe) {
      case 'immediate':
        return 'Immediate';
      case 'short_term':
        return 'Short-term (1-3 months)';
      case 'medium_term':
        return 'Medium-term (3-6 months)';
      case 'long_term':
        return 'Long-term (6+ months)';
      default:
        return timeframe;
    }
  };

  // Show top 10 recommendations
  const topRecommendations = recommendations.slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-600" />
          Actionable Recommendations
        </CardTitle>
        <CardDescription>
          {recommendations.length === 0
            ? 'No recommendations at this time'
            : `${recommendations.length} recommendation${recommendations.length !== 1 ? 's' : ''} to improve compliance`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {recommendations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <TrendingUp className="w-16 h-16 text-green-600 mb-4" />
            <p className="text-lg font-semibold text-green-900">Great Job!</p>
            <p className="text-sm text-muted-foreground mt-2">
              No major recommendations. Continue maintaining your compliance standards.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {topRecommendations.map((rec, idx) => (
              <div key={rec.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                        rec.priority <= 2
                          ? 'bg-red-600'
                          : rec.priority <= 3
                          ? 'bg-yellow-600'
                          : 'bg-blue-600'
                      }`}
                    >
                      {idx + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge variant={getPriorityColor(rec.priority)}>
                        Priority {rec.priority}
                      </Badge>
                      {getEffortBadge(rec.effort)}
                      {getImpactBadge(rec.impact)}
                    </div>
                    <h4 className="font-semibold mb-1">{rec.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{getTimeframeLabel(rec.timeframe)}</span>
                      <span className="ml-2">• Addresses {rec.relatedGaps.length} gap(s)</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {recommendations.length > 10 && (
              <div className="text-center pt-4 text-sm text-muted-foreground">
                Showing top 10 of {recommendations.length} recommendations
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
