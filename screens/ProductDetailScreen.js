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
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>PRODUCT DETAILS</Text>
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
    <Icon name={icon} size={20} color="#ffffff" />
    <Text style={styles.detailText}>{text}</Text>
  </View>
);

const ButtonRow = ({ navigation, onAddToCart }) => (
  <View style={styles.buttonContainer}>
    <Button icon="arrow-left" text="Back" color="#1E90FF" onPress={() => navigation.goBack()} />
    <Button icon="shopping-cart" text="Add to Cart" color="#FF4500" onPress={onAddToCart} />
  </View>
);

const Button = ({ icon, text, color, onPress }) => (
  <TouchableOpacity style={[styles.button, { backgroundColor: color }]} onPress={onPress}>
    <Icon name={icon} size={20} color="white" />
    <Text style={styles.buttonText}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
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
  image: {
    width: '100%',
    height: 300,
    marginTop: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
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
    borderRadius: 8,
  },
  rateItem: {
    backgroundColor: '#1E90FF',
  },
  soldItem: {
    backgroundColor: '#1E90FF',
  },
  priceItem: {
    backgroundColor: '#1E90FF',
  },
  detailText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopColor: '#cccccc',
    paddingVertical: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 5,
    minWidth: '40%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    paddingHorizontal: 20,
  },
  descriptionContainer: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  descriptionScrollView: {
    maxHeight: 150,
  },
  description: {
    fontSize: 16,
    color: '#696969',
  },
});

export default ProductDetailScreen;