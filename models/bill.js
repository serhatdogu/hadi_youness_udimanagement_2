const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
    type: { type: String, required: true }, // e.g., Electricity, Internet
    company: { type: String, required: true }, // Company providing the service
    address: { type: String, required: true }, // Billing address
    accountNumber: { type: String, required: true }, // Reference/account number
    paymentMethod: { type: String, required: true }, // How the bill is paid
    dueDate: { type: Date, required: true }, // When the bill is due
    contactNumber: { type: String }, // Company contact
    notes: { type: String } // Additional details
});

const Bill = mongoose.model("Bill", billSchema);

module.exports = Bill;
