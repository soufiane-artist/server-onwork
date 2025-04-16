"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Schemas
const deliveryItemSchema = new mongoose_1.Schema({
    description: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    note: String
});
const deliverySchema = new mongoose_1.Schema({
    deliveryNumber: {
        type: String,
        required: true,
        unique: true
    },
    invoiceId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Invoice',
        required: true
    },
    clientId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    issueDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    deliveryDate: {
        type: Date,
        required: true
    },
    deliveryAddress: {
        type: String,
        required: true
    },
    transportInfo: String,
    items: [deliveryItemSchema],
    notes: {
        type: String,
        default: 'Veuillez vérifier les produits à la réception et nous signaler tout problème dans les 24 heures.'
    },
    status: {
        type: String,
        enum: ['draft', 'sent', 'delivered', 'cancelled'],
        default: 'draft'
    },
    senderSignature: String,
    receiverSignature: String
}, {
    timestamps: true
});
exports.default = (0, mongoose_1.model)('Delivery', deliverySchema);
