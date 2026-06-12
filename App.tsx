import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌿 Petit Suivi</Text>
      <Text style={styles.sub}>Le suivi de santé, tout en douceur.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF6F0',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#4A3728',
  },
  sub: {
    fontSize: 16,
    color: '#9B8578',
  },
});
