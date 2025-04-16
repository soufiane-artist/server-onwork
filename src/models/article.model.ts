import mongoose, { Schema, Document } from 'mongoose';

export interface IArticle extends Document {
  title: string;
  content: string;
  coverImage: {
    publicId: string;
    url: string;
  };
  author: {
    id: mongoose.Types.ObjectId;
    name: string;
  };
  status: 'draft' | 'published' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const articleSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5
  },
  content: {
    type: String,
    required: true,
    trim: true,
    minlength: 50
  },
  coverImage: {
    publicId: {
      type: String,
      required: false
    },
    url: {
      type: String,
      required: false
    }
  },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  }
}, {
  timestamps: true
});

export const Article = mongoose.model<IArticle>('Article', articleSchema);
