import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function CartScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Cart</Text>
      <Text>Your items will appear here.</Text>
      <Button title="Go to Home" onPress={() => navigation.navigate('CategoryScreen')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
});