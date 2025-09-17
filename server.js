// server.js

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const port = 3025;

// Middleware
app.use(express.static(__dirname)); // serve static files
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // parse JSON body

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/tiffinBookingApp");
const db = mongoose.connection;
db.once("open", () => {
  console.log("✅ Connected to MongoDB");
});

// Schema & Model
const bookingSchema = new mongoose.Schema({
  fullname:String,
    phone:String,
    address:String,
    tiffin:String,
  date: { type: Date, default: Date.now },
});

const Booking = mongoose.model("Booking", bookingSchema);

////////////////////////////////////////////////////
// ---------------- CRUD APIs ------------------- //
////////////////////////////////////////////////////

// CREATE: Book a tiffin
app.post("/book-tiffin", async (req, res) => {
  try {
    const { fullname, phone, address,tiffin } = req.body;
    const newBooking = new Booking({ fullname, phone, address,tiffin });
    await newBooking.save();
    res.status(201).json({ message: "Booking successful ✅", booking: newBooking });
  } catch (err) {
    res.status(500).json({ error: "Error saving booking" });
  }cc
});

// READ: Get all bookings
app.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Error fetching bookings" });
  }
});

// UPDATE: Update booking by ID
app.put("/bookings/:id", async (req, res) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ message: "Booking updated ", booking: updatedBooking });
  } catch (err) {
    res.status(500).json({ error: "Error updating booking" });
  }
});

// DELETE: Delete booking by ID
app.delete("/bookings/:id", async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking deleted " });
  } catch (err) {
    res.status(500).json({ error: "Error deleting booking" });
  }
});

// Start server
app.listen(port, () => {
  console.log(` Server running at http://localhost:${port}`);
});
