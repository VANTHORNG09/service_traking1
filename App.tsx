import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useAuthStore } from './src/store/authStore';
import * as Font from 'expo-font';

export default function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    // Load custom fonts
    const loadFonts = async () => {
      await Font.loadAsync({
        'font-awesome': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/FontAwesome.ttf'),
      });
    };
    
    loadFonts();
    checkAuth();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}