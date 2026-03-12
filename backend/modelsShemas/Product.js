// // models/Product.js

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: String,
  subCategory: String,
  price: Number,
  stock: Number,
  sustainabilityTags: [String],
  plasticFree: Boolean,
  compostable: Boolean,
  vegan: Boolean,
  recycled: Boolean,
  carbonFootprint: Number, // kg CO2
  plasticSaved: Number // kg
});

module.exports = mongoose.model('Product', productSchema);


