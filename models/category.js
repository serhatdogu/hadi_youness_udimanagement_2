const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    category: String,
    brands: [String],
    img: String
});

module.exports = mongoose.model('Category', categorySchema);
