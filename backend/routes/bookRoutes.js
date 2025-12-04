const express = require("express");
const bookController = require("../controllers/bookController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const router = express.Router();

router.get("/", bookController.getAllBooks);
router.get("/:id", bookController.getBookById);

router.post("/", adminMiddleware, bookController.createBook);
router.put("/:id", adminMiddleware, bookController.updateBook);
router.delete("/:id", adminMiddleware, bookController.deleteBook);

module.exports = router;
