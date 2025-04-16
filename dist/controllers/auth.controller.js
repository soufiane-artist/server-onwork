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
exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
// Generate JWT Token
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};
// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, role } = req.body;
        // Check if user exists
        const userExists = yield user_model_1.default.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Create user
        const user = yield user_model_1.default.create({
            name,
            email,
            password,
            role: role || 'user',
        });
        if (user) {
            return res.status(201).json({
                _id: user._id.toString(),
                name: user.name,
                email: user.email,
                token: generateToken(user._id.toString()),
                role: user.role
            });
        }
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
});
exports.register = register;
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Check for user email
        const user = yield user_model_1.default.findOne({ email }).select('+password');
        if (user && (yield user.comparePassword(password))) {
            return res.json({
                _id: user._id.toString(),
                name: user.name,
                email: user.email,
                token: generateToken(user._id.toString()),
                role: user.role
            });
        }
        else {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
});
exports.login = login;
