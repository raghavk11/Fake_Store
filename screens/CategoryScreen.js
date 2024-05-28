import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, SafeAreaView, Alert } from 'react-native';
import { API_BASE_URL } from '../config';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from '../Features/Auth/AuthSlice';

const CategoryScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) {
      Alert.alert('Please sign in', 'You need to be logged in to access this screen.', [
        {
          text: 'Sign In',
          onPress: () => navigation.navigate('SignInScreen'),
        },
      ]);
      return;
    }

    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products/categories`);
        const json = await response.json();
        setCategories(json);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [isLoggedIn, navigation]);

  const handleCategoryPress = (category) => {
    navigation.navigate('ProductListScreen', { category });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>CATEGORIES</Text>
      </View>
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
              <Text style={styles.text}>{category.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.button}>
            <Text style={styles.text}>YOUR_NAME</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#007bff',
    alignItems: 'center',
    paddingVertical: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'uppercase',
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

export default CategoryScreen;