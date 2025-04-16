import { Request, Response } from 'express';
import { Invoice, IInvoice } from '../models/invoice.model';
import { Client } from '../models/client.model';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary';
import fs from 'fs/promises';
import { Document } from 'mongoose';

interface FileUploadRequest extends Request {
  file?: Express.Multer.File;
}

// Add type for Mongoose document with our custom properties
interface InvoiceDocument extends IInvoice, Document {
  documents?: Array<{
    filename: string;
    contentType: string;
    data: string;
  }>;
}

export const createInvoice = async (req: FileUploadRequest, res: Response): Promise<void> => {
  try {
    const { 
      invoiceNumber, 
      clientId, 
      issueDate, 
      dueDate, 
      paymentTerms, 
      items, 
      notes 
    } = req.body;

    // Validate client exists
    const client = await Client.findById(clientId);
    if (!client) {
      res.status(404).json({
        success: false,
        message: 'Client not found'
      });
      return;
    }

    // Handle file upload if present
    let documents: { filename: string; contentType: string; data: string }[] = [];
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.path);
      documents = [{
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        data: uploadResult.secure_url
      }];
      
      // Clean up temp file
      await fs.unlink(req.file.path);
    }

    // Create invoice
    const invoice = new Invoice({
      invoiceNumber,
      clientId,
      issueDate: new Date(issueDate),
      dueDate: new Date(dueDate),
      paymentTerms,
      items,
      notes,
      documents
    });

    await invoice.save();
    
    res.status(201).json({
      success: true,
      message: 'Invoice created successfully',
      data: invoice
    });
  } catch (error: any) {
    console.error('Error creating invoice:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating invoice'
    });
  }
};

export const getInvoices = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, clientId, status, dateRange } = req.query;
    const query: any = {};
    
    if (clientId) {
      query.clientId = clientId;
    }

    if (status) {
      query.status = status;
    }

    if (dateRange) {
      const [startDate, endDate] = dateRange.toString().split(',');
      query.issueDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const invoices = await Invoice.find(query)
      .populate('clientId', 'name email')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Invoice.countDocuments(query);
    
    res.json({
      success: true,
      data: invoices,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit)
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching invoices'
    });
  }
};

export const getInvoice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findById(id)
      .populate('clientId')
      .populate('items');
    
    if (!invoice) {
      res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
      return;
    }
    res.json(invoice);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching invoice'
    });
  }
};

export const updateInvoice = async (req: FileUploadRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Handle file upload if present
    let documents: { filename: string; contentType: string; data: string }[] = [];
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.path);
      documents = [{
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        data: uploadResult.secure_url
      }];
      
      // Clean up temp file
      await fs.unlink(req.file.path);
    }

    // Update invoice
    const invoice = await Invoice.findByIdAndUpdate(
      id,
      { 
        ...updateData,
        documents: documents.length > 0 ? documents : undefined
      },
      { new: true, runValidators: true }
    );

    if (!invoice) {
      res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Invoice updated successfully',
      data: invoice
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating invoice'
    });
  }
};

export const deleteInvoice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findById(id) as InvoiceDocument;

    if (!invoice) {
      res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
      return;
    }

    // Check if invoice has any related documents
    if (invoice.documents && invoice.documents.length > 0) {
      // Delete each document from Cloudinary
      for (const document of invoice.documents) {
        // Extract public_id from secure_url (assuming format: https://res.cloudinary.com/dvivzto6g/image/upload/v1234567890/filename.jpg)
        const publicIdMatch = document.data.match(/cloudinary.com\/dvivzto6g\/.*\/([^/]+)/);
        if (publicIdMatch && publicIdMatch[1]) {
          await deleteFromCloudinary(publicIdMatch[1]);
        }
      }
    }

    await invoice.deleteOne();

    res.json({
      success: true,
      message: 'Invoice deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting invoice:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting invoice'
    });
  }
};

export const sendInvoice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findById(id);

    if (!invoice) {
      res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
      return;
    }

    // Update invoice status to 'sent'
    invoice.status = 'sent';
    await invoice.save();

    // TODO: Add email sending logic here
    // This would typically involve:
    // 1. Generating a PDF of the invoice
    // 2. Sending an email to the client with the PDF attachment

    res.json({
      success: true,
      message: 'Invoice sent successfully',
      data: invoice
    });
  } catch (error: any) {
    console.error('Error sending invoice:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error sending invoice'
    });
  }
};

export const invoiceController = {
  createInvoice,
  getInvoices,
  getInvoice,
  updateInvoice,
  deleteInvoice,
  sendInvoice
};
