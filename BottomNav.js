import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import CategoryScreen from './screens/CategoryScreen';
import CartScreen from './screens/CartScreen';
import OrdersScreen from './screens/OrdersScreen';
import ProfileScreen from './screens/ProfileScreen';
import ProductListScreen from './screens/ProductListScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import { selectCartItemsCount } from './Features/Cart/CartSlice';
import { selectIsLoggedIn } from './Features/Auth/AuthSlice';
import { createStackNavigator } from '@react-navigation/stack';

const Tab = createBottomTabNavigator();
const ProductStack = createStackNavigator();

const ProductStackNavigator = () => {
  return (
    <ProductStack.Navigator screenOptions={{ headerShown: false }}>
      <ProductStack.Screen name="CategoryScreen" component={CategoryScreen} />
      <ProductStack.Screen name="ProductListScreen" component={ProductListScreen} />
      <ProductStack.Screen name="ProductDetailScreen" component={ProductDetailScreen} />
    </ProductStack.Navigator>
  );
};

const BottomNav = () => {
  const cartItemCount = useSelector(selectCartItemsCount);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="ProductsTab"
        component={ProductStackNavigator}
        options={{
          tabBarLabel: 'Products',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="store" size={size} color={color} />
          ),
        }}
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
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
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