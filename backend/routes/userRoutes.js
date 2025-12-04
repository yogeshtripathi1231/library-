const express = require("express");
const userController = require("../controllers/userController");
const adminMiddleware = require("../middlewares/adminMiddleware");

const router = express.Router();

router.get("/", adminMiddleware, userController.getAllUsers);
router.get("/:id", adminMiddleware, userController.getUserById);
router.put("/:id", adminMiddleware, userController.updateUser);
router.delete("/:id", adminMiddleware, userController.deleteUser);

module.exports = router;
