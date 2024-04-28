import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function ProductDetailScreen({ route, navigation }) {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets(); 

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
        const json = await response.json();
        setProduct(json);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Product Details</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {product && (
          <>
            <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
            <Text style={styles.title}>{product.title}</Text>
            <View style={styles.detailContainer}>
              <View style={[styles.detailItem, styles.rateItem]}>
                <Icon name="star" size={20} color="#ffffff" />
                <Text style={styles.detailText}>Rate: {product.rating.rate}</Text>
              </View>
              <View style={[styles.detailItem, styles.soldItem]}>
                <Icon name="shopping-bag" size={20} color="#ffffff" />
                <Text style={styles.detailText}>Sold: {product.rating.count}</Text>
              </View>
              <View style={[styles.detailItem, styles.priceItem]}>
                <Icon name="dollar" size={20} color="#ffffff" />
                <Text style={styles.detailText}>Price: ${product.price}</Text>
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button, styles.backButton]} onPress={() => navigation.goBack()}>
                <Icon name="arrow-left" size={20} color="white" />
                <Text style={styles.buttonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.cartButton]} onPress={() => {}}>
                <Icon name="shopping-cart" size={20} color="white" />
                <Text style={styles.buttonText}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.descriptionTitle}>Description:</Text>
            <View style={styles.descriptionContainer}>
              <ScrollView style={styles.descriptionScrollView}>
                <Text style={styles.description}>{product.description}</Text>
              </ScrollView>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  scrollContainer: {
    flexGrow: 1,
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
  backButton: {
    backgroundColor: '#1E90FF',
  },
  cartButton: {
    backgroundColor: '#FF4500',
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
