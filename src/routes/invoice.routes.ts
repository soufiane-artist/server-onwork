import { Router } from 'express';
import { invoiceController } from '../controllers/invoice.controller';
import { protect } from '../middleware/auth.middleware';
import multer from 'multer';
import path from 'path';

const router = Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Routes
router.post('/', protect, upload.single('document'), invoiceController.createInvoice);
router.get('/', protect, invoiceController.getInvoices);
router.get('/:id', protect, invoiceController.getInvoice);
router.put('/:id', protect, upload.single('document'), invoiceController.updateInvoice);
router.delete('/:id', protect, invoiceController.deleteInvoice);
router.post('/:id/send', protect, invoiceController.sendInvoice);

export default router;
