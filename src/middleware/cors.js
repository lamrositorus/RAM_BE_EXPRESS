// middleware/cors.js
const handleCORS = (options = {}) => {
  return (req, res, next) => {
    // Set CORS headers
    const origin = req.headers.origin;
    const allowedOrigins = [
      'http://localhost:5173',
      'https://ram-fe.vercel.app',
      'https://ram-be-express.vercel.app'
    ];

    if (origin && allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
    }
    
    res.header('Access-Control-Allow-Methods', options.methods?.join(',') || 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', options.allowedHeaders?.join(',') || 'Content-Type, Authorization');
    
    if (options.credentials) {
      res.header('Access-Control-Allow-Credentials', 'true');
    }

    // Jika ini OPTIONS request, langsung response
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    next();
  };
};

module.exports = { handleCORS };