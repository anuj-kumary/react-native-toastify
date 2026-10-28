# 🚀 React Native Toastify Expo – Beautiful Toast Notifications for React Native & Expo

**react-native-toastify-expo** is a lightweight, customizable toast notification library for **React Native** and **Expo** apps. With cross-platform support, smooth animations, and full styling control, it's the easiest way to show success, error, or info toasts in your React Native project.

[![CI](https://github.com/anuj-kumary/react-native-toastify/actions/workflows/ci.yml/badge.svg)](https://github.com/anuj-kumary/react-native-toastify/actions/workflows/ci.yml) [![license](https://img.shields.io/npm/l/react-native-toastify-expo.svg)](LICENSE) [![npm version](https://img.shields.io/npm/v/react-native-toastify-expo.svg)](https://www.npmjs.com/package/react-native-toastify-expo)

---

## 📱 Demo

### iOS  
![iOS Demo](https://raw.githubusercontent.com/anuj-kumary/react-native-toastify/main/assets/ios-demo.gif)

### Android  
![Android Demo](https://raw.githubusercontent.com/anuj-kumary/react-native-toastify/main/assets/android-demo.gif)

---

## ✨ Features

- 🎨 **Four built-in types**: `success`, `error`, `warning` and `info`, each with its own color and icon
- 🖌️ **Fully stylable**: override the container and text styles per toast
- ⚡ **Smooth animations**: fade and slide in/out using the native driver
- ⏱️ **Auto-dismiss**: set how long each toast stays on screen
- 📚 **Stacking**: several toasts can be on screen at once
- 🎯 **Top or bottom placement**
- 🛠️ **TypeScript**: type definitions included
- 🪶 **Zero dependencies**: only `react` and `react-native` as peer dependencies
- 📱 Works with **Expo** and bare **React Native**, on iOS and Android

---

## 📦 Installation

```bash
npm install react-native-toastify-expo
# or
yarn add react-native-toastify-expo
```

No native code, so there's no linking or `pod install`. It works in Expo Go.

## 🚀 Quick start

1. Wrap your app in `ToastProvider` once, near the root:

```jsx
import { ToastProvider } from 'react-native-toastify-expo';

export default function App() {
  return (
    <ToastProvider>
      <YourApp />
    </ToastProvider>
  );
}
```

2. Call `showToast` from any component inside it:

```jsx
import { Button } from 'react-native';
import { useToast } from 'react-native-toastify-expo';

export function SaveButton() {
  const { showToast } = useToast();

  return (
    <Button
      title="Save"
      onPress={() => showToast({ message: 'Saved!', type: 'success' })}
    />
  );
}
```

## 📖 API

### `showToast(options)`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `message` | `string` | **required** | Text to show |
| `type` | `'success' \| 'error' \| 'warning' \| 'info'` | `'info'` | Sets the color and icon |
| `duration` | `number` | `3000` | Milliseconds before the toast auto-dismisses |
| `position` | `'top' \| 'bottom'` | `'bottom'` | Where the toast appears |
| `textStyle` | `TextStyle` | none | Merged into the message text style |
| `containerStyle` | `ViewStyle` | none | Merged into the toast container style |

### `showToast(message, type?, duration?, position?)`

A shorthand with the same defaults:

```js
showToast('Something went wrong', 'error', 5000, 'top');
```

### Exports

| Export | Description |
|--------|-------------|
| `ToastProvider` | Context provider that renders the toasts. Wrap your app in it once. |
| `useToast()` | Returns `{ showToast }`. Throws if used outside `ToastProvider`. |
| `Toast` | The toast component itself, if you want to render one yourself |
| `ToastType`, `ToastConfig`, `ToastProps` | TypeScript types |

## 🎨 Examples

### Every type

```jsx
showToast({ message: 'Data saved successfully!', type: 'success' });
showToast({ message: 'Failed to save data', type: 'error', duration: 5000, position: 'top' });
showToast({ message: 'Please check your input', type: 'warning' });
showToast({ message: 'New update available', type: 'info' });
```

### Custom styling

```jsx
showToast({
  message: 'Custom styled toast',
  type: 'info',
  position: 'top',
  textStyle: { fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  containerStyle: { backgroundColor: '#9c27b0', borderRadius: 20, padding: 20 },
});

// Minimal light toast
showToast({
  message: 'Minimal design toast',
  type: 'warning',
  textStyle: { fontSize: 14, color: '#333' },
  containerStyle: {
    backgroundColor: '#fff',
    borderRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#ff9800',
  },
});
```

### Default styles

| Type | Background | Icon |
|------|------------|------|
| `success` | `#4caf50` | ✓ |
| `error` | `#f44336` | ✕ |
| `warning` | `#ff9800` | ⚠ |
| `info` | `#2196f3` | ℹ |

Text is white at 16px. The container has an 8px border radius, 15px padding and a light shadow. `textStyle` and `containerStyle` are merged on top of these, so you only pass what you want to change.

## ✅ Requirements

- React >= 16.8 (hooks)
- React Native >= 0.60, or any Expo SDK
- Optional: [`react-native-safe-area-context`](https://github.com/AppAndFlow/react-native-safe-area-context). Expo and the React Native template already include it. When it's installed and your app is wrapped in a `SafeAreaProvider`, top toasts sit just below the notch or Dynamic Island, and bottom toasts sit just above the home indicator. Without it, top toasts are offset by the status bar height.

## Contributing

Contributions are welcome! Please read the [contributing guide](CONTRIBUTING.md) and the [code of conduct](CODE_OF_CONDUCT.md) before opening a pull request. Report security issues privately as described in [SECURITY.md](SECURITY.md).

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
