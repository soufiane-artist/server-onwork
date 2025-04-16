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
const express_1 = require("express");
const contact_controller_1 = require("../controllers/contact.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Public routes
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, contact_controller_1.createContactMessage)(req, res);
}));
// Protected routes (admin only)
router.get('/', auth_middleware_1.protect, contact_controller_1.getAllContactMessages);
router.put('/:id/status', auth_middleware_1.protect, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, contact_controller_1.updateContactStatus)(req, res);
}));
router.delete('/:id', auth_middleware_1.protect, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, contact_controller_1.deleteContactMessage)(req, res);
}));
exports.default = router;
