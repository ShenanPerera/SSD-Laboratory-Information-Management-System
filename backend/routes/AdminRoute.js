const express = require('express');
const {
  getAdmin,
  createAdmin,
  getaAdmin,
  loginAdmin,
  getAdminByEmail,
} = require('../controllers/AdminController');

//const requireAuth = require('../middleware/requireAdminAuth')
const { adminLoginLimiter } = require('../middleware/rateLimitMiddleware');

const router = express.Router();

//router.use(requireAuth)

router.get('/', getAdmin);

router.get('/validateAdmin/', getAdminByEmail);

router.post('/', createAdmin);

router.post('/login', adminLoginLimiter, loginAdmin);

router.get('/:id', getaAdmin);


module.exports = router;
