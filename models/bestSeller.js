const mongoose = require('mongoose');

const bestSellerSchema = new mongoose.Schema({
    name: String,
    img: String,
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
    }
});

module.exports = mongoose.model('BestSeller', bestSellerSchema);
