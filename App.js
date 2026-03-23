import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Your Custom Navigators and Contexts
import AppNavigator from './src/navigation/AppNavigator';
import { CartProvider } from "./src/context/CartContext";
import { AddressProvider } from "./src/context/AddressContext";
import { PaymentProvider } from "./src/context/PaymentContext"; 

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AddressProvider>
          <PaymentProvider>
            <CartProvider>
              <AppNavigator />
            </CartProvider>
          </PaymentProvider>
        </AddressProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}