const express = require('express');
const router = express.Router();
const { logMovement, getMovements } = require('../controllers/movementController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, logMovement);
router.get('/', auth, getMovements);

module.exports = router;
