const mongoose = require('mongoose');

const conditionSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
});

const Condition = mongoose.model('Condition', conditionSchema);

module.exports = Condition;
