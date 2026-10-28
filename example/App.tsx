import React from 'react';
import { Button, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ToastProvider, toast } from 'react-native-toastify-expo';

const fakeRequest = (succeed: boolean) =>
  new Promise<string>((resolve, reject) =>
    setTimeout(() => (succeed ? resolve('report.pdf') : reject(new Error('Network error'))), 2000),
  );

let offlineToastId = '';

function Demo() {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>react-native-toastify-expo</Text>
        <Text style={styles.hint}>Tap a toast or swipe it sideways to dismiss it.</Text>

        <Button title="Success" onPress={() => toast.success('Saved successfully!')} />
        <Button title="Error" onPress={() => toast.error('Something went wrong')} />
        <Button title="Warning" onPress={() => toast.warning('Please check your input')} />
        <Button title="Info" onPress={() => toast.info('New update available')} />

        <Button
          title="Title + Undo action"
          onPress={() =>
            toast.info('The message was moved to the trash', {
              title: 'Message deleted',
              action: { label: 'Undo', onPress: () => toast.success('Message restored') },
              duration: 6000,
            })
          }
        />
        <Button
          title="Promise (resolves)"
          onPress={() =>
            toast.promise(fakeRequest(true), {
              loading: 'Saving report…',
              success: (file) => `Saved ${file}`,
              error: 'Could not save',
            })
          }
        />
        <Button
          title="Promise (rejects)"
          onPress={() =>
            toast
              .promise(fakeRequest(false), {
                loading: 'Saving report…',
                success: 'Saved',
                error: (e) => `Could not save: ${(e as Error).message}`,
              })
              .catch(() => {})
          }
        />
        <Button title="Top position" onPress={() => toast.success('I am at the top', { position: 'top' })} />
        <Button title="Custom icon" onPress={() => toast.show({ message: 'Level up!', icon: '🎉', position: 'top' })} />
        <Button
          title="Show until hidden"
          onPress={() => {
            offlineToastId = toast.warning('You are offline', { duration: Infinity, dismissible: false });
          }}
        />
        <Button title="Hide it" onPress={() => toast.hide(offlineToastId)} />
        <Button title="Hide all" onPress={() => toast.hideAll()} />
      </ScrollView>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ToastProvider max={3}>
        <Demo />
      </ToastProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20, gap: 8 },
  heading: { fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  hint: { textAlign: 'center', color: '#666', marginBottom: 8 },
});
