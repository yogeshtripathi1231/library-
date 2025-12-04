'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { bookService } from '@/services';
import BookCard from '@/components/BookCard';
import Modal from '@/components/Modal';
import Toast from '@/components/Toast';
import { motion } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';

export default function AdminBooks() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [booksLoading, setBooksLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    category: '',
    isbn: '',
    stock: 1,
    coverImageUrl: '',
  });

  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== 'admin') {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setBooksLoading(true);
      const response = await bookService.getAllBooks();
      setBooks(response.books);
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to load books' });
    } finally {
      setBooksLoading(false);
    }
  };

  const handleOpenModal = (book = null) => {
    if (book) {
      setEditingBook(book);
      setFormData(book);
    } else {
      setEditingBook(null);
      setFormData({
        title: '',
        author: '',
        description: '',
        category: '',
        isbn: '',
        stock: 1,
        coverImageUrl: '',
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingBook(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'stock' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBook) {
        await bookService.updateBook(editingBook._id, formData);
        setToast({ type: 'success', message: 'Book updated successfully!' });
      } else {
        await bookService.createBook(formData);
        setToast({ type: 'success', message: 'Book created successfully!' });
      }
      handleCloseModal();
      fetchBooks();
    } catch (error) {
      const message = error.response?.data?.message || 'Operation failed';
      setToast({ type: 'error', message });
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (!confirm('Are you sure you want to delete this book?')) return;

    try {
      await bookService.deleteBook(bookId);
      setToast({ type: 'success', message: 'Book deleted successfully!' });
      fetchBooks();
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to delete book' });
    }
  };

  if (loading || booksLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Books Management</h1>
          <p className="text-gray-400">Add, edit, or delete books from the library</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 glass-button"
        >
          <Plus className="w-5 h-5" />
          Add Book
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {books.map((book, index) => (
          <motion.div
            key={book._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="relative group"
          >
            <BookCard
              book={book}
              onEditClick={() => handleOpenModal(book)}
              showActions={true}
              isAdmin={true}
            />
            <button
              onClick={() => handleDeleteBook(book._id)}
              className="absolute top-4 right-4 bg-red-500/20 border border-red-500/30 rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </button>
          </motion.div>
        ))}
      </motion.div>

      {books.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-12 text-center"
        >
          <p className="text-gray-400 text-lg">No books yet</p>
          <button
            onClick={() => handleOpenModal()}
            className="glass-button mt-4"
          >
            Add your first book
          </button>
        </motion.div>
      )}

      {/* Add/Edit Book Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={editingBook ? 'Edit Book' : 'Add New Book'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleFormChange}
              className="glass-input w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Author</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleFormChange}
              className="glass-input w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              className="glass-input w-full h-24"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleFormChange}
              className="glass-input w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">ISBN</label>
            <input
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleFormChange}
              className="glass-input w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleFormChange}
              className="glass-input w-full"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Cover Image URL</label>
            <input
              type="url"
              name="coverImageUrl"
              value={formData.coverImageUrl}
              onChange={handleFormChange}
              className="glass-input w-full"
            />
          </div>

          <button
            type="submit"
            className="glass-button w-full"
          >
            {editingBook ? 'Update Book' : 'Create Book'}
          </button>
        </form>
      </Modal>

      {toast && (
        <div className="fixed top-4 right-4">
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        </div>
      )}
    </div>
  );
}
