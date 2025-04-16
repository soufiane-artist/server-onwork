import Subscriber from '../models/sub.model';
import { Request, Response } from 'express';

interface SubscriberRequest extends Request {
  body: {
    email: string;
    source: string;
  };
  params: {
    id: string;
  };
  
}

export const getAllSubscribers = async (req: SubscriberRequest, res: Response) => {
  try {
    const subscribers = await Subscriber.find()
      .sort({ date: -1 })
      .select('-__v');
    
    res.json(subscribers);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching subscribers'
    });
  }
};

export const createSubscriber = async (req: SubscriberRequest, res: Response) => {
  try {
    const { email, source } = req.body;
    
    // Check if subscriber already exists
    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      return res.status(400).json({
        success: false,
        message: 'Subscriber already exists'
      });
    }

    const subscriber = new Subscriber({
      email,
      source: source.toLowerCase(),
      date: new Date()
    });

    await subscriber.save();

    res.status(201).json({
      success: true,
      data: subscriber
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating subscriber'
    });
  }
};


export const deleteSubscriber = async (req: SubscriberRequest, res: Response) => {
  try {
    const { id } = req.params;

    const subscriber = await Subscriber.findByIdAndDelete(id);

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Subscriber not found'
      });
    }

    res.json({
      success: true,
      message: 'Subscriber deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting subscriber'
    });
  }
};
