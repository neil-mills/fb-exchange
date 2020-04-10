const express = require('express');
const router = express.Router();
const {
  getItemOptions,
  itemValidationRules,
  validateItem,
  createItem,
  updateItem,
  renderAddItem,
  renderEditItem,
} = require('../controllers/itemController');
const {
  collectionValidationRules,
  validateCollection,
  createCollection,
  updateCollection,
  renderCollectionList,
  renderAddCollection,
  renderEditCollection,
} = require('../controllers/collectionController');

const { catchErrors } = require('../handlers/errors');

//item

router.get('/item/edit', getItemOptions, catchErrors(renderAddItem));

router.post(
  '/item/edit',
  itemValidationRules(),
  getItemOptions,
  validateItem,
  catchErrors(createItem)
);

router.get('/item/edit/:id', catchErrors(renderEditItem));

router.post(
  '/item/edit/:id',
  itemValidationRules(),
  getItemOptions,
  validateItem,
  //update item middleware here **
  catchErrors(renderEditItem)
);

// collection

router.get('/collection', catchErrors(renderCollectionList));

router.get('/collection/edit', catchErrors(renderAddCollection));

router.post(
  '/collection/edit',
  collectionValidationRules(),
  catchErrors(validateCollection),
  catchErrors(createCollection)
);

router.get('/collection/edit/:id', catchErrors(renderEditCollection));
router.post(
  '/collection/edit/:id',
  collectionValidationRules(),
  catchErrors(validateCollection),
  catchErrors(updateCollection)
);

module.exports = router;
