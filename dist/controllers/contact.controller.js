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
exports.deleteContactMessage = exports.updateContactStatus = exports.getAllContactMessages = exports.createContactMessage = void 0;
const contact_model_1 = __importDefault(require("../models/contact.model"));
// Create new contact message
const createContactMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contactData = req.body;
        // Validate required fields
        if (!contactData.name || !contactData.email || !contactData.phone || !contactData.message || !contactData.service) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }
        // Create new contact message
        const contact = new contact_model_1.default(contactData);
        yield contact.save();
        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            contact: contact.toObject()
        });
    }
    catch (error) {
        console.error('Error creating contact message:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating contact message'
        });
    }
});
exports.createContactMessage = createContactMessage;
// Get all contact messages (admin only)
const getAllContactMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contacts = yield contact_model_1.default.find()
            .sort({ date: -1 })
            .select('-__v');
        res.json(contacts);
    }
    catch (error) {
        console.error('Error fetching contact messages:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching contact messages'
        });
    }
});
exports.getAllContactMessages = getAllContactMessages;
// Update contact message status (admin only)
const updateContactStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const contact = yield contact_model_1.default.findById(id);
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact message not found'
            });
        }
        contact.status = status;
        yield contact.save();
        res.json(contact);
    }
    catch (error) {
        console.error('Error updating contact status:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating contact status'
        });
    }
});
exports.updateContactStatus = updateContactStatus;
// Delete contact message (admin only)
const deleteContactMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const contact = yield contact_model_1.default.findByIdAndDelete(id);
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact message not found'
            });
        }
        res.json({
            success: true,
            message: 'Contact message deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting contact message:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting contact message'
        });
    }
});
exports.deleteContactMessage = deleteContactMessage;
