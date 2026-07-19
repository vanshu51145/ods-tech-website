const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const Client = require("../models/Client");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post("/register", async (req, res) => {
  try {

const { name, company, email, password } = req.body;

console.log("EMAIL:", email);

const exists = await Client.findOne({ email });

if (exists) {
  return res.status(400).json({
    success: false,
    message: "Email already exists",
  });
}

    const hash = await bcrypt.hash(password, 10);

    const client = new Client({
      name,
      company,
      email,
      password: hash,
    });

    await client.save();

    // Welcome Email
    try {
      await transporter.sendMail({
        from: `"ODS Network" <${process.env.EMAIL_USER}>`,
        to: client.email,
        subject: "Welcome to ODS Network 🎉",
        html: `
          <div style="font-family:Arial,sans-serif;padding:20px">
            <h2>Welcome to ODS Network 🎉</h2>

            <p>Hello <b>${client.name}</b>,</p>

            <p>Thank you for registering with ODS Network.</p>

            <p>Your account has been created successfully.</p>

            <p>You can now login and access your client dashboard.</p>

            <br>

            <p>Regards,</p>

            <b>ODS Network Team</b>
          </div>
        `,
      });

      console.log("Welcome Email Sent");
    } catch (mailError) {
      console.log("Email Error:", mailError.message);
    }

    return res.status(201).json({
      success: true,
      message: "Registration Successful",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const client = await Client.findOne({ email });

    if (!client) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const match = await bcrypt.compare(password, client.password);

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const token = jwt.sign(
      {
        id: client._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      success: true,
      token,
      client,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;