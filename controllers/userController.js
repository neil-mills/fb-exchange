const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const User = mongoose.model('User');
const { promisify } = require('es6-promisify');

exports.registerValidationRules = () => {
  return [
    body('name')
      .not()
      .isEmpty()
      .withMessage('Name cannot be blank')
      .trim()
      .escape(),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Use a valid email address'),
    body('password')
      .not()
      .isEmpty()
      .withMessage('Password cannot be blank')
      .isLength({ min: 5 })
      .withMessage('Password must be at least 5 chars long'),
    body('confirm-password')
      .not()
      .isEmpty()
      .withMessage('Confirm password cannot be blank')
      .custom((value, { req }) => value === req.body.password)
      .withMessage('Passwords do not match'),
  ];
};

exports.renderLogin = (req, res) => {
  console.log('render login')
  res.render('login', { title: 'Login', body: req.body });
};

exports.renderRegister = (req, res) => {
  res.render('register', { title: 'Register', body: req.body });

};
exports.validateRegister = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next(); //if no errors, goto register middleware
  }
  req.flash(
    'error',
    errors.array().map((err) => err.msg)
  );

  //const extractedErrors = errors.array().map(err => ({ [err.param]: err.msg }));
  res.render('register', {
    title: 'Register',
    body: req.body,
    flashes: req.flash(),
  });
  return;
};

exports.register = async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = new User({ name, email });
  try {
    await User.registerAsync(user, password);
    next();
  } catch (err) {
    req.flash('error', err.message);
    res.render('register', {
      title: 'Register',
      body: req.body,
      flashes: req.flash(),
    });
    return;
  }
};
