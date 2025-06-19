import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View, StyleSheet, Button, TouchableOpacity, Text, Alert } from 'react-native';
import { useToast } from '../context/ToastContext';
export const HomeScreen = () => {
    const { showToast } = useToast();
    const handleShowToast = (message, type) => {
        console.log('HomeScreen: Button pressed -', message, type);
        try {
            showToast(message, type);
            console.log('HomeScreen: showToast called successfully');
        }
        catch (error) {
            console.error('HomeScreen: Error calling showToast:', error);
        }
    };
    const handleClick = () => {
        console.log('HomeScreen: Button pressed -');
    };
    const handleTouchablePress = (message, type) => {
        console.log('HomeScreen: TouchableOpacity pressed -', message, type);
        showToast(message, type);
    };
    const testAlert = () => {
        Alert.alert('Test', 'This is a test alert to verify buttons work');
    };
    const testToastContext = () => {
        console.log('HomeScreen: Testing toast context directly');
        showToast('Direct test!', 'success');
    };
    return (_jsxs(View, { style: styles.container, children: [_jsx(Text, { style: styles.title, children: "Toast Test" }), _jsx(Button, { title: "Test Alert (Verify Buttons Work)", onPress: testAlert, color: "#666" }), _jsx(Button, { title: "Test Toast Context Directly", onPress: handleClick, color: "#333" }), _jsx(Button, { title: "Success Toast", onPress: () => handleShowToast('Success message!', 'success'), color: "#4caf50" }), _jsx(Button, { title: "Error Toast", onPress: () => handleShowToast('Error message!', 'error'), color: "#f44336" }), _jsx(Button, { title: "Warning Toast", onPress: () => handleShowToast('Warning message!', 'warning'), color: "#ff9800" }), _jsx(Button, { title: "Info Toast", onPress: () => handleShowToast('Info message!', 'info'), color: "#2196f3" }), _jsx(TouchableOpacity, { style: styles.touchableButton, onPress: () => handleTouchablePress('Touchable Success!', 'success'), activeOpacity: 0.7, children: _jsx(Text, { style: styles.touchableText, children: "Touchable Success" }) }), _jsx(TouchableOpacity, { style: [styles.touchableButton, { backgroundColor: '#f44336' }], onPress: () => handleTouchablePress('Touchable Error!', 'error'), activeOpacity: 0.7, children: _jsx(Text, { style: styles.touchableText, children: "Touchable Error" }) })] }));
};
const styles = StyleSheet.create({
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
