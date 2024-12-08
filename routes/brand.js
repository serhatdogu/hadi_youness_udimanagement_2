const express = require('express');
const router = express.Router();
const Product = require('../models/product');  // module.exports = mongoose.model('Product', productSchema);
const Brand = require('../models/brand');  // module.exports = mongoose.model('Brand', brandSchema);

// GET route for fetching brands with pagination
router.get("/", async (req, res) => {
    try {
        const brandsPerPage = 12; // Number of brands per page
        let page = parseInt(req.query.page) || 1; // Get the current page or default to 1
        if (page < 1) page = 1; // Ensure page is at least 1

        // Fetch brands for the current page
        const brands = await Brand.find({})
            .skip((page - 1) * brandsPerPage) // Skip the previous pages
            .limit(brandsPerPage); // Limit the results to brandsPerPage

        // Count the total number of brands for pagination
        const totalBrands = await Brand.countDocuments();

        // Calculate the total number of pages
        const totalPages = Math.ceil(totalBrands / brandsPerPage);

        // Render the brand page with brands and pagination info
        res.render("brand", {
            brands: brands || [],
            currentPage: page,
            totalPages: totalPages
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error retrieving brands.");
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
