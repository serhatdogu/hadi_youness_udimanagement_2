const express = require("express");
const router = express.Router();
const Bill = require("../models/bill"); // Import the model

// Render Bills Page with Filter Options
router.get("/", async (req, res) => {
    try {
        // Get all unique types and addresses for filter options
        const uniqueTypes = await Bill.distinct("type");
        const uniqueAddresses = await Bill.distinct("address");

        // Get selected type and address from query parameters
        const selectedType = req.query.type || '';
        const selectedAddress = req.query.address || '';

        // Build the filters based on the user's selection
        const filters = {};
        if (selectedType) filters.type = selectedType;
        if (selectedAddress) filters.address = selectedAddress;

        // Fetch filtered bills from the database
        const bills = await Bill.find(filters);

        // Render the page with bills and filter options
        res.render("bills", {
            bills,
            uniqueTypes,
            uniqueAddresses,
            selectedType,
            selectedAddress
        });
    } catch (err) {
        console.error("Error fetching bills:", err);
        res.status(500).send("An error occurred while loading the bills.");
    }
});

module.exports = router;
