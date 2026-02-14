import express from 'express';
import multer from 'multer';
import { supabase } from '../server';
import { logger } from '../utils/logger';

const router = express.Router();

// Configure multer for file uploads (in-memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images and PDFs
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, and PDF allowed.'));
    }
  },
});

// Upload evidence file
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const { reportId, evidenceType, description, linkedCaseStudyIndex } = req.body;

    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    if (!reportId) {
      return res.status(400).json({ error: 'Report ID required' });
    }

    // Generate unique file path
    const timestamp = Date.now();
    const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `evidence/${reportId}/${timestamp}_${sanitizedFilename}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('evidence')
      .upload(storagePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      logger.error('Storage upload error:', uploadError);
      return res.status(500).json({ error: 'Failed to upload file' });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('evidence')
      .getPublicUrl(storagePath);

    // Save evidence record to database
    const { data: evidence, error: dbError } = await supabase
      .from('disclosure_evidence')
      .insert({
        report_id: reportId,
        file_name: file.originalname,
        file_type: file.mimetype.startsWith('image/') ? 'image' : 'pdf',
        storage_path: storagePath,
        file_size_bytes: file.size,
        mime_type: file.mimetype,
        evidence_type: evidenceType || 'other',
        description: description || null,
        linked_case_study_index: linkedCaseStudyIndex ? parseInt(linkedCaseStudyIndex) : null,
        extraction_status: 'not_applicable',
        created_by: req.user?.id,
      })
      .select()
      .single();

    if (dbError) {
      logger.error('Database insert error:', dbError);
      // Try to clean up uploaded file
      await supabase.storage.from('evidence').remove([storagePath]);
      return res.status(500).json({ error: 'Failed to save evidence record' });
    }

    res.json({
      success: true,
      evidence: {
        ...evidence,
        public_url: urlData.publicUrl,
      },
    });
  } catch (error: any) {
    logger.error('Evidence upload error:', error);
    res.status(500).json({ error: error.message || 'Upload failed' });
  }
});

// Get evidence for a report
router.get('/:reportId', async (req, res) => {
  try {
    const { reportId } = req.params;

    const { data: evidence, error } = await supabase
      .from('disclosure_evidence')
      .select('*')
      .eq('report_id', reportId)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Failed to fetch evidence:', error);
      return res.status(500).json({ error: 'Failed to fetch evidence' });
    }

    // Add public URLs
    const evidenceWithUrls = evidence.map((ev) => {
      const { data: urlData } = supabase.storage
        .from('evidence')
        .getPublicUrl(ev.storage_path);
      return {
        ...ev,
        public_url: urlData.publicUrl,
      };
    });

    res.json(evidenceWithUrls);
  } catch (error: any) {
    logger.error('Failed to get evidence:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete evidence
router.delete('/:evidenceId', async (req, res) => {
  try {
    const { evidenceId } = req.params;

    // Get evidence record to find storage path
    const { data: evidence, error: fetchError } = await supabase
      .from('disclosure_evidence')
      .select('storage_path')
      .eq('id', evidenceId)
      .single();

    if (fetchError || !evidence) {
      return res.status(404).json({ error: 'Evidence not found' });
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('evidence')
      .remove([evidence.storage_path]);

    if (storageError) {
      logger.error('Storage delete error:', storageError);
      // Continue anyway - we'll still delete the DB record
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from('disclosure_evidence')
      .delete()
      .eq('id', evidenceId);

    if (deleteError) {
      logger.error('Database delete error:', deleteError);
      return res.status(500).json({ error: 'Failed to delete evidence' });
    }

    res.json({ success: true });
  } catch (error: any) {
    logger.error('Evidence delete error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
