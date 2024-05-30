import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity,SafeAreaView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout, updateProfile } from '../Features/Auth/AuthSlice';
import { API_BASE_URL } from '../config';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector((state) => state.auth.user);
  const [isUpdating, setIsUpdating] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Redirect to SignIn if user is not logged in
    if (!user) {
      navigation.replace('SignIn');
    }
  }, [user, navigation]);

  const handleLogout = () => {
    dispatch(logout());
    navigation.replace('SignIn');
  };

  const handleUpdate = () => {
    setIsUpdating(true);
  };

  const handleConfirm = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ name, password }),
      });
      const data = await response.json();
      if (data.status === 'OK') {
        dispatch(updateProfile(data));
        setIsUpdating(false);
        Alert.alert('Success', data.message);
      } else {
        Alert.alert('Error', data.message || 'An error occurred');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'An error occurred');
    }
  };

  const handleCancel = () => {
    setIsUpdating(false);
    setName(user.name);
    setPassword('');
  };

  if (!user) {
    return null; // Render nothing if user is not logged in
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Profile</Text>
      </View>
      {isUpdating ? (
        <View style={styles.formContainer}>
          <Text style={styles.label}>Name:</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor="#888"
          />
          <Text style={styles.label}>Password:</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Enter your password"
            placeholderTextColor="#888"
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.iconButton, styles.confirmButton]} onPress={handleConfirm}>
              <Icon name="check" size={24} color="#fff" />
              <Text style={styles.iconButtonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconButton, styles.cancelButton]} onPress={handleCancel}>
              <Icon name="cancel" size={24} color="#fff" />
              <Text style={styles.iconButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.info}>{user.name}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.info}>{user.email}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.iconButton, styles.updateButton]} onPress={handleUpdate}>
              <Icon name="edit" size={24} color="#fff" />
              <Text style={styles.iconButtonText}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconButton, styles.logoutButton]} onPress={handleLogout}>
              <Icon name="logout" size={24} color="#fff" />
              <Text style={styles.iconButtonText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>

);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#007BFF',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  formContainer: {
    padding: 20,
  },
  infoContainer: {
    padding: 20,
  },
  infoItem: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  info: {
    fontSize: 16,
    color: '#555',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  confirmButton: {
    backgroundColor: '#28a745',
  },
  cancelButton: {
    backgroundColor: '#dc3545',
  },
  updateButton: {
    backgroundColor: '#007BFF',
  },
  logoutButton: {
    backgroundColor: '#FFD700',
  },
  iconButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 5,
  },
});

export default ProfileScreen;