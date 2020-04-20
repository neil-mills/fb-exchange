const mongoose = require('mongoose');
const Finish = mongoose.model('Finish');
const Collection = mongoose.model('Collection');
const Brand = mongoose.model('Brand');
const Colour = mongoose.model('Colour');
const { validationResult, body } = require('express-validator');

//api

exports.getFinishes = (req, res) => {
  const finish = Finish.find().populate('finishId').select('finishId');
  res.json(finish);
};

exports.collectionValidationRules = () => {
  return [
    body('brandId').not().isEmpty().withMessage('Select a brand'),
    body('finishId').not().isEmpty().withMessage('Select a finish'),
    body('description').not().isEmpty().withMessage('Enter a description'),
  ];
};

exports.validateCollection = async (req, res, next) => {
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
  const coloursReq = Colour.find().sort('name');

  const [brands = [], finishes = [], colours = []] = await Promise.all([
    brandsReq,
    finishesReq,
    coloursReq,
  ]);
  const body = req.params.id ? { ...req.body, _id: req.params.id } : req.body;

  res.render('editCollection', {
    title: '',
    brands,
    finishes,
    colours,
    body,
    flashes: req.flash(),
  });
};

exports.renderCollectionList = async (req, res) => {
  const collections = await Collection.find().sort('name');
  res.render('collections', { title: 'Collections', collections });
};

exports.renderAddCollection = async (req, res) => {
  console.log('render add collection');
  const brandsReq = Brand.find().sort('name');
  const finishesReq = Finish.find().sort('name');
  const coloursReq = Colour.find().sort('name');
  const [brands = [], finishes = [], colours = []] = await Promise.all([
    brandsReq,
    finishesReq,
    coloursReq,
  ]);
  res.render('editCollection', {
    title: 'Add Collection',
    brands,
    finishes,
    colours,
  });
};

exports.renderEditCollection = async (req, res) => {
  const collection = await Collection.findOne({ _id: req.params.id });
  if (!collection) {
    req.flash('error', 'No collection found');
  }
  const brandsReq = Brand.find().sort('name');
  const finishesReq = Finish.find().sort('name');
  const coloursReq = Colour.find().sort('name');

  const [brands = [], finishes = [], colours = []] = await Promise.all([
    brandsReq,
    finishesReq,
    coloursReq,
  ]);
  res.render('editCollection', {
    title: `Edit ${collection.name}`,
    brands,
    finishes,
    colours,
    collection,
  });
};

exports.createCollection = async (req, res) => {
  const collection = await new Collection(req.body).save();
  req.flash('success', 'Collection has been saved');
  res.redirect(`/admin/collection`);
};

exports.updateCollection = async (req, res) => {
  const collection = await Collection.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  ).exec();
  req.flash('success', `${collection.name} has been updated`);
  res.redirect(`/admin/collection`);
};

exports.getCollection = async (req, res) => {
  const collection = await Collection.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(req.params.id) },
    },
    {
      $lookup: {
        from: 'brands',
        localField: 'brandId',
        foreignField: '_id',
        as: 'brandId',
      },
    },
    {
      $lookup: {
        from: 'finishes',
        localField: 'finishId',
        foreignField: '_id',
        as: 'finishId',
      },
    },
    {
      $lookup: {
        from: 'colours',
        localField: 'colourId',
        foreignField: '_id',
        as: 'colourId',
      },
    },
  ]);
  if (!collection) return res.status(404).send('No collection found');
  res.json(collection[0]);
};
