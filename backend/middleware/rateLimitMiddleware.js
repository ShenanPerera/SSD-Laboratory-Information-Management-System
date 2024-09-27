const rateLimit = require('express-rate-limit');

const adminLoginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
});

const staffLoginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
});

const dosLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
});

module.exports = {
  adminLoginLimiter,
  staffLoginLimiter,
  dosLimiter,
};
