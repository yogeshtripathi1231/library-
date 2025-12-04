const Request = require("../models/Request");
const Book = require("../models/Book");
const User = require("../models/User");

exports.createRequest = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.userId;

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Check if book is available
    if (book.stock <= 0) {
      return res.status(400).json({ message: "Book not in stock" });
    }

    // Check if user already has a pending or approved request for this book
    const existingRequest = await Request.findOne({
      userId,
      bookId,
      status: { $in: ["Pending", "Approved", "Issued"] },
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "You already have an active request for this book",
      });
    }

    const request = new Request({
      userId,
      bookId,
      status: "Pending",
    });

    await request.save();

    res.status(201).json({
      message: "Request created successfully",
      request: await request.populate(["userId", "bookId"]),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create request", error: error.message });
  }
};

exports.getUserRequests = async (req, res) => {
  try {
    const userId = req.userId;

    const requests = await Request.find({ userId })
      .populate("bookId")
      .sort({ requestDate: -1 });

    res.status(200).json({ requests });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch requests", error: error.message });
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    const requests = await Request.find(query)
      .populate("userId")
      .populate("bookId")
      .sort({ requestDate: -1 });

    res.status(200).json({ requests });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch requests", error: error.message });
  }
};

exports.updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["Pending", "Approved", "Issued", "Rejected", "Returned"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const request = await Request.findById(id).populate("bookId");
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // If approving, decrease stock
    if (status === "Approved" && request.status !== "Approved") {
      if (request.bookId.stock <= 0) {
        return res.status(400).json({ message: "Book not in stock" });
      }
      request.bookId.stock -= 1;
      await request.bookId.save();
    }

    // If issuing, set issueDate
    if (status === "Issued") {
      request.issueDate = new Date();
    }

    request.status = status;
    await request.save();

    res.status(200).json({
      message: "Request updated successfully",
      request: await request.populate(["userId", "bookId"]),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update request", error: error.message });
  }
};

exports.returnBook = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await Request.findById(id).populate("bookId");
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "Issued") {
      return res.status(400).json({
        message: "Only issued books can be marked as returned",
      });
    }

    // Mark as returned and set return date
    request.status = "Returned";
    request.returnDate = new Date();

    // Increase book stock
    request.bookId.stock += 1;
    await request.bookId.save();

    await request.save();

    res.status(200).json({
      message: "Book marked as returned successfully",
      request: await request.populate(["userId", "bookId"]),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to return book", error: error.message });
  }
};
