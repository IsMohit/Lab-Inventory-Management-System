const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getMonthlyMovementStats
} = require('../controllers/dashboardController');
const auth = require('../middleware/authMiddleware');

router.get('/stats', auth, getDashboardStats);
router.get('/monthly', auth, getMonthlyMovementStats);

module.exports = router;
