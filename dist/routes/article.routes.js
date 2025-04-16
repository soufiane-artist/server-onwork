"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const article_controller_1 = require("../controllers/article.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const multer_1 = __importDefault(require("multer"));
// Configure multer for file uploads
const upload = (0, multer_1.default)({
    dest: 'uploads/',
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});
const router = (0, express_1.Router)();
// Routes with authentication
router.use(auth_middleware_1.protect);
// Create new article
router.post('/', auth_middleware_1.protect, upload.single('coverImage'), article_controller_1.createArticle);
// Get all articles
router.get('/', article_controller_1.getArticles);
// Get article by ID
router.get('/:id', article_controller_1.getArticleById);
// Update article
router.put('/:id', auth_middleware_1.protect, upload.single('coverImage'), article_controller_1.updateArticle);
// Delete article
router.delete('/:id', auth_middleware_1.protect, article_controller_1.deleteArticle);
exports.default = router;
