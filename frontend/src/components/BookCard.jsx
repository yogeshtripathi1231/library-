'use client';

import { motion } from 'framer-motion';
import { BookOpen, Star, Users } from 'lucide-react';

export const BookCard = ({ book, onRequestClick, onEditClick, showActions = false, isAdmin = false }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="glass-card overflow-hidden group"
    >
      <div className="relative h-40 bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center overflow-hidden">
        {book.coverImageUrl ? (
          <img
            src={book.coverImageUrl}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <BookOpen className="w-16 h-16 text-blue-400/50" />
        )}
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-lg text-white line-clamp-2">{book.title}</h3>
          <p className="text-sm text-gray-400">{book.author}</p>
        </div>

        <p className="text-xs text-gray-400 line-clamp-2">{book.description}</p>

        <div className="flex items-center justify-between text-xs text-gray-300">
          <span className="bg-white/10 px-2 py-1 rounded">{book.category}</span>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span>Stock: {book.stock}</span>
          </div>
        </div>

        {showActions && (
          <div className="flex gap-2 pt-2">
            {!isAdmin ? (
              <button
                onClick={() => onRequestClick(book._id)}
                disabled={book.stock === 0}
                className="flex-1 glass-button text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Request Book
              </button>
            ) : (
              <>
                <button
                  onClick={() => onEditClick(book)}
                  className="flex-1 glass-button text-sm"
                >
                  Edit
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BookCard;
