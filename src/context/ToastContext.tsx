import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast, ToastProps, ToastType } from '../components/Toast/Toast';

export interface ToastConfig extends Partial<Omit<ToastProps, 'message' | 'onClose' | 'id'>> {
  message: string;
}

interface ToastItem extends Omit<ToastProps, 'onClose'> {
  id: string;
}

type ToastContextType = {
  showToast: (message: string | ToastConfig, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((messageOrConfig: string | ToastConfig, type?: ToastType) => {
    const id = Math.random().toString(36).substr(2, 9);
    
    if (typeof messageOrConfig === 'string') {
      setToasts((currentToasts) => [
        ...currentToasts,
        {
          id,
          message: messageOrConfig,
          type: type || 'info',
          duration: 3000,
          position: 'bottom'
        }
      ]);
    } else {
      setToasts((currentToasts) => [
        ...currentToasts,
        {
          id,
          ...messageOrConfig,
          type: messageOrConfig.type || type || 'info',
          duration: messageOrConfig.duration || 3000,
          position: messageOrConfig.position || 'bottom'
        }
      ]);
    }
  }, []);

  const handleClose = useCallback((id: string) => {
    setToasts((currentToasts) => currentToasts.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toasts.map((toast, index) => (
        <Toast
          key={toast.id}
          {...toast}
          containerStyle={{
            bottom: (index * 60) + 50, // Stack toasts with 60px spacing
          }}
          onClose={() => handleClose(toast.id)}
        />
      ))}
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