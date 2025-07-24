require('dotenv').config(); // Tambahkan ini di paling atas

const { Pool } = require('pg');

// Debug: Tampilkan nilai environment variables
console.log('DB Config:', {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  database: process.env.DB_NAME
});

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'admin', // Default fallback
  database: process.env.DB_NAME || 'postgres',
  ssl: false
});

pool.connect()
  .then(client => {
    console.log('✅ Database connected successfully');
    client.release();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
    console.log('\nLangkah perbaikan:');
    console.log('1. Pastikan PostgreSQL service berjalan');
    console.log('2. Verifikasi credentials di file .env');
    console.log(`3. Coba konek manual: psql -h ${process.env.DB_HOST} -U ${process.env.DB_USER} -d ${process.env.DB_NAME}`);
    process.exit(1);
  });

module.exports = pool;