import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { PillarScore, ScoreExplanation } from '@/types/compliance';

interface ScoreCardProps {
  overallScore: number;
  pillarScores: PillarScore[];
  explanation: ScoreExplanation;
}

export function ScoreCard({ overallScore, pillarScores, explanation }: ScoreCardProps) {
  // Determine score color and rating
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreRating = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  const getPillarName = (pillar: string) => {
    switch (pillar) {
      case 'governance':
        return 'Governance';
      case 'esg':
        return 'ESG & Sustainability';
      case 'risk_controls':
        return 'Risk & Controls';
      case 'transparency':
        return 'Transparency';
      default:
        return pillar;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Compliance Score Overview</CardTitle>
        <CardDescription>Your overall compliance performance and pillar breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Overall Score */}
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Overall Compliance Score</h3>
              <p className="text-sm text-gray-600">{getScoreRating(overallScore)}</p>
            </div>
            <div className={`text-6xl font-bold ${getScoreColor(overallScore)}`}>
              {overallScore}
              <span className="text-3xl">/100</span>
            </div>
          </div>
          <Progress value={overallScore} className="h-3" />
        </div>

        {/* Pillar Scores */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-4">Pillar Scores</h3>
          {pillarScores.map((pillarScore) => (
            <div key={pillarScore.pillar} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">{getPillarName(pillarScore.pillar)}</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    ({pillarScore.completedQuestions}/{pillarScore.totalQuestions} questions)
                  </span>
                </div>
                <span className={`text-xl font-bold ${getScoreColor(pillarScore.score)}`}>
                  {pillarScore.score}/100
                </span>
              </div>
              <Progress value={pillarScore.score} className="h-2" />
            </div>
          ))}
        </div>

        {/* Strengths and Weaknesses */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Strengths */}
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-900 mb-2">Strengths</h4>
            <ul className="space-y-1 text-sm text-green-800">
              {explanation.strengths.map((strength, idx) => (
                <li key={idx}>• {strength}</li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <h4 className="font-semibold text-red-900 mb-2">Areas for Improvement</h4>
            <ul className="space-y-1 text-sm text-red-800">
              {explanation.weaknesses.map((weakness, idx) => (
                <li key={idx}>• {weakness}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
