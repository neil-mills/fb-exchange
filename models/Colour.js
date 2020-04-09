const mongoose = require('mongoose');

const colourSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
});

const Colour = mongoose.model('Colour', colourSchema);

module.exports = Colour;
