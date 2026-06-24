require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Contact = require("./models/Contact");

const app = express();

app.use(cors());
app.use(express.json());
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log("MongoDB Error:", err);
  });

app.get("/", (req, res) => {
  res.send("Backend Running Successfully");
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running"
  });
});

app.get("/api/message", (req, res) => {
  res.json({
    message: "Empowering Businesses with Innovative Digital Solutions "
  });
});
app.post("/api/contact", async (req, res) => {
  try {
    console.log("Received:", req.body);

    const { name, email, message } = req.body;

    const newContact = new Contact({
      name,
      email,
      message,
    });

    await newContact.save();

    console.log("Saved:", newContact);

    res.status(200).json({
      success: true,
      message: "Form Submitted Successfully",
    });
  } catch (error) {
console.error("SAVE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });  }
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});