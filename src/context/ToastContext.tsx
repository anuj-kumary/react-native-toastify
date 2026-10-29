import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import {
  Keyboard,
  type KeyboardEvent,
  View,
  StyleSheet,
  StatusBar,
  Platform,
  useColorScheme,
} from 'react-native';
import {
  Toast,
  type ToastPosition,
  type ToastProps,
  type ToastTheme,
  type ToastType,
  type ToastTypeStyle,
} from '../components/Toast/Toast';
import { registerToastController, type ToastConfig } from '../toast';

export type { ToastConfig } from '../toast';

interface ToastItem extends Omit<ToastProps, 'onClose'> {
  id: string;
  /** React key. Separate from id, so a toast can reuse the id of one that is still animating out. */
  key: string;
  revision: number;
}

type ToastContextType = {
  /** Shows a toast and returns its id. */
  showToast: (
    message: string | ToastConfig,
    type?: ToastType,
    duration?: number,
    position?: ToastPosition,
  ) => string;
  /** Changes a toast on screen and restarts its countdown. */
  updateToast: (id: string, config: Partial<ToastConfig>) => void;
  hideToast: (id: string) => void;
  hideAll: () => void;
};

export interface ToastProviderProps {
  children: React.ReactNode;
  /** Default auto-dismiss time in ms. Defaults to 3000. */
  duration?: number;
  /** Default position. Defaults to 'bottom'. */
  position?: ToastPosition;
  /** Most toasts visible per position; the oldest is dismissed when a new one would exceed it. */
  max?: number;
  /** Extra distance from the safe area, in points. Defaults to { top: 10, bottom: 20 }. */
  offset?: { top?: number; bottom?: number };
  /** Move bottom toasts above the keyboard while it is open. Defaults to true. */
  avoidKeyboard?: boolean;
  /** Default for each toast's `showProgress`. Defaults to false. */
  showProgress?: boolean;
  /** Default screen-reader dismiss hint. A toast's own hint takes precedence. */
  accessibilityHint?: string;
  /** Custom toast types, or new looks for the built-in ones, e.g. { upload: { backgroundColor: '#6200ee', icon: '⬆' } }. */
  types?: Record<string, ToastTypeStyle>;
  /** Default custom layout for every toast; a toast's own `render` takes precedence. */
  render?: ToastProps['render'];
  /** 'colored' (default), 'light', 'dark', or 'system' to follow the device's color scheme. */
  theme?: ToastTheme | 'system';
  /** Widest a toast gets, so it doesn't stretch across tablets and web. Defaults to 480. */
  maxWidth?: number;
}

type Insets = { top: number; bottom: number };

// Optional: apps with react-native-safe-area-context (Expo and the RN template ship it) get exact notch and
// home-indicator insets. Without it, or without a SafeAreaProvider, fall back to the status bar height.
let SafeAreaInsetsContext: React.Context<Insets | null> = createContext<Insets | null>(null);
try {
  SafeAreaInsetsContext =
    require('react-native-safe-area-context').SafeAreaInsetsContext ?? SafeAreaInsetsContext;
} catch {
  // not installed
}

