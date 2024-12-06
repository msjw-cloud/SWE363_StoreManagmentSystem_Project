// models/productModel.js
const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    weight: { type: Number, required: true },
    color: { type: String, required: true },
    image: { type: String }
});

const productTypeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    companies: [companySchema]
});

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    color: { type: String },
    productTypes: [productTypeSchema]
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);