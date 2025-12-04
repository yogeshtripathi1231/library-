const express = require("express");
const requestController = require("../controllers/requestController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const router = express.Router();

router.post("/", authMiddleware, requestController.createRequest);
router.get("/user", authMiddleware, requestController.getUserRequests);

router.get("/", adminMiddleware, requestController.getAllRequests);
router.put("/:id", adminMiddleware, requestController.updateRequest);
router.put("/:id/return", adminMiddleware, requestController.returnBook);

module.exports = router;
