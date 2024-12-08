const express = require('express');
const router = express.Router();
const Brand = require('../models/brand');
const Category = require('../models/category');
const BestSeller = require('../models/bestSeller');
const Product = require('../models/product');


router.get("/", async (req, res) => {
    try {
        const brands = await Brand.find({});
        const categories = await Category.find({});
        const bestSellers = await BestSeller.find().populate('item');
        res.render("home", {categoriess: categories, brandss: brands, best: bestSellers });
    } catch (err) {
        console.log(err);
        res.status(500).send("An error occurred while fetching data.");
    }
});

// POST route for /productsBrands to fetch products by selected brand
router.post('/productBrands', async (req, res) => {
    console.log('Form submitted for brand:', req.body.brand); // Log the submitted brand
    try {
        const brandName = req.body.brand; // Get the brand name from the form
        if (!brandName) {
            return res.status(400).send("Brand name is required.");
        }

        const products = await Product.find({ brand: brandName }); // Get products that match the brand name

        // If no products are found, log a message
        console.log('Products found for brand:', products);

        // Render the productBrands page with the products of the selected brand
        res.render('productBrands', {
            products: products || [], // Pass the products to the template
            brandName: brandName
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error retrieving products.");
    }
});


module.exports = router;
