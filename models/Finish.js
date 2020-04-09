const mongoose = require('mongoose');

const finishSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: String,
});

const Finish = mongoose.model('Finish', finishSchema);

module.exports = Finish;
