import express, { Request, Response, NextFunction } from 'express';
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
import serverless from 'serverless-http';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:8080', 'http://localhost:3000', 'https://onwork-agence.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
connectDB().then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

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

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Only start the server if we're not in a serverless environment
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
