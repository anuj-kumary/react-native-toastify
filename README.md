# React Native Toastify

A beautiful and customizable toast notification component for React Native applications, built for Expo and React Native.

### iOS Demo

https://github.com/user-attachments/assets/82862979-f5db-4d84-8782-a32530a84542

### Android Demo


https://github.com/user-attachments/assets/84b0eb72-7d81-4952-86f3-c0f7460922c6



## Features

- 🎨 **Fully Customizable**: Customize colors, icons, animations, and styling
- 📱 **Cross-Platform**: Works on both iOS and Android
- ⚡ **Smooth Animations**: Configurable animation duration and easing
- 🎯 **Flexible Positioning**: Top or bottom positioning
- 🔧 **Custom Toast Types**: Create your own toast types with custom colors and icons
- 🎪 **Dynamic Styling**: Override any style property
- 📦 **TypeScript Support**: Full TypeScript definitions included
- 🚀 **Lightweight**: Minimal bundle size with no external dependencies

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

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `message` | `string` | The message to display in the toast |
| `onClose` | `() => void` | Callback function called when toast is dismissed |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `ToastType` | `'info'` | Toast type: 'success', 'error', 'warning', 'info', or custom string |
| `duration` | `number` | `3000` | Duration in milliseconds before auto-dismiss |
| `position` | `'top' \| 'bottom'` | `'bottom'` | Position of the toast on screen |
| `animationDuration` | `number` | `300` | Duration of show/hide animations |
| `showIndicator` | `boolean` | `true` | Whether to show the icon indicator |
| `borderRadius` | `number` | `8` | Border radius of the toast |
| `padding` | `number` | `15` | Internal padding of the toast |
| `margin` | `number` | `20` | Horizontal margin from screen edges |
| `elevation` | `number` | `3` | Android elevation (shadow) |
| `shadowColor` | `string` | `'#000'` | Shadow color for iOS |
| `shadowOffset` | `{width: number, height: number}` | `{width: 0, height: 2}` | Shadow offset |
| `shadowOpacity` | `number` | `0.25` | Shadow opacity |
| `shadowRadius` | `number` | `3.84` | Shadow radius |

### Style Props

| Prop | Type | Description |
|------|------|-------------|
| `textStyle` | `object` | Custom styles for the message text |
| `containerStyle` | `object` | Custom styles for the toast container |
| `indicatorStyle` | `object` | Custom styles for the icon indicator |

### Custom Toast Types

| Prop | Type | Description |
|------|------|-------------|
| `customToastTypes` | `Record<string, ToastTypeConfig>` | Custom toast type configurations |

## ToastTypeConfig Interface

```tsx
interface ToastTypeConfig {
  backgroundColor: string;  // Background color of the toast
  indicator: string;        // Icon/emoji to display
  iconColor: string;        // Color of the indicator
  textColor?: string;       // Color of the text (optional, defaults to iconColor)
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

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
