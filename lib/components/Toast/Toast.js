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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import { Text, StyleSheet, Animated, Platform } from 'react-native';
export var Toast = function (_a) {
    var message = _a.message, _b = _a.type, type = _b === void 0 ? 'info' : _b, _c = _a.duration, duration = _c === void 0 ? 3000 : _c, _d = _a.position, position = _d === void 0 ? 'bottom' : _d, onClose = _a.onClose, _e = _a.textStyle, textStyle = _e === void 0 ? {} : _e, _f = _a.containerStyle, containerStyle = _f === void 0 ? {} : _f;
    var fadeAnim = useRef(new Animated.Value(0)).current;
    var translateY = useRef(new Animated.Value(position === 'top' ? -100 : 100)).current;
    console.log('Toast: Component rendered with:', { message: message, type: type, position: position });
    var toastTypes = {
        success: {
            backgroundColor: '#4caf50',
            indicator: '✓',
            iconColor: '#fff',
            textColor: '#fff'
        },
        error: {
            backgroundColor: '#f44336',
            indicator: '✕',
            iconColor: '#fff',
            textColor: '#fff'
        },
        warning: {
            backgroundColor: '#ff9800',
            indicator: '⚠',
            iconColor: '#fff',
            textColor: '#fff'
        },
        info: {
            backgroundColor: '#2196f3',
            indicator: 'ℹ',
            iconColor: '#fff',
            textColor: '#fff'
        }
    };
    useEffect(function () {
        console.log('Toast: useEffect triggered, starting animation');
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            })
        ]).start();
        var timer = setTimeout(function () {
            console.log('Toast: Timer expired, starting hide animation');
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: position === 'top' ? -100 : 100,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start(function () {
                console.log('Toast: Hide animation completed, calling onClose');
                onClose === null || onClose === void 0 ? void 0 : onClose();
            });
        }, duration);
        return function () { return clearTimeout(timer); };
    }, [fadeAnim, translateY, duration, onClose, position]);
    return (_jsxs(Animated.View, { style: [
            styles.toast,
            {
                backgroundColor: toastTypes[type].backgroundColor,
                opacity: fadeAnim,
                transform: [{ translateY: translateY }],
            },
            containerStyle
        ], pointerEvents: "none", children: [_jsx(Text, { style: [styles.indicator, { color: toastTypes[type].iconColor }], children: toastTypes[type].indicator }), _jsx(Text, { style: [styles.message, textStyle], children: message })] }));
};
var styles = StyleSheet.create({
    toast: __assign({ padding: 15, borderRadius: 8, flexDirection: 'row', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, zIndex: 9999 }, (Platform.OS === 'ios' ? { zIndex: 9999 } : {})),
    indicator: {
        marginRight: 10,
        fontSize: 16,
    },
    message: {
        color: 'white',
        fontSize: 16,
        flex: 1,
    },
});
//# sourceMappingURL=Toast.js.map