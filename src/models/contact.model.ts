// Contact model
import mongoose, { Schema, Document } from 'mongoose';

export interface ContactInterface extends Document {
  name: string;
  email: string;
  phone: string;
  message: string;
  service: string;
  status: string;
  date: Date;
}

const contactSchema = new Schema<ContactInterface>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  service: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['new', 'inProgress', 'resolved'],
    default: 'new'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Contact = mongoose.model<ContactInterface>('Contact', contactSchema);
export default Contact;