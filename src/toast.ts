import type { ToastPosition, ToastProps, ToastType } from './components/Toast/Toast';

export interface ToastConfig extends Partial<Omit<ToastProps, 'message' | 'onClose' | 'visible'>> {
  message: string;
}

/** Options for the typed helpers, e.g. `toast.success('Saved', { position: 'top' })`. */
export type ToastOptions = Omit<ToastConfig, 'message' | 'type'>;

export interface ToastController {
  show: (config: string | ToastConfig) => string;
  hide: (id: string) => void;
  hideAll: () => void;
  update: (id: string, config: Partial<ToastConfig>) => void;
  defaults: () => { duration: number; position: ToastPosition };
}

// ponytail: one global controller, the most recently mounted ToastProvider. Apps render one provider at the root.
let controller: ToastController | null = null;

export function registerToastController(next: ToastController) {
  controller = next;
  return () => {
    if (controller === next) controller = null;
  };
}

function withController<T>(fn: (c: ToastController) => T, fallback: T): T {
  if (!controller) {
    if (__DEV__) console.warn('react-native-toastify-expo: toast was called but no <ToastProvider> is mounted.');
    return fallback;
  }
  return fn(controller);
}

const typed = (type: ToastType) => (message: string, options?: ToastOptions) =>
  withController((c) => c.show({ ...options, message, type }), '');

type PromiseMessage<T> = string | ((value: T) => string);

const resolveMessage = <T,>(message: PromiseMessage<T>, value: T) =>
  typeof message === 'function' ? message(value) : message;

/** Show and hide toasts from anywhere: API clients, stores, navigation. Needs a mounted ToastProvider. */
export const toast = {
  show: (config: string | ToastConfig) => withController((c) => c.show(config), ''),
  success: typed('success'),
  error: typed('error'),
  warning: typed('warning'),
  info: typed('info'),
  hide: (id: string) => withController((c) => c.hide(id), undefined),
  hideAll: () => withController((c) => c.hideAll(), undefined),
  /**
   * Shows a loading toast until the promise settles, then turns it into a success or error toast.
   * Returns the original promise, so callers still handle the result or the error.
   */
  promise<T>(
    promise: Promise<T>,
    messages: { loading: string; success: PromiseMessage<T>; error: PromiseMessage<unknown> },
    options?: ToastOptions,
  ): Promise<T> {
    const id = toast.show({ ...options, message: messages.loading, type: 'loading', duration: Infinity });
    const settle = (type: ToastType, message: string) =>
      withController(
        (c) => c.update(id, { message, type, duration: options?.duration ?? c.defaults().duration }),
        undefined,
      );
    promise.then(
      (value) => settle('success', resolveMessage(messages.success, value)),
      (error) => settle('error', resolveMessage(messages.error, error)),
    );
    return promise;
  },
};
