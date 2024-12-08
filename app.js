const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");
const bodyParser = require('body-parser');
const ejs =require('ejs');



const app = express();
const port = 3000;

// Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/UdiSalesDB")
    .then( () => console.log("MongoDB connected successfully"))
    .catch(err => console.log("Error connecting to MongoDB:", err));

// Import routes
const homeRoutes = require('./routes/home');
const brandRoutes = require('./routes/brand');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const aboutRoutes = require('./routes/about');
const contactRoutes = require('./routes/contact');
const emailRoutes = require("./routes/email");
const billsRoutes = require('./routes/bills');
const vehicleRoutes =require('./routes/vehicles')

// Use routes
app.use("/", homeRoutes);
app.use("/brand", brandRoutes); // This should already be correct
app.use("/category", categoryRoutes);
app.use("/products", productRoutes);
app.use("/about", aboutRoutes);  // Use About route
app.use("/contact", contactRoutes);  // Use Contact route
app.use("/",emailRoutes);
app.use("/bills", billsRoutes);
app.use("/vehicles",vehicleRoutes);

// Start server
app.listen(port, () => {
    console.log(`Server started on port ${port}.`);
});
