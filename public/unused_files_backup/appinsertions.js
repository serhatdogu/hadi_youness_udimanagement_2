const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const port = 3000;
const path = require('path');
const findOrCreate = require('mongoose-findorcreate');

const app = express();

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



// Connect to database
mongoose.connect("mongodb://localhost:27017/UdiSalesDB")
    .then(() => console.log("MongoDB connected successfully"))
    .catch(err => console.log("Error connecting to MongoDB:", err));

// Schema definitions
const brandSchema = new mongoose.Schema({
    brand: String,
    categories: [String],
    img: String
});

const categorySchema = new mongoose.Schema({
    category: String,
    brands: [String],
    img: String
});

const emailSchema = new mongoose.Schema({
    email: String
});

const itemSchema = new mongoose.Schema({
    title: String,
    description: String,
    imgUrl: String,
    brand: String,
    category: String,
    size: String,
    price: Number,
    quantity: Number
});

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    googleId: String,
    number: Number,
    nameUser: String,
    message: String,
    orders: [
        {
            received: { type: Boolean, default: false },
            checkout: { type: Boolean, default: false },
            items: [{
                img: String,
                title: String,
                price: Number,
                qty: Number,
                size: String
            }],
            total: String,
            date: String
        }
    ],
    address: {
        address: String,
        city: String,
        tel: Number
    }
});


// Define the BestSeller schema, including a reference to the Item schema
const bestSellerSchema = new mongoose.Schema({
    name: String,
    img: String,
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item' // Reference to the Item collection
    }
});


// Mongoose models
const Item = mongoose.model("Item", itemSchema);
const Email = mongoose.model("Email", emailSchema);
const BestSeller = mongoose.model('BestSeller', bestSellerSchema);
const Brand = mongoose.model("Brand", brandSchema);
const User = mongoose.model("User", userSchema);
const Category = mongoose.model("Category", categorySchema);


const bestSellersData = [
    {
        name: "Conde Hermanos",
        img: "/images/guitar4.jpg",
        itemBrand: "Conde Hermanos" // Reference to the brand in the Item collection
    },
    {
        name: "Graciliano Perez",
        img: "/images/guitar1.jpg",
        itemBrand: "Graciliano Perez" // Reference to the brand in the Item collection
    }
];




// Insert bestsellers linked to items
async function insertData() {
    try {
        for (let bs of bestSellersData) {
            // Find the corresponding item by brand (or any other field)
            const item = await Item.findOne({ brand: bs.itemBrand });

            if (item) {
                // Create a new bestseller entry with a reference to the found item
                const newBestSeller = new BestSeller({
                    name: bs.name,
                    img: bs.img,
                    item: item._id // Link the bestseller to the item by ObjectId
                });

                await newBestSeller.save(); // Save the bestseller to the database
                console.log("Inserted Bestseller:", newBestSeller);
            } else {
                console.log("Item not found for brand:", bs.itemBrand);
            }
        }
    } catch (err) {
        console.log("Error inserting data:", err);
    }
}

// Call the function to insert data
insertData();



 //Sample data
const brand1 = new Brand({ brand: "Bartolome Lozano", categories: ["Flamenco Guitar", "Classical Guitar", "Electric guitar"], img: "../images/guitar1.jpg" });
const categ1 = new Category({ category: "Flamenco Guitar", brands: ["Graciliano Perez", "Conde Hermanos", "Bartolome Lozano"], img: "../images/guitar2.jpg" });

//Insert data function
async function insertData() {
    try {
        const categories = await Category.insertMany([categ1]);
        console.log("Categories inserted:", categories);
        const brands = await Brand.insertMany([brand1]);
        console.log("Brands inserted:", brands);
    } catch (err) {
        console.log("Error inserting data:", err);
    }
}
//Call insertData once or conditionally

insertData();  //---> commented it as it adds products everytime we start the app.js




const item1 = new Item({
    title: "Nylon String Guitar",
    description: "Comfortable Playing, fingerstyle guitars",
    imgUrl: "../images/guitar1.jpg",
    brand: "Conde Hermanos",
    category: "Flamenco Guitar",
    size: "normal",
    price: "5000 Euro",
    quantity: 1
});

const item2 = new Item({
    title: "Steel String Guitar",
    description: "Comfortable Playing, fingerstyle guitars",
    imgUrl: "../images/guitar2.jpg",
    brand: "Graciliano Perez",
    category: "Acoustic Guitar",
    size: "normal",
    price: "2500 Euro",
    quantity: 1
});

