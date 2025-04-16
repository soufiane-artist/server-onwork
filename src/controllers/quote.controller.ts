import { Request, Response } from 'express';
import { IQuoteItem, Quote } from '../models/quote.model';
import mongoose from 'mongoose';

interface ICreateQuote {
  quoteNumber: string;
  clientId: mongoose.Types.ObjectId;
  issueDate: Date;
  validUntil: Date;
  items: IQuoteItem[];
  notes: string;
}

// @access  Private
export const createQuote = async (req: Request, res: Response): Promise<void> => {
  
  try {
    const {
      quoteNumber,
      clientId,
      issueDate,
      validUntil,
      items,
      notes
    } = req.body;

    // Calculate totals
    const subtotal = items.reduce((total: number, item: IQuoteItem) => {
      return total + (item.quantity * item.unitPrice);
    }, 0);

    const totalDiscount = items.reduce((total: number, item: IQuoteItem) => {
      const itemSubtotal = item.quantity * item.unitPrice;
      return total + (itemSubtotal * item.discount) / 100;
    }, 0);

    const totalTax = items.reduce((total: number, item: IQuoteItem) => {
      const itemSubtotal = item.quantity * item.unitPrice;
      const discountAmount = (itemSubtotal * item.discount) / 100;
      const afterDiscount = itemSubtotal - discountAmount;
      return total + (afterDiscount * parseInt(item.taxRate)) / 100;
    }, 0);

    const totalAmount = subtotal - totalDiscount + totalTax;

    // Create quote
    const quote = await Quote.create({
      quoteNumber,
      clientId,
      issueDate: new Date(issueDate),
      validUntil: new Date(validUntil),
      items,
      subtotal,
      totalDiscount,
      totalTax,
      totalAmount,
      notes
    });

    res.status(201).json({
      success: true,
      data: quote
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @access  Private
export const getQuotes = async (req: Request, res: Response): Promise<void> => {
  try {
    const quotes = await Quote.find()
      .populate('clientId', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: quotes
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @access  Private
export const getQuote = async (req: Request, res: Response): Promise<void> => {
  try {
    const quote = await Quote.findById(req.params.id)
      .populate('clientId', 'name email address phone')
      .populate('items');

    if (!quote) {
      res.status(404).json({
        success: false,
        message: 'Quote not found'
      });
      return;
    }

    res.json({
      success: true,
      data: quote
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @access  Private
export const updateQuote = async (req: Request, res: Response): Promise<void> => {
  try {
    const quote = await Quote.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!quote) {
      res.status(404).json({
        success: false,
        message: 'Quote not found'
      });
      return;
    }

    res.json({
      success: true,
      data: quote
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @access  Private
export const deleteQuote = async (req: Request, res: Response): Promise<void> => {
  try {
    const quote = await Quote.findById(req.params.id);

    if (!quote) {
      res.status(404).json({
        success: false,
        message: 'Quote not found'
      });
      return;
    }

    await quote.deleteOne();
    res.json({
      success: true,
      message: 'Quote removed'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
