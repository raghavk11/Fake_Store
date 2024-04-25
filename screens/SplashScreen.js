import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import * as Font from 'expo-font';

export default function SplashScreen({ navigation }) {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'LibreBaskerville-Bold': require('../assets/fonts/Libre_Baskerville/LibreBaskerville-Bold.ttf'),
        });
        setFontLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
      }
    }
    loadFonts();
  }, []);

  if (!fontLoaded) {
    // Font is not loaded yet, render a loading indicator or null
    return null;
  }

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/logo-fakestore.png')} style={styles.graphic} />
      <Text style={styles.slogan}>Real Products, Unreal Deals!</Text>
      <TouchableOpacity style={styles.shopButton} onPress={() => navigation.navigate('CategoryScreen')}>
        <Text style={styles.buttonText}>Shop Now!</Text>
      </TouchableOpacity>
      {/* Icons at the bottom (assuming you're using react-native-vector-icons) */}
      {/* ... */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007bff',
  },
  slogan: {
    fontSize: 24,
    color: '#FFD700',
    fontFamily: 'LibreBaskerville-Bold',
    marginBottom: 20,
  },
  graphic: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  shopButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#007bff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
