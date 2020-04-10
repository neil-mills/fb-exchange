const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  brandId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Brand',
    required: true,
  },
  finishes: {
    type: [mongoose.Schema.ObjectId],
    ref: 'Finish',
    required: true
  },
  description: String,
  images: [String],
});

const Collection = mongoose.model('Collection', collectionSchema);

module.exports = Collection;
