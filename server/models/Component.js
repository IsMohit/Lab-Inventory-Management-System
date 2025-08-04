const mongoose = require('mongoose');

const componentSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  manufacturer: { type: String },
  partNumber:   { type: String },
  description:  { type: String },
  quantity:     { type: Number, default: 0 },
  location:     { type: String },
  unitPrice:    { type: Number },
  datasheet:    { type: String },
  category:     { type: String },
  criticalLow:  { type: Number, default: 10 },
  lastOutwardDate: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Component', componentSchema);
