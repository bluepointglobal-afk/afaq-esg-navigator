import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, FileText, TrendingUp, Users, Calendar, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCheckout, type PriceType } from '@/hooks/use-checkout';

export function UpgradePrompt() {
  const navigate = useNavigate();
  const { reportId } = useParams<{ reportId: string }>();
  const { toast } = useToast();
  const { checkout, isLoading } = useCheckout();
  const [selectedPrice, setSelectedPrice] = useState<PriceType>('annual');

  const handleUpgrade = () => {
    checkout(
      { priceType: selectedPrice, returnPath: `/compliance/disclosure/${reportId}` },
      {
        onError: (error) => {
          toast({
            title: 'Checkout Error',
            description: error.message || 'Failed to start checkout',
            variant: 'destructive',
          });
          // If not authenticated, redirect to auth
          if (error.message?.includes('authenticated')) {
            navigate('/auth');
          }
        },
      }
    );
  };

  const handleTestMode = () => {
    toast({
      title: 'Test Mode Activated',
      description: 'Pro features enabled for this session. Refreshing...',
    });
    if (reportId) {
      window.location.href = `/compliance/disclosure/${reportId}?test_pro=true`;
    }
  };

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Generate Disclosure Report</CardTitle>
            <CardDescription>Unlock AI-powered disclosure narrative generation</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-6">
          Upgrade to Pro to transform your assessment results into jurisdiction-compliant disclosure narratives
          ready for stakeholder distribution.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-sm">AI-Powered Narrative Generation</div>
              <div className="text-xs text-muted-foreground">
                Professional disclosure narratives based on your results
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-sm">Jurisdiction-Specific Templates</div>
              <div className="text-xs text-muted-foreground">
                UAE, KSA, and Qatar regulatory frameworks
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-sm">Regulatory Citation Engine</div>
              <div className="text-xs text-muted-foreground">
                Automatic references to relevant regulations
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-sm">Year-over-Year Tracking</div>
              <div className="text-xs text-muted-foreground">
                Compare progress across reporting periods
              </div>
            </div>
          </div>
        </div>

        {/* Price toggle */}
        <div className="flex gap-2 mb-6 p-1 bg-white/60 rounded-lg">
          <button
            onClick={() => setSelectedPrice('per_report')}
            className={`flex-1 py-2 px-3 text-sm rounded-md transition-colors ${
              selectedPrice === 'per_report'
                ? 'bg-white shadow text-foreground font-medium'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            $99 per report
          </button>
          <button
            onClick={() => setSelectedPrice('annual')}
            className={`flex-1 py-2 px-3 text-sm rounded-md transition-colors ${
              selectedPrice === 'annual'
                ? 'bg-white shadow text-foreground font-medium'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            $299/year (unlimited)
          </button>
        </div>

        <div className="flex items-center gap-4">
          <Button size="lg" className="flex-1" onClick={handleUpgrade} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Upgrade to Pro
              </>
            )}
          </Button>
          <Button variant="outline" size="lg" onClick={handleTestMode}>
            Test Mode
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-4 text-center">
          * Disclosure generation is a paid feature. Assessment results remain free forever.
        </p>
      </CardContent>
    </Card>
  );
}
