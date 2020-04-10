const express = require('express');
const router = express.Router();
const { getFinishes } = require('../controllers/collectionController');
const { getBrands } = require('../controllers/brandController');
router.get('/collection/:id/finishes', getFinishes);
const { catchErrors } = require('../handlers/errors');
router.get('/brands', catchErrors(getBrands));

module.exports = router;