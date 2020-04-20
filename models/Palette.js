const mongoose = require('mongoose');

const paletteSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
});

const Palette = mongoose.model('Palette', paletteSchema);

module.exports = Palette;
