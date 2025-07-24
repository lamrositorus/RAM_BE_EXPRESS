const express = require('express');
const cors = require('cors');
const { PORT } = require('./config/env');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const usersRoutes = require('./routes/usersRoutes');
const keuanganRoutes = require('./routes/keuanganRoutes');
const susutTimbanganRoutes = require('./routes/susutTimbanganRoutes');

const app = express();

// Konfigurasi CORS
const corsOptions = {
  origin: [
    'http://localhost:5173', // Untuk development
    'https://your-frontend-domain.com' // Untuk production
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
// Tangani OPTIONS request untuk semua rute
app.options('*', cors(corsOptions));
app.use(express.json());

// Routes
app.use('/', authRoutes);
app.use('/users', usersRoutes);
app.use('/keuangan', keuanganRoutes);
app.use('/susut', susutTimbanganRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// main route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the API' });
});

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});

module.exports = app; // Export the app for testing purposes