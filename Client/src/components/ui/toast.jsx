// src/components/ui/toast.jsx
import React from 'react';
import { useToast } from './toast-context';
import { HiCheck, HiX, HiExclamation } from 'react-icons/hi';
import { motion } from 'framer-motion';

const Toast = ({ id, message, variant }) => {
  const { removeToast } = useToast();

  const icon = () => {
    switch (variant) {
      case 'success':
        return <HiCheck className="h-5 w-5" />;
      case 'destructive':
        return <HiExclamation className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const bgColor =
    variant === 'success'
      ? 'bg-green-400 text-white'
      : variant === 'destructive'
      ? 'bg-red-400 text-white'
      : 'bg-gray-800 text-white';

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex items-center justify-between space-x-3 p-3 rounded shadow-lg ${bgColor}`}
    >
      <div className="flex items-center space-x-2">
        {icon()}
        <div className="max-w-[200px]">{message}</div>
      </div>
      <button
        onClick={() => removeToast(id)}
        className="ml-2 p-1 rounded-full hover:bg-gray-200"
        aria-label="Close"
      >
        <HiX className="h-4 w-4" />
      </button>
    </motion.div>
  );
};

export default Toast;