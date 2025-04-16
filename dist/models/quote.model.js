"use strict";
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
exports.Quote = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const quoteSchema = new mongoose_1.Schema({
    quoteNumber: {
        type: String,
        required: true,
        unique: true
    },
    clientId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    issueDate: {
        type: Date,
        required: true
    },
    validUntil: {
        type: Date,
        required: true
    },
    items: [{
            description: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            unitPrice: {
                type: Number,
                required: true,
                min: 0
            },
            taxRate: {
                type: String,
                enum: ['0', '10', '20'],
                required: true
            },
            discount: {
                type: Number,
                required: true,
                min: 0,
                max: 100
            }
        }],
    subtotal: {
        type: Number,
        required: true,
        min: 0
    },
    totalDiscount: {
        type: Number,
        required: true,
        min: 0
    },
    totalTax: {
        type: Number,
        required: true,
        min: 0
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    notes: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['draft', 'sent', 'accepted', 'rejected'],
        default: 'draft'
    }
}, {
    timestamps: true
});
exports.Quote = mongoose_1.default.model('Quote', quoteSchema);
