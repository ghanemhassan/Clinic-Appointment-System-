const express = require('express');
const cors = require('cors'); // allow front to connect with back
const routes = require('./routes');
const requestLogger = require('./middlewares/logger.middleware');
const errorHandler = require('./middlewares/errorHandler.middleware');

const app = express();

// ─── CORS ──────────────────────────────────────────────────────
app.use(cors());

// ─── Body Parsers ──────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Request Logger ────────────────────────────────────────────
app.use(requestLogger);

// ─── Health Check ──────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Clinic Appointment System API is running.',
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ────────────────────────────────────────────────
app.use('/api', routes);

const path = require('path');
const fs = require('fs');

// ─── Serve Frontend Static Files (if built) ────────────────────
const frontendDistPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

// ─── 404 Handler for API ───────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ─── Global Error Handler ──────────────────────────────────────
app.use(errorHandler);

module.exports = app;
