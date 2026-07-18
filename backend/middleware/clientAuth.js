const jwt = require("jsonwebtoken");
const Client = require("../models/Client");

const clientAuth = async (req, res, next) => {
  try {

    let token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access Denied",
      });
    }

    // Remove Bearer prefix
    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const client = await Client.findById(decoded.id);

    if (!client) {
      return res.status(401).json({
        success: false,
        message: "Client not found",
      });
    }

    req.client = client;

    next();

  } catch (error) {

    res.status(401).json({
      success: false,
      message: "Invalid Token",
    });

  }
};

module.exports = clientAuth;