//Insert both items
async function insertData() {
    try {
        const items = [
            {
                title: "Nylon String Guitar",
                description: "Comfortable Playing, fingerstyle guitars",
                imgUrl: "../images/guitar1.jpg",
                brand: "Conde Hermanos",
                category: "Flamenco Guitar",
                size: "normal",
                price: 5000, // Make sure this is a number, not a string
                quantity: 1
            },
            {
                title: "Steel String Guitar",
                description: "Comfortable Playing, fingerstyle guitars",
                imgUrl: "../images/guitar2.jpg",
                brand: "Graciliano Perez",
                category: "Acoustic Guitar",
                size: "normal",
                price: 2500, // Make sure this is a number, not a string
                quantity: 1
            }
        ];

         //Use upsert to update the items if they exist, or insert if they don't
        for (let item of items) {
            await Item.updateOne({ title: item.title }, item, { upsert: true });
        }

        console.log("Items inserted or updated.");
    } catch (err) {
        console.log("Error inserting or updating data:", err);
    }
}

insertData(); // Call this only when needed (e.g., via a route, or once in app initialization)




// Route to render homepage
app.get("/", async function (req, res) {
    try {
        const foundBrand = await Brand.find({});
        const foundBest = await BestSeller.find().populate('item');
        const foundCat = await Category.find({});
        res.render("home", { categoriess: foundCat, req: res, brandss: foundBrand, best: foundBest });
    } catch (err) {
        console.log(err);
        res.status(500).send("An error occurred while fetching data.");
    }
});

// Other routes
app.get("/about", function (req, res) {
    res.render("about", { req: req });
});

app.get("/contact", function (req, res) {
    res.render("contact", { req: req });
});



app.get("/brand", async function (req, res) {
    try {
        const found = await Brand.find({});
        res.render("brand.ejs", { brands: found, req: req });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error retrieving brands.");
    }
});




app.get("/category", async function (req, res) {
    try {
        const found = await Category.find({});
        res.render("category.ejs", { categoriess: found, req: req });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error retrieving categories.");
    }
});



