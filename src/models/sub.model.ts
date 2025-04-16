// sub model

import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscriber extends Document {
  email: string;
  date: Date;
  source: string;
  status: 'active' | 'inactive';
}

const subscriberSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  source: {
    type: String,
    required: true,
    enum: ['homepage', 'blog', 'contact', 'promotion', 'other']
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

export default mongoose.model<ISubscriber>('Subscriber', subscriberSchema);
