'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { bookService, requestService, userService, adminService } from '@/services';
import { motion } from 'framer-motion';
import { BookOpen, Users, FileText } from 'lucide-react';
import Toast from '@/components/Toast';
import Modal from '@/components/Modal';
import { Plus } from 'lucide-react';

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({ books: 0, users: 0, requests: 0 });
  const [statsLoading, setStatsLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [adminForm, setAdminForm] = useState({ name: '', email: '', password: '' });
  const [adminLoading, setAdminLoading] = useState(false);

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

      const results = await Promise.allSettled([
        bookService.getAllBooks(),
        userService.getAllUsers(),
        requestService.getAllRequests(),
      ]);

      // books
      if (results[0].status === 'fulfilled') {
        const booksRes = results[0].value;
        console.log(results)
        setStats((s) => ({ ...s, books: (booksRes?.books?.length) || 0 }));
      } else {
        const err = results[0].reason;
        console.error('Failed to fetch books', err);
        if (err?.response?.status === 401) return router.push('/admin/login');
        setToast({ type: 'error', message: 'Failed to load books' });
      }

      // users
      if (results[1].status === 'fulfilled') {
        const usersRes = results[1].value;
        setStats((s) => ({ ...s, users: (usersRes?.users?.length) || 0 }));
      } else {
        const err = results[1].reason;
        console.error('Failed to fetch users', err);
        if (err?.response?.status === 401) return router.push('/admin/login');
        setToast({ type: 'error', message: 'Failed to load users' });
      }

      // requests
      if (results[2].status === 'fulfilled') {
        const requestsRes = results[2].value;
        setStats((s) => ({ ...s, requests: (requestsRes?.requests?.length) || 0 }));
      } else {
        const err = results[2].reason;
        console.error('Failed to fetch requests', err);
        if (err?.response?.status === 401) return router.push('/admin/login');
        setToast({ type: 'error', message: 'Failed to load requests' });
      }
    } catch (error) {
      console.error('Failed to fetch stats', error);
      setToast({ type: 'error', message: 'Failed to load dashboard stats' });
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

  const handleAdminInput = (e) => {
    const { name, value } = e.target;
    setAdminForm((p) => ({ ...p, [name]: value }));
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      setAdminLoading(true);
      const res = await adminService.createAdmin(adminForm);
      setToast({ type: 'success', message: 'Admin created successfully' });
      setAdminModalOpen(false);
      setAdminForm({ name: '', email: '', password: '' });
      // refresh stats (users count)
      fetchStats();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create admin';
      setToast({ type: 'error', message });
    } finally {
      setAdminLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Admin Dashboard</h1>
          <p className="text-gray-400 mb-12">Manage your library system</p>
        </div>
        <div>
          <button onClick={() => setAdminModalOpen(true)} className="flex items-center gap-2 glass-button">
            <Plus className="w-4 h-4" />
            Add Admin
          </button>
        </div>
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

      {/* Add Admin Modal */}
      <Modal isOpen={adminModalOpen} onClose={() => setAdminModalOpen(false)} title="Create Admin">
        <form onSubmit={handleCreateAdmin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input name="name" value={adminForm.name} onChange={handleAdminInput} className="glass-input w-full" required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input name="email" type="email" value={adminForm.email} onChange={handleAdminInput} className="glass-input w-full" required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input name="password" type="password" value={adminForm.password} onChange={handleAdminInput} className="glass-input w-full" required minLength={6} />
          </div>

          <button type="submit" className="glass-button w-full" disabled={adminLoading}>
            {adminLoading ? 'Creating...' : 'Create Admin'}
          </button>
        </form>
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
