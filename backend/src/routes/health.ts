import { Router } from 'express';
import { supabase } from '../server';
import IORedis from 'ioredis';

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

  // Check Redis
  try {
    const redis = new IORedis(process.env.REDIS_URL!, {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
    });
    await redis.connect();
    await redis.ping();
    await redis.quit();
    health.checks.redis = 'healthy';
  } catch (error) {
    health.checks.redis = 'unhealthy';
    health.status = 'degraded';
  }

  const statusCode = health.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(health);
});

export default router;
