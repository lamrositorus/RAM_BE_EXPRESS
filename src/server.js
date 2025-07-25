const express = require('express');
const cors = require('cors');
const { PORT } = require('./config/env');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const usersRoutes = require('./routes/usersRoutes');
const keuanganRoutes = require('./routes/keuanganRoutes');
const susutTimbanganRoutes = require('./routes/susutTimbanganRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// Konfigurasi CORS yang komprehensif
const allowedOrigins = [
  'http://localhost:5173', // Development
  'https://ram-fe.vercel.app', // Production Frontend
  'https://ram-be-express.vercel.app' // Production Backend (jika diperlukan)
];

const corsOptions = {
  origin: function (origin, callback) {
    // Izinkan request tanpa origin (mobile apps, curl, dll)
    if (!origin) return callback(null, true);
    
    // Periksa semua kemungkinan pattern origin
    const isAllowed = allowedOrigins.some(allowedOrigin => 
      origin === allowedOrigin ||
      origin.startsWith(allowedOrigin) ||
      origin.endsWith('.vercel.app') || // Semua subdomain Vercel
      origin.endsWith('.now.sh') // Domain Now.sh legacy
    );

    if (isAllowed) {
      callback(null, true);
    } else {
      console.error('CORS Blocked for:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: false
};

// Terapkan CORS middleware
app.use(cors(corsOptions));

// Tangani khusus preflight requests untuk semua routes
app.options('*', cors(corsOptions));

// Middleware untuk logging (development only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - Origin: ${req.headers.origin}`);
    next();
  });
}

// Middleware lainnya
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/keuangan', keuanganRoutes);
app.use('/api/susut', susutTimbanganRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Main route
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Welcome to the RAM System API',
    version: '1.0.0',
    documentation: 'https://github.com/lamrositorus/RAM_FE_EXPRESS'
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle server shutdown gracefully
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = app;