const mongoose = require('mongoose');

const wishListSchema = new mongoose.Schema({
  created: {
    type: Date,
    default: Date.now(),
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  brands: {
    type: [mongoose.Schema.ObjectId],
    ref: 'Brand',
  },
  collections: {
    type: [mongoose.Schema.ObjectId],
    ref: 'Collection',
  },
  finishes: {
    type: [mongoose.Schema.ObjectId],
    ref: 'Finish',
  },
  colours: {
    type: mongoose.Schema.ObjectId,
    ref: 'Colour',
  },
  quantityMin: {
    type: Number,
    required: true,
  },
  quantityMax: {
    type: Number,
  },
  condition: {
    type: [mongoose.Schema.ObjectId],
    ref: 'Condition',
  },
});

const WishList = mongoose.model('WishList', wishListSchema);

module.exports = WishList;
