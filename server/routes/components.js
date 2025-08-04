const express = require('express');
const router = express.Router();
const {
  addComponent,
  getComponents,
  getComponent,
  updateComponent,
  deleteComponent
} = require('../controllers/componentController');

const auth = require('../middleware/authMiddleware');

// Protect all component routes
router.post('/', auth, addComponent);
router.get('/', auth, getComponents);
router.get('/:id', auth, getComponent);
router.put('/:id', auth, updateComponent);
router.delete('/:id', auth, deleteComponent);

module.exports = router;
