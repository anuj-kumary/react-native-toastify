import React from 'react';
import { HomeScreen } from "../src/screens/HomeScreen";
import { StyleSheet, Text, View } from "react-native";
import { ToastProvider } from '../src/context/ToastContext';

export default function Page() {
  return (
    <ToastProvider>
      <View style={styles.container}>
        <View style={styles.main}>
          <HomeScreen />
        </View>
      </View>
    </ToastProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
});
