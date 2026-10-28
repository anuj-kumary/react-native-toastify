import React, { createContext, useContext, useState, useCallback } from 'react';
import { View, StyleSheet, StatusBar, Platform } from 'react-native';
import { Toast, ToastProps, ToastType } from '../components/Toast/Toast';

export interface ToastConfig extends Partial<Omit<ToastProps, 'message' | 'onClose'>> {
  message: string;
}

interface ToastItem extends Omit<ToastProps, 'onClose'> {
  id: string;
}

type ToastContextType = {
  showToast: (message: string | ToastConfig, type?: ToastType, duration?: number, position?: 'top' | 'bottom') => void;
};

type Insets = { top: number; bottom: number };

// Optional: apps with react-native-safe-area-context (Expo and the RN template ship it) get exact notch and
// home-indicator insets. Without it, or without a SafeAreaProvider, fall back to the status bar height.
let SafeAreaInsetsContext: React.Context<Insets | null> = createContext<Insets | null>(null);
try {
  SafeAreaInsetsContext = require('react-native-safe-area-context').SafeAreaInsetsContext ?? SafeAreaInsetsContext;
} catch {
  // not installed
}

// ponytail: 44 is the notched-iPhone status bar; install react-native-safe-area-context for exact insets.
const fallbackInsets: Insets = {
  top: Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 44,
  bottom: 0,
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const insets = useContext(SafeAreaInsetsContext) ?? fallbackInsets;

  const showToast = useCallback((messageOrConfig: string | ToastConfig, type?: ToastType, duration?: number, position?: 'top' | 'bottom') => {
    const config: ToastConfig = typeof messageOrConfig === 'string' ? { message: messageOrConfig } : messageOrConfig;
    const newToast: ToastItem = {
      ...config,
      id: Math.random().toString(36).slice(2, 11),
      type: config.type || type || 'info',
      duration: config.duration || duration || 3000,
      position: config.position || position || 'bottom',
    };
    setToasts((currentToasts) => [...currentToasts, newToast]);
  }, []);

  // Each Toast runs its own timer and calls this once its hide animation finishes.
  const handleClose = useCallback((id: string) => {
    setToasts((currentToasts) => currentToasts.filter(toast => toast.id !== id));
  }, []);

  const renderToast = (toast: ToastItem) => (
    <Toast
      key={toast.id}
      {...toast}
      containerStyle={{ ...toastSpacing, ...toast.containerStyle }}
      onClose={() => handleClose(toast.id)}
    />
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <View style={styles.toastContainer} pointerEvents="box-none">
        <View style={[styles.stack, { top: insets.top + 10 }]} pointerEvents="box-none" testID="toast-stack-top">
          {toasts.filter(toast => toast.position === 'top').map(renderToast)}
        </View>
        <View style={[styles.stack, styles.bottomStack, { bottom: insets.bottom + 20 }]} pointerEvents="box-none" testID="toast-stack-bottom">
          {toasts.filter(toast => toast.position === 'bottom').map(renderToast)}
        </View>
      </View>
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    elevation: 9999,
  },
  // Toasts stack in normal flow, so top and bottom toasts never offset each other.
  stack: {
    position: 'absolute',
    left: 20,
    right: 20,
  },
  // The first bottom toast sits lowest; later ones stack above it.
  bottomStack: {
    flexDirection: 'column-reverse',
  },
});

const toastSpacing = { marginVertical: 5 };

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
