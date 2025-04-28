import { View, Button } from 'react-native';
import { useToast } from '../context/ToastContext';

export const HomeScreen = () => {
  const { showToast } = useToast();

  return (
    <View>
      <Button 
        title="Show Success"
        onPress={() => showToast('Success message!', 'success')}
      />
      <Button 
        title="Show Error"
        onPress={() => showToast('Error message!', 'error')}
      />
      <Button 
        title="Show Warning"
        onPress={() => showToast('Warning message!', 'warning')}
      />
      <Button 
        title="Show Info"
        onPress={() => showToast('Info message!', 'info')}
      />
    </View>
  );
}; 