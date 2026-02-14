import { Router } from 'express';
import { supabase } from '../server';
import { disclosureQueue } from '../queues/disclosure.queue';

const router = Router();

router.get('/', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {
      database: 'unknown',
      redis: 'unknown',
    },
  };

  // Check Supabase
  try {
    await supabase.from('user_profiles').select('count').limit(1);
    health.checks.database = 'healthy';
  } catch (error) {
    health.checks.database = 'unhealthy';
    health.status = 'degraded';
  }

  // Check Redis via BullMQ
  try {
    const client = await disclosureQueue.client;
    await client.ping();
    health.checks.redis = 'healthy';
  } catch (error) {
    health.checks.redis = 'unhealthy';
    health.status = 'degraded';
  }

  const statusCode = health.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(health);
});

// Debug endpoint - shows which env vars are set (not values)
router.get('/env-check', (req, res) => {
  res.json({
    SUPABASE_URL: !!process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: !!process.env.SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_KEY: !!process.env.SUPABASE_SERVICE_KEY,
    FRONTEND_URL: !!process.env.FRONTEND_URL,
    REDIS_URL: !!process.env.REDIS_URL,
    OPENROUTER_API_KEY: !!process.env.OPENROUTER_API_KEY,
    NODE_ENV: process.env.NODE_ENV,
  });
});

export default router;
