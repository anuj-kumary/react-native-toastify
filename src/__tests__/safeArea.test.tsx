import React from 'react';
import { render, screen } from '@testing-library/react-native';

test('top and bottom stacks use react-native-safe-area-context insets when available', () => {
  const insets = { top: 59, bottom: 34, left: 0, right: 0 };
  jest.doMock(
    'react-native-safe-area-context',
    () => ({ SafeAreaInsetsContext: require('react').createContext(insets) }),
    { virtual: true },
  );
  const { ToastProvider } = require('..');

  render(<ToastProvider>{null}</ToastProvider>);

  expect(screen.getByTestId('toast-stack-top')).toHaveStyle({ top: 59 + 10 });
  expect(screen.getByTestId('toast-stack-bottom')).toHaveStyle({ bottom: 34 + 20 });
});
