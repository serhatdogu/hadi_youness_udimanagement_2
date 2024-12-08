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

        // Determine whether a search is being performed
        const isSearch = selectedType || selectedAddress;

        // Fetch bills based on whether a search is performed
        const bills = isSearch
            ? await Bill.find(filters) // Return all matching bills for a search
            : await Bill.find().sort({ _id: -1 }).limit(5); // Return only the last 20 bills by default

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
