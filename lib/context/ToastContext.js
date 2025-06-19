import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Toast } from '../components/Toast/Toast';
const ToastContext = createContext(undefined);
export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const [dismissQueue, setDismissQueue] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const currentTimerRef = useRef(null);
    const processNextDismiss = useCallback(() => {
        if (isProcessing || dismissQueue.length === 0)
            return;
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
    const showToast = useCallback((messageOrConfig, type) => {
        const id = Math.random().toString(36).substr(2, 9);
        const createdAt = Date.now();
        console.log('ToastContext: showToast called with:', { messageOrConfig, type, id, createdAt });
        const newToast = typeof messageOrConfig === 'string'
            ? {
                id,
                message: messageOrConfig,
                type: type || 'info',
                duration: 3000,
                position: 'bottom',
                createdAt
            }
            : {
                id,
                ...messageOrConfig,
                type: messageOrConfig.type || type || 'info',
                duration: messageOrConfig.duration || 3000,
                position: messageOrConfig.position || 'bottom',
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
    const handleClose = useCallback((id) => {
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
    return (_jsxs(ToastContext.Provider, { value: { showToast }, children: [children, _jsx(View, { style: styles.toastContainer, pointerEvents: "none", children: toasts.map((toast, index) => (_jsx(Toast, Object.assign({}, toast, { containerStyle: {
                        bottom: (index * 60) + 50, // Stack toasts with 60px spacing
                    }, onClose: () => handleClose(toast.id) }), toast.id))) })] }));
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
