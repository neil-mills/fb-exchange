const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: String,
  images: [String],
});

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;
