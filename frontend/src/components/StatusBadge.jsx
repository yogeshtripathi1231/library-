'use client';

import { motion } from 'framer-motion';

export const StatusBadge = ({ status }) => {
  const statusClasses = {
    Pending: 'status-pending',
    Approved: 'status-approved',
    Issued: 'status-issued',
    Rejected: 'status-rejected',
    Returned: 'status-returned',
  };

  return (
    <motion.span
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      className={statusClasses[status] || 'status-pending'}
    >
      {status}
    </motion.span>
  );
};

export default StatusBadge;
