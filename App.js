import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { CartProvider } from "./src/context/CartContext";
import { AddressProvider } from "./src/context/AddressContext";

export default function App() {
  return (
    <AddressProvider>
      <CartProvider> 
        <SafeAreaProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </CartProvider>
    </AddressProvider>
  );
}