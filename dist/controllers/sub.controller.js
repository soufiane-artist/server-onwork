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
exports.deleteSubscriber = exports.createSubscriber = exports.getAllSubscribers = void 0;
const sub_model_1 = __importDefault(require("../models/sub.model"));
const getAllSubscribers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subscribers = yield sub_model_1.default.find()
            .sort({ date: -1 })
            .select('-__v');
        res.json(subscribers);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching subscribers'
        });
    }
});
exports.getAllSubscribers = getAllSubscribers;
const createSubscriber = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, source } = req.body;
        // Check if subscriber already exists
        const existingSubscriber = yield sub_model_1.default.findOne({ email });
        if (existingSubscriber) {
            return res.status(400).json({
                success: false,
                message: 'Subscriber already exists'
            });
        }
        const subscriber = new sub_model_1.default({
            email,
            source: source.toLowerCase(),
            date: new Date()
        });
        yield subscriber.save();
        res.status(201).json({
            success: true,
            data: subscriber
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating subscriber'
        });
    }
});
exports.createSubscriber = createSubscriber;
const deleteSubscriber = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const subscriber = yield sub_model_1.default.findByIdAndDelete(id);
        if (!subscriber) {
            return res.status(404).json({
                success: false,
                message: 'Subscriber not found'
            });
        }
        res.json({
            success: true,
            message: 'Subscriber deleted successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting subscriber'
        });
    }
});
exports.deleteSubscriber = deleteSubscriber;
