const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

console.log("comminggg")

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh-token", authController.refreshToken);

module.exports = router;
