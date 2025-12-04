'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/services';
import { useAuth } from '@/context/AuthContext';
import Toast from '@/components/Toast';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

export default function Login() {
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
      login(response.user, response.accessToken, response.refreshToken);
      setToast({ type: 'success', message: 'Login successful!' });

      setTimeout(() => {
        router.push(response.user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
      }, 1000);
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
            <BookOpen className="w-10 h-10 text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold gradient-text">LibraryHub</h1>
          <p className="text-gray-400">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="glass-input w-full"
              placeholder="your@email.com"
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
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <Link href="/signup" className="text-blue-400 hover:text-blue-300">
            Sign up
          </Link>
        </p>

        {/* Demo Credentials */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-xs text-gray-300 space-y-1">
          <p className="font-semibold text-white">Demo Credentials:</p>
          <p>User: user@example.com / password123</p>
          <p>Admin: admin@example.com / admin123</p>
        </div>
      </motion.div>

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
