import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { selectOrders } from '../Features/Orders/OrdersSlice';

const OrdersScreen = () => {
  const orders = useSelector(selectOrders);

  const renderOrder = ({ item }) => (
    <View style={styles.orderContainer}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Order ID: {item.id}</Text>
        <Text style={styles.orderTotal}>Total: ${item.total}</Text>
      </View>
      <View style={styles.orderDetails}>
        {item.items.map((product, index) => (
          <View key={index} style={styles.productContainer}>
            <Text style={styles.productTitle}>{product.title}</Text>
            <Text style={styles.productQuantity}>Quantity: {product.quantity}</Text>
            <Text style={styles.productPrice}>Price: ${product.price}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {orders.length === 0 ? (
        <Text style={styles.emptyMessage}>No orders found.</Text>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  emptyMessage: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  orderContainer: {
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 15,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderTotal: {
    fontSize: 16,
    color: '#888',
  },
  orderDetails: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
  },
  productContainer: {
    marginBottom: 10,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productQuantity: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    color: '#888',
  },
});

export default OrdersScreen;