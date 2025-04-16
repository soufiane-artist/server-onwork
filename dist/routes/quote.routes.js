"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const quote_controller_1 = require("../controllers/quote.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// Routes
router.route('/')
    .post(auth_middleware_1.protect, quote_controller_1.createQuote)
    .get(auth_middleware_1.protect, quote_controller_1.getQuotes);
router.route('/:id')
    .get(auth_middleware_1.protect, quote_controller_1.getQuote)
    .put(auth_middleware_1.protect, quote_controller_1.updateQuote)
    .delete(auth_middleware_1.protect, quote_controller_1.deleteQuote);
exports.default = router;
