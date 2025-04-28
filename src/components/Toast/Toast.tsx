import React, { useEffect, useRef } from 'react';
import { Text, View, StyleSheet, Animated, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  position?: 'top' | 'bottom';
  onClose: () => void;
  textStyle?: object;
  containerStyle?: object;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  position = 'bottom',
  onClose,
  textStyle = {},
  containerStyle = {},
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(position === 'top' ? -100 : 100)).current;

  const toastTypes = {
    success: {
      backgroundColor: '#4caf50',
      icon: 'check-circle-outline',
      iconColor: '#fff'
    },
    error: {
      backgroundColor: '#f44336',
      icon: 'error-outline',
      iconColor: '#fff'
    },
    warning: {
      backgroundColor: '#ff9800',
      icon: 'warning-amber',
      iconColor: '#fff'
    },
    info: {
      backgroundColor: '#2196f3',
      icon: 'info-outline',
      iconColor: '#fff'
    }
  };

  useEffect(() => {
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

    const timer = setTimeout(() => {
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
      ]).start(() => onClose());
    }, duration);

    return () => clearTimeout(timer);
  }, [fadeAnim, translateY, duration, onClose, position]);

  const { width } = Dimensions.get('window');

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor: toastTypes[type].backgroundColor,
          [position]: 50,
          opacity: fadeAnim,
          transform: [{ translateY }],
          width: width - 40,
        },
        containerStyle
      ]}
    >
      <MaterialIcons 
        name={toastTypes[type].icon as keyof typeof MaterialIcons.glyphMap}
        size={24}
        color={toastTypes[type].iconColor}
        style={styles.icon}
      />
      <Text style={[styles.message, textStyle]}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 9999,
  },
  icon: {
    marginRight: 10,
  },
  message: {
    color: 'white',
    fontSize: 16,
    flex: 1,
  },
}); 