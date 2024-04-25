import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; 

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
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {product && (
          <>
            <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
            <Text style={styles.title}>{product.title}</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detail}>Rate: {product.rating.rate}</Text>
              <Text style={styles.detail}>Sold: {product.rating.count}</Text>
              <Text style={styles.detail}>Price: ${product.price}</Text>
            </View>
            <Text style={styles.descriptionTitle}>Description:</Text>
            <Text style={styles.description}>{product.description}</Text>
          </>
        )}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.backButton]} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.cartButton]} onPress={() => {}}>
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  detail: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    paddingHorizontal: 20,
  },
  description: {
    fontSize: 16,
    color: '#696969',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopColor: '#cccccc',
    paddingVertical: 10,
  },
  button: {
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
  },
});
