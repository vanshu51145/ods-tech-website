require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Contact = require("./models/Contact");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth");
const Project = require("./models/Project");
const Upload = require("./middleware/Upload");
const cloudinary = require("./config/cloudinary");
const streamifier = require("streamifier");

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.error("MongoDB Error:", err);
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
app.get("/api/contact",  async (req, res) => {
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

  try {
        console.log("CONTACT DATA:", req.body);

    const { name, email, message } = req.body;

    const newContact = new Contact({
      name,
      email,
      message,
    });
    await newContact.save();




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
    console.log("CONTACT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});
app.post("/api/admin/login", (req, res) => {

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
app.get("/api/projects", async (req, res) => {
  try {
    const projects = await Project.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      projects,
    });
  } catch (error) {
      console.error("Projects Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});
app.post(
  "/api/projects",
  auth,
  Upload.single("image"),
  async (req, res) =>  {
  try {
    const { title, category, description } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "ods-projects",
      },
      async (error, result) => {
        if (error) {
          return res.status(500).json({
            success: false,
            message: "Cloudinary Upload Failed",
          });
        }

        const project = new Project({
          title,
          category,
          description,
          imageUrl: result.secure_url,
        });

        await project.save();

        res.status(201).json({
          success: true,
          message: "Project Added Successfully",
          project,
        });
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}
);
app.delete("/api/projects/:id", auth, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Project Deleted Successfully",
    });
  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});