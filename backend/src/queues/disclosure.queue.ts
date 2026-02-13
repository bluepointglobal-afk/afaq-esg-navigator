import { Queue, Worker, Job } from 'bullmq';
import { generateDisclosureContent } from '../services/disclosure.service';
import { supabase } from '../server';
import { logger } from '../utils/logger';

// Redis connection configuration for BullMQ
// BullMQ creates its own Redis connection from these options
const connection = {
  host: process.env.REDIS_URL ? new URL(process.env.REDIS_URL).hostname : 'localhost',
  port: process.env.REDIS_URL ? parseInt(new URL(process.env.REDIS_URL).port) : 6379,
  password: process.env.REDIS_URL ? new URL(process.env.REDIS_URL).password : undefined,
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
        throw new Error('Questionnaire response not found');
      }

      await job.updateProgress(20);

      // 2. Fetch narratives
      const { data: narratives } = await supabase
        .from('report_narratives')
        .select('*')
        .eq('report_id', reportId)
        .single();

      await job.updateProgress(30);

      // 3. Fetch metrics
      const { data: metrics } = await supabase
        .from('metric_data')
        .select('*')
        .eq('report_id', reportId);

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

      // 6. Save to database
      const { data: savedDisclosure, error: saveError } = await supabase
        .from('disclosure_outputs')
        .insert({
          report_id: reportId,
          ...disclosureContent,
          status: 'complete',
          generated_by: userId,
        })
        .select()
        .single();

      if (saveError) {
        throw new Error(`Failed to save disclosure: ${saveError.message}`);
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
