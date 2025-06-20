import { jsx as _jsx } from "react/jsx-runtime";
import { ToastProvider } from './context/ToastContext';
import { HomeScreen } from './screens/HomeScreen';
function App() {
    return (_jsx(ToastProvider, { children: _jsx(HomeScreen, {}) }));
}
export default App;
//# sourceMappingURL=App.js.map