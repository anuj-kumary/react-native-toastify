import { View, StyleSheet, Button, TouchableOpacity, Text, Alert } from 'react-native';
import { useToast } from '../context/ToastContext';

export const HomeScreen = () => {
  const { showToast } = useToast();

  const handleShowToast = (message: string, type: 'success' | 'error' | 'warning' | 'info', duration?: number, position?: 'top' | 'bottom') => {
    try {
      showToast({
        message,
        type,
        duration: duration || 3000,
        position: position || 'bottom'
      });
    } catch (error) {
      console.error('HomeScreen: Error calling showToast:', error);
    }
  };

  const handleClick = () => {
    console.log('HomeScreen: Button pressed -');
  }

  const handleTouchablePress = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    console.log('HomeScreen: TouchableOpacity pressed -', message, type);
    showToast({
      message,
      type,
      duration: 3000,
      position: 'bottom'
    });
  };

  const testAlert = () => {
    Alert.alert('Test', 'This is a test alert to verify buttons work');
  };

  const testToastContext = () => {
    console.log('HomeScreen: Testing toast context directly');
    showToast({
      message: 'Direct test!',
      type: 'success',
      duration: 3000,
      position: 'top'
    });
  };

  // New functions to demonstrate textStyle and containerStyle
  const showCustomStyledToast = () => {
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

  const showGradientStyleToast = () => {
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

  const showMinimalToast = () => {
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Toast Test</Text>
      
      {/* Test Alert Button */}
      <Button 
        title="Test Alert (Verify Buttons Work)"
        onPress={testAlert}
        color="#666"
      />
      
      {/* Test Toast Context Directly */}
      <Button 
        title="Test Toast Context Directly"
        onPress={testToastContext}
        color="#333"
      />
      
      {/* Standard React Native Buttons */}
      <Button 
        title="Success Toast"
        onPress={() => handleShowToast('Success message!', 'success')}
        color="#4caf50"
      />
      
      <Button 
        title="Error Toast (Top)"
        onPress={() => handleShowToast('Error message!', 'error', 5000, 'top')}
        color="#f44336"
      />
      
      <Button 
        title="Warning Toast"
        onPress={() => handleShowToast('Warning message!', 'warning')}
        color="#ff9800"
      />
      
      <Button 
        title="Info Toast (Top)"
        onPress={() => handleShowToast('Info message!', 'info', 3000, 'top')}
        color="#2196f3"
      />

      {/* New Custom Styled Toast Examples */}
      <Button 
        title="Custom Styled Toast"
        onPress={showCustomStyledToast}
        color="#9c27b0"
      />

      <Button 
        title="Gradient Style Toast"
        onPress={showGradientStyleToast}
        color="#ff5722"
      />

      <Button 
        title="Minimal Toast"
        onPress={showMinimalToast}
        color="#607d8b"
      />

      {/* TouchableOpacity as alternative */}
      <TouchableOpacity 
        style={styles.touchableButton}
        onPress={() => handleTouchablePress('Touchable Success!', 'success')}
        activeOpacity={0.7}
      >
        <Text style={styles.touchableText}>Touchable Success</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.touchableButton, { backgroundColor: '#f44336' }]}
        onPress={() => handleTouchablePress('Touchable Error!', 'error')}
        activeOpacity={0.7}
      >
        <Text style={styles.touchableText}>Touchable Error</Text>
      </TouchableOpacity>
    </View>
  );
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