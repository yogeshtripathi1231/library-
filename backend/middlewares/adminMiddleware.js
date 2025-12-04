const User = require("../models/User");
const authMiddleware = require("../middlewares/authMiddleware");

const adminMiddleware = async (req, res, next) => {
  try {
    authMiddleware(req, res, async () => {
   
      const user = await User.findById(req.userId);
 

      if (!user || user.role !== "admin") {
        return res
          .status(403)
          .json({ message: "Access denied. Admin only." });
      }

      next();
    });
  } catch (error) {
    res.status(403).json({ message: "Access denied" });
  }
};

module.exports = adminMiddleware;
