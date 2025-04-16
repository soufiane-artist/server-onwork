import mongoose, { Schema, Document } from 'mongoose';

export interface IQuoteItem {
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: '0' | '10' | '20';
  discount: number;
}

export interface IQuote extends Document {
  quoteNumber: string;
  clientId: mongoose.Types.ObjectId;
  issueDate: Date;
  validUntil: Date;
  items: IQuoteItem[];
  subtotal: number;
  totalDiscount: number;
  totalTax: number;
  totalAmount: number;
  notes: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const quoteSchema = new Schema({
  quoteNumber: {
    type: String,
    required: true,
    unique: true
  },
  clientId: {
    type: Schema.Types.ObjectId,
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

export const Quote = mongoose.model<IQuote>('Quote', quoteSchema);
