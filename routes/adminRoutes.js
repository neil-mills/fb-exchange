const express = require('express');
const router = express.Router();
const {
  collectionValidationRules,
  validateCollection,
  createCollection,
  updateCollection,
  renderCollectionList,
  renderAddCollection,
  renderEditCollection,
} = require('../controllers/collectionController');

const { brandValidationRules, validateBrand, createBrand, updateBrand, renderBrandList, renderAddBrand, renderEditBrand } = require('../controllers/brandController');
const { colourValidationRules, validateColour, createColour, updateColour, renderColourList, renderAddColour, renderEditColour } = require('../controllers/colourController');
const { catchErrors } = require('../handlers/errors');


// collection

router.get('/collection', catchErrors(renderCollectionList));

router.get('/collection/edit', catchErrors(renderAddCollection));

router.post(
  '/collection/edit',
  catchErrors(validateCollection),
  collectionValidationRules(),
  catchErrors(createCollection)
);

router.get('/collection/edit/:id', catchErrors(renderEditCollection));
router.post(
  '/collection/edit/:id',
  collectionValidationRules(),
  catchErrors(validateCollection),
  catchErrors(updateCollection)
);

//brand

router.get('/brand', catchErrors(renderBrandList));
router.get('/brand/edit', renderAddBrand);
router.post(
  '/brand/edit',
  brandValidationRules(),
  validateBrand,
  catchErrors(createBrand)
);

router.get('/brand/edit/:id', catchErrors(renderEditBrand));
router.post(
  '/brand/edit/:id',
  brandValidationRules(),
  validateBrand,
  catchErrors(updateBrand)
);

router.get('/colour', catchErrors(renderColourList));

router.get('/colour/edit', catchErrors(renderAddColour));

router.get('/colour/edit/:id', catchErrors(renderEditColour));

router.post(
  '/colour/edit',
  colourValidationRules(),
  catchErrors(validateColour),
  catchErrors(createColour)
);

router.post(
  '/colour/edit/:id',
  colourValidationRules(),
  catchErrors(validateColour),
  catchErrors(updateColour)
)

module.exports = router;