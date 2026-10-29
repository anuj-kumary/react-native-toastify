import React from 'react';
import { Keyboard, Pressable, Text } from 'react-native';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { toast, ToastProvider, type ToastProviderProps } from '..';

jest.useFakeTimers();

const HIDE_MS = 400;
const advance = (ms: number) => act(() => jest.advanceTimersByTime(ms));
const show = (fn: () => unknown) => act(() => void fn());

const renderProvider = (props: Partial<ToastProviderProps> = {}) =>
  render(<ToastProvider {...props}>{null}</ToastProvider>);

describe('callbacks', () => {
  test('onPress runs on tap, then the toast dismisses', () => {
    const onPress = jest.fn();
    renderProvider();
    show(() => toast.info('Open details', { onPress }));

    fireEvent.press(screen.getByText('Open details'));
    advance(HIDE_MS);

    expect(onPress).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Open details')).toBeNull();
  });

  test('onPress still runs when the toast is not dismissible, and the toast stays', () => {
    const onPress = jest.fn();
    renderProvider();
    show(() => toast.info('Sticky link', { onPress, dismissible: false }));

    fireEvent.press(screen.getByText('Sticky link'));
    advance(HIDE_MS);

    expect(onPress).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Sticky link')).toBeTruthy();
  });

  test('onShow fires after the enter animation and onHide after dismissal', () => {
    const onShow = jest.fn();
    const onHide = jest.fn();
    renderProvider();
    show(() => toast.success('Lifecycle', { duration: 1000, onShow, onHide }));

    expect(onShow).not.toHaveBeenCalled();
    advance(HIDE_MS);
    expect(onShow).toHaveBeenCalledTimes(1);
    expect(onHide).not.toHaveBeenCalled();

    advance(1000);
    expect(onHide).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Lifecycle')).toBeNull();
  });
});

describe('keyboard avoidance', () => {
  // Capture the provider's keyboard listeners so the test can fire them.
  const listeners: Record<string, (e?: unknown) => void> = {};
  beforeEach(() => {
    jest.spyOn(Keyboard, 'addListener').mockImplementation((event, cb) => {
      listeners[event] = cb as (e?: unknown) => void;
      return { remove: jest.fn() } as never;
    });
  });
  afterEach(() => jest.restoreAllMocks());

  // A 390x844 screen with a 300 pt keyboard: its top edge is at y = 544.
  const SCREEN = 844;
  const KEYBOARD = 300;
  const layout = (height: number) =>
    fireEvent(screen.getByTestId('toast-layer'), 'layout', {
      nativeEvent: { layout: { x: 0, y: 0, width: 390, height } },
    });
  const keyboardShows = () =>
    act(() =>
      listeners.keyboardWillShow({
        endCoordinates: { screenX: 0, screenY: SCREEN - KEYBOARD, width: 390, height: KEYBOARD },
      }),
    );
  const bottomStack = () => screen.getByTestId('toast-stack-bottom');

  test('iOS and edge-to-edge Android: the keyboard covers the layer, so toasts move above it', () => {
    renderProvider();
    layout(SCREEN);
    expect(bottomStack()).toHaveStyle({ bottom: 20 });

    keyboardShows();
    expect(bottomStack()).toHaveStyle({ bottom: KEYBOARD + 20 });

    act(() => listeners.keyboardWillHide());
    expect(bottomStack()).toHaveStyle({ bottom: 20 });
  });

  test('Android adjustResize: the layer already shrank above the keyboard, so toasts are not lifted twice', () => {
    renderProvider();
    layout(SCREEN);

    // The window resize can arrive before or after the keyboard event.
    keyboardShows();
    layout(SCREEN - KEYBOARD);
    expect(bottomStack()).toHaveStyle({ bottom: 20 });

    act(() => listeners.keyboardWillHide());
    layout(SCREEN);
    expect(bottomStack()).toHaveStyle({ bottom: 20 });

    layout(SCREEN - KEYBOARD);
    keyboardShows();
    expect(bottomStack()).toHaveStyle({ bottom: 20 });
  });

  test('a keyboard event with screenY 0 (iOS cross-fade transitions) is ignored', () => {
    renderProvider();
    layout(SCREEN);
    act(() =>
      listeners.keyboardWillShow({
        endCoordinates: { screenX: 0, screenY: 0, width: 0, height: 0 },
      }),
    );
    expect(bottomStack()).toHaveStyle({ bottom: 20 });
  });

  test('avoidKeyboard={false} does not listen to the keyboard', () => {
    renderProvider({ avoidKeyboard: false });
    expect(Keyboard.addListener).not.toHaveBeenCalled();
  });
});

