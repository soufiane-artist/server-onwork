"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// delivery routes ts
const express_1 = require("express");
const delivery_controller_1 = require("../controllers/delivery.controller");
const router = (0, express_1.Router)();
// Delivery routes
router.post('/', delivery_controller_1.createDelivery);
router.get('/', delivery_controller_1.getDeliveries);
router.get('/:id', delivery_controller_1.getDeliveryById);
router.put('/:id', delivery_controller_1.updateDelivery);
router.delete('/:id', delivery_controller_1.deleteDelivery);
router.put('/:id/status', delivery_controller_1.updateDeliveryStatus);
exports.default = router;
