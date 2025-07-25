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

// Konfigurasi CORS yang lebih spesifik
const allowedOrigins = [
  'http://localhost:5173', // Development
  'https://ram-fe.vercel.app/' // Production - ganti dengan domain frontend Anda
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200 // Untuk browser lama yang bermasalah dengan status 204
};

// Terapkan CORS middleware
app.use(cors(corsOptions));

// Tangani khusus preflight requests untuk semua routes
app.options('*', cors(corsOptions));

// Middleware lainnya
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/keuangan', keuanganRoutes);
app.use('/api/susut', susutTimbanganRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Main route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the API' });
});

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});

module.exports = app;