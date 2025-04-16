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
exports.deleteArticle = exports.updateArticle = exports.getArticleById = exports.getArticles = exports.createArticle = void 0;
const article_model_1 = require("../models/article.model");
const cloudinary_1 = require("../utils/cloudinary");
const createArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { title, content, coverImage } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const userName = (_b = req.user) === null || _b === void 0 ? void 0 : _b.name;
        let coverImageUrl = null;
        let coverImagePublicId = null;
        if (coverImage) {
            const result = yield (0, cloudinary_1.uploadToCloudinary)(coverImage);
            coverImageUrl = result.secure_url;
            coverImagePublicId = result.public_id;
        }
        const article = new article_model_1.Article({
            title,
            content,
            coverImage: coverImage ? {
                publicId: coverImagePublicId,
                url: coverImageUrl
            } : undefined,
            author: {
                id: userId,
                name: userName
            }
        });
        const savedArticle = yield article.save();
        res.json({
            success: true,
            message: 'Article créé avec succès',
            data: savedArticle
        });
    }
    catch (error) {
        console.error('Error creating article:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Erreur lors de la création de l\'article'
        });
    }
});
exports.createArticle = createArticle;
const getArticles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const articles = yield article_model_1.Article.find()
            .populate('author.id', 'name')
            .sort({ createdAt: -1 });
        res.json(articles);
    }
    catch (error) {
        console.error('Error fetching articles:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Erreur lors de la récupération des articles'
        });
    }
});
exports.getArticles = getArticles;
const getArticleById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const article = yield article_model_1.Article.findById(id)
            .populate('author.id', 'name');
        if (!article) {
            res.status(404).json({
                success: false,
                message: 'Article non trouvé'
            });
            return;
        }
        res.json({
            success: true,
            message: 'Article récupéré avec succès',
            data: article
        });
    }
    catch (error) {
        console.error('Error fetching article:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération de l\'article'
        });
    }
});
exports.getArticleById = getArticleById;
const updateArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const { id } = req.params;
        const { title, summary, content, coverImage } = req.body;
        const article = yield article_model_1.Article.findById(id);
        if (!article) {
            res.status(404).json({
                success: false,
                message: 'Article non trouvé'
            });
            return;
        }
        if (((_a = article.coverImage) === null || _a === void 0 ? void 0 : _a.publicId) && coverImage) {
            yield (0, cloudinary_1.deleteFromCloudinary)(article.coverImage.publicId);
        }
        let coverImageUrl = (_b = article.coverImage) === null || _b === void 0 ? void 0 : _b.url;
        let coverImagePublicId = (_c = article.coverImage) === null || _c === void 0 ? void 0 : _c.publicId;
        if (coverImage) {
            const result = yield (0, cloudinary_1.uploadToCloudinary)(coverImage);
            coverImageUrl = result.secure_url;
            coverImagePublicId = result.public_id;
        }
        const updatedArticle = yield article_model_1.Article.findByIdAndUpdate(id, {
            title,
            summary,
            content,
            coverImage: coverImage ? {
                publicId: coverImagePublicId,
                url: coverImageUrl
            } : undefined
        }, { new: true }).populate('author.id', 'name');
        res.json({
            success: true,
            message: 'Article mis à jour avec succès',
            data: updatedArticle
        });
    }
    catch (error) {
        console.error('Error updating article:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Erreur lors de la mise à jour de l\'article'
        });
    }
});
exports.updateArticle = updateArticle;
const deleteArticle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const article = yield article_model_1.Article.findById(id);
        if (!article) {
            res.status(404).json({
                success: false,
                message: 'Article non trouvé'
            });
            return;
        }
        if ((_a = article.coverImage) === null || _a === void 0 ? void 0 : _a.publicId) {
            yield (0, cloudinary_1.deleteFromCloudinary)(article.coverImage.publicId);
        }
        yield article_model_1.Article.findByIdAndDelete(id);
        res.json({
            success: true,
            message: 'Article supprimé avec succès'
        });
    }
    catch (error) {
        console.error('Error deleting article:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Erreur lors de la suppression de l\'article'
        });
    }
});
exports.deleteArticle = deleteArticle;
