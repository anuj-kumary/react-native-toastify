# Welcome to your Expo app 👋
=======
# React Native Awesome Toastify

A beautiful and customizable toast notification component for React Native applications.

## Features

- 🎨 Multiple toast types (success, error, warning, info)
- 📱 Fully customizable styles
- 🔄 Smooth animations
- 📍 Configurable positions (top, bottom)
- ⚡ Easy to use
- 🎯 TypeScript support

## Installation

```bash
npm install react-native-awesome-toastify @expo/vector-icons
# or
yarn add react-native-awesome-toastify @expo/vector-icons
```

## Usage

1. Wrap your app with the ToastProvider:

```jsx
import { ToastProvider } from 'react-native-awesome-toastify';

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
import { useToast } from 'react-native-awesome-toastify';

export const MyComponent = () => {
  const { showToast } = useToast();

  return (
    <Button 
      title="Show Toast"
      onPress={() => showToast('Hello World!', 'success')}
    />
  );
};
```

## API

### ToastProvider Props

The ToastProvider component accepts children and wraps your application.

### useToast Hook

Returns an object with the following method:

- `showToast(message: string | ToastConfig, type?: ToastType)`

### Toast Types

- 'success'
- 'error'
- 'warning'
- 'info'

### Toast Configuration

You can customize the toast by passing a configuration object:

```jsx
showToast({
  message: 'Custom Toast',
  type: 'success',
  duration: 3000,
  position: 'top',
  textStyle: { fontSize: 16 },
  containerStyle: { borderRadius: 10 }
});
```
