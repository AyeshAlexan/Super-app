import React, { useState, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoadingScreen from "../screens/LoadingScreen";
import AuthNavigator from "./AuthNavigator";
import BottomTabNavigator from "./BottomTabNavigator";

// Import your new profile-related screens
import OrdersScreen from "../screens/ordersScreen";
import FavoritesScreen from "../screens/favoritesScreen";
import AddressesScreen from "../screens/addressScreen";
import PaymentsScreen from "../screens/PaymentmethodScreen";
import NotificationsScreen from "../screens/NotificationsScreen";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  // Change to non-null if you want to skip login during development make demo-token to skip login
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

          {/* Profile Menu Screens */}
          {/* Adding these here allows them to overlay the BottomBar */}
          <Stack.Screen name="Orders" component={OrdersScreen} />
          <Stack.Screen name="Favorites" component={FavoritesScreen} />
          <Stack.Screen name="Addresses" component={AddressesScreen} />
          <Stack.Screen name="Payments" component={PaymentsScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;