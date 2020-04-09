const express = require('express');
const router = express.Router();
const { getItemOptions, itemValidationRules, validateItem,  createItem, updateItem, renderAddItem, renderEditItem } = require('../controllers/itemController');
const { catchErrors } = require('../handlers/errors');
//new item
router.get('/item/edit', getItemOptions, catchErrors(renderAddItem));

router.post('/item/edit',
  itemValidationRules(),
  getItemOptions,
  validateItem,
  catchErrors(createItem)
);

//update item
router.get('/item/edit/:id', catchErrors(renderEditItem));

router.post('/item/edit/:id',
  itemValidationRules(),
  getItemOptions,
  validateItem,
  //update item middleware here **
  catchErrors(renderEditItem)
);

module.exports = router;

