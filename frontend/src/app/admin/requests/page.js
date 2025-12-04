'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { requestService } from '@/services';
import StatusBadge from '@/components/StatusBadge';
import Toast from '@/components/Toast';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Undo2, BookOpen } from 'lucide-react';

export default function AdminRequests() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== 'admin') {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  const fetchRequests = async () => {
    try {
      setRequestsLoading(true);
      const response = await requestService.getAllRequests(statusFilter);
      setRequests(response.requests);
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to load requests' });
    } finally {
      setRequestsLoading(false);
    }
  };

  const handleUpdateRequest = async (requestId, newStatus) => {
    try {
      await requestService.updateRequest(requestId, newStatus);
      setToast({ type: 'success', message: `Request ${newStatus.toLowerCase()}!` });
      fetchRequests();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update request';
      setToast({ type: 'error', message });
    }
  };

  const handleReturnBook = async (requestId) => {
    try {
      await requestService.returnBook(requestId);
      setToast({ type: 'success', message: 'Book marked as returned!' });
      fetchRequests();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to return book';
      setToast({ type: 'error', message });
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold gradient-text mb-2">Book Requests</h1>
        <p className="text-gray-400 mb-8">Manage user book requests</p>
      </motion.div>

      {/* Filter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-4 mb-8"
      >
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="glass-input"
        >
          <option value="">All Requests</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Issued">Issued</option>
          <option value="Rejected">Rejected</option>
          <option value="Returned">Returned</option>
        </select>
      </motion.div>

      {requests.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-12 text-center"
        >
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
          <p className="text-gray-400 text-lg">No requests found</p>
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {request.bookId?.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    by {request.bookId?.author}
                  </p>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-300">
                      <span className="text-gray-400">User:</span> {request.userId?.name} ({request.userId?.email})
                    </p>
                    <p className="text-gray-300">
                      <span className="text-gray-400">Requested:</span>{' '}
                      {new Date(request.requestDate).toLocaleDateString()}
                    </p>
                    {request.issueDate && (
                      <p className="text-gray-300">
                        <span className="text-gray-400">Issued:</span>{' '}
                        {new Date(request.issueDate).toLocaleDateString()}
                      </p>
                    )}
                    {request.returnDate && (
                      <p className="text-gray-300">
                        <span className="text-gray-400">Returned:</span>{' '}
                        {new Date(request.returnDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col justify-between">
                  <StatusBadge status={request.status} />

                  {request.status === 'Pending' && (
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleUpdateRequest(request._id, 'Approved')}
                        className="flex items-center gap-2 flex-1 glass-button text-sm bg-green-500/20 border-green-500/30 hover:bg-green-500/30"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleUpdateRequest(request._id, 'Rejected')}
                        className="flex items-center gap-2 flex-1 glass-button text-sm bg-red-500/20 border-red-500/30 hover:bg-red-500/30"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  )}

                  {request.status === 'Approved' && (
                    <button
                      onClick={() => handleUpdateRequest(request._id, 'Issued')}
                      className="glass-button text-sm mt-4 w-full"
                    >
                      Mark as Issued
                    </button>
                  )}

                  {request.status === 'Issued' && (
                    <button
                      onClick={() => handleReturnBook(request._id)}
                      className="flex items-center gap-2 justify-center glass-button text-sm mt-4 w-full bg-purple-500/20 border-purple-500/30 hover:bg-purple-500/30"
                    >
                      <Undo2 className="w-4 h-4" />
                      Mark as Returned
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

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
