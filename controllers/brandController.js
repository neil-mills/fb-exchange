const mongoose = require('mongoose');
const Brand = mongoose.model('Brand');

exports.getBrands = async(req, res) => {
  const brands = await Brand.find().sort('name');
  console.log('BRANDS=', brands)
  res.json(brands);
};