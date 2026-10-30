import React from 'react';
import { Modal, View } from 'react-native';
import { act, render, screen, within } from '@testing-library/react-native';
import { toast, ToastHost, ToastProvider } from '..';

jest.useFakeTimers();

const show = (fn: () => unknown) => act(() => void fn());

function App({ outer = false, inner = false }) {
  return (
    <ToastProvider>
      <View testID="screen" />
      <Modal visible={outer}>
        <View testID="outer-modal">
          <ToastHost />
          <Modal visible={inner}>
            <View testID="inner-modal">
              <ToastHost />
            </View>
          </Modal>
        </View>
      </Modal>
    </ToastProvider>
  );
}

test('without a host, toasts render at the root, outside any modal', () => {
  render(<App />);
  show(() => toast.info('At the root'));

  expect(screen.getByText('At the root')).toBeTruthy();
  expect(screen.queryByTestId('outer-modal')).toBeNull();
});

test('while a modal with a ToastHost is open, toasts render inside it, and back at the root once it closes', () => {
  const { rerender } = render(<App outer />);
  show(() => toast.info('In the modal', { duration: Infinity }));

  expect(within(screen.getByTestId('outer-modal')).getByText('In the modal')).toBeTruthy();
  expect(screen.getAllByTestId('toast-layer')).toHaveLength(1);

  rerender(<App />);
  expect(screen.getByText('In the modal')).toBeTruthy();
  expect(screen.getAllByTestId('toast-layer')).toHaveLength(1);
});

test('the newest host wins, and closing it hands toasts back to the previous one', () => {
  const { rerender } = render(<App outer inner />);
  show(() => toast.info('Nested', { duration: Infinity }));

  expect(within(screen.getByTestId('inner-modal')).getByText('Nested')).toBeTruthy();
  expect(screen.getAllByTestId('toast-layer')).toHaveLength(1);

  rerender(<App outer />);
  expect(within(screen.getByTestId('outer-modal')).getByText('Nested')).toBeTruthy();
  expect(screen.getAllByTestId('toast-layer')).toHaveLength(1);
});

test('ToastHost outside a ToastProvider throws a clear error', () => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  expect(() => render(<ToastHost />)).toThrow('ToastHost must be used within a ToastProvider');
});
