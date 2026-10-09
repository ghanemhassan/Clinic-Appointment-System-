const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { registerValidator, loginValidator } = require('../validators/auth.validator');
const validate = require('../validators/validate');
const authenticate = require('../middlewares/auth.middleware');

// Public routes
router.post('/register', registerValidator, validate, authController.register);
router.post('/login', loginValidator, validate, authController.login);

// Protected route
router.get('/me', authenticate, authController.getProfile);

module.exports = router;
