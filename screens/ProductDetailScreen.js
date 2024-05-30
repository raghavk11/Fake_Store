import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch } from 'react-redux';
import { addItem } from '../Features/Cart/CartSlice';
import { API_BASE_URL } from '../config';

const ProductDetailScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`);
        const json = await response.json();
        setProduct(json);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addItem(product));
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Product Details</Text>
        </View>
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
        <Text style={styles.title}>{product.title}</Text>
        <View style={styles.detailContainer}>
          <DetailItem icon="star" text={`Rate: ${product.rating.rate}`} />
          <DetailItem icon="shopping-bag" text={`Sold: ${product.rating.count}`} />
          <DetailItem icon="dollar" text={`Price: $${product.price}`} />
        </View>
        <ButtonRow navigation={navigation} onAddToCart={handleAddToCart} />
        <Text style={styles.descriptionTitle}>Description:</Text>
        <View style={styles.descriptionContainer}>
          <ScrollView style={styles.descriptionScrollView}>
            <Text style={styles.description}>{product.description}</Text>
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const DetailItem = ({ icon, text }) => (
  <View style={[styles.detailItem, styles[`${icon}Item`]]}>
    <Icon name={icon} size={20} color="#fff" />
    <Text style={styles.detailText}>{text}</Text>
  </View>
);

const ButtonRow = ({ navigation, onAddToCart }) => (
  <View style={styles.buttonContainer}>
    <Button icon="arrow-left" text="Back" color="#808080" onPress={() => navigation.goBack()} />
    <Button icon="shopping-cart" text="Add to Cart" color="#FFD700" onPress={onAddToCart} />
  </View>
);

const Button = ({ icon, text, color, onPress }) => (
  <TouchableOpacity style={[styles.button, { backgroundColor: color }]} onPress={onPress}>
    <Icon name={icon} size={20} color="#fff" />
    <Text style={styles.buttonText}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#007BFF',
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
  image: {
    width: '100%',
    height: 300,
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 20,
    color: '#333',
  },
  detailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
  },
  starItem: {
    backgroundColor: '#FFD700',
  },
  'shopping-bagItem': {
    backgroundColor: '#007BFF',
  },
  dollarItem: {
    backgroundColor: '#32CD32',
  },
  detailText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingVertical: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    minWidth: '40%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
    fontSize: 16,
  },
  descriptionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingHorizontal: 20,
    color: '#333',
  },
  descriptionContainer: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  descriptionScrollView: {
    maxHeight: 150,
  },
  description: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
});

export default ProductDetailScreen;