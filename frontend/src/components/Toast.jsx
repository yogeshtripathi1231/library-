'use client';

import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, XCircle, Info } from 'lucide-react';

export const Toast = ({ message, type = 'info', onClose }) => {
  const typeConfig = {
    success: { icon: CheckCircle, bgColor: 'bg-green-500/20', borderColor: 'border-green-500/30', textColor: 'text-green-300' },
    error: { icon: XCircle, bgColor: 'bg-red-500/20', borderColor: 'border-red-500/30', textColor: 'text-red-300' },
    warning: { icon: AlertCircle, bgColor: 'bg-yellow-500/20', borderColor: 'border-yellow-500/30', textColor: 'text-yellow-300' },
    info: { icon: Info, bgColor: 'bg-blue-500/20', borderColor: 'border-blue-500/30', textColor: 'text-blue-300' },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex items-center gap-3 backdrop-blur-md ${config.bgColor} border ${config.borderColor} rounded-lg px-4 py-3`}
    >
      <Icon className={`w-5 h-5 ${config.textColor}`} />
      <span className={`text-sm font-medium ${config.textColor}`}>{message}</span>
      <button onClick={onClose} className="ml-auto text-lg">×</button>
    </motion.div>
  );
};

export default Toast;
