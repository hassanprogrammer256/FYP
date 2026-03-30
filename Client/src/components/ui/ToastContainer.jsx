// src/components/ui/ToastContainer.jsx
import React from 'react';
import { useToast } from './toast-context';
import { AnimatePresence } from 'framer-motion';
import Toast from './toast';

const ToastContainer = () => {
  const { toasts } = useToast();

  return (
    <div className="fixed bottom-5 right-5 z-[999] flex flex-col-reverse gap-2 w-[350px] max-w-full p-4">
      <AnimatePresence>
        {toasts.map(({ id, message, variant }) => (
          <Toast key={id} id={id} message={message} variant={variant} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;