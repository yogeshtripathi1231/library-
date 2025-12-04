'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, LogOut, BookOpen } from 'lucide-react';
import { useState } from 'react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="backdrop-blur-md bg-white/5 border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={user ? (user.role === 'admin' ? '/admin/dashboard' : '/dashboard') : '/'} className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-400" />
            <span className="gradient-text font-bold text-xl hidden sm:inline">LibraryHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {!user ? (
              <>
                <Link href="/login" className="glass-button text-sm">
                  Login
                </Link>
                <Link href="/signup" className="glass-button text-sm">
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <span className="text-sm text-gray-300">Welcome, {user.name}</span>
                {user.role === 'user' ? (
                  <>
                    <Link href="/dashboard" className="text-gray-300 hover:text-white transition">
                      Home
                    </Link>
                    <Link href="/my-requests" className="text-gray-300 hover:text-white transition">
                      My Requests
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/admin/dashboard" className="text-gray-300 hover:text-white transition">
                      Dashboard
                    </Link>
                    <Link href="/admin/books" className="text-gray-300 hover:text-white transition">
                      Books
                    </Link>
                    <Link href="/admin/requests" className="text-gray-300 hover:text-white transition">
                      Requests
                    </Link>
                    <Link href="/admin/users" className="text-gray-300 hover:text-white transition">
                      Users
                    </Link>
                  </>
                )}
                <button onClick={handleLogout} className="flex items-center gap-2 glass-button text-sm">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {!user ? (
              <>
                <Link href="/login" className="block w-full glass-button text-center text-sm">
                  Login
                </Link>
                <Link href="/signup" className="block w-full glass-button text-center text-sm">
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <div className="text-sm text-gray-300 px-4 py-2">Welcome, {user.name}</div>
                {user.role === 'user' ? (
                  <>
                    <Link href="/dashboard" className="block px-4 py-2 text-gray-300 hover:text-white">
                      Home
                    </Link>
                    <Link href="/my-requests" className="block px-4 py-2 text-gray-300 hover:text-white">
                      My Requests
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/admin/dashboard" className="block px-4 py-2 text-gray-300 hover:text-white">
                      Dashboard
                    </Link>
                    <Link href="/admin/books" className="block px-4 py-2 text-gray-300 hover:text-white">
                      Books
                    </Link>
                    <Link href="/admin/requests" className="block px-4 py-2 text-gray-300 hover:text-white">
                      Requests
                    </Link>
                    <Link href="/admin/users" className="block px-4 py-2 text-gray-300 hover:text-white">
                      Users
                    </Link>
                  </>
                )}
                <button onClick={handleLogout} className="flex items-center gap-2 w-full glass-button text-sm justify-center mt-2">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
