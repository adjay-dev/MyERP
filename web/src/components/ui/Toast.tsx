'use client';

import { ReactNode } from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
  autoClose?: number;
}

export function Toast({
  message,
  type = 'info',
  onClose,
  autoClose = 3000,
}: ToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, autoClose);
    return () => clearTimeout(timer);
  }, [autoClose, onClose]);

  const styles = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  };

  const icons = {
    success: <CheckCircle size={20} />,
    error: <AlertCircle size={20} />,
    info: <Info size={20} />,
    warning: <AlertTriangle size={20} />,
  };

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 flex items-center gap-3 px-4 py-3 rounded border shadow-lg z-50',
        styles[type]
      )}
    >
      {icons[type]}
      <span>{message}</span>
    </div>
  );
}

import React from 'react';
