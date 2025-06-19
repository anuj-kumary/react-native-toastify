import React, { createContext, useContext, useState, useCallback } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
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
    console.log('ToastContext: showToast called with:', { messageOrConfig, type, id });
    
    if (typeof messageOrConfig === 'string') {
      setToasts((currentToasts) => {
        const newToasts = [
          ...currentToasts,
          {
            id,
            message: messageOrConfig,
            type: type || 'info',
            duration: 3000,
            position: 'bottom' as const
          }
        ];
        console.log('ToastContext: Updated toasts:', newToasts);
        return newToasts;
      });
    } else {
      setToasts((currentToasts) => {
        const newToasts = [
          ...currentToasts,
          {
            id,
            ...messageOrConfig,
            type: messageOrConfig.type || type || 'info',
            duration: messageOrConfig.duration || 3000,
            position: messageOrConfig.position || 'bottom' as const
          }
        ];
        console.log('ToastContext: Updated toasts:', newToasts);
        return newToasts;
      });
    }
  }, []);

  const handleClose = useCallback((id: string) => {
    setToasts((currentToasts) => currentToasts.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <View style={styles.toastContainer} pointerEvents="none">
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
      </View>
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
});

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}; 