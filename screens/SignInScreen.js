import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { login } from '../Features/Auth/AuthSlice';
import { API_BASE_URL } from '../config';
import { Ionicons } from '@expo/vector-icons';

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleSignIn = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.status === 'OK') {
        dispatch(login(data));
        navigation.replace('MainApp');
      } else {
        Alert.alert('Error', data.message || 'An error occurred during sign-in');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      Alert.alert('Error', 'An error occurred during sign-in');
    }
  };

  const handleSwitchToSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Ionicons name="log-in" size={80} color="#007BFF" />
        <Text style={styles.headerText}>Sign In</Text>
      </View>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.switchContainer}>
        <Text style={styles.switchText}>Don't have an account?</Text>
        <TouchableOpacity onPress={handleSwitchToSignUp}>
          <Text style={styles.switchButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
  },
  signInButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  switchText: {
    fontSize: 16,
    color: '#333',
  },
  switchButtonText: {
    fontSize: 16,
    color: '#007BFF',
    marginLeft: 5,
  },
});

export default SignInScreen;