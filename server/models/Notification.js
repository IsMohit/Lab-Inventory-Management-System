const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  component: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Component'
  },
  type: {
    type: String,
    enum: ['low-stock', 'old-stock'],
    required: true
  },
  message: { type: String },
  seen: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
