import Contact, { ContactInterface } from '../models/contact.model';
import { NextFunction, Request, Response } from 'express';


// Create new contact message
export const createContactMessage = async (req: Request, res: Response) => {
  try {
    const contactData = req.body as ContactInterface;
    
    // Validate required fields
    if (!contactData.name || !contactData.email || !contactData.phone || !contactData.message || !contactData.service) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Create new contact message
    const contact = new Contact(contactData);
    await contact.save();

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      contact: contact.toObject()
    });
  } catch (error) {
    console.error('Error creating contact message:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating contact message'
    });
  }
};

// Get all contact messages (admin only)
export const getAllContactMessages = async (req: Request, res: Response) => {
  try {
    const contacts = await Contact.find()
      .sort({ date: -1 })
      .select('-__v');

    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contact messages'
    });
  }
};

// Update contact message status (admin only)
export const updateContactStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    contact.status = status;
    await contact.save();

    res.json(contact);
  } catch (error) {
    console.error('Error updating contact status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating contact status'
    });
  }
};

// Delete contact message (admin only)
export const deleteContactMessage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting contact message:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting contact message'
    });
  }
};