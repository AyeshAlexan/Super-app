import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";

const Stack = createStackNavigator();

const AuthNavigator = ({ setUserToken }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

      <Stack.Screen name="Login">
        {(props) => (
          <LoginScreen
            {...props}
            setUserToken={setUserToken}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Signup">
        {(props) => (
          <SignupScreen
            {...props}
            setUserToken={setUserToken}
          />
        )}
      </Stack.Screen>

    </Stack.Navigator>
  );
};

export default AuthNavigator;