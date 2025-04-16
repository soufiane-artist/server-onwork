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
exports.deleteFromCloudinary = exports.uploadToCloudinary = void 0;
const cloudinary_1 = __importDefault(require("cloudinary"));
const cloudinary_2 = require("cloudinary");
// Configure Cloudinary
cloudinary_1.default.v2.config({
    cloud_name: 'dvivzto6g',
    api_key: '277886899756773',
    api_secret: 'w7fzvlGo27IuYaexKc9_K91yT6A'
});
const uploadToCloudinary = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield cloudinary_2.v2.uploader.upload(filePath, {
            folder: 'onwork',
            resource_type: 'auto'
        });
        return {
            public_id: result.public_id,
            secure_url: result.secure_url
        };
    }
    catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw new Error('Error uploading file');
    }
});
exports.uploadToCloudinary = uploadToCloudinary;
const deleteFromCloudinary = (publicId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Try to delete as image first
        yield cloudinary_2.v2.uploader.destroy(publicId, {
            resource_type: 'image'
        });
    }
    catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        try {
            // If image deletion fails, try raw file
            yield cloudinary_2.v2.uploader.destroy(publicId, {
                resource_type: 'raw'
            });
        }
        catch (error) {
            console.error('Error deleting raw file from Cloudinary:', error);
            throw new Error('Error deleting file from Cloudinary');
        }
    }
});
exports.deleteFromCloudinary = deleteFromCloudinary;
