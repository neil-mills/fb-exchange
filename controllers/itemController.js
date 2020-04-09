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

exports.getItemOptions = async (req, res, next) => {
  // TO DO: implement cacheing on the mongoose requests
  const brandPromise = Brand.find().sort('name');
  const collectionPromise = Collection.find().sort('name');
  const finishPromise = Finish.find().sort('name');
  const promises = [brandPromise, collectionPromise, finishPromise];
  const [brands, collections, finishes] = await Promise.all(promises);
  req.app.set('brands', brands);
  req.app.set('collections', collections);
  req.app.set('finishes', finishes);
  next();
};

exports.validateItem = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next(); //if no errors, goto add/update middleware
  }
  req.flash(
    'error',
    errors.array().map((err) => err.msg)
  );
  res.render('editItem', {
    title: 'Add Item',
    body: req.body,
    brands: req.app.get('brands'),
    collections: req.app.get('collections'),
    finishes: req.app.get('finishes'),
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
  return res.redirect('/');
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
  if (item) {
    req.flash('success', "Item has been updated");
    const collections = await Collection.find({ brandId: item.brandId });
    const finishes = await Finish.find({ });
    res.render('editItem', {
      title: 'Edit Item',
      brands: req.app.get('brands'),
      collections,
      finishes
    }
    )
  }
};

exports.renderAddItem = async (req, res) => {
  res.render('editItem', {
    title: 'Add Item',
    brands: req.app.get('brands'),
    collections: req.app.get('collections'),
    finishes: req.app.get('finishes'),
  });
};

exports.renderEditItem = async (req, res) => {
  const item = await Item.findOne({ _id: req.params.id });
  res.render('editItem', {
    title: 'Edit Item',
    item,
    brands: req.app.get('brands'),
    collections: req.app.get('collections'),
    finishes: req.app.get('finishes'),
  });
};

exports.renderEditItem = async (req, res) => {
  const item = req.params.id ? await Item.findOne({ _id: req.params.id }) : {};
  res.locals.tmp = 'editItem';
  res.render('editItem', {
    title: 'Add Item',
    brands: req.app.get('brands'),
    collections: req.app.get('collections'),
    finishes: req.app.get('finishes'),
    item,
    body: req.app.get('body') || {},
  });
};
