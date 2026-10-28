import React from 'react';
import { Text } from 'react-native';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { toast, ToastProvider, ToastProviderProps, useToast } from '..';

jest.useFakeTimers();

const HIDE_MS = 400;
const advance = (ms: number) => act(() => jest.advanceTimersByTime(ms));
const show = (fn: () => unknown) => act(() => void fn());

const renderProvider = (props: Partial<ToastProviderProps> = {}) =>
  render(<ToastProvider {...props}>{null}</ToastProvider>);

describe('dismissing', () => {
  test('tapping a toast dismisses it', () => {
    renderProvider();
    show(() => toast.info('tap me'));

    fireEvent.press(screen.getByText('tap me'));
    advance(HIDE_MS);

    expect(screen.queryByText('tap me')).toBeNull();
  });

  test('a toast with dismissible: false ignores taps', () => {
    renderProvider();
    show(() => toast.info('sticky', { dismissible: false }));

    fireEvent.press(screen.getByText('sticky'));
    advance(HIDE_MS);

    expect(screen.getByText('sticky')).toBeTruthy();
  });

  test('duration: Infinity keeps a toast until it is hidden', () => {
    renderProvider();
    let id = '';
    show(() => (id = toast.info('forever', { duration: Infinity })));

    advance(60_000);
    expect(screen.getByText('forever')).toBeTruthy();

    show(() => toast.hide(id));
    advance(HIDE_MS);
    expect(screen.queryByText('forever')).toBeNull();
  });

  test('hideAll dismisses every toast', () => {
    renderProvider();
    show(() => toast.info('one', { duration: Infinity }));
    show(() => toast.error('two', { duration: Infinity, position: 'top' }));

    show(() => toast.hideAll());
    advance(HIDE_MS);

    expect(screen.queryByText('one')).toBeNull();
    expect(screen.queryByText('two')).toBeNull();
  });

  test('useToast returns the id from showToast and can hide it', () => {
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
    show(() => (id = api.showToast({ message: 'by id', duration: Infinity })));
    expect(id).toMatch(/\w+/);

    show(() => api.hideToast(id));
    advance(HIDE_MS);
    expect(screen.queryByText('by id')).toBeNull();
  });
});

describe('content', () => {
  test('title and message both render', () => {
    renderProvider();
    show(() => toast.success('Your changes are live', { title: 'Saved' }));

    expect(screen.getByText('Saved')).toBeTruthy();
    expect(screen.getByText('Your changes are live')).toBeTruthy();
  });

  test('pressing the action calls it and dismisses the toast', () => {
    const onUndo = jest.fn();
    renderProvider();
    show(() => toast.info('Message deleted', { action: { label: 'Undo', onPress: onUndo } }));

    fireEvent.press(screen.getByRole('button', { name: 'Undo' }));
    advance(HIDE_MS);

    expect(onUndo).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Message deleted')).toBeNull();
  });

  test('a custom icon replaces the default one, and null hides it', () => {
    renderProvider();
    show(() => toast.success('custom', { icon: '🎉' }));
    show(() => toast.success('element', { icon: <Text>★</Text> }));
    show(() => toast.success('none', { icon: null }));

    expect(screen.getByText('🎉')).toBeTruthy();
    expect(screen.getByText('★')).toBeTruthy();
    // Only the three toasts above render text icons; none of them should use the default checkmark.
    expect(screen.queryByText('✓')).toBeNull();
  });
});

describe('toast.promise', () => {
  test('shows loading, then the success message, then auto-dismisses', async () => {
    renderProvider({ duration: 2000 });
    let resolve!: (value: string) => void;
    const promise = new Promise<string>((r) => (resolve = r));

    show(() => toast.promise(promise, { loading: 'Saving…', success: (name) => `Saved ${name}`, error: 'Failed' }));
    advance(10_000);
    expect(screen.getByText('Saving…')).toBeTruthy();

    await act(async () => resolve('report.pdf'));
    expect(screen.getByText('Saved report.pdf')).toBeTruthy();

    advance(2000 + HIDE_MS);
    expect(screen.queryByText('Saved report.pdf')).toBeNull();
  });

  test('shows the error message when the promise rejects, and returns the original promise', async () => {
    renderProvider();
    const failing = Promise.reject(new Error('offline'));

    let returned!: Promise<unknown>;
    show(() => (returned = toast.promise(failing, { loading: 'Saving…', success: 'Saved', error: (e) => `Failed: ${(e as Error).message}` })));
    await act(async () => {
      await expect(returned).rejects.toThrow('offline');
    });

    expect(screen.getByText('Failed: offline')).toBeTruthy();
  });
});

describe('ToastProvider defaults', () => {
  test('duration and position props apply to toasts that do not set them', () => {
    renderProvider({ duration: 1000, position: 'top' });
    show(() => toast.info('defaults'));

    expect(screen.getByTestId('toast-stack-top')).toHaveTextContent(/defaults/);
    advance(1000 + HIDE_MS);
    expect(screen.queryByText('defaults')).toBeNull();
  });

  test('max dismisses the oldest toast in that position', () => {
    renderProvider({ max: 2 });
    show(() => toast.info('a', { duration: Infinity }));
    show(() => toast.info('b', { duration: Infinity }));
    show(() => toast.info('c', { duration: Infinity }));
    show(() => toast.info('top', { duration: Infinity, position: 'top' }));
    advance(HIDE_MS);

    expect(screen.queryByText('a')).toBeNull();
    expect(screen.getByText('b')).toBeTruthy();
    expect(screen.getByText('c')).toBeTruthy();
    expect(screen.getByText('top')).toBeTruthy();
  });

  test('offset moves the stacks away from the edges', () => {
    renderProvider({ offset: { top: 30, bottom: 50 } });

    expect(screen.getByTestId('toast-stack-top')).toHaveStyle({ top: 44 + 30 });
    expect(screen.getByTestId('toast-stack-bottom')).toHaveStyle({ bottom: 0 + 50 });
  });
});

test('calling toast without a mounted provider warns and returns an empty id', () => {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

  expect(toast.success('nobody listening')).toBe('');
  expect(warn).toHaveBeenCalledWith(expect.stringContaining('no <ToastProvider> is mounted'));
});
