"use strict";
// invoice model
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
exports.Invoice = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const invoiceSchema = new mongoose_1.Schema({
    invoiceNumber: {
        type: String,
        required: true,
        unique: true
    },
    clientId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    issueDate: {
        type: Date,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    paymentTerms: {
        type: String,
        enum: ['0', '15', '30', '60'],
        default: '30'
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
                default: '20'
            },
            discount: {
                type: Number,
                min: 0,
                max: 100,
                default: 0
            }
        }],
    notes: {
        type: String,
        default: ''
    },
    subtotal: {
        type: Number,
        required: true,
        default: 0
    },
    totalDiscount: {
        type: Number,
        required: true,
        default: 0
    },
    totalTax: {
        type: Number,
        required: true,
        default: 0
    },
    totalAmount: {
        type: Number,
        required: true,
        default: 0
    },
    status: {
        type: String,
        enum: ['draft', 'sent', 'paid', 'overdue'],
        default: 'draft'
    }
}, {
    timestamps: true
});
// Calculate totals before saving
invoiceSchema.pre('save', function (next) {
    const invoice = this;
    invoice.subtotal = invoice.items.reduce((total, item) => {
        return total + (item.quantity * item.unitPrice);
    }, 0);
    invoice.totalDiscount = invoice.items.reduce((total, item) => {
        const itemSubtotal = item.quantity * item.unitPrice;
        return total + (itemSubtotal * item.discount) / 100;
    }, 0);
    invoice.totalTax = invoice.items.reduce((total, item) => {
        const itemSubtotal = item.quantity * item.unitPrice;
        const discountAmount = (itemSubtotal * item.discount) / 100;
        const afterDiscount = itemSubtotal - discountAmount;
        return total + (afterDiscount * parseInt(item.taxRate)) / 100;
    }, 0);
    invoice.totalAmount = invoice.subtotal - invoice.totalDiscount + invoice.totalTax;
    next();
});
exports.Invoice = mongoose_1.default.model('Invoice', invoiceSchema);
