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
exports.deleteUser = exports.updateUser = exports.getUserById = exports.getUsers = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
// @desc    Get all users
// @route   GET /api/users
// @access  Private
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.default.find().select('-password');
        return res.json(users);
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
});
exports.getUsers = getUsers;
// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.json(user);
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
});
exports.getUserById = getUserById;
// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, role } = req.body;
        const user = yield user_model_1.default.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.name = name || user.name;
        user.role = role || user.role;
        const updatedUser = yield user.save();
        return res.json({
            _id: updatedUser._id.toString(),
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
});
exports.updateUser = updateUser;
// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        yield user.deleteOne();
        return res.json({ message: 'User removed' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
});
exports.deleteUser = deleteUser;
