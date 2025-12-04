'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { bookService, requestService, userService } from '@/services';
import { motion } from 'framer-motion';
import { BookOpen, Users, FileText } from 'lucide-react';

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ books: 0, users: 0, requests: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== 'admin') {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const [booksRes, usersRes, requestsRes] = await Promise.all([
        bookService.getAllBooks(),
        userService.getAllUsers(),
        requestService.getAllRequests(),
      ]);

      setStats({
        books: booksRes.books.length,
        users: usersRes.users.length,
        requests: requestsRes.requests.length,
      });
    } catch (error) {
      console.error('Failed to fetch stats', error);
    } finally {
      setStatsLoading(false);
    }
  };

  if (loading || statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      icon: BookOpen,
      label: 'Total Books',
      value: stats.books,
      link: '/admin/books',
    },
    {
      icon: Users,
      label: 'Total Users',
      value: stats.users,
      link: '/admin/users',
    },
    {
      icon: FileText,
      label: 'Book Requests',
      value: stats.requests,
      link: '/admin/requests',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold gradient-text mb-2">Admin Dashboard</h1>
        <p className="text-gray-400 mb-12">Manage your library system</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.a
              key={card.label}
              href={card.link}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass-card p-6 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-2">{card.label}</p>
                  <p className="text-4xl font-bold gradient-text">{card.value}</p>
                </div>
                <Icon className="w-12 h-12 text-blue-400/50" />
              </div>
            </motion.a>
          );
        })}
      </motion.div>
    </div>
  );
}
