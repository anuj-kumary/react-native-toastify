import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast, ToastProps } from '../components/Toast/Toast';

type ToastContextType = {
  showToast: (message: string, type?: ToastProps['type'], duration?: number) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<Omit<ToastProps, 'onClose'> | null>(null);

  const showToast = useCallback((message: string, type: ToastProps['type'] = 'info', duration = 3000) => {
    setToast({ message, type, duration });
  }, []);

  const handleClose = useCallback(() => {
    setToast(null);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && <Toast {...toast} onClose={handleClose} />}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}; 