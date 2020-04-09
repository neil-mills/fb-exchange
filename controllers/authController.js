const passport = require('passport');
const mongoose = require('mongoose');

exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Failed login',
  successRedirect: '/',
  successFlash: 'You are now logged in',
});

exports.logout = (req, res) => {
  req.logout(); //passport req method
  req.flash('success', 'Logged out');
  res.redirect('/');
};

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    //passport req method
    return next();
  }
  req.flash('error', 'You must be logged in to do that');
  res.redirect('/login');
};

exports.login = async (req, res) => {
  await passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: 'Failed login',
    successRedirect: '/',
    successFlash: 'You are now logged in',
  })(req, res);
};
