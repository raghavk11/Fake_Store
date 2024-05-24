import React from 'react';
import { useSelector } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';
import ProfileScreen from './ProfileScreen';
import { selectIsLoggedIn } from '../Features/Auth/AuthSlice';
const Stack = createStackNavigator();
const AuthScreen = () => {
const isLoggedIn = useSelector(selectIsLoggedIn);
return (
<Stack.Navigator screenOptions={{ headerShown: false }}>
{isLoggedIn ? (
<Stack.Screen name="Profile" component={ProfileScreen} />
) : (
<>
<Stack.Screen name="SignIn" component={SignInScreen} />
<Stack.Screen name="SignUp" component={SignUpScreen} />
</>
)}
</Stack.Navigator>
);
};
export default AuthScreen;