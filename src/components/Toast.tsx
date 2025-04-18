'use client';

import { useState, useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose?: () => void;
}

export default function Toast({ message, type = 'success', duration = 3000, onClose }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  const bgColor = 
    type === 'success' ? 'bg-green-900 border-l-4 border-green-500' : 
    type === 'error' ? 'bg-red-900 border-l-4 border-red-500' : 'bg-slate-800 border-l-4 border-violet-500';

  return (
    <div 
      className={`fixed bottom-4 right-4 ${bgColor} text-white py-3 px-4 rounded-md shadow-lg z-50 
                 animate-fadeIn flex items-center justify-between min-w-[250px] max-w-md`}
    >
      <span className="pr-3">{message}</span>
      <button 
        onClick={() => {
          setVisible(false);
          if (onClose) onClose();
        }}
        className="ml-2 text-white/80 hover:text-white transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
