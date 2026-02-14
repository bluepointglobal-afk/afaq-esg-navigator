import { Router } from 'express';
import { z } from 'zod';
import { disclosureQueue } from '../queues/disclosure.queue';
import { supabase } from '../server';
import { logger } from '../utils/logger';

const router = Router();

// Request schema
const GenerateDisclosureSchema = z.object({
  reportId: z.string().uuid(),
  frameworks: z.array(z.string()).min(1),
  companyProfile: z.object({
    name: z.string().optional(),
    industry: z.string().optional(),
    jurisdiction: z.string().optional(),
  }),
  language: z.enum(['en', 'ar']).optional(),
});

/**
 * POST /api/disclosure/generate
 *
 * Queues a disclosure generation job (async)
 * No timeout - runs in background worker
 */
router.post('/generate', async (req, res) => {
  try {
    const userId = req.user!.id; // From auth middleware

    // Validate request
    const body = GenerateDisclosureSchema.parse(req.body);

    // TIER CHECK DISABLED FOR TESTING
    // TODO: Re-enable tier check in production
    // const { data: profile } = await supabase
    //   .from('user_profiles')
    //   .select('tier')
    //   .eq('id', userId)
    //   .single();
    //
    // if (!profile || (profile.tier !== 'pro' && profile.tier !== 'enterprise')) {
    //   return res.status(403).json({
    //     error: 'TIER_INSUFFICIENT',
    //     message: 'Pro or Enterprise tier required for disclosure generation'
    //   });
    // }

    // Add job to queue
    const job = await disclosureQueue.add('generate-disclosure', {
      reportId: body.reportId,
      userId,
      frameworks: body.frameworks,
      companyProfile: body.companyProfile,
      timestamp: new Date().toISOString(),
    }, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
      removeOnComplete: false, // Keep for auditing
      removeOnFail: false,
    });

    logger.info(`Disclosure generation queued: ${job.id}`, {
      reportId: body.reportId,
      userId,
      jobId: job.id,
    });

    // Return immediately with job ID
    res.status(202).json({
      jobId: job.id,
      status: 'queued',
      message: 'Disclosure generation started. Check status at /api/disclosure/status/:jobId',
      estimatedTime: '30-60 seconds',
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        details: error.errors
      });
    }

    logger.error('Disclosure generation error:', error);
    res.status(500).json({
      error: 'GENERATION_FAILED',
      message: 'Failed to queue disclosure generation'
    });
  }
});

/**
 * GET /api/disclosure/status/:jobId
 *
 * Check status of disclosure generation job
 */
router.get('/status/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user!.id;

    const job = await disclosureQueue.getJob(jobId);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Verify user owns this job
    if (job.data.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const state = await job.getState();
    const progress = job.progress;
    const returnValue = job.returnvalue;
    const failedReason = job.failedReason;

    res.json({
      jobId: job.id,
      status: state,
      progress,
      result: returnValue,
      error: failedReason,
      createdAt: job.timestamp,
      processedAt: job.processedOn,
      finishedAt: job.finishedOn,
    });

  } catch (error) {
    logger.error('Status check error:', error);
    res.status(500).json({ error: 'Failed to check status' });
  }
});

/**
 * GET /api/disclosure/:reportId
 *
 * Get generated disclosure
 */
router.get('/:reportId', async (req, res) => {
  try {
    const { reportId } = req.params;
    const userId = req.user!.id;

    // Verify user has access to this report
    const { data: report } = await supabase
      .from('reports')
      .select('company_id')
      .eq('id', reportId)
      .single();

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('company_id')
      .eq('id', userId)
      .single();

    if (profile?.company_id !== report.company_id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Get disclosure
    const { data: disclosure, error } = await supabase
      .from('disclosure_outputs')
      .select('*')
      .eq('report_id', reportId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !disclosure) {
      return res.status(404).json({ error: 'Disclosure not found' });
    }

    res.json(disclosure);

  } catch (error) {
    logger.error('Get disclosure error:', error);
    res.status(500).json({ error: 'Failed to retrieve disclosure' });
  }
});

export default router;
