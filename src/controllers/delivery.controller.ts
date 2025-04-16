 /// delivery controller ts
 import { Request, Response } from 'express';
 import Delivery from '../models/delivery.model';
 

 
 // Create a new delivery
 export const createDelivery = async (req: Request, res: Response): Promise<void> => {


  try {
    const delivery = new Delivery(req.body);
    await delivery.save();
    res.status(201).json({
      success: true,
      data: delivery
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error
    });
  }
};


// Get all deliveries
export const getDeliveries = async (req: Request, res: Response): Promise<void> => {
  try {
    const deliveries = await Delivery.find();
    res.status(200).json({
      success: true,
      data: deliveries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error fetching deliveries'
    });
  }
};

// Get delivery by ID
export const getDeliveryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const delivery = await Delivery.findById(id);
    if (!delivery) {
      res.status(404).json({
        success: false,
        error: 'Delivery not found'
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: delivery
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error fetching delivery'
    });
  }
};

// Update delivery
export const updateDelivery = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const delivery = await Delivery.findByIdAndUpdate(id, req.body, { new: true });
    if (!delivery) {
      res.status(404).json({
        success: false,
        error: 'Delivery not found'
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: delivery
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error updating delivery'
    });
  }
};

// Delete delivery
export const deleteDelivery = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const delivery = await Delivery.findByIdAndDelete(id);
    if (!delivery) {
      res.status(404).json({
        success: false,
        error: 'Delivery not found'
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: delivery
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error deleting delivery'
    });
  }
};

// Update delivery status
export const updateDeliveryStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const delivery = await Delivery.findByIdAndUpdate(id, { status }, { new: true });
    if (!delivery) {
      res.status(404).json({
        success: false,
        error: 'Delivery not found'
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: delivery
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error updating delivery status'
    });
  }
};
