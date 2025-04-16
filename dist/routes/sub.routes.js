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
const express_1 = __importDefault(require("express"));
const sub_controller_1 = require("../controllers/sub.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
// Get all subscribers
router.get('/', auth_middleware_1.protect, sub_controller_1.getAllSubscribers);
// Create new subscriber
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, sub_controller_1.createSubscriber)(req, res);
}));
// Delete subscriber 
router.delete('/:id', auth_middleware_1.protect, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, sub_controller_1.deleteSubscriber)(req, res);
}));
exports.default = router;
