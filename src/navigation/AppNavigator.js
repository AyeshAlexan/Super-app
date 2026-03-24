import React, { useState, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoadingScreen from "../screens/LoadingScreen";
import SuccessScreen from "../screens/SuccessScreen";
import AuthNavigator from "./AuthNavigator";
import BottomTabNavigator from "./BottomTabNavigator";

// Import your existing screens
import OrdersScreen from "../screens/ordersScreen";
import FavoritesScreen from "../screens/favoritesScreen";
import AddressesScreen from "../screens/addressScreen";
import PaymentsScreen from "../screens/PaymentmethodScreen";
import NotificationsScreen from "../screens/NotificationsScreen";

import CheckoutScreen from "../screens/checkoutscreen"; 

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  // Set to "demo-token" to skip login during development or make as null to require login
  const [userToken, setUserToken] = useState(null); 

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <LoadingScreen />;

  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right', 
        orientation: 'portrait',
        contentStyle: { backgroundColor: '#f9fafb' } 
      }}
    >
      {userToken == null ? (
        <Stack.Screen name="Auth">
          {(props) => <AuthNavigator {...props} setUserToken={setUserToken} />}
        </Stack.Screen>
      ) : (
        <>
          {/* Main App with Bottom Tabs */}
          <Stack.Screen 
            name="Main" 
            component={BottomTabNavigator} 
            options={{ animation: 'fade' }}
          />

          {/* Profile & Flow Screens (Overlay BottomBar) */}
          <Stack.Screen name="Orders" component={OrdersScreen} />
          <Stack.Screen name="Favorites" component={FavoritesScreen} />
          <Stack.Screen name="Addresses" component={AddressesScreen} />
          <Stack.Screen name="Payments" component={PaymentsScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />

          {/* ✅ 2. Add Checkout Screen to the stack */}
          <Stack.Screen 
            name="Checkout" 
            component={CheckoutScreen} 
            options={{ 
              animation: 'slide_from_bottom', // Optional: Slide up feel for checkout
            }} 
          />
          {/* ✅ Registering Success Screen */}
          <Stack.Screen 
            name="Success" 
            component={SuccessScreen} 
            options={{ 
              animation: 'fade',
              gestureEnabled: false // Prevent swiping back to checkout
            }} 
          />
        </>

      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;