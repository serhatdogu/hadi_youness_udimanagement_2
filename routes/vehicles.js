const express = require("express");
const router = express.Router();
const Vehicle = require("../models/vehicle"); // Import the model


router.get('/', async (req, res) => {
    try {
        const vehicles = await Vehicle.find(); // Use Vehicle here
        res.render('vehicles', { vehicles });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.post("/submit-vehicles", async (req, res) => {
    const { name, description, plate, year } = req.body;

    try {
        const newVehicle = new Vehicle({ name, description, plate, year });
        await newVehicle.save();

        console.log("Vehicle form data saved successfully:", newVehicle);
        res.render("submit-vehicle", { name, description, plate, year });
    } catch (err) {
        console.error("Error saving vehicle data:", err);
        res.status(500).send("An error occurred while saving your message.");
    }
});


module.exports = router;
