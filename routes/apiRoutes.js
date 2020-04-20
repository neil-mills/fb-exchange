const express = require('express');
const router = express.Router();
const { filterBrand } = require('../controllers/brandController');
const { getFinishes, getCollection } = require('../controllers/collectionController');

router.get('/collection/:id/finishes', getFinishes);
router.get('/collection/:id', getCollection);
router.get('/brand/:id', filterBrand);

module.exports = router;