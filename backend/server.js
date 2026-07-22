require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Contact = require("./models/Contact");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth");
const isSuperAdmin = require("./middleware/isSuperAdmin");
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
const ticketRoutes = require("./routes/ticketRoutes");
const clientRoutes = require("./routes/clientRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");
const Invoice = require("./models/Invoice");
const clientAuth = require("./middleware/clientAuth");
const Client = require("./models/Client");
const Ticket = require("./models/Ticket");
const Milestone = require("./models/Milestone");
const TeamMember = require("./models/TeamMember");
const Notification = require("./models/Notification");

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


    await Notification.create({
      message: `New lead received from ${name}`,
      type: "Lead",
    });
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

  let role = null;

  // Super Admin Login
  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    role = "SuperAdmin";
  }

  // Editor Login
  else if (
    email === process.env.EDITOR_EMAIL &&
    password === process.env.EDITOR_PASSWORD
  ) {
    role = "Editor";
  }

  // Invalid Login
  else {
    return res.status(401).json({
      success: false,
      message: "Invalid Credentials",
    });
  }

  const token = jwt.sign(
    {
      email,
      role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  res.json({
    success: true,
    token,
    role,
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
            try {
              await transporter.sendMail({
                from: `"ODS Network" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: "Application Received - ODS Network",
                html: `
      <div style="font-family: Arial, sans-serif; padding:20px;">
        <h2>Application Received ✅</h2>

        <p>Hello <b>${name}</b>,</p>

        <p>Thank you for applying at <b>ODS Network</b>.</p>

        <p>We have successfully received your application.</p>

        <p>Our recruitment team will review your profile and contact you if you are shortlisted.</p>

        <br>

        <p>Regards,</p>
        <b>ODS Network Team</b>
      </div>
    `,
              });

              console.log("Application email sent");
            } catch (mailError) {
              console.log("Application Email Error:", mailError.message);
            }

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
        success: false,
        message: "Job not found"
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

app.delete("/api/projects/:id", auth, isSuperAdmin, async (req, res) => {
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
app.delete("/api/blogs/:id", auth, isSuperAdmin, async (req, res) => {
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
app.delete("/api/admin/testimonials/:id", auth,  isSuperAdmin, async (req, res) => {
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
app.post(
  "/api/invoices",
  auth,
  Upload.single("invoice"),
  async (req, res) => {
    try {
      const clientId = req.body.clientId;
      const invoiceNumber = xss(req.body.invoiceNumber);
      const amount = Number(req.body.amount);
      const description = xss(req.body.description);
      const status = xss(req.body.status);
      console.log("BODY:", req.body);
      console.log("FILE:", req.file);
      if (
        !clientId ||
        !invoiceNumber ||
        !amount ||
        !description ||
        !status
      ) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Invoice PDF is required",
        });
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "ods-invoices",
          resource_type: "raw",
          public_id: req.file.originalname,
          use_filename: true,
          unique_filename: true,
        },
        async (error, result) => {
          if (error) {
            return res.status(500).json({
              success: false,
              message: "Invoice Upload Failed",
            });
          }

          const invoice = new Invoice({
            clientId,
            invoiceNumber,
            amount,
            description,
            status,
            pdfUrl: result.secure_url,
          });

          await invoice.save();

          res.status(201).json({
            success: true,
            message: "Invoice Created Successfully",
            invoice,
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
app.delete(
  "/api/contact/:id",
  auth,
  isSuperAdmin,
  async (req, res) => {
    try {
      const contact = await Contact.findByIdAndDelete(req.params.id);

      if (!contact) {
        return res.status(404).json({
          success: false,
          message: "Lead not found",
        });
      }

      res.json({
        success: true,
        message: "Lead Deleted Successfully",
      });

    } catch (error) {
      console.log("DELETE LEAD ERROR:", error);

      res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  }
);
app.get("/api/client/invoices", clientAuth, async (req, res) => {
  try {
    const invoices = await Invoice.find({
      clientId: req.client._id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      invoices,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});
app.get("/api/clients", auth, async (req, res) => {
  try {
    const clients = await Client.find()
      .select("name company email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      clients,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});
app.get("/api/invoices", auth, async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate("clientId", "name company email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      invoices,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});
app.get("/api/admin/analytics", auth, async (req, res) => {
  try {
    const contacts = await Contact.find();
    const tickets = await Ticket.find();

    const leadAnalytics = {
      New: contacts.filter(c => c.status === "New").length,
      Contacted: contacts.filter(c => c.status === "Contacted").length,
      Converted: contacts.filter(c => c.status === "Converted").length,
    };

    const ticketAnalytics = {
      Open: tickets.filter(t => t.status === "Open").length,
      "In Progress": tickets.filter(t => t.status === "In Progress").length,
      Resolved: tickets.filter(t => t.status === "Resolved").length,
    };

    res.json({
      success: true,
      leadAnalytics,
      ticketAnalytics,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});
app.post(
  "/api/milestones",
  auth,
  async (req, res) => {

    try {

      const {
        clientId,
        title,
        description,
        dueDate
      } = req.body;


      if (!clientId || !title) {

        return res.status(400).json({
          success: false,
          message: "Client and title required"
        });

      }


      const milestone = new Milestone({

        clientId,
        title,
        description,
        dueDate

      });


      await milestone.save();


      res.status(201).json({

        success: true,

        message: "Milestone Created",

        milestone

      });


    }
    catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message: "Server Error"

      });

    }

  });
app.get(
  "/api/milestones",
  auth,
  async (req, res) => {

    try {

      const milestones =
        await Milestone.find()
          .populate(
            "clientId",
            "name email company"
          )
          .sort({
            createdAt: -1
          });


      res.json({

        success: true,

        milestones

      });


    }
    catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message: "Server Error"

      });

    }

  });
app.put(
  "/api/milestones/:id",
  auth,
  async (req, res) => {


    try {

      const milestone =
        await Milestone.findById(
          req.params.id
        );


      if (!milestone) {

        return res.status(404).json({

          success: false,

          message: "Milestone not found"

        });

      }


      milestone.isCompleted =
        req.body.isCompleted;


      await milestone.save();


      res.json({

        success: true,

        message: "Milestone Updated",

        milestone

      });


    }
    catch (error) {

      console.log(error);


      res.status(500).json({

        success: false,

        message: "Server Error"

      });


    }


  });
app.get(
  "/api/client/milestones",
  clientAuth,
  async (req, res) => {

    try {


      const milestones =
        await Milestone.find({

          clientId: req.client._id

        })
          .sort({
            createdAt: 1
          });


      res.json({

        success: true,

        milestones

      });


    }
    catch (error) {

      console.log(error);


      res.status(500).json({

        success: false,

        message: "Server Error"

      });

    }


  });
app.get("/api/team", async (req, res) => {
  try {
    const teamMembers = await TeamMember.find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      teamMembers,
    });

  } catch (error) {
    console.log("GET TEAM ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});
app.post(
  "/api/team",
  auth,
   isSuperAdmin,
  Upload.single("profileImage"),
  async (req, res) => {
    try {

      const name = xss(req.body.name);
      const designation = xss(req.body.designation);
      const bio = xss(req.body.bio);
      const linkedinUrl = xss(req.body.linkedinUrl || "");

      if (!name || !designation || !bio) {
        return res.status(400).json({
          success: false,
          message: "Name, designation and bio are required",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Profile image is required",
        });
      }

      const uploadStream =
        cloudinary.uploader.upload_stream(
          {
            folder: "ods-team",
          },
          async (error, result) => {

            if (error) {
              console.log("CLOUDINARY ERROR:", error);

              return res.status(500).json({
                success: false,
                message: "Profile Image Upload Failed",
              });
            }

            const teamMember = new TeamMember({
              name,
              designation,
              bio,
              profileImage: result.secure_url,
              linkedinUrl,
            });

            await teamMember.save();

            res.status(201).json({
              success: true,
              message: "Team Member Added Successfully",
              teamMember,
            });
          }
        );

      streamifier
        .createReadStream(req.file.buffer)
        .pipe(uploadStream);

    } catch (error) {

      console.log("ADD TEAM ERROR:", error);

      res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  }
);

app.delete("/api/team/:id", auth, isSuperAdmin, async (req, res) => {
  try {

    const teamMember =
      await TeamMember.findByIdAndDelete(req.params.id);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: "Team Member not found",
      });
    }

    res.json({
      success: true,
      message: "Team Member Deleted Successfully",
    });

  } catch (error) {

    console.log("DELETE TEAM ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});
app.put(
  "/api/team/:id",
  auth,
  Upload.single("profileImage"),
  async (req, res) => {
    try {

      const teamMember =
        await TeamMember.findById(req.params.id);

      if (!teamMember) {
        return res.status(404).json({
          success: false,
          message: "Team Member not found",
        });
      }

      teamMember.name =
        xss(req.body.name);

      teamMember.designation =
        xss(req.body.designation);

      teamMember.bio =
        xss(req.body.bio);

      teamMember.linkedinUrl =
        xss(req.body.linkedinUrl || "");


      // If new image uploaded
      if (req.file) {

        const uploadStream =
          cloudinary.uploader.upload_stream(
            {
              folder: "ods-team",
            },
            async (error, result) => {

              if (error) {
                return res.status(500).json({
                  success: false,
                  message: "Profile Image Upload Failed",
                });
              }

              teamMember.profileImage =
                result.secure_url;

              await teamMember.save();

              res.json({
                success: true,
                message: "Team Member Updated Successfully",
                teamMember,
              });
            }
          );

        return streamifier
          .createReadStream(req.file.buffer)
          .pipe(uploadStream);
      }


      // If image not changed
      await teamMember.save();

      res.json({
        success: true,
        message: "Team Member Updated Successfully",
        teamMember,
      });

    } catch (error) {

      console.log("UPDATE TEAM ERROR:", error);

      res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  }
);
app.get("/api/admin/notifications", auth, async (req, res) => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(20);

    const unreadCount = await Notification.countDocuments({
      isRead: false,
    });

    res.json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.log("NOTIFICATION ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});
app.put(
  "/api/admin/notifications/:id/read",
  auth,
  async (req, res) => {
    try {
      const notification =
        await Notification.findByIdAndUpdate(
          req.params.id,
          {
            isRead: true,
          },
          {
            new: true,
          }
        );

      if (!notification) {
        return res.status(404).json({
          success: false,
          message: "Notification not found",
        });
      }

      res.json({
        success: true,
        message: "Notification marked as read",
        notification,
      });
    } catch (error) {
      console.log("READ NOTIFICATION ERROR:", error);

      res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  }
);
app.delete(
  "/api/invoices/:id",
  auth,
  isSuperAdmin,
  async (req, res) => {
    try {
      const invoice = await Invoice.findByIdAndDelete(req.params.id);

      if (!invoice) {
        return res.status(404).json({
          success: false,
          message: "Invoice not found",
        });
      }

      res.json({
        success: true,
        message: "Invoice Deleted Successfully",
      });

    } catch (error) {
      console.log("DELETE INVOICE ERROR:", error);

      res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  }
);
const PORT = process.env.PORT || 5000;
app.use("/api/tickets", ticketRoutes);
app.use("/api/client", clientRoutes);
app.use(
  "/api/newsletter",
  newsletterRoutes
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});