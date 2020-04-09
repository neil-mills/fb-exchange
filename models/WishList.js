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
  colourId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Colour',
  },
  brandColourId: {
    type: mongoose.Schema.ObjectId,
    ref: 'BrandColour',
  },
  brandId: {
    type: [mongoose.Schema.ObjectId],
    ref: 'Brand',
  },
  subBrandId: {
    type: [mongoose.Schema.ObjectId],
    ref: 'SubBrand',
  },
  typeId: {
    type: [mongoose.Schema.ObjectId],
    ref: 'Type',
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
  },
});

const WishList = mongoose.model('WishList', wishListSchema);

module.exports = WishList;
