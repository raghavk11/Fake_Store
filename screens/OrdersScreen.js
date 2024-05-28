import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from '../Features/Auth/AuthSlice';
import { API_BASE_URL } from '../config';
import Icon from 'react-native-vector-icons/FontAwesome';

const OrdersScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState([]);
  const [expandedLabels, setExpandedLabels] = useState([]);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/all`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      setOrders(data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const toggleOrderExpansion = (orderId) => {
    if (expandedOrders.includes(orderId)) {
      setExpandedOrders(expandedOrders.filter((id) => id !== orderId));
    } else {
      setExpandedOrders([...expandedOrders, orderId]);
    }
  };

  const toggleLabelExpansion = (label) => {
    if (expandedLabels.includes(label)) {
      setExpandedLabels(expandedLabels.filter((l) => l !== label));
    } else {
      setExpandedLabels([...expandedLabels, label]);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/updateorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          orderID: orderId,
          isPaid: newStatus === 'paid' ? 1 : 0,
          isDelivered: newStatus === 'delivered' ? 1 : 0,
        }),
      });
      const data = await response.json();
      if (data.status === 'OK') {
        fetchOrders();
        Alert.alert('Success', `Your order is ${newStatus}`);
      } else {
        Alert.alert('Error', data.message || 'An error occurred');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      Alert.alert('Error', 'An error occurred');
    }
  };

  const renderOrder = ({ item }) => (
    <View style={styles.orderContainer}>
      <TouchableOpacity
        style={styles.orderHeader}
        onPress={() => toggleOrderExpansion(item.id)}
      >
        <Text style={styles.orderId}>Order ID: {item.id}</Text>
        <Text style={styles.orderItems}>Items: {item.item_numbers}</Text>
        <Text style={styles.orderTotal}>Total: ${item.total_price}</Text>
        <Icon
          name={expandedOrders.includes(item.id) ? 'caret-up' : 'caret-down'}
          size={20}
          color="#000"
        />
      </TouchableOpacity>
      {expandedOrders.includes(item.id) && (
        <View style={styles.orderDetails}>
          {JSON.parse(item.order_items).map((product) => (
            <View key={product.prodID} style={styles.productContainer}>
              <Text style={styles.productTitle}>Product ID: {product.prodID}</Text>
              <Text style={styles.productQuantity}>Quantity: {product.quantity}</Text>
            </View>
          ))}
          {item.is_paid === 0 && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => updateOrderStatus(item.id, 'paid')}
            >
              <Text style={styles.buttonText}>Pay</Text>
            </TouchableOpacity>
          )}
          {item.is_paid === 1 && item.is_delivered === 0 && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => updateOrderStatus(item.id, 'delivered')}
            >
              <Text style={styles.buttonText}>Receive</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );

  const renderLabel = (label) => (
    <TouchableOpacity
      style={styles.labelContainer}
      onPress={() => toggleLabelExpansion(label)}
    >
      <Text style={styles.labelText}>
        {label} Orders ({orders.filter((order) => {
          if (label === 'new') return order.is_paid === 0;
          if (label === 'paid') return order.is_paid === 1 && order.is_delivered === 0;
          if (label === 'delivered') return order.is_delivered === 1;
        }).length})
      </Text>
      <Icon
        name={expandedLabels.includes(label) ? 'caret-up' : 'caret-down'}
        size={20}
        color="#000"
      />
    </TouchableOpacity>
  );

  const labels = ['new', 'paid', 'delivered'];

  return (
    <View style={styles.container}>
      {labels.map((label) => (
        <View key={label}>
          {renderLabel(label)}
          {expandedLabels.includes(label) && (
            <FlatList
              data={orders.filter((order) => {
                if (label === 'new') return order.is_paid === 0;
                if (label === 'paid') return order.is_paid === 1 && order.is_delivered === 0;
                if (label === 'delivered') return order.is_delivered === 1;
              })}
              renderItem={renderOrder}
              keyExtractor={(item) => item.id.toString()}
            />
          )}
        </View>
      ))}
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
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  labelText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  orderContainer: {
    marginBottom: 20,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderItems: {
    fontSize: 16,
  },
  orderTotal: {
    fontSize: 16,
  },
  orderDetails: {
    padding: 10,
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  productImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  productQuantity: {
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OrdersScreen;