const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: String,
    brand: String,
    category: String,// Ensure this field exists and is spelled correctly
    description: String,
    price:Number,
    quantity:Number,
    size:String,
    img: String

});

module.exports = mongoose.model('Product', productSchema);
