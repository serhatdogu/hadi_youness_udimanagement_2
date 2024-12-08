const express = require("express");
const router = express.Router();
const Contact = require("../models/contact"); // Import the model

// Render Contact page
router.get("/", (req, res) => {
    res.render("contact");
});

// Handle Contact Form Submission
router.post("/submit-contact", async (req, res) => {
    const { name, email, phone, message } = req.body;

    try {
        // Create a new Contact document
        const newContact = new Contact({ name, email, phone, message });
        await newContact.save(); // Save to the database

        console.log("Contact form data saved successfully:", newContact);

        // Render a thank-you page or redirect
        res.render("submit-contact", { name, email, phone, message });
    } catch (err) {
        console.error("Error saving contact data:", err);
        res.status(500).send("An error occurred while saving your message.");
    }

});

module.exports = router;
