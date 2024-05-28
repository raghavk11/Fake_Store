import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Alert, SafeAreaView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders, updateOrderStatus } from '../Features/Orders/OrdersSlice'; // Ensure correct import
import { MaterialIcons } from '@expo/vector-icons';

const OrdersScreen = () => {
  const orders = useSelector((state) => state.orders.orders);
  const dispatch = useDispatch();
  const [expandedOrders, setExpandedOrders] = useState([]);
  const [expandedStatuses, setExpandedStatuses] = useState([]);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const toggleOrderExpansion = (orderId) => {
    if (expandedOrders.includes(orderId)) {
      setExpandedOrders(expandedOrders.filter((id) => id !== orderId));
    } else {
      setExpandedOrders([...expandedOrders, orderId]);
    }
  };

  const toggleStatusExpansion = (status) => {
    if (expandedStatuses.includes(status)) {
      setExpandedStatuses(expandedStatuses.filter((s) => s !== status));
    } else {
      setExpandedStatuses([...expandedStatuses, status]);
    }
  };

  const handlePayOrder = async (orderId) => {
    try {
      await dispatch(updateOrderStatus({ orderId, status: 'paid' })).unwrap();
      Alert.alert('Order Paid', 'Your order is paid');
    } catch (error) {
      console.error('Error paying order:', error);
      Alert.alert('Payment Failed', 'An error occurred while paying the order');
    }
  };

  const handleReceiveOrder = async (orderId) => {
    try {
      await dispatch(updateOrderStatus({ orderId, status: 'delivered' })).unwrap();
      Alert.alert('Order Delivered', 'Your order is delivered');
    } catch (error) {
      console.error('Error receiving order:', error);
      Alert.alert('Delivery Failed', 'An error occurred while marking the order as delivered');
    }
  };

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
          {order.items.map((item, index) => (
            <View key={index} style={styles.productContainer}>
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <Text style={styles.productTitle}>{item.title}</Text>
              <Text style={styles.productQuantity}>Quantity: {item.quantity}</Text>
            </View>
          ))}
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
      )}
    </View>
  );

  const renderOrderStatus = (status) => {
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
          />
        )}
      </View>
    );
  };

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
  statusContainer: {
    marginBottom: 20,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusCount: {
    marginRight: 5,
    fontSize: 16,
    color: '#888',
  },
  orderContainer: {
    marginBottom: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    padding: 10,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
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
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  productImage: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  productTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
  },
  productQuantity: {
    fontSize: 14,
    color: '#888',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default OrdersScreen;