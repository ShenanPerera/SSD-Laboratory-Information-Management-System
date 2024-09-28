require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const winston = require('winston');

const { dosLimiter } = require('./middleware/rateLimitMiddleware');
const patientRoutes = require('./routes/patientRoutes');
const servicesRoutes = require('./routes/servicesRoutes');
const billRoutes = require('./routes/billRoutes');
const expensesRoutes = require('./routes/expensesRoutes');
const sampleRoutes = require('./routes/samples');
const testRoutes = require('./routes/tests');
const testResultRoutes = require('./routes/testResultRoutes');
const machineRoutes = require('./routes/machineRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const StaffRoutes = require('./routes/StaffRoutes.js');
const AdminRoute = require('./routes/AdminRoute.js');
const LabInfoRoutes = require('./routes/LabInfoRoutes.js');
const machinePartsRoute = require('./routes/machinePartsRoute');
const serviceMachineRoute = require('./routes/serviceMachineRoutes');
const AttendanceRoute = require('./routes/AttendanceRoute');
const SalaryRoute = require('./routes/salaryRoutes');

const app = express();

// Winston logger configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

// Trust the first proxy
app.set('trust proxy', 1);

// Enable CORS for all routes
app.use(cors());

// Middleware
app.use(express.json());
app.use(cookieParser()); // Required for CSRF

// CSRF protection middleware (only for /api/inventoryRoutes)
const csrfProtection = csrf({ cookie: true });

// Helmet middleware for securing HTTP headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      'script-src': ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net'],
      'img-src': ["'self'", 'data:'],
      'connect-src': ["'self'", 'cdn.jsdelivr.net'],
      'default-src': ["'self'"],
      'style-src': null,
    },
  },
}));

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Rate limiting middleware
app.use(dosLimiter);

// Apply CSRF protection only to the /api/inventoryRoutes route
app.use('/api/inventoryRoutes', csrfProtection, inventoryRoutes);

// CSRF token route (for fetching the CSRF token, if needed)
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Other routes (No CSRF protection for these routes)
app.use('/api/patients/', patientRoutes);
app.use('/api/services/', servicesRoutes);
app.use('/api/bills/', billRoutes);
app.use('/api/expenses/', expensesRoutes);
app.use('/api/samples', sampleRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/testResult', testResultRoutes);
app.use('/api/machines', machineRoutes);
app.use('/api/Staff', StaffRoutes);
app.use('/api/Admin', AdminRoute);
app.use('/api/labInfo', LabInfoRoutes);
app.use('/api/machineParts', machinePartsRoute);
app.use('/api/serviceMachines', serviceMachineRoute);
app.use('/api/Attendance', AttendanceRoute);
app.use('/api/Salary', SalaryRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  res.status(err.status || 500).json({ error: err.message });
});

// Connect to db and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      logger.info(`Connected to db and listening on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    logger.error('Database connection error:', error);
  });
