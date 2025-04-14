import { ToastProvider } from './context/ToastContext';
import { HomeScreen } from './screens/HomeScreen';

function App() {
  return (
    <ToastProvider>
<HomeScreen />
    </ToastProvider>
  );
}

export default App; 