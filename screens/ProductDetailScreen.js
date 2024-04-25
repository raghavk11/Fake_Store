import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView, StyleSheet, ActivityIndicator, Image } from 'react-native';

export default function ProductDetailScreen({ route, navigation }) {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

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
    <ScrollView style={styles.container}>
      {product && (
        <>
          <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
          <Text style={styles.title}>{product.title}</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.info}>{`Rating: ${product.rating}`}</Text>
            <Text style={styles.info}>{`Units Sold: ${product.sold}`}</Text>
            <Text style={styles.info}>{`Price: $${product.price}`}</Text>
          </View>
          <Text style={styles.description}>{product.description}</Text>
          <View style={styles.buttonContainer}>
            <Button title="Back" onPress={() => navigation.goBack()} />
            <Button title="Add to Cart" onPress={() => {}} />
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  image: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  info: {
    marginRight: 10,
  },
  description: {
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
