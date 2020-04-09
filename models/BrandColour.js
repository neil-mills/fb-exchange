const mongoose = require('mongoose');

const brandColourSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  brandId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Brand',
    required: true,
  },
  colourId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Colour',
    required: true,
  },
  toneId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tone',
    required: true,
  },
  finishId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Finish',
    required: true,
  },
  collectionId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Collection',
    required: true,
  },
});

const BrandColour = mongoose.model('BrandColour', brandColourSchema);

module.exports = BrandColour;
