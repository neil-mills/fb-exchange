const mongoose = require('mongoose');
const validator = require('validator');
const passportLocalMongoose = require('passport-local-mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    unique: [true, 'User with same email already registered'],
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Invalid email'],
    required: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 100,
    default: 100,
  },
  reviews: [mongoose.Schema.ObjectId],
});

userSchema.plugin(passportLocalMongoose, { errorMessages: { UserExistsError: 'User already registered' }, usernameField: 'email' });
userSchema.plugin(mongodbErrorHandler);

userSchema.statics.registerAsync = function (data, password) {
  return new Promise((resolve, reject) => {
    this.register(data, password, (err, user) => {
      if (err) return reject(err);
      resolve(user);
    });
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
