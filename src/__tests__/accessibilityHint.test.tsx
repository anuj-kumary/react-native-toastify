import React from 'react';
import { act, render, screen } from '@testing-library/react-native';
import { toast, ToastProvider, type ToastProviderProps } from '..';

jest.useFakeTimers();

const renderProvider = (props: Partial<ToastProviderProps> = {}) =>
  render(<ToastProvider {...props}>{null}</ToastProvider>);
const show = (fn: () => unknown) => act(() => void fn());

test('dismissible toasts keep the English hint by default', () => {
  renderProvider();
  show(() => toast.success('Saved'));
  expect(screen.getByRole('alert').props.accessibilityHint).toBe('Double tap to dismiss');
});

test('the provider supplies a translated dismiss hint', () => {
  renderProvider({ accessibilityHint: 'Toca dos veces para cerrar' });
  show(() => toast.success('Guardado'));
  expect(screen.getByRole('alert').props.accessibilityHint).toBe('Toca dos veces para cerrar');
});

test.each(['Touchez deux fois pour fermer', ''])(
  'a toast hint %j overrides the provider',
  (hint) => {
    renderProvider({ accessibilityHint: 'Toca dos veces para cerrar' });
    show(() => toast.success('Enregistré', { accessibilityHint: hint }));
    expect(screen.getByRole('alert').props.accessibilityHint).toBe(hint);
  },
);

test('a per-toast hint works without a provider default and can be updated', () => {
  renderProvider();
  let id = '';
  show(() => (id = toast.info('Saved', { accessibilityHint: 'Toca dos veces para cerrar' })));
  expect(screen.getByRole('alert').props.accessibilityHint).toBe('Toca dos veces para cerrar');
  show(() => toast.update(id, { accessibilityHint: 'Touchez deux fois pour fermer' }));
  expect(screen.getByRole('alert').props.accessibilityHint).toBe('Touchez deux fois pour fermer');
});

test('a provider locale change updates the hint of a visible toast', () => {
  const { rerender } = renderProvider({ accessibilityHint: 'Toca dos veces para cerrar' });
  show(() => toast.info('Saved'));
  rerender(<ToastProvider accessibilityHint="Touchez deux fois pour fermer">{null}</ToastProvider>);
  expect(screen.getByRole('alert').props.accessibilityHint).toBe('Touchez deux fois pour fermer');
});

test('non-dismissible toasts do not announce a dismiss hint', () => {
  renderProvider({ accessibilityHint: 'Toca dos veces para cerrar' });
  show(() =>
    toast.info('Working', {
      dismissible: false,
      accessibilityHint: 'Touchez deux fois pour fermer',
    }),
  );
  expect(screen.getByRole('alert').props.accessibilityHint).toBeUndefined();
});
