import React from 'react';
import { AccessibilityInfo, Button } from 'react-native';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { ToastProvider, useToast, type ToastConfig } from '..';

jest.useFakeTimers();

// Duration + the 300 ms hide animation, with a little slack.
const afterDismiss = (duration: number) => duration + 400;

function Trigger({ toasts }: { toasts: ToastConfig[] }) {
  const { showToast } = useToast();
  return (
    <>
      {toasts.map((t, i) => (
        <Button key={i} title={`show-${i}`} onPress={() => showToast(t)} />
      ))}
    </>
  );
}

const renderWith = (toasts: ToastConfig[]) =>
  render(
    <ToastProvider>
      <Trigger toasts={toasts} />
    </ToastProvider>,
  );

const advance = (ms: number) => act(() => jest.advanceTimersByTime(ms));

test('a toast is dismissed after its own duration even when another toast is added', () => {
  renderWith([
    { message: 'first', duration: 3000 },
    { message: 'second', duration: 3000 },
  ]);

  fireEvent.press(screen.getByText('show-0'));
  advance(2000);
  fireEvent.press(screen.getByText('show-1'));
  advance(afterDismiss(1000));

  expect(screen.queryByText('first')).toBeNull();
  expect(screen.getByText('second')).toBeTruthy();

  advance(2000);
  expect(screen.queryByText('second')).toBeNull();
});

test('toasts with different durations dismiss independently, not in sequence', () => {
  renderWith([
    { message: 'long', duration: 5000 },
    { message: 'short', duration: 1000 },
  ]);

  fireEvent.press(screen.getByText('show-0'));
  fireEvent.press(screen.getByText('show-1'));
  advance(afterDismiss(1000));

  expect(screen.queryByText('short')).toBeNull();
  expect(screen.getByText('long')).toBeTruthy();
});

test('top and bottom toasts go into separate stacks', () => {
  renderWith([
    { message: 'bottom-1', position: 'bottom' },
    { message: 'bottom-2', position: 'bottom' },
    { message: 'top-1', position: 'top' },
  ]);

  ['show-0', 'show-1', 'show-2'].forEach((label) => fireEvent.press(screen.getByText(label)));

  expect(screen.getByTestId('toast-stack-top')).toHaveTextContent(/top-1/);
  expect(screen.getByTestId('toast-stack-top')).not.toHaveTextContent(/bottom/);
  expect(screen.getByTestId('toast-stack-bottom')).toHaveTextContent(/bottom-1.*bottom-2/);
});

test('top toasts clear the status bar when react-native-safe-area-context is missing', () => {
  renderWith([]);
  expect(screen.getByTestId('toast-stack-top')).toHaveStyle({ top: 44 + 10 });
});

test('a toast is announced to screen readers', () => {
  const announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility');
  renderWith([{ message: 'Saved', type: 'success' }]);

  fireEvent.press(screen.getByText('show-0'));

  expect(screen.getByRole('alert')).toHaveTextContent(/Saved/);
  expect(announce).toHaveBeenCalledWith('Saved');
});

test('the positional shorthand applies the defaults', () => {
  function Shorthand() {
    const { showToast } = useToast();
    return <Button title="go" onPress={() => showToast('Oops', 'error', 5000, 'top')} />;
  }
  render(
    <ToastProvider>
      <Shorthand />
    </ToastProvider>,
  );

  fireEvent.press(screen.getByText('go'));
  expect(screen.getByTestId('toast-stack-top')).toHaveTextContent(/Oops/);
  advance(afterDismiss(3000));
  expect(screen.getByText('Oops')).toBeTruthy();
  advance(2000);
  expect(screen.queryByText('Oops')).toBeNull();
});

test('useToast throws outside a ToastProvider', () => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  expect(() => render(<Trigger toasts={[]} />)).toThrow(
    'useToast must be used within a ToastProvider',
  );
});
