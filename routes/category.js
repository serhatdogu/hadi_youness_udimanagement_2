const express = require('express');
const router = express.Router();
const Category = require('../models/category');

router.get("/", async (req, res) => {
    try {
        const categories = await Category.find({});
        res.render("category", { categoriess: categories, req });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error retrieving categories.");
    }
});

router.post("/", async (req, res) => {
    let category = req.body.categoryname;
    if (category.length > 1) category = category.charAt(0).toUpperCase() + category.slice(1);

    try {
        const categories = await Category.find({ category: { $regex: category, $options: "i" } });
        res.render("category", { categoriess: categories || [], req });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error searching for category");
    }
});

module.exports = router;
