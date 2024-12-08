const express = require('express');
const router = express.Router();
const Item = require('../models/item');

router.post("/", async (req, res) => {
    const category = req.body.category || '';
    try {
        const query = category ? { category: { $regex: category, $options: "i" } } : {};
        const items = await Item.find(query);
        res.render("products", { items: items || [], req });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error finding products.");
    }
});

module.exports = router;
