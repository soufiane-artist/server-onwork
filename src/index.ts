import express, { Request, Response, NextFunction, Application, RequestHandler } from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import cors from 'cors';
import subRoutes from './routes/sub.routes';
import contactRoutes from './routes/contact.routes';
import clientRoutes from './routes/client.routes';
import invoiceRoutes from './routes/invoice.routes';
import articleRoutes from './routes/article.routes';
import quoteRoutes from './routes/quote.routes';
import deliveryRoutes from './routes/delivery.routes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection state
let isConnected = false;

// Database connection middleware
const connectMiddleware: RequestHandler = async (req, res, next) => {
  try {
    if (!isConnected) {
      await connectDB();
      isConnected = true;
    }
    next();
  } catch (error) {
    console.error('Database connection failed:', error);
    next(error);
  }
};

app.use(connectMiddleware);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/subscribers', subRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/deliveries', deliveryRoutes);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

export default app;
