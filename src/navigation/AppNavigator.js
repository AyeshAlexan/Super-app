import React, { useState, useEffect } from "react";
// Change: Switch to createNativeStackNavigator for native performance
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoadingScreen from "../screens/LoadingScreen";
import AuthNavigator from "./AuthNavigator";
import BottomTabNavigator from "./BottomTabNavigator";

// Use the Native Stack
const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null); // if u don't want login in all time give put "null" in usestate

  useEffect(() => {
    // Artificial loading delay
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer); // Clean up timeout
  }, []);

  if (isLoading) return <LoadingScreen />;

  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        // Native optimization settings:
        animation: 'slide_from_right', // Smooth liquid movement
        orientation: 'portrait',
        contentStyle: { backgroundColor: '#f9fafb' } // Prevents white flash between screens
      }}
    >
      {userToken == null ? (
        <Stack.Screen name="Auth">
          {(props) => (
            <AuthNavigator {...props} setUserToken={setUserToken} />
          )}
        </Stack.Screen>
      ) : (
        <Stack.Screen 
          name="Main" 
          component={BottomTabNavigator} 
          options={{
             // Prevents the "jumpy" feel when switching from Auth to Main
             animation: 'fade' 
          }}
        />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;