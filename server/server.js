const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
// CORS configuration - allow requests from Vercel frontend and localhost
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  'https://az-clinical-trails.vercel.app',
  'https://az-clinical-trails-git-master.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);

    // Check if origin is in allowed list or matches Vercel pattern
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }

    callback(null, true); // Allow all origins for now to debug
  },
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/registrations', require('./routes/registrations'));
app.use('/api/cell-therapy-interest', require('./routes/cellTherapyInterest'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'AstraZeneca Clinical Trials API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
