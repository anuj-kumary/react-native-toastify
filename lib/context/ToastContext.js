var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { View, StyleSheet, StatusBar, Platform } from 'react-native';
import { Toast } from '../components/Toast/Toast';
var ToastContext = createContext(undefined);
export var ToastProvider = function (_a) {
    var children = _a.children;
    var _b = useState([]), toasts = _b[0], setToasts = _b[1];
    var _c = useState([]), dismissQueue = _c[0], setDismissQueue = _c[1];
    var _d = useState(false), isProcessing = _d[0], setIsProcessing = _d[1];
    var currentTimerRef = useRef(null);
    var processNextDismiss = useCallback(function () {
        if (isProcessing || dismissQueue.length === 0)
            return;
        setIsProcessing(true);
        var nextToast = dismissQueue[0];
        console.log('ToastContext: Processing dismiss for toast:', nextToast.id);
        // Set timer for this toast
        currentTimerRef.current = setTimeout(function () {
            console.log('ToastContext: Auto-dismissing toast:', nextToast.id);
            // Remove from both arrays
            setToasts(function (prev) { return prev.filter(function (toast) { return toast.id !== nextToast.id; }); });
            setDismissQueue(function (prev) {
                var newQueue = prev.slice(1);
                console.log('ToastContext: Updated dismiss queue after removal:', newQueue);
                return newQueue;
            });
            setIsProcessing(false);
        }, nextToast.duration);
    }, [dismissQueue, isProcessing]);
    // Process next dismiss when queue changes and not currently processing
    useEffect(function () {
        console.log('ToastContext: useEffect triggered, queue length:', dismissQueue.length, 'isProcessing:', isProcessing);
        if (dismissQueue.length > 0 && !isProcessing) {
            console.log('ToastContext: Starting to process next dismiss');
            processNextDismiss();
        }
    }, [dismissQueue.length, isProcessing, processNextDismiss]);
    var showToast = useCallback(function (messageOrConfig, type, duration, position) {
        var id = Math.random().toString(36).substr(2, 9);
        var createdAt = Date.now();
        console.log('ToastContext: showToast called with:', { messageOrConfig: messageOrConfig, type: type, duration: duration, position: position, id: id, createdAt: createdAt });
        var newToast;
        if (typeof messageOrConfig === 'string') {
            // Old API format: showToast(message, type, duration, position)
            newToast = {
                id: id,
                message: messageOrConfig,
                type: type || 'info',
                duration: duration || 3000,
                position: position || 'bottom',
                createdAt: createdAt
            };
        }
        else {
            // New API format: showToast({ message, type, duration, position, textStyle, containerStyle })
            newToast = {
                id: id,
                message: messageOrConfig.message,
                type: messageOrConfig.type || type || 'info',
                duration: messageOrConfig.duration || duration || 3000,
                position: messageOrConfig.position || position || 'bottom',
                textStyle: messageOrConfig.textStyle,
                containerStyle: messageOrConfig.containerStyle,
                createdAt: createdAt
            };
        }
        // Add to visible toasts immediately
        setToasts(function (currentToasts) {
            var newToasts = __spreadArray(__spreadArray([], currentToasts, true), [newToast], false);
            console.log('ToastContext: Updated toasts:', newToasts);
            return newToasts;
        });
        // Add to dismiss queue
        setDismissQueue(function (currentQueue) {
            var newQueue = __spreadArray(__spreadArray([], currentQueue, true), [newToast], false);
            console.log('ToastContext: Updated dismiss queue:', newQueue);
            return newQueue;
        });
    }, []);
    var handleClose = useCallback(function (id) {
        var _a;
        console.log('ToastContext: Manual close for toast:', id);
        // Clear current timer if this is the toast being processed
        if (currentTimerRef.current && ((_a = dismissQueue[0]) === null || _a === void 0 ? void 0 : _a.id) === id) {
            clearTimeout(currentTimerRef.current);
            currentTimerRef.current = null;
            setIsProcessing(false);
        }
        // Remove from both arrays
        setToasts(function (currentToasts) { return currentToasts.filter(function (toast) { return toast.id !== id; }); });
        setDismissQueue(function (currentQueue) { return currentQueue.filter(function (toast) { return toast.id !== id; }); });
    }, [dismissQueue]);
    // Cleanup on unmount
    useEffect(function () {
        return function () {
            if (currentTimerRef.current) {
                clearTimeout(currentTimerRef.current);
            }
        };
    }, []);
    // Get status bar height for proper top positioning
    var getStatusBarHeight = function () {
        if (Platform.OS === 'ios') {
            return StatusBar.currentHeight || 20; // Reduced iOS status bar height
        }
        return StatusBar.currentHeight || 0;
    };
    return (_jsxs(ToastContext.Provider, { value: { showToast: showToast }, children: [children, _jsx(View, { style: styles.toastContainer, pointerEvents: "none", children: toasts.map(function (toast, index) {
                    // Position toast at the absolute top - no status bar offset
                    var topPosition = toast.position === 'top' ? 0 + (index * 70) : undefined;
                    var bottomPosition = toast.position === 'bottom' ? 20 + (index * 70) : undefined;
                    // Merge default positioning styles with custom containerStyle
                    var mergedContainerStyle = __assign({ position: 'absolute', top: topPosition, bottom: bottomPosition, left: 20, right: 20, zIndex: 9999, elevation: 5 }, toast.containerStyle);
                    return (_jsx(Toast, __assign({}, toast, { containerStyle: mergedContainerStyle, onClose: function () { return handleClose(toast.id); } }), toast.id));
                }) })] }));
};
var styles = StyleSheet.create({
    toastContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 9999,
    },
});
export var useToast = function () {
    var context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
//# sourceMappingURL=ToastContext.js.map