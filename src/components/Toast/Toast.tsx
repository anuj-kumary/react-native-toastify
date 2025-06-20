import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, Animated, Platform } from 'react-native';

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

  console.log('Toast: Component rendered with:', { message, type, position });

  const toastTypes = {
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

  useEffect(() => {
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

    const timer = setTimeout(() => {
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
      ]).start(() => {
        console.log('Toast: Hide animation completed, calling onClose');
        onClose?.();
      });
    }, duration);

    return () => clearTimeout(timer);
  }, [fadeAnim, translateY, duration, onClose, position]);

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor: toastTypes[type].backgroundColor,
          opacity: fadeAnim,
          transform: [{ translateY }],
        },
        containerStyle
      ]}
      pointerEvents="none"
    >
      <Text style={[styles.indicator, { color: toastTypes[type].iconColor }]}>
        {toastTypes[type].indicator}
      </Text>
      <Text style={[styles.message, textStyle]}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 9999,
    ...(Platform.OS === 'ios' ? { zIndex: 9999 } : {}),
  },
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