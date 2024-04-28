import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import * as Font from 'expo-font';

const { width, height } = Dimensions.get('window');

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


    const timer = setTimeout(() => {
      navigation.navigate('CategoryScreen');
    }, 3000); 

  
    return () => clearTimeout(timer);
  }, [navigation]);

  if (!fontLoaded) {
    return null; 
  }

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/Splash.png')} style={styles.graphic} resizeMode="cover" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  graphic: {
    width: width,
    height: height,
  },
});
