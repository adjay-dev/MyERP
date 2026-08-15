'use client';

import { useState, useCallback } from 'react';
import { Toast } from '@/components/ui/Toast';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const show = useCallback(
    (
      message: string,
      type: 'success' | 'error' | 'info' | 'warning' = 'info'
    ) => {
      const id = Date.now().toString();
      setToasts((prev) => [...prev, { id, message, type }]);
    },
    []
  );

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback(
    (message: string) => show(message, 'success'),
    [show]
  );

  const error = useCallback(
    (message: string) => show(message, 'error'),
    [show]
  );

  const info = useCallback(
    (message: string) => show(message, 'info'),
    [show]
  );

  const warning = useCallback(
    (message: string) => show(message, 'warning'),
    [show]
  );

  return {
    toasts,
    show,
    remove,
    success,
    error,
    info,
    warning,
  };
}
