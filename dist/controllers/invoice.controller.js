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
exports.invoiceController = exports.sendInvoice = exports.deleteInvoice = exports.updateInvoice = exports.getInvoice = exports.getInvoices = exports.createInvoice = void 0;
const invoice_model_1 = require("../models/invoice.model");
const client_model_1 = require("../models/client.model");
const cloudinary_1 = require("../utils/cloudinary");
const promises_1 = __importDefault(require("fs/promises"));
const createInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { invoiceNumber, clientId, issueDate, dueDate, paymentTerms, items, notes } = req.body;
        // Validate client exists
        const client = yield client_model_1.Client.findById(clientId);
        if (!client) {
            res.status(404).json({
                success: false,
                message: 'Client not found'
            });
            return;
        }
        // Handle file upload if present
        let documents = [];
        if (req.file) {
            const uploadResult = yield (0, cloudinary_1.uploadToCloudinary)(req.file.path);
            documents = [{
                    filename: req.file.originalname,
                    contentType: req.file.mimetype,
                    data: uploadResult.secure_url
                }];
            // Clean up temp file
            yield promises_1.default.unlink(req.file.path);
        }
        // Create invoice
        const invoice = new invoice_model_1.Invoice({
            invoiceNumber,
            clientId,
            issueDate: new Date(issueDate),
            dueDate: new Date(dueDate),
            paymentTerms,
            items,
            notes,
            documents
        });
        yield invoice.save();
        res.status(201).json({
            success: true,
            message: 'Invoice created successfully',
            data: invoice
        });
    }
    catch (error) {
        console.error('Error creating invoice:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error creating invoice'
        });
    }
});
exports.createInvoice = createInvoice;
const getInvoices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 10, clientId, status, dateRange } = req.query;
        const query = {};
        if (clientId) {
            query.clientId = clientId;
        }
        if (status) {
            query.status = status;
        }
        if (dateRange) {
            const [startDate, endDate] = dateRange.toString().split(',');
            query.issueDate = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }
        const invoices = yield invoice_model_1.Invoice.find(query)
            .populate('clientId', 'name email')
            .sort({ createdAt: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));
        const total = yield invoice_model_1.Invoice.countDocuments(query);
        res.json({
            success: true,
            data: invoices,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit)
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching invoices'
        });
    }
});
exports.getInvoices = getInvoices;
const getInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const invoice = yield invoice_model_1.Invoice.findById(id)
            .populate('clientId')
            .populate('items');
        if (!invoice) {
            res.status(404).json({
                success: false,
                message: 'Invoice not found'
            });
            return;
        }
        res.json(invoice);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching invoice'
        });
    }
});
exports.getInvoice = getInvoice;
const updateInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updateData = req.body;
        // Handle file upload if present
        let documents = [];
        if (req.file) {
            const uploadResult = yield (0, cloudinary_1.uploadToCloudinary)(req.file.path);
            documents = [{
                    filename: req.file.originalname,
                    contentType: req.file.mimetype,
                    data: uploadResult.secure_url
                }];
            // Clean up temp file
            yield promises_1.default.unlink(req.file.path);
        }
        // Update invoice
        const invoice = yield invoice_model_1.Invoice.findByIdAndUpdate(id, Object.assign(Object.assign({}, updateData), { documents: documents.length > 0 ? documents : undefined }), { new: true, runValidators: true });
        if (!invoice) {
            res.status(404).json({
                success: false,
                message: 'Invoice not found'
            });
            return;
        }
        res.json({
            success: true,
            message: 'Invoice updated successfully',
            data: invoice
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error updating invoice'
        });
    }
});
exports.updateInvoice = updateInvoice;
const deleteInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const invoice = yield invoice_model_1.Invoice.findById(id);
        if (!invoice) {
            res.status(404).json({
                success: false,
                message: 'Invoice not found'
            });
            return;
        }
        // Check if invoice has any related documents
        if (invoice.documents && invoice.documents.length > 0) {
            // Delete each document from Cloudinary
            for (const document of invoice.documents) {
                // Extract public_id from secure_url (assuming format: https://res.cloudinary.com/dvivzto6g/image/upload/v1234567890/filename.jpg)
                const publicIdMatch = document.data.match(/cloudinary.com\/dvivzto6g\/.*\/([^/]+)/);
                if (publicIdMatch && publicIdMatch[1]) {
                    yield (0, cloudinary_1.deleteFromCloudinary)(publicIdMatch[1]);
                }
            }
        }
        yield invoice.deleteOne();
        res.json({
            success: true,
            message: 'Invoice deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting invoice:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error deleting invoice'
        });
    }
});
exports.deleteInvoice = deleteInvoice;
const sendInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const invoice = yield invoice_model_1.Invoice.findById(id);
        if (!invoice) {
            res.status(404).json({
                success: false,
                message: 'Invoice not found'
            });
            return;
        }
        // Update invoice status to 'sent'
        invoice.status = 'sent';
        yield invoice.save();
        // TODO: Add email sending logic here
        // This would typically involve:
        // 1. Generating a PDF of the invoice
        // 2. Sending an email to the client with the PDF attachment
        res.json({
            success: true,
            message: 'Invoice sent successfully',
            data: invoice
        });
    }
    catch (error) {
        console.error('Error sending invoice:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error sending invoice'
        });
    }
});
exports.sendInvoice = sendInvoice;
exports.invoiceController = {
    createInvoice: exports.createInvoice,
    getInvoices: exports.getInvoices,
    getInvoice: exports.getInvoice,
    updateInvoice: exports.updateInvoice,
    deleteInvoice: exports.deleteInvoice,
    sendInvoice: exports.sendInvoice
};
