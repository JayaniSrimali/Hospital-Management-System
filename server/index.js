const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');

dotenv.config();

const app = express();

// Middleware - Moved to the top for maximum reliability
app.use(cors({
  origin: true, // This will reflect the origin of the request, allowing any domain
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

app.use(express.json());

// Root route to prevent 'Cannot GET /'
app.get('/', (req, res) => {
  res.json({ message: 'Hospital Management System Backend is Live!' });
});

const fs = require('fs');

// Health check route
app.get('/api', (req, res) => {
  res.json({ message: 'Hospital Management System API is running...' });
});

// Avoid crash on Vercel's read-only filesystem
if (process.env.NODE_ENV !== 'production') {
  if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
  }
}
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/patients', require('./routes/patients'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/prescriptions', require('./routes/prescriptions'));
app.use('/api/billing', require('./routes/billing'));
app.use('/api/reports', require('./routes/reports'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

