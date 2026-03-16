import React, { useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";

const CustomInput = ({
  iconName,
  placeholder,
  isPassword,
  rightIcon,
  ...props
}) => {

  const [secureText, setSecureText] = useState(isPassword);

  return (
    <View style={styles.container}>

      {/* Left Icon */}
      <MaterialCommunityIcons
        name={iconName}
        size={20}
        color={COLORS.darkGrey}
        style={styles.icon}
      />

      {/* Input */}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        secureTextEntry={secureText}
        placeholderTextColor={COLORS.placeholder}
        {...props}
      />

      {/* Right Icon (Eye Toggle) */}
      {rightIcon && (
        <TouchableOpacity onPress={() => setSecureText(!secureText)}>
          <MaterialCommunityIcons
            name={secureText ? "eye-off-outline" : "eye-outline"}
            size={20}
            color={COLORS.darkGrey}
          />
        </TouchableOpacity>
      )}

    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.grey,
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 55,
    marginBottom: 10,
  },

  icon: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    color: COLORS.black,
    fontSize: 16,
  },

});

export default CustomInput;