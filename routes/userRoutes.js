const express = require('express');
const router = express.Router();
const {
  itemValidationRules,
  validateItem,
  createItem,
  updateItem,
  renderAddItem,
  renderEditItem,
} = require('../controllers/itemController');

const { getData, renderAddWishList, renderEditWishList, getUserWishList } = require('../controllers/wishListController');
const { catchErrors } = require('../handlers/errors');

router.get('/', catchErrors(getUserWishList), (req, res) => {
  res.render('user', { title: 'User' })
});

//item

router.get('/item/add', catchErrors(renderAddItem));

router.post(
  '/item/add',
  itemValidationRules(),
  catchErrors(validateItem),
  catchErrors(createItem)
);

router.get('/item/edit/:id', catchErrors(renderEditItem));

router.post(
'/item/edit/:id',
  itemValidationRules(),
  catchErrors(validateItem),
  catchErrors(updateItem)
);



router.get(
  '/wishlist/add',
  catchErrors(getData),
  catchErrors(renderAddWishList)
);
router.get('/wishlist/edit',
  catchErrors(getData),
  catchErrors(getUserWishList),
  catchErrors(renderEditWishList)
);

module.exports = router;