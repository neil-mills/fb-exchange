const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const Item = mongoose.model('Item');
const Brand = mongoose.model('Brand');
const Collection = mongoose.model('Collection');
const Finish = mongoose.model('Finish');
const { getBrand } = require('./brandController');

exports.itemValidationRules = () => {
  return [
    body('brandId').not().isEmpty().withMessage('Select a brand'),
    body('collectionId').not().isEmpty().withMessage('Select a collection'),
    body('finishId').not().isEmpty().withMessage('Select a finish'),
    body('purchaseDate').not().isEmpty().withMessage('Select a purchase date'),
    body('condition').not().isEmpty().withMessage('Select condition'),
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
  const brandReq = Brand.find().sort('name');
  const collectionReq = Collection.find().sort('name');
  const finishReq = Finish.find().sort('name');
  const [brands, collections, finishes] = await Promise.all([
    brandReq,
    collectionReq,
    finishReq,
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

exports.createItem = async (req, res) => {
  console.log(req.body)
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
  const item = await Item.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  req.flash('success', 'Item has been updated');
  return res.redirect(`/admin/item/edit/${item._id}`);
};

exports.renderAddItem = async (req, res) => {
  const brands = await Brand.find().sort('name');
  res.render('editItem', {
    title: 'Add Item',
    brands,
    collections: [],
    finishes: [],
    colours: []
  });
};

exports.renderEditItem = async (req, res) => {
  const item = await Item.findOne({ _id: req.params.id });
  const brands = await Brand.find().sort('name');
  const {collections=[], finishes=[], colours=[]} = await getBrand(item.brandId);
  const body = req.params.id ? { ...req.body, _id: req.params.id } : req.body;
  res.render('editItem', {
    title: 'Edit Item',
    brands,
    collections,
    finishes,
    colours,
    item,
    body
  });
};

exports.getItemsList = async (req, res, next) => {
  const items = await Item
    .find()
    .populate('brandId')
    .populate('collectionId')
    .populate('finishId')
    .populate('userId')
    .sort('-created');
  res.locals.items = items;
  next();
}