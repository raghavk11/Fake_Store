import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, SafeAreaView, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import { addItem } from '../Features/Cart/CartSlice';
import { API_BASE_URL } from '../config';
import { Ionicons } from '@expo/vector-icons';

const ProductListScreen = ({ route, navigation }) => {
  const { category } = route.params;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products/category/${encodeURIComponent(category)}`);
        const json = await response.json();
        setProducts(json);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const handleProductPress = (productId) => {
    navigation.navigate('ProductDetailScreen', { productId });
  };

  const handleAddToCart = (product) => {
    dispatch(addItem(product));
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => handleProductPress(item.id)}>
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>{`$${item.price}`}</Text>
        <TouchableOpacity style={styles.addToCartButton} onPress={() => handleAddToCart(item)}>
          <Ionicons name="cart" size={20} color="#fff" style={styles.addToCartIcon} />
          <Text style={styles.addToCartButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{category.toUpperCase()}</Text>
        <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate('CartScreen')}>
          <Ionicons name="cart" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
        />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButton: {
    padding: 5,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'uppercase',
  },
  cartButton: {
    padding: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 20,
    borderRadius: 10,
  },
  infoContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  price: {
    fontSize: 16,
    color: '#888',
    marginBottom: 10,
  },
  addToCartButton: {
    flexDirection: 'row',
    backgroundColor: '#FFD700',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  addToCartIcon: {
    marginRight: 5,
  },
  addToCartButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ProductListScreen;