const mongoose = require('mongoose');
const Finish = mongoose.model('Finish');
const Collection = mongoose.model('Collection');
const Brand = mongoose.model('Brand');
const { validationResult, body } = require('express-validator');

//api

exports.getFinishes = (req, res) => {
  const finishes = Finish
    .find()
    .populate('finishes')
    .select('finishes');
  res.json(finishes);
};

exports.collectionValidationRules = () => {
  return [
    body('brandId').not().isEmpty().withMessage('Select a brand'),
    body('finishes').not().isEmpty().withMessage('Select a finish'),
    body('description').not().isEmpty().withMessage('Enter a description'),
  ];
};

exports.validateCollection = async(req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next(); //if no errors, goto add/update middleware
  }
  req.flash(
    'error',
    errors.array().map((err) => err.msg)
  );
  const brandsReq = Brand.find().sort('name');
  const finishesReq = Finish.find().sort('name'); 
  const [ brands = [], finishes = [] ] = await Promise.all([brandsReq, finishesReq]);
   res.render('editCollection', { title: '', brands, finishes, body: req.body, flashes: req.flash() });

};

exports.renderCollectionList = async (req, res) => {
  const collections = await Collection.find().sort('name');
  res.render('collections', { title: 'Collections', collections })
};

exports.renderAddCollection = async (req, res) => {
  console.log('render add collection')
  const brandsReq = Brand.find().sort('name');
  const finishesReq = Finish.find().sort('name'); 
  const [ brands = [], finishes = [] ] = await Promise.all([brandsReq, finishesReq]);
  res.render('editCollection', { title: 'Add Collection', brands, finishes });
};

exports.renderEditCollection = async(req, res) => {
  const collection = await Collection.findOne({ _id: req.params.id });
  if (!collection) {
    req.flash('error', 'No collection found')
  }
  const brandsReq = Brand.find().sort('name');
  const finishesReq = Finish.find().sort('name'); 
  const [ brands = [], finishes = [] ] = await Promise.all([brandsReq, finishesReq]);
  res.render('editCollection', { title: 'Edit Collection', brands, finishes, collection })
};

exports.createCollection = async (req, res) => {
  const collection = await new Collection(req.body).save();
  req.flash('success', 'Collection has been saved');
  res.redirect(`/admin/collection/edit/${collection._id}`);
};

exports.updateCollection = async (req, res) => {
  const collection = await Collection.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).exec();
  req.flash('success', 'Collection has been updated');
  res.redirect(`/admin/collection/edit/${collection._id}`);
}
