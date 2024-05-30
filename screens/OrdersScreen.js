import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Alert, SafeAreaView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders, updateOrderStatus, selectOrders } from '../Features/Orders/OrdersSlice';
import { MaterialIcons } from '@expo/vector-icons';

const OrdersScreen = () => {
  const orders = useSelector(selectOrders);
  const loading = useSelector((state) => state.orders.status === 'loading');
  const error = useSelector((state) => state.orders.error);
  const dispatch = useDispatch();
  const [expandedOrders, setExpandedOrders] = useState([]);
  const [expandedStatuses, setExpandedStatuses] = useState([]);

  useEffect(() => {
    // Fetch orders when the component mounts
    dispatch(fetchOrders());
  }, [dispatch]);

  const toggleOrderExpansion = (orderId) => {
    // Toggle the expanded state of an order
    setExpandedOrders((prevExpandedOrders) =>
      prevExpandedOrders.includes(orderId)
        ? prevExpandedOrders.filter((id) => id !== orderId)
        : [...prevExpandedOrders, orderId]
    );
  };

  const toggleStatusExpansion = (status) => {
    // Toggle the expanded state of an order status section
    setExpandedStatuses((prevExpandedStatuses) =>
      prevExpandedStatuses.includes(status)
        ? prevExpandedStatuses.filter((s) => s !== status)
        : [...prevExpandedStatuses, status]
    );
  };

  const handlePayOrder = async (orderId) => {
    try {
      // Update the order status to 'paid' and show a success alert
      await dispatch(updateOrderStatus({ orderId, status: 'paid' })).unwrap();
      Alert.alert('Order Paid', 'Your order is now marked as paid');
    } catch (error) {
      console.error('Error paying order:', error.message);
      // Show an error alert if payment fails
      Alert.alert('Payment Failed', `An error occurred while paying the order: ${error.message}`);
    }
  };

  const handleReceiveOrder = async (orderId) => {
    try {
      // Update the order status to 'delivered' and show a success alert
      await dispatch(updateOrderStatus({ orderId, status: 'delivered' })).unwrap();
      Alert.alert('Order Delivered', 'Your order is now marked as delivered');
    } catch (error) {
      console.error('Error delivering order:', error.message);
      // Show an error alert if delivery fails
      Alert.alert('Delivery Failed', `An error occurred while marking the order as delivered: ${error.message}`);
    }
  };

  const renderOrderProduct = ({ item: product, index }) => (
    <View key={index} style={styles.productContainer}>
      <Image source={{ uri: product.image }} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text style={styles.productTitle}>{product.title}</Text>
        <Text style={styles.productQuantity}>Quantity: {product.quantity}</Text>
      </View>
    </View>
  );

  const renderOrder = ({ item: order }) => (
    <View style={styles.orderContainer}>
      <TouchableOpacity onPress={() => toggleOrderExpansion(order.id)}>
        <View style={styles.orderHeader}>
          <Text style={styles.orderId}>Order ID: {order.id}</Text>
          <View style={styles.orderDetails}>
            <Text style={styles.orderItems}>{order.items.length} items</Text>
            <Text style={styles.orderTotal}>Total: ${order.total}</Text>
          </View>
          <MaterialIcons
            name={expandedOrders.includes(order.id) ? 'expand-less' : 'expand-more'}
            size={24}
            color="#888"
          />
        </View>
      </TouchableOpacity>
      {expandedOrders.includes(order.id) && (
        <View style={styles.expandedOrderDetails}>
          <FlatList
            data={order.items}
            renderItem={renderOrderProduct}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.productList}
          />
          <View style={styles.actionButtons}>
            {order.status === 'new' && (
              <TouchableOpacity style={styles.button} onPress={() => handlePayOrder(order.id)}>
                <Text style={styles.buttonText}>Pay</Text>
              </TouchableOpacity>
            )}
            {order.status === 'paid' && (
              <TouchableOpacity style={styles.button} onPress={() => handleReceiveOrder(order.id)}>
                <Text style={styles.buttonText}>Receive</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );

  const renderOrderStatus = (status) => {
    if (!orders || !Array.isArray(orders)) {
      return null;
    }

    const filteredOrders = orders.filter((order) => order.status === status);
    const count = filteredOrders.length;

    return (
      <View style={styles.statusContainer} key={status}>
        <TouchableOpacity onPress={() => toggleStatusExpansion(status)}>
          <View style={styles.statusHeader}>
            <Text style={styles.statusTitle}>{status.charAt(0).toUpperCase() + status.slice(1)} Orders</Text>
            <View style={styles.statusDetails}>
              <Text style={styles.statusCount}>{count}</Text>
              <MaterialIcons
                name={expandedStatuses.includes(status) ? 'expand-less' : 'expand-more'}
                size={24}
                color="#888"
              />
            </View>
          </View>
        </TouchableOpacity>
        {expandedStatuses.includes(status) && (
          <FlatList
            data={filteredOrders}
            renderItem={renderOrder}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.orderList}
          />
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="shopping-basket" size={80} color="#ccc" />
        <Text style={styles.emptyText}>No orders found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderOrderStatus('new')}
      {renderOrderStatus('paid')}
      {renderOrderStatus('delivered')}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#888',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#f00',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
    marginTop: 20,
  },
  statusContainer: {
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#007BFF',
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  statusDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusCount: {
    marginRight: 5,
    fontSize: 16,
    color: '#fff',
  },
  orderContainer: {
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  orderDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderItems: {
    marginRight: 10,
    fontSize: 14,
    color: '#888',
  },
  orderTotal: {
    fontSize: 14,
    color: '#888',
  },
  expandedOrderDetails: {
    marginTop: 10,
  },
  productList: {
    paddingBottom: 10,
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  productImage: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  productDetails: {
    flex: 1,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  productQuantity: {
    fontSize: 14,
    color: '#888',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#FFD700',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold',
  },
  orderList: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});

export default OrdersScreen;