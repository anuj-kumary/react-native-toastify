import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View, StyleSheet, Button, TouchableOpacity, Text, Alert } from 'react-native';
import { useToast } from '../context/ToastContext';
export var HomeScreen = function () {
    var showToast = useToast().showToast;
    var handleShowToast = function (message, type, duration, position) {
        try {
            showToast({
                message: message,
                type: type,
                duration: duration || 3000,
                position: position || 'bottom'
            });
        }
        catch (error) {
            console.error('HomeScreen: Error calling showToast:', error);
        }
    };
    var handleClick = function () {
        console.log('HomeScreen: Button pressed -');
    };
    var handleTouchablePress = function (message, type) {
        console.log('HomeScreen: TouchableOpacity pressed -', message, type);
        showToast({
            message: message,
            type: type,
            duration: 3000,
            position: 'bottom'
        });
    };
    var testAlert = function () {
        Alert.alert('Test', 'This is a test alert to verify buttons work');
    };
    var testToastContext = function () {
        console.log('HomeScreen: Testing toast context directly');
        showToast({
            message: 'Direct test!',
            type: 'success',
            duration: 3000,
            position: 'top'
        });
    };
    // New functions to demonstrate textStyle and containerStyle
    var showCustomStyledToast = function () {
        showToast({
            message: 'Custom styled toast with large text and rounded corners!',
            type: 'info',
            duration: 4000,
            position: 'top',
            textStyle: {
                fontSize: 18,
                fontWeight: 'bold',
                textAlign: 'center',
                color: '#ffffff'
            },
            containerStyle: {
                borderRadius: 20,
                backgroundColor: '#9c27b0',
                padding: 20,
                marginHorizontal: 10
            }
        });
    };
    var showGradientStyleToast = function () {
        showToast({
            message: 'Toast with custom background and text styling!',
            type: 'success',
            duration: 5000,
            position: 'bottom',
            textStyle: {
                fontSize: 16,
                fontStyle: 'italic',
                textDecorationLine: 'underline',
                color: '#fff'
            },
            containerStyle: {
                backgroundColor: '#ff5722',
                borderRadius: 12,
                borderWidth: 2,
                borderColor: '#fff',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 6,
                elevation: 8
            }
        });
    };
    var showMinimalToast = function () {
        showToast({
            message: 'Minimal design toast',
            type: 'warning',
            duration: 3000,
            position: 'top',
            textStyle: {
                fontSize: 14,
                color: '#333'
            },
            containerStyle: {
                backgroundColor: '#fff',
                borderRadius: 4,
                padding: 12,
                borderLeftWidth: 4,
                borderLeftColor: '#ff9800'
            }
        });
    };
    return (_jsxs(View, { style: styles.container, children: [_jsx(Text, { style: styles.title, children: "Toast Test" }), _jsx(Button, { title: "Test Alert (Verify Buttons Work)", onPress: testAlert, color: "#666" }), _jsx(Button, { title: "Test Toast Context Directly", onPress: testToastContext, color: "#333" }), _jsx(Button, { title: "Success Toast", onPress: function () { return handleShowToast('Success message!', 'success'); }, color: "#4caf50" }), _jsx(Button, { title: "Error Toast (Top)", onPress: function () { return handleShowToast('Error message!', 'error', 5000, 'top'); }, color: "#f44336" }), _jsx(Button, { title: "Warning Toast", onPress: function () { return handleShowToast('Warning message!', 'warning'); }, color: "#ff9800" }), _jsx(Button, { title: "Info Toast (Top)", onPress: function () { return handleShowToast('Info message!', 'info', 3000, 'top'); }, color: "#2196f3" }), _jsx(Button, { title: "Custom Styled Toast", onPress: showCustomStyledToast, color: "#9c27b0" }), _jsx(Button, { title: "Gradient Style Toast", onPress: showGradientStyleToast, color: "#ff5722" }), _jsx(Button, { title: "Minimal Toast", onPress: showMinimalToast, color: "#607d8b" }), _jsx(TouchableOpacity, { style: styles.touchableButton, onPress: function () { return handleTouchablePress('Touchable Success!', 'success'); }, activeOpacity: 0.7, children: _jsx(Text, { style: styles.touchableText, children: "Touchable Success" }) }), _jsx(TouchableOpacity, { style: [styles.touchableButton, { backgroundColor: '#f44336' }], onPress: function () { return handleTouchablePress('Touchable Error!', 'error'); }, activeOpacity: 0.7, children: _jsx(Text, { style: styles.touchableText, children: "Touchable Error" }) })] }));
};
var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        gap: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    touchableButton: {
        backgroundColor: '#4caf50',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        minWidth: 200,
        alignItems: 'center',
    },
    touchableText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});
//# sourceMappingURL=HomeScreen.js.map