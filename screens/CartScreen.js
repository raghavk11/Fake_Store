import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, SafeAreaView, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { incrementQuantity, decrementQuantity, removeItem, uploadCart } from '../Features/Cart/CartSlice';
import { addOrder } from '../Features/Orders/OrdersSlice';
import { selectIsLoggedIn } from '../Features/Auth/AuthSlice';
import { Ionicons } from '@expo/vector-icons';

const CartScreen = ({ navigation }) => {
  const cartItems = useSelector((state) => state.cart.items);
  const cartStatus = useSelector((state) => state.cart.status);
  const cartError = useSelector((state) => state.cart.error);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if the user is logged in, otherwise navigate to SignInScreen
    if (!isLoggedIn) {
      navigation.navigate('SignInScreen');
    }
  }, [isLoggedIn, navigation]);

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="contain" />
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity style={styles.quantityButton} onPress={() => dispatch(decrementQuantity(item.id))}>
            <Ionicons name="remove" size={18} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity style={styles.quantityButton} onPress={() => dispatch(incrementQuantity(item.id))}>
            <Ionicons name="add" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
        <TouchableOpacity onPress={() => dispatch(removeItem(item.id))}>
          <Text style={styles.removeButton}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const getTotalQuantity = () => cartItems.reduce((total, item) => total + item.quantity, 0);
  const getTotalPrice = () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

  const handleCheckout = async () => {
    try {
      const order = {
        id: new Date().getTime().toString(),
        items: cartItems,
        total: getTotalPrice(),
        status: 'new',
      };

      // Upload the cart items to the server and add the order to the store
      await dispatch(uploadCart(cartItems)).unwrap();
      dispatch(addOrder(order));
      cartItems.forEach((item) => dispatch(removeItem(item.id)));

      // Show a success alert and navigate to the OrdersTab
      Alert.alert('Checkout Successful', 'New order has been created', [
        { text: 'OK', onPress: () => navigation.navigate('OrdersTab') },
      ]);
    } catch (error) {
      console.error('Error creating order:', error);
      // Show an error alert if the checkout fails
      Alert.alert('Checkout Failed', 'An error occurred while creating the order', [{ text: 'OK' }]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {cartStatus === 'loading' ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : cartError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{cartError}</Text>
        </View>
      ) : cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color="#ccc" />
          <Text style={styles.emptyMessage}>Your shopping cart is empty</Text>
        </View>
      ) : (
        <>
          <View style={styles.cartHeader}>
            <Text style={styles.cartHeaderText}>Total Items: {getTotalQuantity()}</Text>
            <Text style={styles.cartHeaderText}>Total Price: ${getTotalPrice()}</Text>
          </View>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.cartList}
          />
          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
            <Text style={styles.checkoutButtonText}>Check Out</Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  emptyMessage: {
    fontSize: 18,
    color: '#888',
    marginTop: 20,
  },
  cartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#f9f9f9',
  },
  cartHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cartList: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemImage: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  quantityButton: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  quantity: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemPrice: {
    fontSize: 16,
    color: '#888',
  },
  removeButton: {
    color: '#FF0000',
    fontWeight: 'bold',
    marginTop: 5,
  },
  checkoutButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  checkoutButtonText: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CartScreen;