import express from 'express';
import { getUserAnalytics, upsertAnalytics } from '../controllers/analyticsController.js';

const router = express.Router();

// GET: Fetch analytics for user
router.get('/:userId', getUserAnalytics);

// POST: Create/update analytics
router.post('/', upsertAnalytics);

export default router;
