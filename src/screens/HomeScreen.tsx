import { useToast } from '../context/ToastContext';

export const HomeScreen = () => {
  const { showToast } = useToast();

  const handleButtonClick = () => {
    showToast('This is a success message!', 'success');
  };

  const handleErrorClick = () => {
    showToast('Something went wrong!', 'error');
  };

  return (
    <div>
      <h1>Home Screen</h1>
      <button onClick={handleButtonClick}>Show Success Toast</button>
      <button onClick={handleErrorClick}>Show Error Toast</button>
    </div>
  );
}; 