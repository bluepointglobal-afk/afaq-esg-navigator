import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Logo } from '@/components/layout/Logo';
import { useQueryClient } from '@tanstack/react-query';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [countdown, setCountdown] = useState(5);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Invalidate user profile cache to fetch updated tier
    queryClient.invalidateQueries({ queryKey: ['userProfile'] });
  }, [queryClient]);

  useEffect(() => {
    // Auto-redirect after countdown
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      navigate('/dashboard');
    }
  }, [countdown, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-xl border-green-200">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4">
            <Logo />
          </div>
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-800">Payment Successful!</CardTitle>
          <CardDescription className="text-green-600">
            Welcome to AFAQ Pro
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <h3 className="font-semibold text-green-800 mb-2">Your Pro benefits:</h3>
            <ul className="space-y-2 text-sm text-green-700">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Unlimited ESG disclosure reports
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                AI-powered narrative generation
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Clean exports (no watermarks)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Full audit trail
              </li>
            </ul>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Redirecting to dashboard in {countdown} seconds...
            </p>
            <Button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Go to Dashboard Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {sessionId && (
            <p className="text-xs text-center text-muted-foreground">
              Transaction ID: {sessionId.substring(0, 20)}...
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
