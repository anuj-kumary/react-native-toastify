import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { View, StyleSheet, StatusBar, Platform } from 'react-native';
import { Toast, ToastPosition, ToastProps, ToastType } from '../components/Toast/Toast';
import { registerToastController, ToastConfig } from '../toast';

export type { ToastConfig } from '../toast';

interface ToastItem extends Omit<ToastProps, 'onClose'> {
  id: string;
}

type ToastContextType = {
  /** Shows a toast and returns its id. */
  showToast: (message: string | ToastConfig, type?: ToastType, duration?: number, position?: ToastPosition) => string;
  hideToast: (id: string) => void;
  hideAll: () => void;
};

export interface ToastProviderProps {
  children: React.ReactNode;
  /** Default auto-dismiss time in ms. Defaults to 3000. */
  duration?: number;
  /** Default position. Defaults to 'bottom'. */
  position?: ToastPosition;
  /** Most toasts visible per position; the oldest is dismissed when a new one would exceed it. */
  max?: number;
  /** Extra distance from the safe area, in points. Defaults to { top: 10, bottom: 20 }. */
  offset?: { top?: number; bottom?: number };
}

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

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  duration = 3000,
  position = 'bottom',
  max,
  offset,
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const insets = useContext(SafeAreaInsetsContext) ?? fallbackInsets;
  // Read through a ref so the callbacks below stay stable for the global controller.
  const options = useRef({ duration, position, max });
  options.current = { duration, position, max };

  const showToast = useCallback((messageOrConfig: string | ToastConfig, type?: ToastType, dur?: number, pos?: ToastPosition) => {
    const config: ToastConfig = typeof messageOrConfig === 'string' ? { message: messageOrConfig } : messageOrConfig;
    const { duration: defaultDuration, position: defaultPosition, max: maxVisible } = options.current;
    const newToast: ToastItem = {
      ...config,
      id: Math.random().toString(36).slice(2, 11),
      type: config.type || type || 'info',
      duration: config.duration || dur || defaultDuration,
      position: config.position || pos || defaultPosition,
      visible: true,
    };
    setToasts((currentToasts) => {
      const next = [...currentToasts, newToast];
      const shown = next.filter((t) => t.visible && t.position === newToast.position);
      const excess = maxVisible ? shown.length - maxVisible : 0;
      if (excess <= 0) return next;
      const dropped = new Set(shown.slice(0, excess).map((t) => t.id));
      return next.map((t) => (dropped.has(t.id) ? { ...t, visible: false } : t));
    });
    return newToast.id;
  }, []);

  // Hiding plays the exit animation; the toast is removed once it calls onClose.
  const hideToast = useCallback((id: string) => {
    setToasts((currentToasts) => currentToasts.map((t) => (t.id === id ? { ...t, visible: false } : t)));
  }, []);

  const hideAll = useCallback(() => {
    setToasts((currentToasts) => currentToasts.map((t) => ({ ...t, visible: false })));
  }, []);

  const updateToast = useCallback((id: string, config: Partial<ToastConfig>) => {
    setToasts((currentToasts) => currentToasts.map((t) => (t.id === id ? { ...t, ...config } : t)));
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((currentToasts) => currentToasts.filter((t) => t.id !== id));
  }, []);

  useEffect(
    () =>
      registerToastController({
        show: (config) => showToast(config),
        hide: hideToast,
        hideAll,
        update: updateToast,
        defaults: () => options.current,
      }),
    [showToast, hideToast, hideAll, updateToast],
  );

  const renderToast = (toast: ToastItem) => (
    <Toast
      key={toast.id}
      {...toast}
      containerStyle={{ ...toastSpacing, ...toast.containerStyle }}
      onClose={() => removeToast(toast.id)}
    />
  );

  return (
    <ToastContext.Provider value={{ showToast, hideToast, hideAll }}>
      {children}
      <View style={styles.toastContainer} pointerEvents="box-none">
        <View
          style={[styles.stack, { top: insets.top + (offset?.top ?? 10) }]}
          pointerEvents="box-none"
          testID="toast-stack-top"
        >
          {toasts.filter((toast) => toast.position === 'top').map(renderToast)}
        </View>
        <View
          style={[styles.stack, styles.bottomStack, { bottom: insets.bottom + (offset?.bottom ?? 20) }]}
          pointerEvents="box-none"
          testID="toast-stack-bottom"
        >
          {toasts.filter((toast) => toast.position === 'bottom').map(renderToast)}
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
