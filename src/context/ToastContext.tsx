import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Toast, ToastProps, ToastType } from '../components/Toast/Toast';

export interface ToastConfig extends Partial<Omit<ToastProps, 'message' | 'onClose' | 'id'>> {
  message: string;
}

interface ToastItem extends Omit<ToastProps, 'onClose'> {
  id: string;
  createdAt: number;
}

type ToastContextType = {
  showToast: (message: string | ToastConfig, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [dismissQueue, setDismissQueue] = useState<ToastItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const currentTimerRef = useRef<NodeJS.Timeout | null>(null);

  const processNextDismiss = useCallback(() => {
    if (isProcessing || dismissQueue.length === 0) return;
    
    setIsProcessing(true);
    const nextToast = dismissQueue[0];
    
    console.log('ToastContext: Processing dismiss for toast:', nextToast.id);
    
    // Set timer for this toast
    currentTimerRef.current = setTimeout(() => {
      console.log('ToastContext: Auto-dismissing toast:', nextToast.id);
      
      // Remove from both arrays
      setToasts(prev => prev.filter(toast => toast.id !== nextToast.id));
      setDismissQueue(prev => {
        const newQueue = prev.slice(1);
        console.log('ToastContext: Updated dismiss queue after removal:', newQueue);
        return newQueue;
      });
      setIsProcessing(false);
    }, nextToast.duration);
  }, [dismissQueue, isProcessing]);

  // Process next dismiss when queue changes and not currently processing
  useEffect(() => {
    console.log('ToastContext: useEffect triggered, queue length:', dismissQueue.length, 'isProcessing:', isProcessing);
    if (dismissQueue.length > 0 && !isProcessing) {
      console.log('ToastContext: Starting to process next dismiss');
      processNextDismiss();
    }
  }, [dismissQueue.length, isProcessing, processNextDismiss]);

  const showToast = useCallback((messageOrConfig: string | ToastConfig, type?: ToastType) => {
    const id = Math.random().toString(36).substr(2, 9);
    const createdAt = Date.now();
    console.log('ToastContext: showToast called with:', { messageOrConfig, type, id, createdAt });
    
    const newToast: ToastItem = typeof messageOrConfig === 'string' 
      ? {
          id,
          message: messageOrConfig,
          type: type || 'info',
          duration: 3000,
          position: 'bottom' as const,
          createdAt
        }
      : {
          id,
          ...messageOrConfig,
          type: messageOrConfig.type || type || 'info',
          duration: messageOrConfig.duration || 3000,
          position: messageOrConfig.position || 'bottom' as const,
          createdAt
        };

    // Add to visible toasts immediately
    setToasts((currentToasts) => {
      const newToasts = [...currentToasts, newToast];
      console.log('ToastContext: Updated toasts:', newToasts);
      return newToasts;
    });

    // Add to dismiss queue
    setDismissQueue((currentQueue) => {
      const newQueue = [...currentQueue, newToast];
      console.log('ToastContext: Updated dismiss queue:', newQueue);
      return newQueue;
    });
  }, []);

  const handleClose = useCallback((id: string) => {
    console.log('ToastContext: Manual close for toast:', id);
    
    // Clear current timer if this is the toast being processed
    if (currentTimerRef.current && dismissQueue[0]?.id === id) {
      clearTimeout(currentTimerRef.current);
      currentTimerRef.current = null;
      setIsProcessing(false);
    }
    
    // Remove from both arrays
    setToasts((currentToasts) => currentToasts.filter(toast => toast.id !== id));
    setDismissQueue((currentQueue) => currentQueue.filter(toast => toast.id !== id));
  }, [dismissQueue]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (currentTimerRef.current) {
        clearTimeout(currentTimerRef.current);
      }
    };
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