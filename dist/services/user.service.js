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
exports.UserService = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
class UserService {
    // Get user by ID
    static getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_model_1.default.findById(id);
        });
    }
    // Update user
    static updateUser(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_model_1.default.findByIdAndUpdate(id, updateData, { new: true });
        });
    }
    // Delete user
    static deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield user_model_1.default.findByIdAndDelete(id);
            return result !== null;
        });
    }
    // Get all users (with pagination)
    static getUsers() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 10) {
            const skip = (page - 1) * limit;
            const users = yield user_model_1.default.find().skip(skip).limit(limit);
            const total = yield user_model_1.default.countDocuments();
            return {
                users,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalUsers: total
            };
        });
    }
}
exports.UserService = UserService;
