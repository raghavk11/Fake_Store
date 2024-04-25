import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';

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
          <Text style={styles.title}>{product.title}</Text>
          {/* Render product image, rating, sold units, and other details */}
          <Text>{`Price: $${product.price}`}</Text>
          <Text>{product.description}</Text>
          <Button title="Back" onPress={() => navigation.goBack()} />
          {/* The Add to Cart button is non-functional in this milestone */}
          <Button title="Add to Cart" onPress={() => {}} />
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
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  // ... more styles
});