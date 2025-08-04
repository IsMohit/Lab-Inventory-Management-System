const express = require('express');
const router = express.Router();
const { getNotifications, markAsSeen } = require('../controllers/notificationController');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, getNotifications);
router.put('/:id/seen', auth, markAsSeen);

module.exports = router;
