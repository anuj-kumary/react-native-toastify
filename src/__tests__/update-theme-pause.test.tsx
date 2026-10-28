import React from 'react';
import * as ReactNative from 'react-native';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { toast, ToastProvider, type ToastProviderProps, useToast } from '..';

jest.useFakeTimers();

const HIDE_MS = 400;
const advance = (ms: number) => act(() => jest.advanceTimersByTime(ms));
const show = (fn: () => unknown) => act(() => void fn());

const renderProvider = (props: Partial<ToastProviderProps> = {}) =>
  render(<ToastProvider {...props}>{null}</ToastProvider>);

const flatStyle = (testID: string, index = 0) =>
  Object.assign({}, ...[screen.getAllByTestId(testID)[index].props.style].flat(Infinity));

describe('update and dedupe by id', () => {
  test('showing a toast with the id of one on screen updates it instead of adding another', () => {
    renderProvider();
    show(() => toast.error('Offline', { id: 'network' }));
    show(() => toast.error('Still offline', { id: 'network' }));

    expect(screen.getAllByTestId('toast')).toHaveLength(1);
    expect(screen.getByText('Still offline')).toBeTruthy();
    expect(screen.queryByText('Offline')).toBeNull();
  });

  test('the repeat restarts the countdown', () => {
    renderProvider();
    show(() => toast.error('Offline', { id: 'network', duration: 3000 }));
    advance(2000);
    show(() => toast.error('Offline', { id: 'network', duration: 3000 }));
    advance(2000);

    expect(screen.getByText('Offline')).toBeTruthy();
    advance(1000 + HIDE_MS);
    expect(screen.queryByText('Offline')).toBeNull();
  });

  test('toast.update changes a toast in place and restarts its countdown', () => {
    renderProvider();
    let id = '';
    show(() => (id = toast.info('Uploading 10%', { duration: 3000 })));
    advance(2000);
    show(() => toast.update(id, { message: 'Uploading 90%', type: 'success' }));

    expect(screen.getAllByTestId('toast')).toHaveLength(1);
    expect(screen.getByText('Uploading 90%')).toBeTruthy();
    expect(screen.getByText('✓')).toBeTruthy();

    advance(2000);
    expect(screen.getByText('Uploading 90%')).toBeTruthy();
    advance(1000 + HIDE_MS);
    expect(screen.queryByText('Uploading 90%')).toBeNull();
  });

  test('updating an unknown id does nothing', () => {
    renderProvider();
    show(() => toast.info('Untouched'));
    show(() => toast.update('missing', { message: 'Changed' }));

    expect(screen.getByText('Untouched')).toBeTruthy();
    expect(screen.queryByText('Changed')).toBeNull();
  });

  test('useToast exposes updateToast', () => {
    let api!: ReturnType<typeof useToast>;
    function Capture() {
      api = useToast();
      return null;
    }
    render(
      <ToastProvider>
        <Capture />
      </ToastProvider>,
    );

    let id = '';
    show(() => (id = api.showToast({ message: 'Before' })));
    show(() => api.updateToast(id, { message: 'After' }));
    expect(screen.getByText('After')).toBeTruthy();
  });
});

describe('themes', () => {
  test("'colored' (the default) fills the card with the type color", () => {
    renderProvider();
    show(() => toast.success('Colored'));
    expect(screen.getByTestId('toast')).toHaveStyle({ backgroundColor: '#4caf50' });
    expect(screen.getByText('Colored')).toHaveStyle({ color: '#fff' });
  });

  test("'dark' uses a dark card, light text and a colored accent", () => {
    renderProvider({ theme: 'dark' });
    show(() => toast.error('Dark'));
    expect(screen.getByTestId('toast')).toHaveStyle({
      backgroundColor: '#262626',
      borderLeftColor: '#f44336',
    });
    expect(screen.getByText('Dark')).toHaveStyle({ color: '#f5f5f5' });
    expect(screen.getByText('✕')).toHaveStyle({ color: '#f44336' });
  });

  test("'light' uses a white card and dark text", () => {
    renderProvider({ theme: 'light' });
    show(() => toast.info('Light'));
    expect(screen.getByTestId('toast')).toHaveStyle({
      backgroundColor: '#ffffff',
      borderLeftColor: '#2196f3',
    });
    expect(screen.getByText('Light')).toHaveStyle({ color: '#1f1f1f' });
  });

  test("'system' follows the device color scheme", () => {
    const scheme = jest.spyOn(ReactNative, 'useColorScheme').mockReturnValue('dark');
    renderProvider({ theme: 'system' });
    show(() => toast.info('Follows the device'));
    expect(screen.getByTestId('toast')).toHaveStyle({ backgroundColor: '#262626' });

    scheme.mockReturnValue('light');
    show(() => toast.info('Now light'));
    expect(screen.getAllByTestId('toast')[1]).toHaveStyle({ backgroundColor: '#ffffff' });
    scheme.mockRestore();
  });

  test('textStyle still wins over the theme', () => {
    renderProvider({ theme: 'dark' });
    show(() => toast.info('Custom color', { textStyle: { color: 'gold' } }));
    expect(screen.getByText('Custom color')).toHaveStyle({ color: 'gold' });
  });
});

describe('pause on press and hold', () => {
  test('holding a toast pauses its countdown, releasing resumes it', () => {
    renderProvider();
    show(() => toast.info('Hold me', { duration: 3000, dismissible: false, onPress: () => {} }));
    advance(1000);

    fireEvent(screen.getByText('Hold me'), 'pressIn');
    advance(10_000);
    expect(screen.getByText('Hold me')).toBeTruthy();

    fireEvent(screen.getByText('Hold me'), 'pressOut');
    advance(1900);
    expect(screen.getByText('Hold me')).toBeTruthy();
    advance(100 + HIDE_MS);
    expect(screen.queryByText('Hold me')).toBeNull();
  });

  test('the progress bar stops while held', () => {
    renderProvider();
    show(() =>
      toast.info('Progress', {
        duration: 2000,
        showProgress: true,
        dismissible: false,
        onPress: () => {},
      }),
    );
    advance(1000);

    fireEvent(screen.getByText('Progress'), 'pressIn');
    const held = parseFloat(flatStyle('toast-progress').width);
    advance(1000);
    expect(parseFloat(flatStyle('toast-progress').width)).toBeCloseTo(held, 0);
  });
});

describe('wide screens', () => {
  test('toasts are capped at maxWidth (480 by default) and centered', () => {
    renderProvider();
    show(() => toast.info('Wide'));

    expect(screen.getByTestId('toast-slot')).toHaveStyle({ width: '100%', maxWidth: 480 });
    expect(screen.getByTestId('toast-stack-bottom')).toHaveStyle({ alignItems: 'center' });
  });

  test('maxWidth can be changed', () => {
    renderProvider({ maxWidth: 600 });
    show(() => toast.info('Wider'));
    expect(screen.getByTestId('toast-slot')).toHaveStyle({ maxWidth: 600 });
  });
});
