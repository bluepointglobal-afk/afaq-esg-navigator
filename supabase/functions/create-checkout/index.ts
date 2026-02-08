// Supabase Edge Function: Create Stripe Checkout Session
// Creates checkout session for Pro tier upgrade

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Price IDs - replace with actual Stripe price IDs after creating products
const PRICES = {
  per_report: 'price_per_report_placeholder', // $99 one-time
  annual: 'price_annual_placeholder', // $299/year subscription
};

interface CheckoutRequest {
  priceType: 'per_report' | 'annual';
  successUrl: string;
  cancelUrl: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      throw new Error('STRIPE_SECRET_KEY not configured');
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader || '' } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user profile
    const { data: profile } = await supabaseClient
      .from('user_profiles')
      .select('email, full_name, tier')
      .eq('id', user.id)
      .single();

    // Check if already pro
    if (profile?.tier === 'pro' || profile?.tier === 'enterprise') {
      return new Response(
        JSON.stringify({ error: 'Already subscribed to Pro tier' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const payload: CheckoutRequest = await req.json();
    const { priceType, successUrl, cancelUrl } = payload;

    if (!priceType || !successUrl || !cancelUrl) {
      throw new Error('Missing required fields: priceType, successUrl, cancelUrl');
    }

    // Check or create Stripe customer
    let customerId: string | undefined;
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });

    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        name: profile?.full_name || undefined,
        metadata: {
          supabase_user_id: user.id,
        },
      });
      customerId = customer.id;
    }

    // Create checkout session
    const isSubscription = priceType === 'annual';

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      mode: isSubscription ? 'subscription' : 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: isSubscription ? 'AFAQ Pro - Annual' : 'AFAQ Pro - Single Report',
              description: isSubscription
                ? 'Unlimited ESG disclosure reports for one year'
                : 'One professional ESG disclosure report',
            },
            unit_amount: isSubscription ? 29900 : 9900, // in cents
            ...(isSubscription && {
              recurring: {
                interval: 'year',
              },
            }),
          },
          quantity: 1,
        },
      ],
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      metadata: {
        supabase_user_id: user.id,
        price_type: priceType,
      },
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    return new Response(
      JSON.stringify({
        sessionId: session.id,
        url: session.url,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Checkout error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
