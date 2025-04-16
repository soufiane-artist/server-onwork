// delivery routes ts
import { Router } from 'express';
import { createDelivery, getDeliveries, getDeliveryById, updateDelivery, deleteDelivery, updateDeliveryStatus } from '../controllers/delivery.controller';

const router = Router();

// Delivery routes
router.post('/', createDelivery);
router.get('/', getDeliveries);
router.get('/:id', getDeliveryById);
router.put('/:id', updateDelivery);
router.delete('/:id', deleteDelivery);
router.put('/:id/status', updateDeliveryStatus);

export default router;