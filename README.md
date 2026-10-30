# 🚀 React Native Toastify Expo – Beautiful Toast Notifications for React Native & Expo

**react-native-toastify-expo** is a lightweight, customizable toast notification library for **React Native** and **Expo** apps. With cross-platform support, smooth animations, and full styling control, it's the easiest way to show success, error, or info toasts in your React Native project.

[![npm version](https://img.shields.io/npm/v/react-native-toastify-expo.svg)](https://www.npmjs.com/package/react-native-toastify-expo)
[![npm downloads](https://img.shields.io/npm/dm/react-native-toastify-expo.svg)](https://www.npmjs.com/package/react-native-toastify-expo)
[![CI](https://github.com/anuj-kumary/react-native-toastify/actions/workflows/ci.yml/badge.svg)](https://github.com/anuj-kumary/react-native-toastify/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/npm/types/react-native-toastify-expo.svg)](src/index.ts)
[![license](https://img.shields.io/npm/l/react-native-toastify-expo.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/anuj-kumary/react-native-toastify?style=social)](https://github.com/anuj-kumary/react-native-toastify/stargazers)
[![good first issues](https://img.shields.io/github/issues/anuj-kumary/react-native-toastify/good%20first%20issue?label=good%20first%20issues&color=7057ff)](https://github.com/anuj-kumary/react-native-toastify/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

▶️ **[Try it live in Expo Snack](https://snack.expo.dev/@git/github.com/anuj-kumary/react-native-toastify:example)**: runs in your browser, or on your phone with Expo Go.

⭐ **Like it? [Star the repo](https://github.com/anuj-kumary/react-native-toastify/stargazers)**: it's how other developers find it.

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
- ✋ **Hold to pause**: holding a toast pauses its countdown so it can be read
- 🔁 **Update in place, no duplicates**: `toast.update(id, …)`, and repeating a toast with the same `id` updates it instead of stacking another
- 🌗 **Themes**: colored, light, dark, or follow the device
- 🔘 **Titles and action buttons**, for example "Undo"
- 🖼️ **Custom icons**: any emoji, string or React element
- 🧩 **Custom types and layouts**: register your own types (`toast.show({ type: 'upload' })`), or render toasts however you like
- 🔔 **Callbacks**: `onPress`, `onShow` and `onHide`
- ⏱️ **Progress bar** counting down to auto-dismiss
- 🪟 **Works over Modals**: add `<ToastHost />` inside a `<Modal>` and toasts show on top of it
- ⌨️ **Keyboard-aware**: bottom toasts move above the keyboard
- ⚙️ **Provider defaults**: set duration, position, max visible toasts, offsets and styles once
- 📐 **Safe-area aware**: clears the notch and the home indicator
- 🖥️ **Tablet and web friendly**: toasts are capped at a readable width and centered
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
| `toast.update(id, options)` | | Changes a toast on screen and restarts its countdown |
| `toast.hide(id)` | | Dismisses one toast |
| `toast.hideAll()` | | Dismisses every toast |

### Toast options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `message` | `string` | **required** | Text to show |
| `id` | `string` | generated | If a toast with this id is on screen, it's updated instead of a new one being added |
| `type` | `'success' \| 'error' \| 'warning' \| 'info' \| 'loading'`, or a custom type | `'info'` | Sets the color and icon. Custom types are registered with the provider's `types` prop. |
| `title` | `string` | none | Bold first line above the message |
| `duration` | `number` | `3000` (or the provider's `duration`) | Milliseconds before auto-dismiss. `Infinity` keeps the toast until it's dismissed. |
| `position` | `'top' \| 'bottom'` | `'bottom'` (or the provider's `position`) | Where the toast appears |
| `action` | `{ label: string, onPress: () => void }` | none | Button on the toast. Pressing it also dismisses the toast. |
| `icon` | `ReactNode` | the type's icon | Custom icon: a string, emoji or element. `null` hides it. |
| `dismissible` | `boolean` | `true` | Tap or swipe sideways to dismiss |
| `accessibilityHint` | `string` | the provider's hint, or `'Double tap to dismiss'` | Screen-reader dismiss hint for the default layout. Per-toast value wins; ignored when `dismissible` is `false`. |
| `onPress` | `() => void` | none | Called when the toast is tapped, before it's dismissed |
| `onShow` | `() => void` | none | Called once the toast has animated in |
| `onHide` | `() => void` | none | Called once the toast is gone, whatever dismissed it |
| `showProgress` | `boolean` | `false` (or the provider's `showProgress`) | Shows a bar counting down to auto-dismiss |
| `render` | `(toast) => ReactNode` | the default layout (or the provider's `render`) | Fully custom layout. It receives `{ id, message, title, type, hide }`. Animations, swiping and the timer still apply. |
| `textStyle` | `TextStyle` | none | Merged into the title and message text style |
| `containerStyle` | `ViewStyle` | none | Merged into the toast container style |

### `<ToastProvider>` props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `duration` | `number` | `3000` | Default auto-dismiss time |
| `position` | `'top' \| 'bottom'` | `'bottom'` | Default position |
| `max` | `number` | unlimited | Most toasts visible per position. When a new toast would exceed it, the oldest is dismissed. |
| `offset` | `{ top?: number, bottom?: number }` | `{ top: 10, bottom: 20 }` | Extra distance from the safe area |
| `avoidKeyboard` | `boolean` | `true` | Moves bottom toasts above the keyboard while it's open. It measures how much of the screen the keyboard covers, so it works whether the app draws edge-to-edge or its window resizes for the keyboard (Android `adjustResize`). |
| `showProgress` | `boolean` | `false` | Shows the countdown bar on every toast |
| `accessibilityHint` | `string` | `'Double tap to dismiss'` | Default screen-reader dismiss hint; set a translation for your app's locale. A toast can override it. |
| `types` | `Record<string, { backgroundColor, icon? }>` | none | Registers custom types, or restyles the built-in ones |
| `render` | `(toast) => ReactNode` | none | Default custom layout for every toast |
| `theme` | `'colored' \| 'light' \| 'dark' \| 'system'` | `'colored'` | `'colored'` fills the card with the type's color. `'light'` and `'dark'` use a neutral card with a colored accent. `'system'` follows the device. |
| `maxWidth` | `number` | `480` | Widest a toast gets, so it doesn't stretch across tablets and web |

### `useToast()`

Returns `{ showToast, updateToast, hideToast, hideAll }`. `showToast(options)` returns the toast's id. The 1.1 shorthand `showToast(message, type?, duration?, position?)` still works. `useToast` throws if it's used outside `ToastProvider`.

### `<ToastHost />`

A React Native `<Modal>` covers everything outside it, including toasts shown at the app root. Render `<ToastHost />` as the last child of the Modal's content, and toasts show inside the Modal while it's open. When several hosts are mounted, the newest one shows the toasts. When it unmounts, toasts go back to the previous host or the app root. It takes no props.

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

### No duplicate toasts

Give a toast an `id`. Showing it again while it's on screen updates it and restarts its countdown, instead of stacking a copy:

```jsx
api.onError(() => toast.error('You are offline', { id: 'network' }));
```

### Update a toast in place

```jsx
const id = toast.info('Uploading… 0%', { duration: Infinity });
upload.onProgress((p) => toast.update(id, { message: `Uploading… ${p}%` }));
upload.onDone(() => toast.update(id, { message: 'Upload complete', type: 'success', duration: 3000 }));
```

### Toasts over a Modal

```tsx
import { Modal, View } from 'react-native';
import { toast, ToastHost } from 'react-native-toastify-expo';

<Modal visible={open} onRequestClose={close}>
  <View style={{ flex: 1 }}>
    <EditProfileForm onSave={() => toast.success('Profile saved')} />
    <ToastHost />
  </View>
</Modal>;
```

Without `<ToastHost />`, the toast would show behind the Modal. A toast already on screen when the Modal opens moves into it and replays its entrance.

### Themes

```jsx
<ToastProvider theme="system">   {/* or "colored" (default), "light", "dark" */}
  <App />
</ToastProvider>
```

### Custom types

```jsx
<ToastProvider
  types={{
    upload: { backgroundColor: '#6200ee', icon: '⬆' },
    success: { backgroundColor: '#00796b' }, // restyle a built-in type
  }}
>
  <App />
</ToastProvider>

toast.show({ type: 'upload', message: 'Uploading photo…' });
```

### Fully custom layout

```jsx
toast.show({
  message: 'Jane sent you a message',
  render: ({ message, hide }) => (
    <View style={styles.card}>
      <Image source={avatar} style={styles.avatar} />
      <Text style={styles.text}>{message}</Text>
      <Button title="Reply" onPress={() => { openChat(); hide(); }} />
    </View>
  ),
});
```

Pass `render` to `ToastProvider` to use your own layout for every toast.

### Callbacks and progress bar

```jsx
toast.info('New comment on your post', {
  showProgress: true,
  onPress: () => navigation.navigate('Comments'),
  onHide: () => markNotificationSeen(),
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

Holding a toast pauses its countdown, and the progress bar with it; releasing resumes it. This works on any toast you can interact with, but not on a `dismissible: false` toast that has no `onPress` or `action`, because taps pass through those.

These are the colors in the default `'colored'` theme. Text is white at 16px. The container has an 8px border radius, 15px padding and a light shadow. `textStyle` and `containerStyle` are merged on top of these, so you only pass what you want to change.

## 🆚 Compared with react-native-toast-message

[react-native-toast-message](https://github.com/calintamas/react-native-toast-message) is the most popular toast library and a great choice. Here's how the two differ (compared with its v2.5):

| | react-native-toastify-expo | react-native-toast-message |
|---|:---:|:---:|
| Call from anywhere (outside components) | ✅ `toast.success()` | ✅ `Toast.show()` |
| Several toasts on screen at once | ✅ stacked, with optional `max` | ❌ one at a time |
| Promise toasts (loading → success / error) | ✅ `toast.promise()` | ❌ |
| Action button (e.g. "Undo") | ✅ `action` | Custom layout needed |
| Progress bar | ✅ `showProgress` | ❌ |
| Screen-reader announcements | ✅ VoiceOver and TalkBack | ❌ |
| Safe-area insets (notch, home indicator) | ✅ automatic | Manual `topOffset` / `bottomOffset` |
| Toasts over a `<Modal>` | ✅ one `<ToastHost />`, no extra config | A second `<Toast />` with its own config |
| Swipe to dismiss | ✅ | ✅ |
| Keyboard avoidance | ✅ | ✅ |
| `onPress` / `onShow` / `onHide` callbacks | ✅ | ✅ |
| Custom types and fully custom layouts | ✅ `types` and `render` | ✅ custom renderers |
| Dependencies | 0 | 0 |
| TypeScript | ✅ | ✅ |

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
| `onPress` / `onShow` / `onHide` | `onPress` / `onShow` / `onHide` |
| `avoidKeyboard` / `keyboardOffset` | `<ToastProvider avoidKeyboard>` (on by default) |
| Custom types through `config` | `<ToastProvider types>` for colors and icons, or `render` for a fully custom layout |

## ✅ Requirements

- React >= 16.8 (hooks)
- React Native >= 0.60, or any Expo SDK
- Optional: [`react-native-safe-area-context`](https://github.com/AppAndFlow/react-native-safe-area-context). Expo and the React Native template already include it. When it's installed and your app is wrapped in a `SafeAreaProvider`, top toasts sit just below the notch or Dynamic Island, and bottom toasts sit just above the home indicator. Without it, top toasts are offset by the status bar height.

## Contributing

Contributions are welcome, including your first one!

- **Looking for something to work on?** The [good first issues](https://github.com/anuj-kumary/react-native-toastify/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) are small and well-scoped, and each one lists the files involved and what "done" looks like. Comment on one to take it.
- **Setup takes a minute:** `npm ci` installs everything, including a pre-commit hook that formats and lint-fixes your changes. The [contributing guide](CONTRIBUTING.md) covers the workflow and code style.
- **Found a bug or have an idea?** [Open an issue](https://github.com/anuj-kumary/react-native-toastify/issues/new/choose). The forms ask for exactly what's needed.
- Please follow the [code of conduct](CODE_OF_CONDUCT.md), and report security issues privately as described in [SECURITY.md](SECURITY.md).

### Contributors

Thanks to everyone who has helped build this library:

<a href="https://github.com/anuj-kumary/react-native-toastify/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=anuj-kumary/react-native-toastify" alt="Contributors" />
</a>

If this library saves you time, a ⭐ on GitHub helps other developers find it.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
