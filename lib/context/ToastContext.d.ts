import React from 'react';
import { ToastProps, ToastType } from '../components/Toast/Toast';
export interface ToastConfig extends Partial<Omit<ToastProps, 'message' | 'onClose' | 'id'>> {
    message: string;
    duration: number;
    position: 'top' | 'bottom';
    textStyle?: object;
    containerStyle?: object;
}
type ToastContextType = {
    showToast: (message: string | ToastConfig, type?: ToastType, duration?: number, position?: 'top' | 'bottom') => void;
};
export declare const ToastProvider: React.FC<{
    children: React.ReactNode;
}>;
export declare const useToast: () => ToastContextType;
export {};
//# sourceMappingURL=ToastContext.d.ts.map