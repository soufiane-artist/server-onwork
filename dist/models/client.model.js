"use strict";
// client model
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const clientSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100
    },
    type: {
        type: String,
        required: true,
        enum: ['individual', 'freelance', 'sarl']
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: /^\S+@\S+\.\S+$/
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        minlength: 8
    },
    contactName: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true,
        minlength: 5
    },
    salesRep: {
        type: String
    },
    ice: {
        type: String,
        trim: true
    },
    notes: {
        type: String
    },
    documents: [{
            filename: String,
            contentType: String,
            data: String
        }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
// Add virtual for invoices
clientSchema.virtual('invoices', {
    ref: 'Invoice',
    localField: '_id',
    foreignField: 'clientId'
});
exports.Client = mongoose_1.default.model('Client', clientSchema);
