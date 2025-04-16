"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDeliveryStatus = exports.deleteDelivery = exports.updateDelivery = exports.getDeliveryById = exports.getDeliveries = exports.createDelivery = void 0;
const delivery_model_1 = __importDefault(require("../models/delivery.model"));
// Create a new delivery
const createDelivery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const delivery = new delivery_model_1.default(req.body);
        yield delivery.save();
        res.status(201).json({
            success: true,
            data: delivery
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error
        });
    }
});
exports.createDelivery = createDelivery;
// Get all deliveries
const getDeliveries = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deliveries = yield delivery_model_1.default.find();
        res.status(200).json({
            success: true,
            data: deliveries
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error fetching deliveries'
        });
    }
});
exports.getDeliveries = getDeliveries;
// Get delivery by ID
const getDeliveryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const delivery = yield delivery_model_1.default.findById(id);
        if (!delivery) {
            res.status(404).json({
                success: false,
                error: 'Delivery not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: delivery
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error fetching delivery'
        });
    }
});
exports.getDeliveryById = getDeliveryById;
// Update delivery
const updateDelivery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const delivery = yield delivery_model_1.default.findByIdAndUpdate(id, req.body, { new: true });
        if (!delivery) {
            res.status(404).json({
                success: false,
                error: 'Delivery not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: delivery
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error updating delivery'
        });
    }
});
exports.updateDelivery = updateDelivery;
// Delete delivery
const deleteDelivery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const delivery = yield delivery_model_1.default.findByIdAndDelete(id);
        if (!delivery) {
            res.status(404).json({
                success: false,
                error: 'Delivery not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: delivery
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error deleting delivery'
        });
    }
});
exports.deleteDelivery = deleteDelivery;
// Update delivery status
const updateDeliveryStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const delivery = yield delivery_model_1.default.findByIdAndUpdate(id, { status }, { new: true });
        if (!delivery) {
            res.status(404).json({
                success: false,
                error: 'Delivery not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: delivery
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error updating delivery status'
        });
    }
});
exports.updateDeliveryStatus = updateDeliveryStatus;
