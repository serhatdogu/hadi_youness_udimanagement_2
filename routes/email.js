const express = require("express");
const router = express.Router();
const Email = require("../models/email");

// Handle subscription form submission
router.post("/subscribe", async (req, res) => {
    const { email } = req.body;

    try {
        // Check if email already exists
        const existingEmail = await Email.findOne({ email });
        if (existingEmail) {
            return res.redirect("/?error=Email+already+subscribed"); // Redirect with an error query
        }

        // Save the email to the database
        const newEmail = new Email({ email });
        await newEmail.save();

        res.redirect("/?success=Subscription+successful"); // Redirect with a success query
    } catch (err) {
        console.error(err);
        res.redirect("/?error=An+error+occurred"); // Redirect with an error query
    }
});

module.exports = router;
