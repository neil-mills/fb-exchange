const mongoose = require('mongoose');
const WishList = mongoose.model('WishList');
const Brand = mongoose.model('Brand');
const Collection = mongoose.model('Collection');
const Colour = mongoose.model('Colour');
const Finish = mongoose.model('Finish');
const Condition = mongoose.model('Condition');
const Palette = mongoose.model('Palette');
const Tone = mongoose.model('Tone');

exports.getUserWishList = async (req, res, next) => {
  const wishList = await WishList.find({ userId: req.user._id })
    .populate('brands')
    .populate('collections')
    .populate('finishes')
    .populate('colours')
    .populate('condition');
  res.locals.wishList = wishList;
  next();
};

exports.getData = async (req, res, next) => {
  const brandReq = Brand.find().sort('name');
  const collectionReq = Collection.find().sort('name');
  const colourReq = Colour.find().sort('name');
  const finishReq = Finish.find().sort('name');
  const conditionReq = Condition.find().sort('name');
  const paletteReq = Palette.find().sort('name');
  const toneReq = Tone.find().sort('name');
  const [brands, collections, finishes, colours, conditions, palettes, tones] = await Promise.all([
    brandReq,
    collectionReq,
    finishReq,
    colourReq,
    conditionReq,
    paletteReq,
    toneReq
  ]);
  const data = { brands, collections, finishes, colours, conditions, palettes, tones }; 
  res.locals.data = data;
  next();
};

exports.renderAddWishList = async (req, res) => {
  const brandReq = Brand.find().sort('name');
  const conditionReq = Condition.find().sort('name');
  const paletteReq = Palette.find().sort('name');
  const toneReq = Tone.find().sort('name');
  const [brands, conditions, palettes, tones] = await Promise.all([
    brandReq,
    conditionReq,
    paletteReq,
    toneReq
  ]);
  const data = { brands, conditions, palettes, tones }; 
  
  res.render('editWishList', {
    title: 'Add Wish List Item',
    data
  });
};

exports.renderEditWishList = async (req, res) => {
  const brandReq = Brand.find().sort('name');
  
  const data = await getData();
  res.render('editWishList', {
    title: 'Edit Wish List Item',
    wishListItem
  });
};
