// middleware/errorHandler.js
module.exports = (err, req, res, next) => {
  console.error('Full error stack:', err.stack);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
  
  if (err.code === '23505') { // Unique violation in PostgreSQL
    return res.status(400).json({ 
      message: 'Duplicate entry',
      detail: err.detail
    });
  }
  
  res.status(500).json({ 
    message: err.message || 'Something went wrong',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};