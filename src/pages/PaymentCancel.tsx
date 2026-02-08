import { useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Logo } from '@/components/layout/Logo';

export default function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-xl">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4">
            <Logo />
          </div>
          <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-10 h-10 text-slate-500" />
          </div>
          <CardTitle className="text-2xl">Payment Cancelled</CardTitle>
          <CardDescription>
            No worries - you can try again anytime
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-slate-50 rounded-lg p-4 border">
            <p className="text-sm text-muted-foreground">
              Your payment was not processed. You can continue using AFAQ with your current plan,
              or upgrade to Pro whenever you're ready.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => navigate('/#pricing')}
              className="w-full"
              variant="default"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              View Pricing Options
            </Button>

            <Button
              onClick={() => navigate('/dashboard')}
              className="w-full"
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Questions? Contact support@afaq.ae
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
