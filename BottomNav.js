import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import CategoryScreen from './screens/CategoryScreen';
import CartScreen from './screens/CartScreen';
import OrdersScreen from './screens/OrdersScreen';
import AuthNavigator from './screens/AuthNavigator';
import { selectCartItemsCount } from './Features/Cart/CartSlice';
import { selectIsLoggedIn } from './Features/Auth/AuthSlice';
import { Alert } from 'react-native';

const Tab = createBottomTabNavigator();

const BottomNav = () => {
  const cartItemCount = useSelector(selectCartItemsCount);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const showLoginAlert = () => {
    Alert.alert(
      'Login Required',
      'You need to log in to access this feature.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Log In',
          onPress: () => {
            // No need to navigate, as the AuthNavigator will handle it
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="ProductsTab"
        component={CategoryScreen}
        options={{
          tabBarLabel: 'Products',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="store" size={size} color={color} />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (!isLoggedIn) {
              e.preventDefault();
              showLoginAlert();
            }
          },
        })}
      />
      <Tab.Screen
        name="CartTab"
        component={CartScreen}
        options={{
          tabBarLabel: 'My Cart',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="shopping-cart" size={size} color={color} />
          ),
          tabBarBadge: isLoggedIn && cartItemCount > 0 ? cartItemCount : null,
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (!isLoggedIn) {
              e.preventDefault();
              showLoginAlert();
            }
          },
        })}
      />
      <Tab.Screen
        name="OrdersTab"
        component={OrdersScreen}
        options={{
          tabBarLabel: 'My Orders',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="list-alt" size={size} color={color} />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (!isLoggedIn) {
              e.preventDefault();
              showLoginAlert();
            }
          },
        })}
      />
      <Tab.Screen
        name="AuthTab"
        component={AuthNavigator}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNav;