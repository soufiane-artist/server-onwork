// invoice model

import mongoose, { Schema, Document } from 'mongoose';

export interface IClient {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface IInvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: '0' | '10' | '20';
  discount: number;
}

export interface IInvoice extends Document {
  invoiceNumber: string;
  clientId: mongoose.Types.ObjectId;
  issueDate: Date;
  dueDate: Date;
  paymentTerms: string;
  items: IInvoiceItem[];
  notes: string;
  subtotal: number;
  totalDiscount: number;
  totalTax: number;
  totalAmount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  createdAt: Date;
  updatedAt: Date;
}

const invoiceSchema = new Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
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
invoiceSchema.pre('save', function(next) {
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

export const Invoice = mongoose.model<IInvoice>('Invoice', invoiceSchema);