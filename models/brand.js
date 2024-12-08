const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    brand: String,
    categories: [String],
    img: String
});

module.exports = mongoose.model('Brand', brandSchema);
