const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    googleId: String,
    number: Number,
    nameUser: String,
    message: String,
    orders: [
        {
            received: { type: Boolean, default: false },
            checkout: { type: Boolean, default: false },
            items: [{
                img: String,
                title: String,
                price: Number,
                qty: Number,
                size: String
            }],
            total: String,
            date: String
        }
    ],
    address: {
        address: String,
        city: String,
        tel: Number
    }
});

module.exports = mongoose.model('User', userSchema);
