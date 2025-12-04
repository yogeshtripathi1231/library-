const express = require('express');
const authController = require('../controllers/authController');
const adminMiddleware = require('../middlewares/adminMiddleware');

const router = express.Router();

// Admin register: requires ADMIN_SECRET to be set in env and provided in header x-admin-secret or body.adminSecret
router.post('/register', authController.registerAdmin);

// Admin login: only allows users with role === 'admin'
router.post('/login', authController.loginAdmin);

// Create admin via existing admin user (no ADMIN_SECRET required) - protected by adminMiddleware
router.post('/create', adminMiddleware, authController.createAdminByAdmin);

module.exports = router;
