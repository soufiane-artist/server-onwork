import { Schema, model, Document } from 'mongoose';

// Interfaces
export interface IDeliveryItem {
  description: string;
  quantity: number;
  note?: string;
}

export interface IDelivery extends Document {
  deliveryNumber: string;
  invoiceId: Schema.Types.ObjectId;
  clientId: Schema.Types.ObjectId;
  issueDate: Date;
  deliveryDate: Date;
  deliveryAddress: string;
  transportInfo?: string;
  items: IDeliveryItem[];
  notes: string;
  status: 'draft' | 'sent' | 'delivered' | 'cancelled';
  senderSignature?: string;
  receiverSignature?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schemas
const deliveryItemSchema = new Schema<IDeliveryItem>({
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

const deliverySchema = new Schema<IDelivery>({
  deliveryNumber: {
    type: String,
    required: true,
    unique: true
  },
  invoiceId: {
    type: Schema.Types.ObjectId,
    ref: 'Invoice',
    required: true
  },
  clientId: {
    type: Schema.Types.ObjectId,
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

export default model<IDelivery>('Delivery', deliverySchema);
