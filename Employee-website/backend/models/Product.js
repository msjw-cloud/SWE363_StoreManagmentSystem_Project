const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  product: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Refrigerators', 'Washing Machines', 'ACs', 'Dishwashers', 'Cooking']
  },
  items: {
    type: Number,
    required: true,
    default: 0
  },
  type: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);