const express = require('express');
const csrf = require('csurf');
const {
    creatInventory,
    inventory,
    getInventory,
    deleteInventory,
    updateInventory
} = require('../controllers/inventoryController');

const router = express.Router();
const csrfProtection = csrf({ cookie: true });

// No CSRF protection needed for GET requests (read-only)
router.get('/', inventory);
router.get('/:id', getInventory);

// Apply CSRF protection only to POST, PATCH, and DELETE requests (state-changing operations)
router.post('/', csrfProtection, creatInventory);
router.patch('/:id', csrfProtection, updateInventory);
router.delete('/:id', csrfProtection, deleteInventory);

module.exports = router;
