import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CustomInput from "../componets/common/CustomeInput";
import HomeScreen from "./HomeScreen";

const { height } = Dimensions.get("window");

// ✅ ADD setUserToken HERE
const LoginScreen = ({ navigation, setUserToken }) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (email.trim() === "" || password.trim() === "") {
      Alert.alert("Missing Fields", "Please enter email and password");
      return;
    }

    // ✅ ADD SAFETY CHECK (important)
    if (setUserToken) {
      setUserToken("logged");
    } else {
      console.log("setUserToken not received");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient
        colors={["#16a34a", "#22c55e"]}
        style={styles.headerSection}
      >
        <Text style={styles.welcomeTitle}>Welcome Back</Text>
        <Text style={styles.welcomeSub}>Login to your account</Text>
      </LinearGradient>

      {/* Form Card */}
      <View style={styles.cardContainer}>
        <View style={styles.whiteCard}>

          <Text style={styles.label}>Email Address</Text>
          <CustomInput
            iconName="email-outline"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Password</Text>
          <CustomInput
            iconName="lock-outline"
            placeholder="Enter your password"
            isPassword
            rightIcon="eye-outline"
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.forgotContainer}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
            <LinearGradient
              colors={["#16a34a", "#22c55e"]}
              style={styles.loginGradient}
            >
              <Text style={styles.loginBtnText}>Login</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.line} />
            <Text style={styles.orText}>or continue with</Text>
            <View style={styles.line} />
          </View>

          {/* Social Buttons */}
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialBtn}>
              <MaterialCommunityIcons name="google" size={20} color="#DB4437" />
              <Text style={styles.socialText}>Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialBtn}>
              <MaterialCommunityIcons name="facebook" size={20} color="#1877F2" />
              <Text style={styles.socialText}>Facebook</Text>
            </TouchableOpacity>
          </View>

          {/* Signup */}
          <TouchableOpacity
            style={styles.footer}
            onPress={() => navigation.navigate("Signup")}
          >
            <Text style={styles.footerText}>
              Dont have an account?{" "}
              <Text style={styles.signUpLink}>Sign Up</Text>
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0fdf4",
  },
  headerSection: {
    height: height * 0.30,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    paddingTop: 30,
  },
  welcomeTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
  },
  welcomeSub: {
    fontSize: 16,
    color: "#dcfce7",
    marginTop: 6,
  },
  cardContainer: {
    flex: 1,
    paddingHorizontal: 22,
    marginTop: -70,
  },
  whiteCard: {
    backgroundColor: "#fff",
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingVertical: 30,
    borderWidth: 1,
    borderColor: "#dcfce7",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 25,
    elevation: 8,
  },
  label: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 6,
    marginTop: 12,
  },
  forgotContainer: {
    alignItems: "flex-end",
    marginTop: 8,
  },
  forgotText: {
    color: "#16a34a",
    fontSize: 13,
    fontWeight: "500",
  },
  loginBtn: {
    marginTop: 25,
  },
  loginGradient: {
    height: 55,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#22c55e",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  loginBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 28,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#e5e7eb",
  },
  orText: {
    marginHorizontal: 12,
    fontSize: 13,
    color: "#6b7280",
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  socialBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 0.48,
    height: 50,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 16,
  },
  socialText: {
    marginLeft: 8,
    fontWeight: "600",
    color: "#374151",
  },
  footer: {
    marginTop: 30,
    alignItems: "center",
  },
  footerText: {
    color: "#6b7280",
  },
  signUpLink: {
    color: "#16a34a",
    fontWeight: "600",
  },
});

export default LoginScreen;