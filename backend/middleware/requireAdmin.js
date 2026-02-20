const User = require("../models/User");

const requireAdmin = async (req, res, next) => {
  try {
    if (!req?.user?.id) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(req.user.id).select("role");
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    next();
  } catch (error) {
    console.error("requireAdmin error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = requireAdmin;
