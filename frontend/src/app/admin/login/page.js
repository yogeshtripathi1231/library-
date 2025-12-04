'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services';
import { useAuth } from '@/context/AuthContext';
import Toast from '@/components/Toast';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.login({ email, password });

      // Ensure only admin users can sign in from this page
      if (response.user?.role !== 'admin') {
        setToast({ type: 'error', message: 'Access denied. Not an admin user.' });
        setLoading(false);
        return;
      }

      // Save auth state via context (stores tokens in localStorage)
      login(response.user, response.accessToken, response.refreshToken);
      setToast({ type: 'success', message: 'Admin login successful!' });

      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 800);
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      setToast({ type: 'error', message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-md p-8 space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <ShieldCheck className="w-10 h-10 text-indigo-400" />
          </div>
          <h1 className="text-3xl font-bold gradient-text">Admin Portal</h1>
          <p className="text-gray-400">Sign in with your admin account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="glass-input w-full"
              placeholder="admin@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass-input w-full"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="glass-button w-full disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In as Admin'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400">
          Want the regular user portal?{' '}
          <Link href="/login" className="text-blue-400 hover:text-blue-300">
            Go to User Login
          </Link>
        </p>

       
      </motion.div>

      {toast && (
        <div className="fixed top-4 right-4 z-60">
          <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
        </div>
      )}
    </div>
  );
}
