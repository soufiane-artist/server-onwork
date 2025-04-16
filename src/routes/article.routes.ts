import { Router } from 'express';
import { createArticle, getArticles, getArticleById, updateArticle, deleteArticle } from '../controllers/article.controller';
import { protect } from '../middleware/auth.middleware';
import multer from 'multer';

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});
const router = Router();

// Routes with authentication
router.use(protect);

// Create new article
router.post('/',protect, upload.single('coverImage'), createArticle);

// Get all articles
router.get('/', getArticles);

// Get article by ID
router.get('/:id', getArticleById);

// Update article
router.put('/:id', protect, upload.single('coverImage'), updateArticle);

// Delete article
router.delete('/:id', protect, deleteArticle);

export default router;
