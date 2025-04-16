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
exports.clientController = exports.getClientInvoices = exports.deleteClient = exports.updateClient = exports.getClient = exports.getClients = exports.createClient = void 0;
const client_model_1 = require("../models/client.model");
const invoice_model_1 = require("../models/invoice.model");
const cloudinary_1 = require("../utils/cloudinary");
const promises_1 = __importDefault(require("fs/promises"));
const multer_1 = __importDefault(require("multer"));
// Configure multer for file upload
const upload = (0, multer_1.default)({
    dest: 'uploads/',
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});
const createClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, type, email, phone, contactName, address, salesRep, notes, ice } = req.body;
        let documents = [];
        // Handle file upload if present
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
        const client = new client_model_1.Client({
            name,
            type,
            email,
            phone,
            contactName,
            address,
            salesRep,
            notes,
            ice,
            documents
        });
        yield client.save();
        res.status(201).json({
            success: true,
            message: 'Client created successfully',
            data: client
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error creating client'
        });
    }
});
exports.createClient = createClient;
const getClients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 10, type, search } = req.query;
        const query = {};
        if (type) {
            query.type = type;
        }
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }
            ];
        }
        const clients = yield client_model_1.Client.find(query)
            .sort({ createdAt: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));
        const total = yield client_model_1.Client.countDocuments(query);
        res.json({
            success: true,
            data: clients,
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
            message: error.message || 'Error fetching clients'
        });
    }
});
exports.getClients = getClients;
const getClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const client = yield client_model_1.Client.findById(id).populate('invoices');
        if (!client) {
            res.status(404).json({
                success: false,
                message: 'Client not found'
            });
            return;
        }
        res.json({
            success: true,
            data: client
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching client'
        });
    }
});
exports.getClient = getClient;
const updateClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const client = yield client_model_1.Client.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!client) {
            res.status(404).json({
                success: false,
                message: 'Client not found'
            });
            return;
        }
        // Handle file upload if present
        if (req.file) {
            const uploadResult = yield (0, cloudinary_1.uploadToCloudinary)(req.file.path);
            // Add new document
            client.documents = client.documents || [];
            client.documents.push({
                filename: req.file.originalname,
                contentType: req.file.mimetype,
                data: uploadResult.secure_url
            });
            yield client.save();
            // Clean up temp file
            yield promises_1.default.unlink(req.file.path);
        }
        res.json({
            success: true,
            message: 'Client updated successfully',
            data: client
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error updating client'
        });
    }
});
exports.updateClient = updateClient;
const deleteClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Check if client exists
        const client = yield client_model_1.Client.findById(id);
        if (!client) {
            res.status(404).json({
                success: false,
                message: 'Client not found'
            });
            return;
        }
        // Check if client has invoices (prevent deletion if they do)
        const invoiceCount = yield invoice_model_1.Invoice.countDocuments({ clientId: id });
        if (invoiceCount > 0) {
            res.status(400).json({
                success: false,
                message: 'Cannot delete client with existing invoices'
            });
            return;
        }
        // Check if client has any related documents
        if (client.documents && client.documents.length > 0) {
            // Delete each document from Cloudinary
            for (const document of client.documents) {
                // Extract public_id from secure_url (assuming format: https://res.cloudinary.com/dvivzto6g/image/upload/v1234567890/filename.jpg)
                const publicIdMatch = document.data.match(/cloudinary.com\/dvivzto6g\/.*\/([^/]+)/);
                if (publicIdMatch && publicIdMatch[1]) {
                    yield (0, cloudinary_1.deleteFromCloudinary)(publicIdMatch[1]);
                }
            }
        }
        // Delete client
        yield client.deleteOne();
        res.json({
            success: true,
            message: 'Client deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting client:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error deleting client'
        });
    }
});
exports.deleteClient = deleteClient;
const getClientInvoices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const client = yield client_model_1.Client.findById(id).populate('invoices');
        if (!client) {
            res.status(404).json({
                success: false,
                message: 'Client not found'
            });
            return;
        }
        res.json({
            success: true,
            data: client.invoices
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching client invoices'
        });
    }
});
exports.getClientInvoices = getClientInvoices;
exports.clientController = {
    createClient: exports.createClient,
    getClients: exports.getClients,
    getClient: exports.getClient,
    updateClient: exports.updateClient,
    deleteClient: exports.deleteClient,
    getClientInvoices: exports.getClientInvoices
};
