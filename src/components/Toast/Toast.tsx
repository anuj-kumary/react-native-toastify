import React, { useCallback, useEffect, useRef } from 'react';
import {
  AccessibilityInfo,
  ActivityIndicator,
  Animated,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'loading';
export type ToastPosition = 'top' | 'bottom';

export interface ToastAction {
  label: string;
  onPress: () => void;
}

export interface ToastProps {
  message: string;
  type: ToastType;
  /** Milliseconds before auto-dismiss. `Infinity` keeps the toast until it is dismissed. */
  duration: number;
  position: ToastPosition;
  title?: string;
  /** Replaces the type's icon. A string is rendered as text; `null` hides the icon. */
  icon?: React.ReactNode;
  /** A button on the toast, e.g. "Undo". Pressing it also dismisses the toast. */
  action?: ToastAction;
  /** Tap or swipe sideways to dismiss. Defaults to true. */
  dismissible?: boolean;
  /** Set to false to play the hide animation and then call onClose. */
  visible?: boolean;
  onClose?: () => void;
  textStyle?: object;
  containerStyle?: object;
}

const toastTypes: Record<ToastType, { backgroundColor: string; indicator: string }> = {
  success: { backgroundColor: '#4caf50', indicator: '✓' },
  error: { backgroundColor: '#f44336', indicator: '✕' },
  warning: { backgroundColor: '#ff9800', indicator: '⚠' },
  info: { backgroundColor: '#2196f3', indicator: 'ℹ' },
  loading: { backgroundColor: '#323232', indicator: '' },
};

const ANIMATION_MS = 300;
const SWIPE_DISTANCE = 80;

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  position = 'bottom',
  title,
  icon,
  action,
  dismissible = true,
  visible = true,
  onClose,
  textStyle = {},
  containerStyle = {},
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(position === 'top' ? -100 : 100)).current;
  // Swipe runs on the JS driver, so it lives on its own outer view.
  const translateX = useRef(new Animated.Value(0)).current;
  // Callers usually pass an inline onClose; reading it from a ref keeps the timer from restarting on every parent render.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const closing = useRef(false);

  const hide = useCallback((swipeTo = 0) => {
    if (closing.current) return;
    closing.current = true;
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: ANIMATION_MS, useNativeDriver: true }),
      swipeTo
        ? Animated.timing(translateX, { toValue: swipeTo, duration: ANIMATION_MS, useNativeDriver: false })
        : Animated.timing(translateY, {
            toValue: position === 'top' ? -100 : 100,
            duration: ANIMATION_MS,
            useNativeDriver: true,
          }),
    ]).start(() => onCloseRef.current?.());
  }, [fadeAnim, translateX, translateY, position]);
  const hideRef = useRef(hide);
  hideRef.current = hide;

  useEffect(() => {
    // Android announces through accessibilityLiveRegion below; iOS needs an explicit announcement.
    if (Platform.OS === 'ios') {
      AccessibilityInfo.announceForAccessibility(title ? `${title}. ${message}` : message);
    }
  }, [title, message]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: ANIMATION_MS, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: ANIMATION_MS, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, translateY]);

  // Restarts when duration changes, e.g. a promise toast going from loading (Infinity) to success.
  useEffect(() => {
    if (!Number.isFinite(duration)) return;
    const timer = setTimeout(() => hide(), duration);
    return () => clearTimeout(timer);
  }, [duration, hide]);

  useEffect(() => {
    if (!visible) hide();
  }, [visible, hide]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 10 && Math.abs(g.dx) > Math.abs(g.dy),
      onPanResponderMove: (_, g) => translateX.setValue(g.dx),
      onPanResponderRelease: (_, g) => {
        if (Math.abs(g.dx) > SWIPE_DISTANCE || Math.abs(g.vx) > 0.5) {
          hideRef.current(g.dx > 0 ? 500 : -500);
        } else {
          Animated.spring(translateX, { toValue: 0, useNativeDriver: false }).start();
        }
      },
      onPanResponderTerminate: () => {
        Animated.spring(translateX, { toValue: 0, useNativeDriver: false }).start();
      },
    }),
  ).current;

  const iconNode =
    icon !== undefined
      ? typeof icon === 'string'
        ? <Text style={styles.indicator}>{icon}</Text>
        : icon
      : type === 'loading'
        ? <ActivityIndicator color="#fff" size="small" />
        : <Text style={styles.indicator}>{toastTypes[type].indicator}</Text>;
  const interactive = dismissible || !!action;

  return (
    <Animated.View
      style={{ transform: [{ translateX }] }}
      pointerEvents={interactive ? 'auto' : 'none'}
      {...(dismissible ? panResponder.panHandlers : {})}
    >
      <Animated.View
        style={[
          styles.toast,
          {
            backgroundColor: toastTypes[type].backgroundColor,
            opacity: fadeAnim,
            transform: [{ translateY }],
          },
          containerStyle,
        ]}
      >
        <Pressable
          style={styles.body}
          onPress={dismissible ? () => hide() : undefined}
          disabled={!dismissible}
          // With an action, leave the content ungrouped so the action button stays reachable by screen readers.
          accessible={!action}
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
          accessibilityHint={dismissible ? 'Double tap to dismiss' : undefined}
        >
          {iconNode != null ? <View style={styles.icon}>{iconNode}</View> : null}
          <View style={styles.text}>
            {title ? <Text style={[styles.title, textStyle]}>{title}</Text> : null}
            <Text style={[styles.message, textStyle]}>{message}</Text>
          </View>
        </Pressable>
        {action ? (
          <Pressable
            onPress={() => {
              action.onPress();
              hide();
            }}
            accessibilityRole="button"
            hitSlop={8}
            style={styles.action}
          >
            <Text style={styles.actionText}>{action.label}</Text>
          </Pressable>
        ) : null}
      </Animated.View>
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
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  indicator: {
    color: 'white',
    fontSize: 16,
  },
  text: {
    flex: 1,
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  message: {
    color: 'white',
    fontSize: 16,
  },
  action: {
    marginLeft: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  actionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});
