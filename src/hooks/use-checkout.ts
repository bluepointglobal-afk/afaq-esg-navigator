import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

export type PriceType = 'per_report' | 'annual';

interface CheckoutOptions {
  priceType: PriceType;
  returnPath?: string;
}

interface CheckoutResponse {
  sessionId: string;
  url: string;
}

async function createCheckoutSession(options: CheckoutOptions): Promise<CheckoutResponse> {
  const { priceType, returnPath = '/dashboard' } = options;

  const baseUrl = window.location.origin;
  const successUrl = `${baseUrl}/payment/success`;
  const cancelUrl = `${baseUrl}${returnPath}`;

  const { data: session } = await supabase.auth.getSession();
  if (!session?.session?.access_token) {
    throw new Error('Not authenticated');
  }

  const response = await supabase.functions.invoke('create-checkout', {
    body: {
      priceType,
      successUrl,
      cancelUrl,
    },
  });

  if (response.error) {
    throw new Error(response.error.message || 'Failed to create checkout session');
  }

  return response.data as CheckoutResponse;
}

export function useCheckout() {
  const mutation = useMutation({
    mutationFn: async (options: CheckoutOptions) => {
      const { url } = await createCheckoutSession(options);

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      } else {
        // Fallback: use Stripe.js redirect
        const stripe = await stripePromise;
        if (!stripe) {
          throw new Error('Stripe not loaded');
        }
        const response = await createCheckoutSession(options);
        const { error } = await stripe.redirectToCheckout({
          sessionId: response.sessionId,
        });
        if (error) {
          throw error;
        }
      }
    },
  });

  return {
    checkout: mutation.mutate,
    checkoutAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}
