const express = require('express');
const router = express.Router();
const { getItemsList } = require('../controllers/itemController');
const { catchErrors } = require('../handlers/errors');
const {
  renderLogin,
  registerValidationRules,
  validateRegister,
  register,
  renderRegister,
} = require('../controllers/userController');
const { login, logout } = require('../controllers/authController');

router.get('/', catchErrors(getItemsList), (req, res) => {
  res.render('home', { title: 'Farrow & Ball Exchange' });
});
router.get('/login', renderLogin);
router.post('/login', login);
router.get('/logout', logout);
router.get('/register', renderRegister);

router.post(
  '/register',
  registerValidationRules(),
  validateRegister,
  register,
  login
);

module.exports = router;
