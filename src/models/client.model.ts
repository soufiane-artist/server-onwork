// client model

import mongoose, { Schema, Document } from 'mongoose';
import { IInvoice } from './invoice.model';

export interface IClient extends Document {
  name: string;
  type: 'individual' | 'freelance' | 'sarl';
  email: string;
  phone: string;
  contactName?: string;
  address: string;
  salesRep?: string;
  notes?: string;
  ice?: string;
  documents?: {
    filename: string;
    contentType: string;
    data: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
  invoices?: IInvoice[]; 
}

const clientSchema = new Schema({
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

export const Client = mongoose.model<IClient>('Client', clientSchema);
