'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { requestService } from '@/services';
import StatusBadge from '@/components/StatusBadge';
import Toast from '@/components/Toast';
import { motion } from 'framer-motion';
import { Calendar, BookOpen } from 'lucide-react';

export default function MyRequests() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== 'user') {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setRequestsLoading(true);
      const response = await requestService.getUserRequests();
      const reqs = response.requests || [];
      setRequests(reqs);

      // Notify user if any requests are due soon (computed.notifySoon)
      const dueSoon = reqs.filter(r => r.computed && r.computed.notifySoon);
      if (dueSoon.length > 0) {
        const titles = dueSoon.map(r => r.bookId?.title).filter(Boolean).slice(0,3).join(', ');
        const more = dueSoon.length > 3 ? ` and ${dueSoon.length - 3} more` : '';
        setToast({ type: 'warning', message: `Upcoming due: ${titles}${more} — return within 2 days` });
      }
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to load requests' });
    } finally {
      setRequestsLoading(false);
    }
  };

  if (loading || requestsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold gradient-text mb-2">My Requests</h1>
        <p className="text-gray-400 mb-8">Track the status of your book requests</p>
      </motion.div>

      {requests.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-12 text-center"
        >
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
          <p className="text-gray-400 text-lg">No requests yet</p>
          <p className="text-gray-500">Start by requesting a book from the catalog</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          {requests.map((request, index) => (
            <motion.div
              key={request._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {request.bookId?.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    by {request.bookId?.author}
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Calendar className="w-4 h-4" />
                      <span>Requested: {new Date(request.requestDate).toLocaleDateString()}</span>
                    </div>
                    {request.issueDate && (
                      <div className="flex items-center gap-2 text-gray-300">
                        <Calendar className="w-4 h-4" />
                        <span>Issued: {new Date(request.issueDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    {request.returnDate && (
                      <div className="flex items-center gap-2 text-gray-300">
                        <Calendar className="w-4 h-4" />
                        <span>Returned: {new Date(request.returnDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-start md:items-end justify-between h-full">
                  <StatusBadge status={request.status} />
                  {request.computed && request.status === 'Issued' && (
                    <div className="mt-2 text-right">
                      {request.computed.notifySoon && (
                        <span className="inline-block text-xs bg-yellow-500/20 border border-yellow-400 text-yellow-200 px-2 py-1 rounded">Due in {request.computed.daysUntilDue} day{request.computed.daysUntilDue !== 1 ? 's' : ''}</span>
                      )}
                      {request.computed.isLate && (
                        <div className="mt-1">
                          <span className="inline-block text-xs bg-red-500/20 border border-red-400 text-red-200 px-2 py-1 rounded">Late by {request.computed.daysLate} day{request.computed.daysLate !== 1 ? 's' : ''}</span>
                          <div className="text-xs text-red-300 mt-1">Fine due: ₹{request.computed.fineDue}</div>
                        </div>
                      )}
                    </div>
                  )}
                  {request.status === 'Returned' && request.fine > 0 && (
                    <div className="mt-2 text-right">
                      <span className="inline-block text-xs bg-red-500/20 border border-red-400 text-red-200 px-2 py-1 rounded">Returned late — Fine: ₹{request.fine}</span>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-4">
                    {request.status === 'Pending' &&
                      'Waiting for admin approval'}
                    {request.status === 'Approved' &&
                      'Approved, please collect from library'}
                    {request.status === 'Issued' &&
                      'Book has been issued to you'}
                    {request.status === 'Returned' &&
                      'You have returned this book'}
                    {request.status === 'Rejected' &&
                      'Your request was rejected'}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

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
