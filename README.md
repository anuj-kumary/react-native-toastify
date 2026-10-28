# 🚀 React Native Toastify Expo – Beautiful Toast Notifications for React Native & Expo

**react-native-toastify-expo** is a lightweight, customizable toast notification library for **React Native** and **Expo** apps. With cross-platform support, smooth animations, and full styling control, it's the easiest way to show success, error, or info toasts in your React Native project.

[![CI](https://github.com/anuj-kumary/react-native-toastify/actions/workflows/ci.yml/badge.svg)](https://github.com/anuj-kumary/react-native-toastify/actions/workflows/ci.yml) [![license](https://img.shields.io/npm/l/react-native-toastify-expo.svg)](LICENSE) [![npm version](https://img.shields.io/npm/v/react-native-toastify-expo.svg)](https://www.npmjs.com/package/react-native-toastify-expo)

▶️ **[Try it live in Expo Snack](https://snack.expo.dev/@git/github.com/anuj-kumary/react-native-toastify:example)**: runs in your browser, or on your phone with Expo Go.

---

## 📱 Demo

### iOS  
![iOS Demo](https://raw.githubusercontent.com/anuj-kumary/react-native-toastify/main/assets/ios-demo.gif)

### Android  
![Android Demo](https://raw.githubusercontent.com/anuj-kumary/react-native-toastify/main/assets/android-demo.gif)

---

## ✨ Features

- 🎨 **Built-in types**: `success`, `error`, `warning`, `info` and `loading`, each with its own color and icon
- 🌍 **Call it from anywhere**: `toast.success('Saved')` works in API clients, stores and navigation code, not just components
- ⏳ **Promise toasts**: show a spinner until a request finishes, then switch to success or error
- 👆 **Tap or swipe to dismiss**, or dismiss in code with `toast.hide(id)` / `toast.hideAll()`
- 🔘 **Titles and action buttons**, for example "Undo"
- 🖼️ **Custom icons**: any emoji, string or React element
- ⚙️ **Provider defaults**: set duration, position, max visible toasts and offsets once
- 📐 **Safe-area aware**: clears the notch and the home indicator
- ♿ **Accessible**: announced by VoiceOver and TalkBack
- ⚡ **Smooth animations** using the native driver
- 🛠️ **TypeScript** types included, 🪶 **zero dependencies**
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

2. Show a toast from anywhere:

```jsx
import { toast } from 'react-native-toastify-expo';

toast.success('Saved!');
toast.error('Something went wrong', { position: 'top' });
```

You can also use the hook inside components: `const { showToast } = useToast();`.

## 📖 API

### `toast`

Works anywhere in your app once a `ToastProvider` is mounted: in components, API clients, stores and navigation code.

| Method | Returns | Description |
|--------|---------|-------------|
| `toast.success(message, options?)` | `id` | Green toast with a ✓ icon |
| `toast.error(message, options?)` | `id` | Red toast with a ✕ icon |
| `toast.warning(message, options?)` | `id` | Orange toast with a ⚠ icon |
| `toast.info(message, options?)` | `id` | Blue toast with an ℹ icon |
| `toast.show(options)` | `id` | Any type, set through `options.type` |
| `toast.promise(promise, messages, options?)` | `promise` | Shows a loading toast, then the success or error message |
| `toast.hide(id)` | | Dismisses one toast |
| `toast.hideAll()` | | Dismisses every toast |

### Toast options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `message` | `string` | **required** | Text to show |
| `type` | `'success' \| 'error' \| 'warning' \| 'info' \| 'loading'` | `'info'` | Sets the color and icon |
| `title` | `string` | none | Bold first line above the message |
| `duration` | `number` | `3000` (or the provider's `duration`) | Milliseconds before auto-dismiss. `Infinity` keeps the toast until it's dismissed. |
| `position` | `'top' \| 'bottom'` | `'bottom'` (or the provider's `position`) | Where the toast appears |
| `action` | `{ label: string, onPress: () => void }` | none | Button on the toast. Pressing it also dismisses the toast. |
| `icon` | `ReactNode` | the type's icon | Custom icon: a string, emoji or element. `null` hides it. |
| `dismissible` | `boolean` | `true` | Tap or swipe sideways to dismiss |
| `textStyle` | `TextStyle` | none | Merged into the title and message text style |
| `containerStyle` | `ViewStyle` | none | Merged into the toast container style |

### `<ToastProvider>` props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `duration` | `number` | `3000` | Default auto-dismiss time |
| `position` | `'top' \| 'bottom'` | `'bottom'` | Default position |
| `max` | `number` | unlimited | Most toasts visible per position. When a new toast would exceed it, the oldest is dismissed. |
| `offset` | `{ top?: number, bottom?: number }` | `{ top: 10, bottom: 20 }` | Extra distance from the safe area |

### `useToast()`

Returns `{ showToast, hideToast, hideAll }`. `showToast(options)` returns the toast's id. The 1.1 shorthand `showToast(message, type?, duration?, position?)` still works. `useToast` throws if it's used outside `ToastProvider`.

## 🎨 Examples

### Promise toast

```jsx
toast.promise(
  saveReport(),
  {
    loading: 'Saving report…',
    success: (report) => `Saved ${report.name}`,
    error: (err) => `Couldn't save: ${err.message}`,
  },
);
```

`toast.promise` returns the original promise, so you still `await` it or handle its errors as usual.

### Title and action

```jsx
toast.info('The message was moved to the trash', {
  title: 'Message deleted',
  action: { label: 'Undo', onPress: () => restoreMessage(id) },
  duration: 6000,
});
```

### Show until dismissed

```jsx
const id = toast.warning('You are offline', { duration: Infinity, dismissible: false });
// later
toast.hide(id);
```

### Custom icon and styling

```jsx
toast.show({
  message: 'Level up!',
  icon: '🎉',
  position: 'top',
  textStyle: { fontSize: 18, fontWeight: 'bold' },
  containerStyle: { backgroundColor: '#9c27b0', borderRadius: 20 },
});
```

### Provider defaults

```jsx
<ToastProvider position="top" duration={4000} max={3} offset={{ top: 8 }}>
  <App />
</ToastProvider>
```

### Default styles

| Type | Background | Icon |
|------|------------|------|
| `success` | `#4caf50` | ✓ |
| `error` | `#f44336` | ✕ |
| `warning` | `#ff9800` | ⚠ |
| `info` | `#2196f3` | ℹ |
| `loading` | `#323232` | spinner |

Text is white at 16px. The container has an 8px border radius, 15px padding and a light shadow. `textStyle` and `containerStyle` are merged on top of these, so you only pass what you want to change.

## 🆚 Compared with react-native-toast-message

[react-native-toast-message](https://github.com/calintamas/react-native-toast-message) is the most popular toast library and a great choice. Here's how the two differ (compared with its v2.5):

| | react-native-toastify-expo | react-native-toast-message |
|---|:---:|:---:|
| Call from anywhere (outside components) | ✅ `toast.success()` | ✅ `Toast.show()` |
| Several toasts on screen at once | ✅ stacked, with optional `max` | ❌ one at a time |
| Promise toasts (loading → success / error) | ✅ `toast.promise()` | ❌ |
| Action button (e.g. "Undo") | ✅ `action` | Custom layout needed |
| Screen-reader announcements | ✅ VoiceOver and TalkBack | ❌ |
| Safe-area insets (notch, home indicator) | ✅ automatic | Manual `topOffset` / `bottomOffset` |
| Swipe to dismiss | ✅ | ✅ |
| Keyboard avoidance | ❌ | ✅ |
| `onPress` / `onShow` / `onHide` callbacks | ❌ | ✅ |
| Fully custom toast layouts | Icon and styles | ✅ custom renderers |
| Dependencies | 0 | 0 |
| TypeScript | ✅ | ✅ |

If you need keyboard avoidance or completely custom layouts today, react-native-toast-message covers those better.

## 🔁 Migrating from react-native-toast-message

Most apps can switch in a few minutes.

**1. Replace the root component.** Instead of rendering `<Toast />` last in your root, wrap your app:

```diff
- import Toast from 'react-native-toast-message';
+ import { ToastProvider } from 'react-native-toastify-expo';

  export default function App() {
    return (
-     <>
-       <YourApp />
-       <Toast />
-     </>
+     <ToastProvider>
+       <YourApp />
+     </ToastProvider>
    );
  }
```

**2. Update the calls.** `text1` becomes the `title`, and `text2` becomes the message:

```diff
- import Toast from 'react-native-toast-message';
+ import { toast } from 'react-native-toastify-expo';

- Toast.show({ type: 'success', text1: 'Saved', text2: 'Your changes are live' });
+ toast.success('Your changes are live', { title: 'Saved' });

- Toast.show({ type: 'error', text1: 'Something went wrong' });
+ toast.error('Something went wrong');
```

| react-native-toast-message | react-native-toastify-expo |
|---|---|
| `Toast.show({ type, text1, text2 })` | `toast[type](text2, { title: text1 })`, or `toast.show({ type, title, message })` |
| A toast with only `text1` | `toast[type](text1)` |
| `visibilityTime: 4000` | `duration: 4000` |
| `autoHide: false` | `duration: Infinity` |
| `position: 'top'` | `position: 'top'` |
| `swipeable: false` | `dismissible: false` |
| `topOffset` / `bottomOffset` | `<ToastProvider offset={{ top, bottom }}>`, added on top of the safe-area insets |
| `Toast.hide()` | `toast.hideAll()`, or `toast.hide(id)` for one toast |
| Custom types through `config` | `icon`, `containerStyle` and `textStyle` per toast |

## ✅ Requirements

- React >= 16.8 (hooks)
- React Native >= 0.60, or any Expo SDK
- Optional: [`react-native-safe-area-context`](https://github.com/AppAndFlow/react-native-safe-area-context). Expo and the React Native template already include it. When it's installed and your app is wrapped in a `SafeAreaProvider`, top toasts sit just below the notch or Dynamic Island, and bottom toasts sit just above the home indicator. Without it, top toasts are offset by the status bar height.

## Contributing

Contributions are welcome! Please read the [contributing guide](CONTRIBUTING.md) and the [code of conduct](CODE_OF_CONDUCT.md) before opening a pull request. Report security issues privately as described in [SECURITY.md](SECURITY.md).

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
