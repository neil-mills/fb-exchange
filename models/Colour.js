const mongoose = require('mongoose');

const colourSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  brandId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Brand',
    required: true
  },
  paletteId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Palette',
    required: true,
  },
  toneId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tone',
    required: true,
  }
});

const Colour = mongoose.model('Colour', colourSchema);

module.exports = Colour;
