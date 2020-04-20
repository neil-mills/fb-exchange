const mongoose = require('mongoose');
const Brand = mongoose.model('Brand');
const { body, validationResult } = require('express-validator');

exports.brandValidationRules = () => {
  return [body('name').not().isEmpty().withMessage('Enter a name')];
};

exports.validateBrand = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  req.flash(
    'error',
    errors.array().map((err) => err.msg)
  );
  const body = req.params.id ? { ...req.body, _id: req.params.id } : req.body;
  res.render('editBrand', { title: '', body });
};

exports.renderBrandList = async (req, res) => {
  const brands = await Brand.find().sort('name');
  res.render('brands', { title: 'Brands', brands });
};

exports.renderAddBrand = (req, res) => {
  res.render('editBrand', { title: 'Add Brand' });
};

exports.renderEditBrand = async (req, res) => {
  const brand = await Brand.findOne({ _id: req.params.id });
  res.render('editBrand', { title: `Edit ${brand.name}`, brand });
};

exports.createBrand = async (req, res) => {
  const brand = await new Brand(req.body).save();
  req.flash('success', 'Brand has been saved');
  res.redirect(`/admin/brand/edit/${brand._id}`);
};

exports.updateBrand = async (req, res) => {
  const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  }).exec();
  req.flash('success', `${brand.name} has been updated`);
  res.redirect(`/admin/brand`);
};

exports.filterBrand = async (req, res) => {
  const brand = await this.getBrand(req.params.id);
  if (!brand) return res.status(404).send('No brand found');
  res.json(brand);
};

exports.getBrand = async (brandId) => {
  const brand = await Brand.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(brandId) },
    },
    {
      $lookup: {
        from: 'collections',
        localField: '_id',
        foreignField: 'brandId',
        as: 'collectionId',
      },
    },
    
  ]);
  return (brand[0]);
};
