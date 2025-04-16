// client controller
import { Request, Response } from 'express';
import { Client } from '../models/client.model';
import { Invoice } from '../models/invoice.model';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary';
import fs from 'fs/promises';
import multer from 'multer';

// Extend Express Request type to include file upload
interface FileUploadRequest extends Request {
  file?: Express.Multer.File;
}

// Configure multer for file upload
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

export const createClient = async (req: FileUploadRequest, res: Response): Promise<void> => {
  try {
    const { name, type, email, phone, contactName, address, salesRep, notes, ice } = req.body;
    let documents: { filename: string; contentType: string; data: string }[] = [];

    // Handle file upload if present
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

    const client = new Client({
      name,
      type,
      email,
      phone,
      contactName,
      address,
      salesRep,
      notes,
      ice,
      documents
    });

    await client.save();
    
    res.status(201).json({
      success: true,
      message: 'Client created successfully',
      data: client
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating client'
    });
  }
};

export const getClients = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, type, search } = req.query;
    const query: any = {};
    
    if (type) {
      query.type = type;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const clients = await Client.find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Client.countDocuments(query);
    
    res.json({
      success: true,
      data: clients,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit)
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching clients'
    });
  }
};

export const getClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const client = await Client.findById(id).populate('invoices');
    
    if (!client) {
      res.status(404).json({
        success: false,
        message: 'Client not found'
      });
      return;
    }

    res.json({
      success: true,
      data: client
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching client'
    });
  }
};

export const updateClient = async (req: FileUploadRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const client = await Client.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!client) {
      res.status(404).json({
        success: false,
        message: 'Client not found'
      });
      return;
    }

    // Handle file upload if present
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.path);
      
      // Add new document
      client.documents = client.documents || [];
      client.documents.push({
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        data: uploadResult.secure_url
      });
      
      await client.save();
      
      // Clean up temp file
      await fs.unlink(req.file.path);
    }

    res.json({
      success: true,
      message: 'Client updated successfully',
      data: client
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating client'
    });
  }
};

export const deleteClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if client exists
    const client = await Client.findById(id);
    if (!client) {
      res.status(404).json({
        success: false,
        message: 'Client not found'
      });
      return;
    }

    // Check if client has invoices (prevent deletion if they do)
    const invoiceCount = await Invoice.countDocuments({ clientId: id });
    if (invoiceCount > 0) {
      res.status(400).json({
        success: false,
        message: 'Cannot delete client with existing invoices'
      });
      return;
    }

    // Check if client has any related documents
    if (client.documents && client.documents.length > 0) {
      // Delete each document from Cloudinary
      for (const document of client.documents) {
        // Extract public_id from secure_url (assuming format: https://res.cloudinary.com/dvivzto6g/image/upload/v1234567890/filename.jpg)
        const publicIdMatch = document.data.match(/cloudinary.com\/dvivzto6g\/.*\/([^/]+)/);
        if (publicIdMatch && publicIdMatch[1]) {
          await deleteFromCloudinary(publicIdMatch[1]);
        }
      }
    }


    // Delete client
    await client.deleteOne();

    res.json({
      success: true,
      message: 'Client deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting client:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting client'
    });
  }
};

export const getClientInvoices = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const client = await Client.findById(id).populate('invoices');

    if (!client) {
      res.status(404).json({
        success: false,
        message: 'Client not found'
      });
      return;
    }

    res.json({
      success: true,
      data: client.invoices
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching client invoices'
    });
  }
};

export const clientController = {
  createClient,
  getClients,
  getClient,
  updateClient,
  deleteClient,
  getClientInvoices
};