const express = require("express");
const router = express.Router();

const Ticket = require("../models/Ticket");
const auth = require("../middleware/auth");
const clientAuth = require("../middleware/clientAuth");
const auth = require("../middleware/auth");

router.get("/admin/all", auth, async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      tickets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.post("/", clientAuth, async (req, res) => {
      try {
const ticket = new Ticket({
  clientId: req.client._id,
  subject: req.body.subject,
  description: req.body.description,
  priority: req.body.priority,
});
    await ticket.save();

    res.status(201).json({
      success: true,
      message: "Ticket created successfully",
      ticket,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
router.get("/", clientAuth, async (req, res) => {
      try {
const tickets = await Ticket.find({
  clientId: req.client._id,
});
    res.json({
      success: true,
      tickets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
router.put("/:id", auth, async (req, res) => {
      try {
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      {
        new: true,
      }
    );

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    res.json({
      success: true,
      message: "Status updated successfully",
      ticket,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
module.exports = router;