import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, SafeAreaView, Alert } from 'react-native';
import { API_BASE_URL } from '../config';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from '../Features/Auth/AuthSlice';
import { Ionicons } from '@expo/vector-icons';

const CategoryScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  useEffect(() => {
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
  }, []);

  // Handle category press and navigate to ProductListScreen with the selected category
  const handleCategoryPress = (category) => {
    navigation.navigate('ProductListScreen', { category });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Categories</Text>
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      ) : (
        <View style={styles.categoriesContainer}>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={styles.categoryButton}
              onPress={() => handleCategoryPress(category)}
            >
              <Ionicons name="folder" size={24} color="#007bff" style={styles.categoryIcon} />
              <Text style={styles.categoryText}>{category.toUpperCase()}</Text>
              <Ionicons name="arrow-forward" size={24} color="#007bff" style={styles.arrowIcon} />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#007bff',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'uppercase',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  categoryIcon: {
    marginRight: 10,
  },
  categoryText: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  arrowIcon: {
    opacity: 0.7,
  },
});

export default CategoryScreen;