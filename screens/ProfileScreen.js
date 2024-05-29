import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native';
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
  const [name, setName] = useState(user?.name || ''); // Handle potential null user
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!user) {
      navigation.replace('SignIn'); // Redirect to SignIn if user is not logged in
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
    <View style={styles.container}>
      {isUpdating ? (
        <View style={styles.formContainer}>
          <Text style={styles.label}>Name:</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
          <Text style={styles.label}>Password:</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.iconButton} onPress={handleConfirm}>
              <Icon name="check" size={24} color="#fff" />
              <Text style={styles.iconButtonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={handleCancel}>
              <Icon name="cancel" size={24} color="#fff" />
              <Text style={styles.iconButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.info}>{user.name}</Text>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.info}>{user.email}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.iconButton} onPress={handleUpdate}>
              <Icon name="edit" size={24} color="#fff" />
              <Text style={styles.iconButtonText}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
              <Icon name="logout" size={24} color="#fff" />
              <Text style={styles.iconButtonText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoContainer: {
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  iconButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 5,
  },
});

export default ProfileScreen;