// ponytail: 44 is the notched-iPhone status bar; install react-native-safe-area-context for exact insets.
const fallbackInsets: Insets = {
  top: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 44,
  bottom: 0,
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  duration = 3000,
  position = 'bottom',
  max,
  offset,
  avoidKeyboard = true,
  showProgress = false,
  accessibilityHint,
  types,
  render,
  theme = 'colored',
  maxWidth = 480,
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const colorScheme = useColorScheme();
  const resolvedTheme: ToastTheme =
    theme === 'system' ? (colorScheme === 'dark' ? 'dark' : 'light') : theme;
  const insets = useContext(SafeAreaInsetsContext) ?? fallbackInsets;
  const keyboardTop = useKeyboardTop(avoidKeyboard);
  const [layer, setLayer] = useState({ y: 0, height: 0 });
  // How much of the toast layer the keyboard covers, as KeyboardAvoidingView computes it. That is the
  // full keyboard on iOS and edge-to-edge Android, but 0 on Android windows that resize for the keyboard
  // (adjustResize), where the layer already ends at the keyboard's top edge.
  const keyboardOverlap =
    keyboardTop === null ? 0 : Math.max(0, layer.y + layer.height - keyboardTop);
  // Read through a ref so the callbacks below stay stable for the global controller.
  const optionsRef = useRef({ duration, position, max, showProgress });
  optionsRef.current = { duration, position, max, showProgress };

  const showToast = useCallback(
    (
      messageOrConfig: string | ToastConfig,
      type?: ToastType,
      dur?: number,
      pos?: ToastPosition,
    ) => {
      const config: ToastConfig =
        typeof messageOrConfig === 'string' ? { message: messageOrConfig } : messageOrConfig;
      const {
        duration: defaultDuration,
        position: defaultPosition,
        max: maxVisible,
        showProgress: defaultProgress,
      } = optionsRef.current;
      const newToast: ToastItem = {
        ...config,
        id: config.id ?? randomId(),
        key: randomId(),
        revision: 0,
        type: config.type || type || 'info',
        duration: config.duration || dur || defaultDuration,
        position: config.position || pos || defaultPosition,
        showProgress: config.showProgress ?? defaultProgress,
        visible: true,
      };
      setToasts((currentToasts) => {
        const existing = config.id
          ? currentToasts.find((t) => t.visible && t.id === config.id)
          : undefined;
        if (existing) {
          return currentToasts.map((t) =>
            t === existing ? { ...newToast, key: t.key, revision: t.revision + 1 } : t,
          );
        }
        const next = [...currentToasts, newToast];
        const shown = next.filter((t) => t.visible && t.position === newToast.position);
        const excess = maxVisible ? shown.length - maxVisible : 0;
        if (excess <= 0) return next;
        const dropped = new Set(shown.slice(0, excess).map((t) => t.key));
        return next.map((t) => (dropped.has(t.key) ? { ...t, visible: false } : t));
      });
      return newToast.id;
    },
    [],
  );

  // Hiding plays the exit animation; the toast is removed once it calls onClose.
  const hideToast = useCallback((id: string) => {
    setToasts((currentToasts) =>
      currentToasts.map((t) => (t.id === id ? { ...t, visible: false } : t)),
    );
  }, []);

  const hideAll = useCallback(() => {
    setToasts((currentToasts) => currentToasts.map((t) => ({ ...t, visible: false })));
  }, []);

  const updateToast = useCallback((id: string, config: Partial<ToastConfig>) => {
    setToasts((currentToasts) =>
      currentToasts.map((t) =>
        t.visible && t.id === id ? { ...t, ...config, id, revision: t.revision + 1 } : t,
      ),
    );
  }, []);

  const removeToast = useCallback((key: string) => {
    setToasts((currentToasts) => currentToasts.filter((t) => t.key !== key));
  }, []);

  useEffect(
    () =>
      registerToastController({
        show: (config) => showToast(config),
        hide: hideToast,
        hideAll,
        update: updateToast,
        defaults: () => optionsRef.current,
      }),
    [showToast, hideToast, hideAll, updateToast],
  );

  const renderToast = ({ key, ...toast }: ToastItem) => (
    <View
      key={key}
      style={[styles.slot, { maxWidth }]}
      pointerEvents="box-none"
      testID="toast-slot"
    >
      <Toast
        {...toast}
        render={toast.render ?? render}
        accessibilityHint={toast.accessibilityHint ?? accessibilityHint}
        typeStyle={types?.[toast.type]}
        theme={resolvedTheme}
        containerStyle={{ ...toastSpacing, ...toast.containerStyle }}
        onClose={() => removeToast(key)}
      />
    </View>
  );

  return (
    <ToastContext.Provider value={{ showToast, updateToast, hideToast, hideAll }}>
      {children}
      <View
        style={styles.toastContainer}
        pointerEvents="box-none"
        testID="toast-layer"
        onLayout={(e) =>
          setLayer({ y: e.nativeEvent.layout.y, height: e.nativeEvent.layout.height })
        }
      >
        <View
          style={[styles.stack, { top: insets.top + (offset?.top ?? 10) }]}
          pointerEvents="box-none"
          testID="toast-stack-top"
        >
          {toasts.filter((toast) => toast.position === 'top').map(renderToast)}
        </View>
        <View
          // While the keyboard is open it covers the bottom inset, so only the overlap counts.
          style={[
            styles.stack,
            styles.bottomStack,
            {
              bottom:
                (keyboardTop === null ? insets.bottom : keyboardOverlap) + (offset?.bottom ?? 20),
            },
          ]}
          pointerEvents="box-none"
          testID="toast-stack-bottom"
        >
          {toasts.filter((toast) => toast.position === 'bottom').map(renderToast)}
        </View>
      </View>
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    elevation: 9999,
  },
  // Toasts stack in normal flow, so top and bottom toasts never offset each other.
  stack: {
    position: 'absolute',
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  // Full width on phones; capped and centered by maxWidth on tablets and web.
  slot: {
    width: '100%',
  },
  // The first bottom toast sits lowest; later ones stack above it.
  bottomStack: {
    flexDirection: 'column-reverse',
  },
});

const toastSpacing = { marginVertical: 5 };

const randomId = () => Math.random().toString(36).slice(2, 11);

// iOS reports the keyboard before it animates in; Android only after.
const keyboardEvents =
  Platform.OS === 'ios'
    ? (['keyboardWillShow', 'keyboardWillHide'] as const)
    : (['keyboardDidShow', 'keyboardDidHide'] as const);

// The keyboard's top edge in screen coordinates while it is open, otherwise null.
function useKeyboardTop(enabled: boolean) {
  const [top, setTop] = useState<number | null>(null);
  useEffect(() => {
    if (!enabled) return;
    const show = Keyboard.addListener(keyboardEvents[0], (e: KeyboardEvent) =>
      // iOS can report screenY 0 with "prefer cross-fade transitions"; KeyboardAvoidingView ignores it too.
      setTop(e.endCoordinates.screenY > 0 ? e.endCoordinates.screenY : null),
    );
    const hide = Keyboard.addListener(keyboardEvents[1], () => setTop(null));
    return () => {
      show.remove();
      hide.remove();
    };
  }, [enabled]);
  return enabled ? top : null;
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
