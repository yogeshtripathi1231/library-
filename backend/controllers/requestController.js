const Request = require("../models/Request");
const Book = require("../models/Book");
const User = require("../models/User");

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const LOAN_DAYS = parseInt(process.env.LOAN_DAYS, 10) || 14; // default loan period
const FINE_PER_DAY = parseFloat(process.env.FINE_PER_DAY) || 5; // default fine per day

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

    // augment requests with computed fields: daysUntilDue, notifySoon, isLate, daysLate, fineDue
    const now = new Date();
    const augmented = requests.map((r) => {
      const obj = r.toObject();
      obj.computed = {};

      if (obj.status === "Issued") {
        if (obj.dueDate) {
          const due = new Date(obj.dueDate);
          const msUntil = due.getTime() - now.getTime();
          const daysUntil = Math.ceil(msUntil / MS_PER_DAY);
          obj.computed.daysUntilDue = daysUntil;
          obj.computed.notifySoon = daysUntil <= 2 && daysUntil >= 0;
          obj.computed.isLate = now > due;
          obj.computed.daysLate = obj.computed.isLate ? Math.ceil((now.getTime() - due.getTime()) / MS_PER_DAY) : 0;
          obj.computed.fineDue = obj.computed.daysLate * FINE_PER_DAY;
        }
      }

      if (obj.status === "Returned") {
        if (obj.dueDate && obj.returnDate) {
          const due = new Date(obj.dueDate);
          const ret = new Date(obj.returnDate);
          const daysLate = ret.getTime() > due.getTime() ? Math.ceil((ret.getTime() - due.getTime()) / MS_PER_DAY) : 0;
          obj.computed.daysLate = daysLate;
          obj.computed.isLate = daysLate > 0;
          obj.computed.fineDue = (obj.fine || 0) || daysLate * FINE_PER_DAY;
        } else {
          obj.computed.fineDue = obj.fine || 0;
          obj.computed.isLate = false;
          obj.computed.daysLate = 0;
        }
      }

      return obj;
    });

    res.status(200).json({ requests: augmented });
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

    const now = new Date();
    const augmented = requests.map((r) => {
      const obj = r.toObject();
      obj.computed = {};

      if (obj.status === "Issued") {
        if (obj.dueDate) {
          const due = new Date(obj.dueDate);
          const msUntil = due.getTime() - now.getTime();
          const daysUntil = Math.ceil(msUntil / MS_PER_DAY);
          obj.computed.daysUntilDue = daysUntil;
          obj.computed.notifySoon = daysUntil <= 2 && daysUntil >= 0;
          obj.computed.isLate = now > due;
          obj.computed.daysLate = obj.computed.isLate ? Math.ceil((now.getTime() - due.getTime()) / MS_PER_DAY) : 0;
          obj.computed.fineDue = obj.computed.daysLate * FINE_PER_DAY;
        }
      }

      if (obj.status === "Returned") {
        if (obj.dueDate && obj.returnDate) {
          const due = new Date(obj.dueDate);
          const ret = new Date(obj.returnDate);
          const daysLate = ret.getTime() > due.getTime() ? Math.ceil((ret.getTime() - due.getTime()) / MS_PER_DAY) : 0;
          obj.computed.daysLate = daysLate;
          obj.computed.isLate = daysLate > 0;
          obj.computed.fineDue = (obj.fine || 0) || daysLate * FINE_PER_DAY;
        } else {
          obj.computed.fineDue = obj.fine || 0;
          obj.computed.isLate = false;
          obj.computed.daysLate = 0;
        }
      }

      return obj;
    });

    res.status(200).json({ requests: augmented });
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

    // If issuing, set issueDate and dueDate
    if (status === "Issued") {
      const issueDate = new Date();
      request.issueDate = issueDate;
      // dueDate = issueDate + LOAN_DAYS
      const due = new Date(issueDate.getTime() + LOAN_DAYS * MS_PER_DAY);
      request.dueDate = due;
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
    const returnDate = new Date();
    request.status = "Returned";
    request.returnDate = returnDate;

    // Calculate fine if returned late
    if (request.dueDate) {
      const due = new Date(request.dueDate);
      if (returnDate.getTime() > due.getTime()) {
        const daysLate = Math.ceil((returnDate.getTime() - due.getTime()) / MS_PER_DAY);
        request.fine = daysLate * FINE_PER_DAY;
      } else {
        request.fine = 0;
      }
    }

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
