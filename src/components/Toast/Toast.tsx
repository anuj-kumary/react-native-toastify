import React, { useCallback, useEffect, useRef } from 'react';
import {
  AccessibilityInfo,
  ActivityIndicator,
  Animated,
  Easing,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export type BuiltInToastType = 'success' | 'error' | 'info' | 'warning' | 'loading';
/** A built-in type, or a custom one registered through `<ToastProvider types>`. */
export type ToastType = BuiltInToastType | (string & {});
export type ToastPosition = 'top' | 'bottom';
/** 'colored' fills the card with the type's color; 'light' and 'dark' use a neutral card with a colored accent. */
export type ToastTheme = 'colored' | 'light' | 'dark';

export interface ToastAction {
  label: string;
  onPress: () => void;
}

/** Look of a toast type: register custom types, or restyle built-in ones, with `<ToastProvider types>`. */
export interface ToastTypeStyle {
  backgroundColor: string;
  /** A string or emoji is rendered as text; any other node as is. */
  icon?: React.ReactNode;
}

/** What a custom `render` function receives. */
export interface ToastRenderInfo {
  id?: string;
  message: string;
  title?: string;
  type: ToastType;
  /** Plays the exit animation and removes the toast. */
  hide: () => void;
}

export interface ToastProps {
  id?: string;
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
  /** Called when the toast is tapped, before it is dismissed (if dismissible). */
  onPress?: () => void;
  /** Called once the toast has finished animating in. */
  onShow?: () => void;
  /** Called once the toast has been dismissed, for any reason. */
  onHide?: () => void;
  /** Shows a bar counting down the time left. Ignored when duration is Infinity. */
  showProgress?: boolean;
  /** Replaces the default toast layout. Animations, swiping and the timer still apply. */
  render?: (toast: ToastRenderInfo) => React.ReactNode;
  /** Overrides the look of `type`. ToastProvider sets this from its `types` prop. */
  typeStyle?: ToastTypeStyle;
  /** Defaults to 'colored'. ToastProvider sets this from its `theme` prop. */
  theme?: ToastTheme;
  /** Changing this restarts the countdown. ToastProvider bumps it when a toast is updated. */
  revision?: number;
  /** Set to false to play the hide animation and then call onClose. */
  visible?: boolean;
  onClose?: () => void;
  textStyle?: object;
  containerStyle?: object;
}

const builtInTypes: Record<BuiltInToastType, ToastTypeStyle> = {
  success: { backgroundColor: '#4caf50', icon: '✓' },
  error: { backgroundColor: '#f44336', icon: '✕' },
  warning: { backgroundColor: '#ff9800', icon: '⚠' },
  info: { backgroundColor: '#2196f3', icon: 'ℹ' },
  loading: { backgroundColor: '#323232' },
};

const palettes: Record<ToastTheme, { card?: string; text: string; accent?: string }> = {
  colored: { text: '#fff', accent: '#fff' },
  light: { card: '#ffffff', text: '#1f1f1f' },
  dark: { card: '#262626', text: '#f5f5f5' },
};

const ANIMATION_MS = 300;
const SWIPE_DISTANCE = 80;

export const Toast: React.FC<ToastProps> = ({
  id,
  message,
  type = 'info',
  duration = 3000,
  position = 'bottom',
  title,
  icon,
  action,
  dismissible = true,
  onPress,
  onShow,
  onHide,
  showProgress = false,
  render,
  typeStyle,
  theme = 'colored',
  revision = 0,
  visible = true,
  onClose,
  textStyle = {},
  containerStyle = {},
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(position === 'top' ? -100 : 100)).current;
  // Swipe and the progress bar run on the JS driver, so they live on their own views.
  const translateX = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(1)).current;
  // Callers usually pass inline callbacks; reading them from refs keeps the timers from restarting on every render.
  const callbacks = useRef({ onClose, onPress, onShow, onHide });
  callbacks.current = { onClose, onPress, onShow, onHide };
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
    ]).start(() => {
      callbacks.current.onHide?.();
      callbacks.current.onClose?.();
    });
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
    ]).start(({ finished }) => {
      if (finished) callbacks.current.onShow?.();
    });
  }, [fadeAnim, translateY]);

  // The countdown can be paused (press and hold, swipe), so it tracks what is left.
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const remaining = useRef(0);
  const startedAt = useRef(0);
  const paused = useRef(false);

  const runCountdown = useCallback((ms: number) => {
    clearTimeout(timer.current);
    startedAt.current = Date.now();
    remaining.current = ms;
    timer.current = setTimeout(() => hide(), ms);
    if (showProgress) {
      Animated.timing(progress, { toValue: 0, duration: ms, easing: Easing.linear, useNativeDriver: false }).start();
    }
  }, [hide, showProgress, progress]);

  // Restarts when duration changes (a promise toast going from loading to success) or the toast is updated.
  useEffect(() => {
    if (!Number.isFinite(duration)) return;
    paused.current = false;
    progress.setValue(1);
    runCountdown(duration);
    return () => clearTimeout(timer.current);
  }, [duration, revision, runCountdown, progress]);

  const pause = () => {
    if (paused.current || closing.current || !Number.isFinite(duration)) return;
    paused.current = true;
    clearTimeout(timer.current);
    remaining.current -= Date.now() - startedAt.current;
    progress.stopAnimation();
  };
  const resume = () => {
    if (!paused.current || closing.current) return;
    paused.current = false;
    runCountdown(Math.max(remaining.current, 0));
  };
  const pauseRef = useRef({ pause, resume });
  pauseRef.current = { pause, resume };

  useEffect(() => {
    if (!visible) hide();
  }, [visible, hide]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 10 && Math.abs(g.dx) > Math.abs(g.dy),
      onPanResponderGrant: () => pauseRef.current.pause(),
      onPanResponderMove: (_, g) => translateX.setValue(g.dx),
      onPanResponderRelease: (_, g) => {
        if (Math.abs(g.dx) > SWIPE_DISTANCE || Math.abs(g.vx) > 0.5) {
          hideRef.current(g.dx > 0 ? 500 : -500);
        } else {
          Animated.spring(translateX, { toValue: 0, useNativeDriver: false }).start();
          pauseRef.current.resume();
        }
      },
      onPanResponderTerminate: () => {
        Animated.spring(translateX, { toValue: 0, useNativeDriver: false }).start();
        pauseRef.current.resume();
      },
    }),
  ).current;

  const style = { ...(builtInTypes[type as BuiltInToastType] ?? builtInTypes.info), ...typeStyle };
  const palette = palettes[theme];
  // The loading color is a dark grey, too close to the dark card, so it borrows the text color there.
  const accent = palette.accent ?? (type === 'loading' ? palette.text : style.backgroundColor);
  const textColor = { color: palette.text };
  const resolvedIcon =
    icon !== undefined
      ? icon
      : style.icon !== undefined
        ? style.icon
        : type === 'loading'
          ? <ActivityIndicator color={accent} size="small" />
          : null;
  const iconNode =
    typeof resolvedIcon === 'string' ? <Text style={[styles.indicator, { color: accent }]}>{resolvedIcon}</Text> : resolvedIcon;
  const pressable = dismissible || !!onPress;
  const interactive = pressable || !!action || !!render;
  const handlePress = () => {
    callbacks.current.onPress?.();
    if (dismissible) hide();
  };

  return (
    <Animated.View
      style={{ transform: [{ translateX }] }}
      pointerEvents={interactive ? 'auto' : 'none'}
      {...(dismissible ? panResponder.panHandlers : {})}
    >
      <Animated.View
        testID="toast"
        style={[
          render
            ? null
            : [
                styles.toast,
                palette.card
                  ? { backgroundColor: palette.card, borderLeftWidth: 4, borderLeftColor: accent }
                  : { backgroundColor: style.backgroundColor },
              ],
          { opacity: fadeAnim, transform: [{ translateY }] },
          containerStyle,
        ]}
      >
        {render ? (
          // Custom layouts may contain their own buttons, so they are not grouped into one accessibility element.
          <Pressable
            onPress={pressable ? handlePress : undefined}
            onPressIn={pause}
            onPressOut={resume}
            accessibilityLiveRegion="polite"
          >
            {render({ id, message, title, type, hide: () => hide() })}
          </Pressable>
        ) : (
          <>
            <Pressable
              style={styles.body}
              onPress={pressable ? handlePress : undefined}
              // Holding a toast pauses its countdown so it can be read.
              onPressIn={pause}
              onPressOut={resume}
              // With an action, leave the content ungrouped so the action button stays reachable by screen readers.
              accessible={!action}
              accessibilityRole="alert"
              accessibilityLiveRegion="polite"
              accessibilityHint={dismissible ? 'Double tap to dismiss' : undefined}
            >
              {iconNode != null ? <View style={styles.icon}>{iconNode}</View> : null}
              <View style={styles.text}>
                {title ? <Text style={[styles.title, textColor, textStyle]}>{title}</Text> : null}
                <Text style={[styles.message, textColor, textStyle]}>{message}</Text>
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
                <Text style={[styles.actionText, { color: accent }]}>{action.label}</Text>
              </Pressable>
            ) : null}
            {showProgress && Number.isFinite(duration) ? (
              <Animated.View
                testID="toast-progress"
                style={[
                  styles.progress,
                  palette.card ? { backgroundColor: accent } : null,
                  { width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) },
                ]}
              />
            ) : null}
          </>
        )}
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
  // Rounded on both ends so it stays inside the card corners without overflow: hidden, which would clip the iOS shadow.
  progress: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    height: 3,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
});
