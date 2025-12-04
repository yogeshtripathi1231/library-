'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { bookService, requestService } from '@/services';
import BookCard from '@/components/BookCard';
import Toast from '@/components/Toast';
import Modal from '@/components/Modal';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [booksLoading, setBooksLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [bookDetailsModal, setBookDetailsModal] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== 'user') {
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
      console.log(response)
      setBooks(response.books);
  setFilteredBooks(response.books);
      const uniqueCategories = [...new Set(response.books.map((b) => b.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to load books' });
    } finally {
      setBooksLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    filterBooks(value, category);
  };

  const handleCategoryFilter = (e) => {
    const value = e.target.value;
    setCategory(value);
    filterBooks(search, value);
  };

  const filterBooks = (searchTerm, selectedCategory) => {
    let filtered = books;

    if (searchTerm) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((book) => book.category === selectedCategory);
    }

    setFilteredBooks(filtered);
  };

  const handleRequestBook = async (bookId) => {
    try {
      await requestService.createRequest(bookId);
      setToast({ type: 'success', message: 'Book request created successfully!' });
      setBookDetailsModal(false);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create request';
      setToast({ type: 'error', message });
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
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold gradient-text mb-2">Book Catalog</h1>
        <p className="text-gray-400 mb-8">Browse and request books from our collection</p>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 mb-8 space-y-4"
      >
        <div className="relative">
          <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search books by title or author..."
            value={search}
            onChange={handleSearch}
            className="glass-input w-full pl-12"
          />
        </div>

        <div className="flex gap-4 flex-wrap items-center">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={category}
            onChange={handleCategoryFilter}
            className="glass-input flex-1 min-w-[200px]"
          >
            <option value="" className='text-black'>All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat} className='text-black'>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Books Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {filteredBooks.map((book, index) => (
          <motion.div
            key={book._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => {
              setSelectedBook(book);
              setBookDetailsModal(true);
            }}
            className="cursor-pointer"
          >
            <BookCard
              book={book}
              onRequestClick={() => handleRequestBook(book._id)}
              showActions={false}
            />
          </motion.div>
        ))}
      </motion.div>

      {filteredBooks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-gray-400 text-lg">No books found matching your search</p>
        </motion.div>
      )}

      {/* Book Details Modal */}
      <Modal
        isOpen={bookDetailsModal}
        onClose={() => setBookDetailsModal(false)}
        title={selectedBook?.title}
      >
        {selectedBook && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 h-40 rounded-lg flex items-center justify-center">
              {selectedBook.coverImageUrl ? (
                <img
                  src={selectedBook.coverImageUrl}
                  alt={selectedBook.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <p className="text-gray-400">No cover image</p>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-400">Author</p>
              <p className="text-white font-semibold">{selectedBook.author}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Category</p>
              <p className="text-white font-semibold">{selectedBook.category}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Description</p>
              <p className="text-white text-sm">{selectedBook.description}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Stock Available</p>
              <p className="text-white font-semibold">{selectedBook.stock}</p>
            </div>
            <button
              onClick={() => handleRequestBook(selectedBook._id)}
              disabled={selectedBook.stock === 0}
              className="glass-button w-full disabled:opacity-50"
            >
              {selectedBook.stock === 0 ? 'Out of Stock' : 'Request This Book'}
            </button>
          </div>
        )}
      </Modal>

      {toast && (
        <div className="fixed top-4 right-4 z-60">
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
