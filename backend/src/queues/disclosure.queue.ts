import { Queue, Worker, Job } from 'bullmq';
import { generateDisclosureContent } from '../services/disclosure.service';
import { supabase } from '../server';
import { logger } from '../utils/logger';

// Redis connection - parse URL for BullMQ connection options
const redisUrl = new URL(process.env.REDIS_URL || 'redis://localhost:6379');
const connection = {
  host: redisUrl.hostname,
  port: parseInt(redisUrl.port) || 6379,
  username: redisUrl.username || undefined,
  password: redisUrl.password || undefined,
  maxRetriesPerRequest: null,
};

// Queue for disclosure generation
export const disclosureQueue = new Queue('disclosure-generation', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
  },
});

// Worker to process disclosure jobs
const worker = new Worker(
  'disclosure-generation',
  async (job: Job) => {
    const { reportId, userId, frameworks, companyProfile } = job.data;

    logger.info(`Processing disclosure generation: ${job.id}`, {
      reportId,
      userId,
      frameworks,
    });

    try {
      // Update progress: Fetching data
      await job.updateProgress(10);

      // 1. Fetch questionnaire response
      const { data: questionnaireResponse, error: qError } = await supabase
        .from('questionnaire_responses')
        .select('*')
        .eq('report_id', reportId)
        .single();

      if (qError || !questionnaireResponse) {
        logger.error('Failed to fetch questionnaire response', {
          reportId,
          error: qError,
          code: qError?.code,
          message: qError?.message,
          hint: qError?.hint,
          hasData: !!questionnaireResponse,
        });

        // Check for specific error types
        if (qError?.code === '42501') {
          throw new Error('Permission denied: RLS policy blocking questionnaire access. User may not have access to this report.');
        }

        if (qError?.code === 'PGRST116') {
          throw new Error('Questionnaire response not found for this report. User must complete the questionnaire first.');
        }

        if (qError) {
          throw new Error(`Database error (${qError.code}): ${qError.message}`);
        }

        throw new Error('Questionnaire response not found: No data returned from database');
      }

      // Validate questionnaire structure
      if (!questionnaireResponse.answers || typeof questionnaireResponse.answers !== 'object') {
        logger.error('Invalid questionnaire response structure', {
          reportId,
          response: questionnaireResponse
        });
        throw new Error('Questionnaire response has invalid structure: missing or invalid answers object');
      }

      await job.updateProgress(20);

      // 2. Fetch disclosure narratives (CEO message, pillars, strategy, etc.)
      const { data: narratives, error: narrativesError } = await supabase
        .from('disclosure_narratives')
        .select('*')
        .eq('report_id', reportId)
        .maybeSingle();

      if (narrativesError) {
        logger.error('Failed to fetch disclosure narratives', { error: narrativesError, reportId });
      }

      if (!narratives) {
        logger.warn('No disclosure narratives found for report', { reportId });
        throw new Error('Disclosure narratives not found. Please complete Step 2: Data Collection first.');
      }

      await job.updateProgress(30);

      // 3. Fetch disclosure metrics (emissions, energy, workforce, etc.)
      const { data: metrics, error: metricsError } = await supabase
        .from('disclosure_metrics')
        .select('*')
        .eq('report_id', reportId)
        .maybeSingle();

      if (metricsError) {
        logger.error('Failed to fetch disclosure metrics', { error: metricsError, reportId });
      }

      await job.updateProgress(40);

      // 4. Fetch assessment result
      const { data: assessment } = await supabase
        .from('assessment_results')
        .select('*')
        .eq('report_id', reportId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      await job.updateProgress(50);

      // 5. Generate disclosure content with AI (can take 30-60s)
      logger.info('Starting AI generation...', { reportId, jobId: job.id });

      const disclosureContent = await generateDisclosureContent({
        companyProfile,
        frameworks,
        questionnaireResponse,
        narratives,
        metrics: metrics || [],
        assessment,
      });

      await job.updateProgress(80);

      // 6. Save to database (map to actual schema columns)
      // Use upsert to allow regeneration - updates existing disclosure for same report_id
      const { data: savedDisclosure, error: saveError } = await supabase
        .from('disclosure_outputs')
        .upsert({
          report_id: reportId,
          assessment_id: assessment?.id || null,
          template_id: null,
          version: '1.0',
          template_version: '1.0',
          jurisdiction: companyProfile?.jurisdiction || 'UAE',
          generated_for_company: companyProfile?.name || 'Unknown',
          sections: disclosureContent.sections || [],
          evidence_appendix: disclosureContent.evidence_appendix || [],
          disclaimers: disclosureContent.disclaimers || [],
          quality_checklist: disclosureContent.quality_checklist || [],
          status: 'complete',
          generated_at: new Date().toISOString(),
          generated_by: userId,
          format: 'json',
          listing_status: 'non-listed',
          errors: null,
        }, { onConflict: 'report_id' })
        .select()
        .single();

      if (saveError) {
        logger.error('Failed to save disclosure', {
          error: saveError,
          code: saveError.code,
          message: saveError.message,
          hint: saveError.hint,
          details: saveError.details,
          reportId
        });

        // Check for specific error types
        if (saveError.code === '42501') {
          throw new Error('Permission denied: RLS policy blocking disclosure save. Check user_profiles and RLS policies.');
        }

        if (saveError.code === '23505') {
          throw new Error('Disclosure already exists for this report. Delete the existing disclosure first.');
        }

        if (saveError.code === '23503') {
          throw new Error(`Foreign key violation: ${saveError.message}. Check that report and assessment exist.`);
        }

        throw new Error(`Database error (${saveError.code}): ${saveError.message}`);
      }

      await job.updateProgress(100);

      logger.info(`Disclosure generated successfully: ${job.id}`, {
        reportId,
        disclosureId: savedDisclosure.id,
      });

      return {
        success: true,
        disclosureId: savedDisclosure.id,
        reportId,
      };

    } catch (error) {
      logger.error(`Disclosure generation failed: ${job.id}`, {
        error,
        reportId,
        userId,
      });
      throw error;
    }
  },
  {
    connection,
    concurrency: 5, // Process 5 jobs in parallel
    limiter: {
      max: 10, // Max 10 jobs per duration
      duration: 60000, // Per minute (rate limiting for AI API)
    },
  }
);

// Event listeners
worker.on('completed', (job) => {
  logger.info(`Job completed: ${job.id}`, job.returnvalue);
});

worker.on('failed', (job, err) => {
  logger.error(`Job failed: ${job?.id}`, {
    error: err.message,
    stack: err.stack,
  });
});

worker.on('error', (err) => {
  logger.error('Worker error:', err);
});

export { worker };
