# React Native Toastify Expo

A beautiful and customizable toast notification component for React Native applications, built for Expo and React Native.

### iOS Demo

https://github.com/user-attachments/assets/82862979-f5db-4d84-8782-a32530a84542

### Android Demo


https://github.com/user-attachments/assets/84b0eb72-7d81-4952-86f3-c0f7460922c6



## Features

- 🎨 Multiple toast types (success, error, warning, info)
- 📱 Fully customizable styles
- 🔄 Smooth animations
- 📍 Configurable positions (top, bottom)
- ⚡ Easy to use
- 🎯 TypeScript support
- 📦 Zero dependencies (only React Native peer dependencies)

## Installation

```bash
npm install react-native-toastify-expo
# or
yarn add react-native-toastify-expo
```

## Quick Start

1. Wrap your app with the ToastProvider:

```jsx
import React from 'react';
import { ToastProvider } from 'react-native-toastify-expo';

export default function App() {
  return (
    <ToastProvider>
      <YourApp />
    </ToastProvider>
  );
}
```

2. Use the useToast hook in your components:

```jsx
import React from 'react';
import { View, Button } from 'react-native';
import { useToast } from 'react-native-toastify-expo';

export const MyComponent = () => {
  const { showToast } = useToast();

  return (
    <View>
      <Button 
        title="Show Success Toast"
        onPress={() => showToast('Operation completed successfully!', 'success')}
      />
      <Button 
        title="Show Error Toast"
        onPress={() => showToast('Something went wrong!', 'error')}
      />
    </View>
  );
};
```

## API Reference

### ToastProvider

The ToastProvider component wraps your application and provides the toast context.

```jsx
import { ToastProvider } from 'react-native-toastify-expo';

<ToastProvider>
  <YourApp />
</ToastProvider>
```

### useToast Hook

Returns an object with the following method:

#### `showToast(message: string | ToastConfig, type?: ToastType)`

Shows a toast notification.

**Parameters:**
- `message` (string | ToastConfig): The message to display or a configuration object
- `type` (ToastType, optional): The type of toast ('success', 'error', 'warning', 'info')

**Returns:** void

### Toast Types

- `'success'` - Green background with checkmark icon
- `'error'` - Red background with X icon
- `'warning'` - Orange background with warning icon
- `'info'` - Blue background with info icon

### Toast Configuration

You can customize the toast by passing a configuration object:

```jsx
showToast({
  message: 'Custom Toast Message',
  type: 'success',
  duration: 5000, // Duration in milliseconds (default: 3000)
  position: 'top', // 'top' or 'bottom' (default: 'bottom')
  textStyle: { fontSize: 18, fontWeight: 'bold' },
  containerStyle: { borderRadius: 12, marginHorizontal: 20 }
});
```

### ToastConfig Interface

```typescript
interface ToastConfig {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  position?: 'top' | 'bottom';
  textStyle?: object;
  containerStyle?: object;
}
```

## Examples

### Basic Usage

```jsx
import { useToast } from 'react-native-toastify-expo';

const MyComponent = () => {
  const { showToast } = useToast();

  const handleSuccess = () => {
    showToast('Data saved successfully!', 'success');
  };

  const handleError = () => {
    showToast('Failed to save data!', 'error');
  };

  const handleWarning = () => {
    showToast('Please check your input!', 'warning');
  };

  const handleInfo = () => {
    showToast('New update available!', 'info');
  };

  return (
    <View>
      <Button title="Success" onPress={handleSuccess} />
      <Button title="Error" onPress={handleError} />
      <Button title="Warning" onPress={handleWarning} />
      <Button title="Info" onPress={handleInfo} />
    </View>
  );
};
```

### Advanced Configuration

```jsx
const { showToast } = useToast();

// Custom duration and position
showToast({
  message: 'This toast will appear at the top for 5 seconds',
  type: 'info',
  duration: 5000,
  position: 'top'
});

// Custom styling
showToast({
  message: 'Custom styled toast',
  type: 'success',
  textStyle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  containerStyle: {
    borderRadius: 20,
    paddingHorizontal: 25,
    paddingVertical: 20
  }
});
```

## Styling

The toast component uses React Native's StyleSheet for styling. You can customize the appearance by passing `textStyle` and `containerStyle` props.

### Default Styles

- **Background Colors:**
  - Success: `#4caf50`
  - Error: `#f44336`
  - Warning: `#ff9800`
  - Info: `#2196f3`
- **Text Color:** White
- **Border Radius:** 8px
- **Padding:** 15px
- **Shadow:** Subtle elevation/shadow for depth

## Requirements

- React Native >= 0.60.0
- React >= 16.8.0

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
