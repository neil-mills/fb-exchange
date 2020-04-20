const mongoose = require('mongoose');
const Colour = mongoose.model('Colour');
const Palette = mongoose.model('Palette');
const Tone = mongoose.model('Tone');
const Brand = mongoose.model('Brand');

const { body, validationResult } = require('express-validator');

exports.colourValidationRules = () => {
  return [
    body('name').not().isEmpty().withMessage('Enter a name'),
    body('brandId').not().isEmpty().withMessage('Select a brand'),
    body('paletteId').not().isEmpty().withMessage('Select a palette'),
    body('toneId').not().isEmpty().withMessage('Select a tone'),
  ];
};

exports.validateColour = async (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  req.flash(
    'error',
    errors.array().map((err) => err.msg)
  );
  const brandReq = Brand.find().sort('name');
  const paletteReq = Palette.find().sort('name');
  const toneReq = Tone.find().sort('name');
  const [brands, palettes, tones] = await Promise.all([
    brandReq,
    paletteReq,
    toneReq,
  ]);
  const body = req.params.id ? { ...req.body, _id: req.params.id } : req.body;
  res.render('editColour', { title: '', brands, palettes, tones, body });
};

exports.renderColourList = async (req, res) => {
  const colours = await Colour.find().sort('name');
  res.render('colours', { title: 'Colours', colours });
};

exports.renderAddColour = async (req, res) => {
  const brandReq = Brand.find().sort('name');
  const paletteReq = Palette.find().sort('name');
  const toneReq = Tone.find().sort('name');
  const [brands, palettes, tones] = await Promise.all([
    brandReq,
    paletteReq,
    toneReq,
  ]);
  console.log(brands);
  res.render('editColour', { title: 'Add Colour', brands, palettes, tones });
};

exports.renderEditColour = async (req, res) => {
  const colourReq = Colour.findOne({ _id: req.params.id });
  const brandReq = Brand.find().sort('name');
  const paletteReq = Palette.find().sort('name');
  const toneReq = Tone.find().sort('name');
  const [colour, brands, palettes, tones] = await Promise.all([
    colourReq,
    brandReq,
    paletteReq,
    toneReq,
  ]);
  res.render('editColour', {
    title: `Edit Colour`,
    colour,
    brands,
    palettes,
    tones,
  });
};

exports.createColour = async (req, res) => {
  const colour = await new Colour(req.body).save();
  req.flash('success', 'Colour has been added');
  res.redirect(`/admin/colour`);
};

exports.updateColour = async (req, res) => {
  console.log(req.body);
  const colour = await Colour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  req.flash('success', 'Colour has been updated');
  res.redirect(`/admin/colour`);
};

exports.getBrandColours = async (req, res) => {
  const colours = await Colour.find({ brandId: req.params.brandId })  
  res.json(colours);
};