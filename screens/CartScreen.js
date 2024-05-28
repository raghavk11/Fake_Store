// Imports
import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, SafeAreaView, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { incrementQuantity, decrementQuantity, removeItem, uploadCart } from '../Features/Cart/CartSlice';
import { addOrder } from '../Features/Orders/OrdersSlice';
import { selectIsLoggedIn } from '../Features/Auth/AuthSlice';

// Component
const CartScreen = ({ navigation }) => {
  const cartItems = useSelector((state) => state.cart.items);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const dispatch = useDispatch();

  useEffect(() => {
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
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity style={styles.quantityButton} onPress={() => dispatch(incrementQuantity(item.id))}>
            <Text style={styles.quantityButtonText}>+</Text>
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
      const order = { id: new Date().getTime().toString(), items: cartItems, total: getTotalPrice() };

      await dispatch(uploadCart(cartItems)).unwrap();
      dispatch(addOrder(order));
      cartItems.forEach((item) => dispatch(removeItem(item.id)));

      Alert.alert('Checkout Successful', 'New order has been created', [{ text: 'OK', onPress: () => navigation.navigate('OrdersTab') }]);
    } catch (error) {
      console.error('Error creating order:', error);
      Alert.alert('Checkout Failed', 'An error occurred while creating the order', [{ text: 'OK' }]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyMessage}>Your shopping cart is empty</Text>
        </View>
      ) : (
        <>
          <View style={styles.cartHeader}>
            <Text style={styles.cartHeaderText}>Total Items: {getTotalQuantity()}</Text>
            <Text style={styles.cartHeaderText}>Total Price: ${getTotalPrice()}</Text>
          </View>
          <FlatList data={cartItems} renderItem={renderCartItem} keyExtractor={(item) => item.id.toString()} contentContainerStyle={styles.cartList} />
          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
            <Text style={styles.checkoutButtonText}>Check Out</Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyMessage: { fontSize: 18, color: '#888' },
  cartHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#ccc', backgroundColor: '#f9f9f9' },
  cartHeaderText: { fontSize: 16, fontWeight: 'bold' },
  cartList: { paddingHorizontal: 20, paddingTop: 10 },
  cartItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  itemImage: { width: 80, height: 80, marginRight: 10 },
  itemDetails: { flex: 1 },
  itemTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  quantityButton: { backgroundColor: '#ddd', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 },
  quantityButtonText: { fontSize: 18, fontWeight: 'bold' },
  quantity: { marginHorizontal: 10, fontSize: 16 },
  itemPrice: { fontSize: 16, color: '#888' },
  removeButton: { color: '#FF0000', fontWeight: 'bold', marginTop: 5 },
  checkoutButton: { backgroundColor: '#007BFF', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5, alignSelf: 'center', marginTop: 20, marginBottom: 10 },
  checkoutButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default CartScreen;