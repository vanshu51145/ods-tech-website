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
const Blog = require("./models/Blog");
const rateLimit = require("express-rate-limit");
const xss = require("xss");
const Testimonial = require("./models/Testimonial");
const Job = require("./models/Job");
const Application = require("./models/Application");

const app = express();

app.use(
  cors({
    origin: "https://ods-tech-website.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use("/uploads", express.static("uploads"));
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many requests. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});


const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many login attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  })
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
app.put("/api/contact/:id", auth, async (req, res) => {
  try {
    const { status } = req.body;

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    contact.status = status;

    await contact.save();

    res.json({
      success: true,
      message: "Status Updated",
      contact,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});
app.post("/api/contact", contactLimiter, async (req, res) => {

  try {
    console.log("CONTACT DATA:", req.body);

    const name = xss(req.body.name);
    const email = xss(req.body.email);
    const serviceRequested = xss(req.body.serviceRequested);
    const message = xss(req.body.message);
    if (!name || !email || !serviceRequested || !message) {
  return res.status(400).json({
    success: false,
    message: "All fields are required",
  });
}
    const newContact = new Contact({
  name,
  email,
  serviceRequested,
  message,
});
    await newContact.save();



    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: "New Contact Form Submission",
        html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Service Requested:</strong> ${serviceRequested}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
      });
      console.log("Email sent successfully");

    } catch (mailError) {

      console.log("MAIL ERROR:", mailError.message);

    }

    res.status(200).json({
      success: true,
      message: "Form Submitted Successfully",
    });
  } catch (error) {
    console.log("CONTACT ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
app.get("/api/applications", auth, async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("jobId", "title")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});
app.post("/api/admin/login", loginLimiter, (req, res) => {

  const email = xss(req.body.email);
  const password = xss(req.body.password);
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
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;

    const query = {
      $or: [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          category: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ],
    };

    const totalProjects = await Project.countDocuments(query);

    const projects = await Project.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      projects,
      currentPage: page,
      totalPages: Math.ceil(totalProjects / limit),
      totalProjects,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});
app.get("/api/blogs", async (req, res) => {
  try {
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;

    const query = {
      $or: [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          content: {
            $regex: search,
            $options: "i",
          },
        },
        {
          author: {
            $regex: search,
            $options: "i",
          },
        },
      ],
    };

    const totalBlogs = await Blog.countDocuments(query);

    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      blogs,
      currentPage: page,
      totalPages: Math.ceil(totalBlogs / limit),
      totalBlogs,
    });
  } catch (error) {
    console.error(error);

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
  async (req, res) => {
    try {
      const title = xss(req.body.title);
      const category = xss(req.body.category);
      const description = xss(req.body.description);
      if (!title || !category || !description) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }
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
app.post(
  "/api/blogs",
  auth,
  Upload.single("coverImage"),
  async (req, res) => {
    try {
      console.log("BODY:", req.body);
      console.log("FILE:", req.file);
      const title = xss(req.body.title);
      const author = xss(req.body.author);
      const content = xss(req.body.content);
           console.log("Sanitized:", { title, author, content });

      if (!title || !author || !content) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Cover Image is required",
        });
      }

      const slug = title
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-");

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "ods-blogs",
        },
        async (error, result) => {
          if (error) {
            return res.status(500).json({
              success: false,
              message: "Cloudinary Upload Failed",
            });
          }

          const blog = new Blog({
            title,
            author,
            content,
            coverImage: result.secure_url,
            slug,
          });

          await blog.save();

          res.status(201).json({
            success: true,
            message: "Blog Added Successfully",
            blog,
          });
        }
      );

      streamifier
        .createReadStream(req.file.buffer)
        .pipe(uploadStream);

    } catch (error) {
     console.error("BLOG ERROR:", error);

  res.status(500).json({
    success: false,
    message: error.message,
  });
    }
  }
);
app.get("/api/testimonials", async (req, res) => {
  try {
    const testimonials = await Testimonial.find({
      isApproved: true,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      testimonials,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});
app.get("/api/admin/testimonials", auth, async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      testimonials,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});
app.get("/api/jobs", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});
app.post("/api/testimonials", async (req, res) => {
  try {
    const clientName = xss(req.body.clientName);
    const company = xss(req.body.company);
    const feedback = xss(req.body.feedback);
    const rating = Number(req.body.rating);

    if (!clientName || !company || !feedback || !rating) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    if (rating < 1 || rating > 5) {
  return res.status(400).json({
    success: false,
    message: "Rating must be between 1 and 5",
  });
}

    const testimonial = new Testimonial({
      clientName,
      company,
      feedback,
      rating,
    });

    await testimonial.save();

    res.status(201).json({
      success: true,
      message: "Review submitted successfully. Waiting for approval.",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});
app.post("/api/jobs", auth, async (req, res) => {
  try {
    const job = new Job({
      title: req.body.title,
      description: req.body.description,
      type: req.body.type,
    });

    await job.save();

    res.status(201).json({
      success: true,
      message: "Job Posted Successfully",
      job,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});
app.post(
  "/api/jobs/apply",
  Upload.single("resume"),
  async (req, res) => {
    try {

      const name = xss(req.body.name);
      const email = xss(req.body.email);
      const jobId = req.body.jobId;

      if (!name || !email || !jobId) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Resume PDF is required",
        });
      }

      const uploadStream =
        cloudinary.uploader.upload_stream(
          {
            folder: "ods-resumes",
            resource_type: "raw",
             public_id: req.file.originalname,
    use_filename: true,
    unique_filename: true,
          },
          async (error, result) => {

            if (error) {
              return res.status(500).json({
                success: false,
                message: "Resume Upload Failed",
              });
            }

            const application =
              new Application({
                name,
                email,
                jobId,
                resume: result.secure_url,
              });

            await application.save();

            res.status(201).json({
              success: true,
              message: "Application Submitted Successfully",
            });
          }
        );

      streamifier
        .createReadStream(req.file.buffer)
        .pipe(uploadStream);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message: "Server Error",
      });

    }
  }
);
app.put("/api/admin/testimonials/:id", auth, async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    testimonial.isApproved = true;

    await testimonial.save();

    res.json({
      success: true,
      message: "Review Approved",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});
app.put("/api/jobs/:id", auth, async (req, res) => {
  try {

   const job = await Job.findById(req.params.id);

if (!job) {
  return res.status(404).json({
    success:false,
    message:"Job not found"
  });
}

job.isActive = !job.isActive;

await job.save();

    res.json({
      success: true,
      message: "Job Updated",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
});
app.put("/api/jobs/edit/:id", auth, async (req, res) => {
  try {
    const { title, description, type } = req.body;

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    job.title = title;
    job.description = description;
    job.type = type;

    await job.save();

    res.json({
      success: true,
      message: "Job Updated Successfully",
      job,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

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
app.get("/api/blogs/:slug", async (req, res) => {
  try {

    const blog = await Blog.findOne({
      slug: req.params.slug,
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.json({
      success: true,
      blog,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }
});
app.delete("/api/blogs/:id", auth, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Blog Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});
app.delete("/api/admin/testimonials/:id", auth, async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Review Deleted",
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