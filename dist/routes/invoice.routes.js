"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const invoice_controller_1 = require("../controllers/invoice.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
// Configure multer for file uploads
const upload = (0, multer_1.default)({
    storage: multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/');
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + path_1.default.extname(file.originalname));
        }
    }),
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});
// Routes
router.post('/', auth_middleware_1.protect, upload.single('document'), invoice_controller_1.invoiceController.createInvoice);
router.get('/', auth_middleware_1.protect, invoice_controller_1.invoiceController.getInvoices);
router.get('/:id', auth_middleware_1.protect, invoice_controller_1.invoiceController.getInvoice);
router.put('/:id', auth_middleware_1.protect, upload.single('document'), invoice_controller_1.invoiceController.updateInvoice);
router.delete('/:id', auth_middleware_1.protect, invoice_controller_1.invoiceController.deleteInvoice);
router.post('/:id/send', auth_middleware_1.protect, invoice_controller_1.invoiceController.sendInvoice);
exports.default = router;
