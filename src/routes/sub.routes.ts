import express from 'express';
import { 
  createSubscriber,
  deleteSubscriber,
  getAllSubscribers,
} from '../controllers/sub.controller';
import { Request, Response } from 'express';
import { protect } from '../middleware/auth.middleware';

interface SubscriberRequest extends Request {
  body: {
    email: string;
    source: string;
  };
  params: {
    id: string;
  };
}

const router = express.Router();

// Get all subscribers
router.get('/',protect, getAllSubscribers);

// Create new subscriber
router.post('/', async (req: SubscriberRequest, res: Response) => {
  await createSubscriber(req, res);
});

// Delete subscriber 
router.delete('/:id', protect, async (req: SubscriberRequest, res: Response) => {
  await deleteSubscriber(req, res);
});

export default router;
