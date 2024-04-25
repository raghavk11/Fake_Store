import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

export default function CategoryScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://fakestoreapi.com/products/categories');
        const json = await response.json();
        setCategories(json);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryPress = (category) => {
    navigation.navigate('ProductListScreen', { category });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Categories</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={styles.button}
              onPress={() => handleCategoryPress(category)}
            >
              <Text style={styles.text}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
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
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'black',
    alignSelf: 'center',
    marginTop:30,
    marginBottom: 20,
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
