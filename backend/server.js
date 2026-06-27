require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Contact = require("./models/Contact");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth");

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

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
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
app.get("/api/admin", auth, (req, res) => {

  res.json({
    success: true,
    message: "Welcome Admin",
  });

});
app.get("/api/contact", auth, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      contacts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});
app.post("/api/contact", async (req, res) => {
  console.log("POST API HIT");

  try {
    const { name, email, message } = req.body;

    const newContact = new Contact({
      name,
      email,
      message,
    });
    console.log("Saving to MongoDB...");
    await newContact.save();
    console.log("Saved to MongoDB");

    console.log("Sending Email...");



    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "New Contact Form Submission",
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    });

    res.status(200).json({
      success: true,
      message: "Form Submitted Successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});
app.post("/api/admin/login", (req, res) => {
  console.log(req.body);

  const { email, password } = req.body;

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {

    const token = jwt.sign(

      { email },

      process.env.JWT_SECRET,

      { expiresIn: "1h" }

    );

    return res.json({
      success: true,
      token,
    });

  }

  res.status(401).json({
    success: false,
    message: "Invalid Credentials",
  });

});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});