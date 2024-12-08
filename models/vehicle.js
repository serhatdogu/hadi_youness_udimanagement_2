const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    name: String,
    description: String,
    imgUrl: String,
    plate: String,
    year: String,
    inspectionDate:Date

});

module.exports = mongoose.model('Vehicle', vehicleSchema);
