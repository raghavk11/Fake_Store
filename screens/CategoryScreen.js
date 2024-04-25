import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const categories = [
  'Electronics',
  'Jewellery',
  "Men's Clothing",
  "Women's Clothing",
];

export default function CategoryScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Categories</Text>
      </View>
      {categories.map((category, index) => (
        <TouchableOpacity
          key={index}
          style={styles.button}
          onPress={() => navigation.navigate('ProductListScreen', { category })}
        >
          <Text style={styles.text}>{category}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', 
    padding: 20,
    backgroundColor: '#fff',
  },
  headerContainer: {
    marginTop:30,
    marginBottom: 20, 
  },
  headerText: {
    fontSize: 32, 
    fontWeight: 'bold',
    color: 'black',
    alignSelf: 'center', 
  },
  button: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
  },
  text: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
});