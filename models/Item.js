const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  created: {
    type: Date,
    default: Date.now(),
  },
  brandId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Brand',
    required: 'Select a brand',
  },
  collectionId: { 
    type: mongoose.Schema.ObjectId,
    ref: 'Collection',
    required: [true,'Select a collection'],
  },
  finishId: { 
    type: mongoose.Schema.ObjectId,
    ref: 'Finish',
    required: [true, 'Select a finish']
  },
  colourId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Colour',
    required: true
  },
  purchaseDate: {
    type: Date,
    required: [true, 'Enter a purchase date']
  },
  condition: {
    type: [String],
    required: [true, 'Select condition options']
  },
  originalSize: {
    type: Number,
    required: [true, 'Select original size']
  },
  quantityRemaining: {
    type: Number,
    required: [true, 'Enter quantity remaining']
  },
  images: {
    type: [String],
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  description: {
    type: String,
    required: [true, 'Enter a description']
  },
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
