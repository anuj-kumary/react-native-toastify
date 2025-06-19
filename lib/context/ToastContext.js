import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useContext, useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Toast } from '../components/Toast/Toast';
const ToastContext = createContext(undefined);
export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const showToast = useCallback((messageOrConfig, type) => {
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
                        position: 'bottom'
                    }
                ];
                console.log('ToastContext: Updated toasts:', newToasts);
                return newToasts;
            });
        }
        else {
            setToasts((currentToasts) => {
                const newToasts = [
                    ...currentToasts,
                    Object.assign(Object.assign({ id }, messageOrConfig), { type: messageOrConfig.type || type || 'info', duration: messageOrConfig.duration || 3000, position: messageOrConfig.position || 'bottom' })
                ];
                console.log('ToastContext: Updated toasts:', newToasts);
                return newToasts;
            });
        }
    }, []);
    const handleClose = useCallback((id) => {
        setToasts((currentToasts) => currentToasts.filter(toast => toast.id !== id));
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
