import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from '../Features/Auth/AuthSlice';

const OrdersScreen = ({ navigation }) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) {
      Alert.alert('Please sign in', 'You need to be logged in to access this screen.', [
        {
          text: 'Sign In',
          onPress: () => navigation.navigate('SignInScreen'),
        },
      ]);
    }
  }, [isLoggedIn, navigation]);

  return (
    <View style={styles.container}>
      <Text>Orders Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OrdersScreen;