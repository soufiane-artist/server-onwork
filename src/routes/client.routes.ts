// client routes
import express from 'express';
import multer from 'multer';
import { clientController } from '../controllers/client.controller';
import { protect } from '../middleware/auth.middleware';

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

const router = express.Router();

// Routes with file upload support
router.post('/', protect, upload.single('file'), clientController.createClient);
router.put('/:id', protect, upload.single('file'), clientController.updateClient);

// Routes without file upload
router.get('/', protect, clientController.getClients);
router.get('/:id', protect, clientController.getClient);
router.delete('/:id', protect, clientController.deleteClient);
router.get('/:id/invoices', protect, clientController.getClientInvoices);

export default router;