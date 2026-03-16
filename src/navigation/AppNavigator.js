import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoadingScreen from '../screens/LoadingScreen';
import AuthNavigator from '../navigation/AuthNavigator';
import HomeScreen from '../screens/HomeScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  // You would eventually replace this with a real auth check (e.g., Firebase or AsyncStorage)
  const [userToken, setUserToken] = useState(null); 

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    // Keep the loading screen completely separate from the main stack 
    // to prevent any navigation glitches during the splash.
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userToken == null ? (
        // 1. If not logged in, they only see Auth screens
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        // 2. If logged in, they only see App screens
        <Stack.Screen name="Home" component={HomeScreen} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;