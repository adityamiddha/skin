const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { updateMyPassword } = require('../controllers/authController');
const { protect } = require('../middlewares/authmiddleware');
const { getMe } = require('../controllers/authController');
const { updateMe } = require('../controllers/authController');


// POST /api/auth/signup
router.post('/signup', authController.signup);

// POST /api/auth/login
router.post('/login', authController.login);

// PATCH /api/auth/updateMyPassword
router.patch('/updateMyPassword', protect, updateMyPassword);

// PATCH /api/auth/updateMe
router.patch('/updateMe', protect, updateMe);

// GET /api/auth/getMe
router.get('/getMe', protect, getMe);


module.exports = router;