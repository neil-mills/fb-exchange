const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const Item = mongoose.model('Item');
const Brand = mongoose.model('Brand');
const Collection = mongoose.model('Collection');
const Finish = mongoose.model('Finish');

exports.itemValidationRules = () => {
  return [
    body('brandId').not().isEmpty().withMessage('Select a brand'),
    body('collectionId').not().isEmpty().withMessage('Select a collection'),
    body('finishId').not().isEmpty().withMessage('Select a finish'),
    body('purchaseDate').not().isEmpty().withMessage('Select a purchase date'),
    body('condition').not().isEmpty().withMessage('Enter condition'),
    body('originalSize').not().isEmpty().withMessage('Select original size'),
    body('quantityRemaining')
      .not()
      .isEmpty()
      .withMessage('Enter quantity remaining'),
    body('description').not().isEmpty().withMessage('Enter a description'),
  ];
};

exports.validateItem = async (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next(); //if no errors, goto add/update middleware
  }
  req.flash(
    'error',
    errors.array().map((err) => err.msg)
  );
  const brandsReq = Brand.find().sort('name');
  const collectionsReq = Collection.find().sort('name');
  const finishesReq = Finish.find().sort('name');
  const [brands, collections, finishes] = await Promises.all([
    brandsReq,
    collectionsReq,
    finishesReq,
  ]);

  res.render('editItem', {
    title: 'Add Item',
    body: req.body,
    brands,
    collections,
    finishes,
    flashes: req.flash(),
  });
};

exports.getLatestItems = async (req, res) => {
  return [];
};

exports.createItem = async (errors, req, res) => {
  const {
    brandId,
    collectionId,
    finishId,
    purchaseDate,
    condition,
    originalSize,
    quantityRemaining,
    images,
    description,
  } = req.body;
  const item = await new Item({
    brandId,
    collectionId,
    finishId,
    purchaseDate,
    condition,
    originalSize,
    quantityRemaining,
    images,
    description,
    userId: req.user._id,
  }).save();
  req.flash('success', 'Item successfully posted');
  return res.redirect(`/admin/item/edit/${item._id}`);
};

exports.updateItem = async (req, res) => {
  const {
    brandId,
    collectionId,
    finishId,
    purchaseDate,
    condition,
    originalSize,
    quantityRemaining,
    images,
    description,
  } = req.body;
  const item = await Item.findByIdAndUpdate(
    req.params.id,
    {
      brandId,
      collectionId,
      finishId,
      purchaseDate,
      condition,
      originalSize,
      quantityRemaining,
      images,
      description,
    },
    { new: true }
  );
  req.flash('success', 'Item has been updated');
  req.redirect(`/admin/item/edit/${item._id}`);
};

exports.renderAddItem = async (req, res) => {
  const brandsReq = Brand.find().sort('name');
  const collectionsReq = Collection.find().sort('name');
  const finishesReq = Finish.find().sort('name');
  const [brands, collections, finishes] = await Promises.all([
    brandsReq,
    collectionsReq,
    finishesReq,
  ]);

  res.render('editItem', {
    title: 'Add Item',
    brands,
    collections,
    finishes,
  });
};

exports.renderEditItem = async (req, res) => {
  const item = req.params.id ? await Item.findOne({ _id: req.params.id }) : {};
  const brandsReq = Brand.find().sort('name');
  const collectionsReq = Collection.find().sort('name');
  const finishesReq = Finish.find().sort('name');
  const [brands, collections, finishes] = await Promises.all([
    brandsReq,
    collectionsReq,
    finishesReq,
  ]);
  res.render('editItem', {
    title: 'Add Item',
    brands,
    collections,
    finishes,
    item,
    body: req.app.get('body') || {},
  });
};
