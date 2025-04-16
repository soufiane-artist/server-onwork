"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// client routes
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const client_controller_1 = require("../controllers/client.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
// Configure multer for file uploads
const upload = (0, multer_1.default)({
    dest: 'uploads/',
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});
const router = express_1.default.Router();
// Routes with file upload support
router.post('/', auth_middleware_1.protect, upload.single('file'), client_controller_1.clientController.createClient);
router.put('/:id', auth_middleware_1.protect, upload.single('file'), client_controller_1.clientController.updateClient);
// Routes without file upload
router.get('/', auth_middleware_1.protect, client_controller_1.clientController.getClients);
router.get('/:id', auth_middleware_1.protect, client_controller_1.clientController.getClient);
router.delete('/:id', auth_middleware_1.protect, client_controller_1.clientController.deleteClient);
router.get('/:id/invoices', auth_middleware_1.protect, client_controller_1.clientController.getClientInvoices);
exports.default = router;
