import React from 'react';
export type ToastType = 'success' | 'error' | 'info' | 'warning';
export interface ToastProps {
    message: string;
    type: ToastType;
    duration: number;
    position: 'top' | 'bottom';
    onClose?: () => void;
    textStyle?: object;
    containerStyle?: object;
}
export declare const Toast: React.FC<ToastProps>;
//# sourceMappingURL=Toast.d.ts.map