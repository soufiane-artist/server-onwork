import { Router } from 'express';
import { Request, Response } from 'express';
import { 
  createContactMessage,
  getAllContactMessages,
  updateContactStatus,
  deleteContactMessage
} from '../controllers/contact.controller';
import { protect } from '../middleware/auth.middleware';


const router = Router();

interface ContactRequest extends Request {
  body: {
    name: string;
    email: string;
    phone: string;
    message: string;
    service: string;
  };
}

// Public routes
router.post('/', async (req: ContactRequest, res: Response) => {
  await createContactMessage(req, res);
});

// Protected routes (admin only)
router.get('/', protect, getAllContactMessages);
router.put('/:id/status', protect, async (req: Request, res: Response) => {
  await updateContactStatus(req, res);
});
router.delete('/:id', protect, async (req: Request, res: Response) => {
  await deleteContactMessage(req, res);
});

export default router;