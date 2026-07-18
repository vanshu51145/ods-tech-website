const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  console.log("AUTH HEADER:", req.headers.authorization);

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Access Denied",
    });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log("VERIFIED:", verified);

    req.user = verified;

    next();
  } catch (error) {
        console.log("JWT ERROR:",error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }
};

module.exports = auth;