import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import LoadingScreen from "../screens/LoadingScreen";
import AuthNavigator from "./AuthNavigator";
import BottomTabNavigator from "./BottomTabNavigator";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null); // if u don't want login in all time give put "null" in usestate

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  if (isLoading) return <LoadingScreen />;

  return (
   <Stack.Navigator screenOptions={{ headerShown: false }}>
  {userToken == null ? (
    <Stack.Screen name="Auth">
      {(props) => (
        <AuthNavigator {...props} setUserToken={setUserToken} />
      )}
    </Stack.Screen>
  ) : (
    <Stack.Screen name="Main" component={BottomTabNavigator} />
  )}
</Stack.Navigator>
);
};

export default AppNavigator;