describe('custom types and layouts', () => {
  test('types registers a custom type with its own color and icon', () => {
    renderProvider({ types: { upload: { backgroundColor: '#6200ee', icon: '⬆' } } });
    show(() => toast.show({ message: 'Uploading photo', type: 'upload' }));

    expect(screen.getByText('⬆')).toBeTruthy();
    expect(screen.getByTestId('toast')).toHaveStyle({ backgroundColor: '#6200ee' });
  });

  test('types can restyle a built-in type', () => {
    renderProvider({ types: { success: { backgroundColor: '#00796b' } } });
    show(() => toast.success('Restyled'));

    expect(screen.getByText('✓')).toBeTruthy();
    expect(screen.getByTestId('toast')).toHaveStyle({ backgroundColor: '#00796b' });
  });

  test('render replaces the layout and can dismiss the toast', () => {
    renderProvider();
    show(() =>
      toast.info('ignored by the layout', {
        title: 'Custom',
        render: ({ title, message, hide }) => (
          <Pressable onPress={hide} accessibilityRole="button">
            <Text>{`${title}: ${message.toUpperCase()}`}</Text>
          </Pressable>
        ),
      }),
    );

    expect(screen.getByText('Custom: IGNORED BY THE LAYOUT')).toBeTruthy();
    expect(screen.queryByText('ℹ')).toBeNull();

    fireEvent.press(screen.getByRole('button'));
    advance(HIDE_MS);
    expect(screen.queryByText('Custom: IGNORED BY THE LAYOUT')).toBeNull();
  });

  test("the provider's render is the default layout, and a toast's own render wins", () => {
    renderProvider({ render: ({ message }) => <Text>{`[app] ${message}`}</Text> });
    show(() => toast.success('default layout'));
    show(() =>
      toast.success('own layout', { render: ({ message }) => <Text>{`[own] ${message}`}</Text> }),
    );

    expect(screen.getByText('[app] default layout')).toBeTruthy();
    expect(screen.getByText('[own] own layout')).toBeTruthy();
  });
});

describe('progress bar', () => {
  const widthPercent = () => {
    const style = Object.assign(
      {},
      ...[screen.getByTestId('toast-progress').props.style].flat(Infinity),
    );
    return parseFloat(style.width);
  };

  test('counts down over the duration', () => {
    renderProvider();
    show(() => toast.info('Counting down', { duration: 2000, showProgress: true }));

    expect(widthPercent()).toBeCloseTo(100, 0);
    advance(500);
    expect(widthPercent()).toBeCloseTo(75, 0);
    advance(500);
    expect(widthPercent()).toBeCloseTo(50, 0);
  });

  test('is off by default, on for every toast with the provider prop, and skipped for Infinity', () => {
    const { unmount } = renderProvider();
    show(() => toast.info('No bar'));
    expect(screen.queryByTestId('toast-progress')).toBeNull();
    unmount();

    renderProvider({ showProgress: true });
    show(() => toast.info('Bar'));
    expect(screen.getByTestId('toast-progress')).toBeTruthy();

    show(() => toast.hideAll());
    advance(HIDE_MS);
    show(() => toast.info('Forever', { duration: Infinity }));
    expect(screen.queryByTestId('toast-progress')).toBeNull();
  });
});
