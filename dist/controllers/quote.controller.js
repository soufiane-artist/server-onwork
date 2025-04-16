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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteQuote = exports.updateQuote = exports.getQuote = exports.getQuotes = exports.createQuote = void 0;
const quote_model_1 = require("../models/quote.model");
// @access  Private
const createQuote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { quoteNumber, clientId, issueDate, validUntil, items, notes } = req.body;
        // Calculate totals
        const subtotal = items.reduce((total, item) => {
            return total + (item.quantity * item.unitPrice);
        }, 0);
        const totalDiscount = items.reduce((total, item) => {
            const itemSubtotal = item.quantity * item.unitPrice;
            return total + (itemSubtotal * item.discount) / 100;
        }, 0);
        const totalTax = items.reduce((total, item) => {
            const itemSubtotal = item.quantity * item.unitPrice;
            const discountAmount = (itemSubtotal * item.discount) / 100;
            const afterDiscount = itemSubtotal - discountAmount;
            return total + (afterDiscount * parseInt(item.taxRate)) / 100;
        }, 0);
        const totalAmount = subtotal - totalDiscount + totalTax;
        // Create quote
        const quote = yield quote_model_1.Quote.create({
            quoteNumber,
            clientId,
            issueDate: new Date(issueDate),
            validUntil: new Date(validUntil),
            items,
            subtotal,
            totalDiscount,
            totalTax,
            totalAmount,
            notes
        });
        res.status(201).json({
            success: true,
            data: quote
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});
exports.createQuote = createQuote;
// @access  Private
const getQuotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quotes = yield quote_model_1.Quote.find()
            .populate('clientId', 'name email')
            .sort({ createdAt: -1 });
        res.json({
            success: true,
            data: quotes
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});
exports.getQuotes = getQuotes;
// @access  Private
const getQuote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quote = yield quote_model_1.Quote.findById(req.params.id)
            .populate('clientId', 'name email address phone')
            .populate('items');
        if (!quote) {
            res.status(404).json({
                success: false,
                message: 'Quote not found'
            });
            return;
        }
        res.json({
            success: true,
            data: quote
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});
exports.getQuote = getQuote;
// @access  Private
const updateQuote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quote = yield quote_model_1.Quote.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!quote) {
            res.status(404).json({
                success: false,
                message: 'Quote not found'
            });
            return;
        }
        res.json({
            success: true,
            data: quote
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});
exports.updateQuote = updateQuote;
// @access  Private
const deleteQuote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quote = yield quote_model_1.Quote.findById(req.params.id);
        if (!quote) {
            res.status(404).json({
                success: false,
                message: 'Quote not found'
            });
            return;
        }
        yield quote.deleteOne();
        res.json({
            success: true,
            message: 'Quote removed'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});
exports.deleteQuote = deleteQuote;
