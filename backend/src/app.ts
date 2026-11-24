import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/index.js';
import { errorHandler } from './middleware/errorHandler.js';

// Route imports
import authRoutes from './modules/auth/auth.routes.js';
import sellerRoutes from './modules/sellers/sellers.routes.js';
import productRoutes from './modules/products/products.routes.js';
import serviceRoutes from './modules/services/services.routes.js';
import cartRoutes from './modules/cart/cart.routes.js';
import orderRoutes from './modules/orders/orders.routes.js';
import bookingRoutes from './modules/bookings/bookings.routes.js';
import ledgerRoutes from './modules/ledger/ledger.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';
import paymentRoutes from './modules/payments/payments.routes.js';
import reviewRoutes from './modules/reviews/reviews.routes.js';
import path from 'path';

const app = express();

// Security and HTTP pipelines
app.use(helmet({
  crossOriginResourcePolicy: false,
  hsts: false,
  originAgentCluster: false,
  contentSecurityPolicy: false,
  crossOriginOpenerPolicy: false
}));
app.use(cors({
  origin: [
    config.clientUrl,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5093',
    'http://127.0.0.1:5093',
    'http://147.93.107.21:5093',
    'http://mahilo.sriddha.com',
    'https://mahilo.sriddha.com'
  ],
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'MAHILO API',
    tagline: 'Shop • Book • Learn • Empower',
    timestamp: new Date().toISOString(),
  });
});

// Mount Domain API Modules
app.use('/api/auth', authRoutes);
app.use('/api/sellers', sellerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/ledger', ledgerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);

// Serve Frontend Build in Production (Self-contained on port 5093)
const frontendDist = path.resolve(__dirname, '../../frontend/dist');
app.use(express.static(frontendDist));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(frontendDist, 'index.html'), (err) => {
    if (err) next();
  });
});

// Error Handling Middleware
app.use(errorHandler);

export default app;
