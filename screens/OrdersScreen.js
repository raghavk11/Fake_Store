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
    dispatch(fetchOrders());
  }, [dispatch]);

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders((prevExpandedOrders) =>
      prevExpandedOrders.includes(orderId)
        ? prevExpandedOrders.filter((id) => id !== orderId)
        : [...prevExpandedOrders, orderId]
    );
  };

  const toggleStatusExpansion = (status) => {
    setExpandedStatuses((prevExpandedStatuses) =>
      prevExpandedStatuses.includes(status)
        ? prevExpandedStatuses.filter((s) => s !== status)
        : [...prevExpandedStatuses, status]
    );
  };

  const handlePayOrder = async (orderId) => {
    try {
      await dispatch(updateOrderStatus({ orderId, status: 'paid' })).unwrap();
      Alert.alert('Order Paid', 'Your order is now marked as paid');
    } catch (error) {
      console.error('Error paying order:', error.message);
      Alert.alert('Payment Failed', `An error occurred while paying the order: ${error.message}`);
    }
  };

  const handleReceiveOrder = async (orderId) => {
    try {
      await dispatch(updateOrderStatus({ orderId, status: 'delivered' })).unwrap();
      Alert.alert('Order Delivered', 'Your order is now marked as delivered');
    } catch (error) {
      console.error('Error delivering order:', error.message);
      Alert.alert('Delivery Failed', `An error occurred while marking the order as delivered: ${error.message}`);
    }
  };

  const renderOrderProduct = ({ item: product, index }) => (
    <View key={index} style={styles.productContainer}>
      <Image source={{ uri: product.image }} style={styles.productImage} />
      <Text style={styles.productTitle}>{product.title}</Text>
      <Text style={styles.productQuantity}>Quantity: {product.quantity}</Text>
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
          />
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
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  if (!orders || orders.length === 0) {
    return <Text>No orders found.</Text>;
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
  statusContainer: {
    marginBottom: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
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
    borderRadius: 5,
    overflow: 'hidden',
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
  orderList: {
    paddingHorizontal: 10,
  },
});

export default OrdersScreen;