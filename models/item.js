const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    title: String,
    description: String,
    imgUrl: String,
    brand: String,
    category: String,
    size: String,
    price: Number,
    quantity: Number
});

module.exports = mongoose.model('Item', itemSchema);
