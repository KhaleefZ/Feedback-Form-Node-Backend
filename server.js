const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fileUpload = require('express-fileupload');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth.routes');
const supportRoutes = require('./routes/support.routes');
const profileRoutes = require('./routes/profile.routes');
const uploadRoutes = require('./routes/upload.routes');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload middleware
app.use(fileUpload({
  createParentPath: true,
  limits: { 
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  },
}));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/upload', uploadRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Support System API',
    status: 'Running',
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend server is running on: http://localhost:${PORT}`);
});

module.exports = app;
