const Book = require("../models/Book");
const { validateRequest, createBookSchema, updateBookSchema } = require("../utils/validators");

exports.getAllBooks = async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      query.category = { $regex: category, $options: "i" };
    }

    const books = await Book.find(query).sort({ createdAt: -1 });
    

    res.status(200).json({ books });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch books", error: error.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({ book });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch book", error: error.message });
  }
};

exports.createBook = async (req, res) => {
  try {
    const validation = validateRequest(createBookSchema, req.body);

    if (!validation.valid) {
      return res.status(400).json({ errors: validation.errors });
    }

    const book = new Book(validation.data);
    await book.save();

    res.status(201).json({
      message: "Book created successfully",
      book,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "ISBN must be unique" });
    }
    res.status(500).json({ message: "Failed to create book", error: error.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
  // Strip unknown fields (like _id, createdAt) which may be present when the client
  // sends the full book object. This prevents Joi from rejecting the request.
  const validation = validateRequest(updateBookSchema, req.body, { stripUnknown: true });
    if (!validation.valid) {
      return res.status(400).json({ errors: validation.errors });
    }

    const book = await Book.findByIdAndUpdate(
      req.params.id,
      validation.data,
      { new: true, runValidators: true }
    );


    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({
      message: "Book updated successfully",
      book,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update book", error: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({
      message: "Book deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete book", error: error.message });
  }
};
