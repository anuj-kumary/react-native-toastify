import React from 'react';
import { ToastProps, ToastType } from '../components/Toast/Toast';
export interface ToastConfig extends Partial<Omit<ToastProps, 'message' | 'onClose' | 'id'>> {
    message: string;
}
type ToastContextType = {
    showToast: (message: string | ToastConfig, type?: ToastType) => void;
};
export declare const ToastProvider: React.FC<{
    children: React.ReactNode;
}>;
export declare const useToast: () => ToastContextType;
export {};