app.post("/category", async function (req, res) {
    let category = req.body.categoryname;

    // Capitalize the first letter if the input is longer than 1 character
    if (category.length > 1) {
        category = category.charAt(0).toUpperCase() + category.slice(1);
    }

    try {
        // Use regular expression for partial matching and ignore case
        const found = await Category.find({
            category: {
                $regex: category,
                $options: "i" // 'i' makes it case-insensitive
            }
        });

        if (found.length > 0) {
            res.render("category", { categoriess: found, req: req });
        } else {
            res.render("category", { categoriess: [], req: req });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Error searching for category");
    }
});  /**To allow partial matching of the category name instead of requiring the full exact name, you can modify your query to use a regular expression (regex) with the $regex operator in MongoDB. This will allow you to search for categories that contain the search term as a substring, ignoring case sensitivity.
you can search using only part of the category name, and the search will be case-insensitive. For example, if you have a category "Electronics," typing "electr" or "Elect" will still return results.*/
/**************************** */
app.post("/brand", async function (req, res) {
    let brand = req.body.brandname;

    // Capitalize the first letter if the input is longer than 1 character
    if (brand.length > 1) {
        brand = brand.charAt(0).toUpperCase() + brand.slice(1);
    }

    try {
        // Use regular expression for partial matching and ignore case
        const found = await Brand.find({
            brand: {
                $regex: brand,
                $options: "i" // 'i' makes it case-insensitive
            }
        });

        if (found.length > 0) {
            res.render("brand", { brands: found, req: req }); // Make sure to pass 'brands' correctly
        } else {
            res.render("brand", { brands: [], req: req });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Error searching for brand");
    }
});

/*********************************************/


app.post("/products", async function (req, res) {
    const category = req.body.category ? String(req.body.category) : ''; // Ensure category is a string

    try {
        // Only use $regex if category is not an empty string
        const query = category ? { category: { $regex: category, $options: "i" } } : {};

        const foundItems = await Item.find(query);

        res.render("products", { items: foundItems.length > 0 ? foundItems : [], req: req });
    } catch (err) {
        console.log("Error finding products:", err);
        res.status(500).send("Error finding products.");
    }
});





app.post("/productsBrands", async function (req, res) {
    let brand = req.body.brand;

    // Ensure 'brand' is a string
    if (typeof brand !== 'string') {
        brand = String(brand);
    }

    try {
        // Use regex for partial, case-insensitive matching
        const foundItems = await Item.find({ brand: { $regex: brand, $options: "i" } });

        if (foundItems && foundItems.length > 0) {
            res.render("products", { items: foundItems, req: req });
        } else {
            res.render("products", { items: [], req: req }); // Render an empty list if no items are found
        }
    } catch (err) {
        console.log("Error finding products:", err);
        res.status(500).send("Error finding products.");
    }
});

/*********************************************/
app.get("/productOfBrand", function (req, res) {
    const custom = req.body.name;
    Item.find({ title: custom }, function (err, foundItems) {
        if (!err) {
            if (!foundItems) {
                console.log("Items found:" + foundItems)
                res.render("product", { req: req, item: foundItems })
            }
            else {
                console.log("no item found")
                res.redirect("/")
            }
        }
        else { console.log("error" + err) }
    })
})
/*********************************************/
/*********************************************/
app.get("/productOfCategory", function (req, res) {
    const name = req.body.name;
    Item.find({ title: name }, function (err, found) {
        if (!err) {
            if (!found) {
                console.log("Items found:" + found)
                res.render("product", { req: req, item: found })
            }
            else {
                console.log("no item found")
                res.redirect("/")
            }
        }
        else { console.log("error" + err) }
    })
})
/*********************************************/
app.get("/productOfBest", function (req, res) {
    const custom = req.body.name;
    Item.find({ title: custom }, function (err, foundItems) {
        if (!err) {
            if (!foundItems) {
                console.log("Items found:" + foundItems)
                res.render("product", { req: req, item: foundItems })
            }
            else {
                console.log("no item found")
                res.redirect("/")
            }
        }
        else { console.log("error" + err) }
    })
})
/*********************************************/

app.get("/products/:custom", async function (req, res) {
    const custom = req.params.custom;
    console.log("Product ID received:", custom);  // Add this to check the ID

    try {
        const foundItems = await Item.findById(custom);
        if (foundItems) {
            res.render("product", { req: req, item: foundItems });
        } else {
            res.redirect("/");  // Redirect if no item is found
        }
    } catch (err) {
        console.log("Error finding item:", err);
        res.redirect("/");  // Redirect on error
    }
});





/*********************************************/

app.post("/stayConnected", function (req, res) {
    const email = req.body.email;
    Email.create({ email }, function (error) {
        if (error) console.log(error);
        else console.log("email is added.");
    });
    res.redirect("/");
});


app.post("/contact", function (req, res) {
    if (req.isAuthenticated()) {
        User.updateOne({ _id: req.user.id }, { message: req.body.txtMsg }, function (err) { // Fixed typo 'newMessafe'
            if (err) {
                console.log(err);
            } else {
                console.log("Message received");
            }
            res.redirect("/");
        });
    } else {
        const newUser = new User({
            nameUser: req.body.txtName,
            email: req.body.txtEmail,
            number: req.body.Phone,
            message: req.body.txtMsg // Fixed typo 'mesaage'
        });
        newUser.save(function (err) {
            if (err) {
                console.log(err);
                res.status(500).send("Error saving user.");
            } else {
                res.redirect("/");
            }
        });
    }
});




/*********************************************/
app.get("/productOfBrand", function (req, res) {
    const custom = req.body.name;
    Item.find({ title: custom }, function (err, foundItems) {
        if (!err) {
            if (!foundItems) {
                console.log("Items found:" + foundItems)
                res.render("product", { req: req, item: foundItems })
            }
            else {
                console.log("no item found")
                res.redirect("/")
            }
        }
        else { console.log("error" + err) }
    })
})
/*********************************************/
/*********************************************/
app.get("/productOfCategory", function (req, res) {
    const name = req.body.name;
    Item.find({ title: name }, function (err, found) {
        if (!err) {
            if (!found) {
                console.log("Items found:" + found)
                res.render("product", { req: req, item: found })
            }
            else {
                console.log("no item found")
                res.redirect("/")
            }
        }
        else { console.log("error" + err) }
    })
})
/*********************************************/
app.get("/productOfBest", function (req, res) {
    const custom = req.body.name;
    Item.find({ title: custom }, function (err, foundItems) {
        if (!err) {
            if (!foundItems) {
                console.log("Items found:" + foundItems)
                res.render("product", { req: req, item: foundItems })
            }
            else {
                console.log("no item found")
                res.redirect("/")
            }
        }
        else { console.log("error" + err) }
    })
})
/*********************************************/


// Start the server
app.listen(port, function () {
    console.log(`server started at port ${port}.`);
});
