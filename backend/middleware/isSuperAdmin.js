const isSuperAdmin = (req, res, next) => {
  if (req.user?.role !== "SuperAdmin") {
    return res.status(403).json({
      success: false,
      message: "Super Admin access required",
    });
  }

  next();
};

module.exports = isSuperAdmin;