import express from 'express';
import { 
  createQuote, 
  getQuotes, 
  getQuote, 
  updateQuote, 
  deleteQuote 
} from '../controllers/quote.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// Routes
router.route('/')
  .post(protect, createQuote)
  .get(protect, getQuotes);

router.route('/:id')
  .get(protect, getQuote)
  .put(protect, updateQuote)
  .delete(protect, deleteQuote);

export default router;
