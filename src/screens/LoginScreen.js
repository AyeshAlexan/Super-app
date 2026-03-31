import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Modal,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import CustomInput from "../componets/common/CustomeInput";

// ✅ IMPORT ASYNC STORAGE
import AsyncStorage from "@react-native-async-storage/async-storage";

// ✅ IMPORT API SERVICE
import { loginUser } from "../services/authService";

const { height, width } = Dimensions.get("window");

const LoginScreen = ({ navigation, setUserToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [modalConfig, setModalConfig] = useState({
    visible: false,
    type: "success", 
    title: "",
    message: "",
  });

  const [showAnimationOverlay, setShowAnimationOverlay] = useState(false);
  const lottieRef = useRef(null);

  const showStatus = (type, title, message) => {
    setModalConfig({ visible: true, type, title, message });
    
    // Only auto-hide if it's an error. Success is handled in the handleLogin flow.
    if (type === "error") {
      setTimeout(() => {
        setModalConfig(prev => ({ ...prev, visible: false }));
      }, 2500);
    }
  };

  const handleLogin = async () => {
    if (email.trim() === "" || password.trim() === "") {
      showStatus("error", "Missing Fields", "Please enter both email and password.");
      return;
    }

    try {
      const res = await loginUser({ email, password });
      const token = res.data.token;

      // 🔥 FIX: SAVE THE TOKEN TO STORAGE HERE
      // This ensures your Cart service can find the token later
      await AsyncStorage.setItem("userToken", token);
      console.log("Token saved successfully:", token);

      // 1. Show Success Modal First
      showStatus("success", "Login Successful!", "Welcome back to Greenova.");

      // 2. Wait 1.2 seconds so user sees the message
      setTimeout(() => {
        setModalConfig(prev => ({ ...prev, visible: false }));
        setShowAnimationOverlay(true); // Switch to Green Animation Overlay

        // 3. Final small delay to prevent the "White Flash"
        // This ensures the green overlay is fully rendered before the screen switch
        setTimeout(() => {
          if (setUserToken) setUserToken(token);
        }, 800);
      }, 1200);
      
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Invalid email or password";
      showStatus("error", "Login Failed", errorMsg);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#16a34a" translucent />
      <View style={{ height: StatusBar.currentHeight || 40, backgroundColor: "#16a34a" }} />

      {/* --- Seamless Loading Overlay --- */}
      {showAnimationOverlay && (
        <View style={styles.animationOverlay}>
          <LottieView
            ref={lottieRef}
            source={require("../../assets/Images-1/Loading screen.json")}
            autoPlay
            loop
            style={{ width: width * 0.95, height: width * 0.95 }}
          />
          <Text style={styles.loadingText}>Verifying Account...</Text>
        </View>
      )}

      <View style={styles.mainContent}>
        <LinearGradient colors={["#16a34a", "#22c55e"]} style={styles.headerSection}>
          <View style={styles.headerInner}>
            <Text style={styles.welcomeTitle}>Welcome Back</Text>
            <Text style={styles.welcomeSub}>Login to your account</Text>
          </View>
        </LinearGradient>

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

            <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
              <LinearGradient colors={["#16a34a", "#22c55e"]} style={styles.loginGradient}>
                <Text style={styles.loginBtnText}>Login</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.line} />
              <Text style={styles.orText}>or continue with</Text>
              <View style={styles.line} />
            </View>

            <View style={styles.socialRow}>
              {/* ✅ UPDATED GOOGLE LOGO */}
              <TouchableOpacity style={styles.socialBtn}>
                <Image 
                  source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_Color_Logo.svg/1200px-Google_Color_Logo.svg.png' }} 
                  style={{ width: 20, height: 20 }} 
                />
                <Text style={styles.socialText}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialBtn}>
                <MaterialCommunityIcons name="facebook" size={20} color="#1877F2" />
                <Text style={styles.socialText}>Facebook</Text>
              </TouchableOpacity>
            </View>

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

        {/* Dynamic Status Modal */}
        <Modal visible={modalConfig.visible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View 
                style={[
                  styles.statusCircle, 
                  { backgroundColor: modalConfig.type === "success" ? "#16a34a" : "#ef4444" }
                ]}
              >
                <MaterialCommunityIcons 
                  name={modalConfig.type === "success" ? "check" : "alert-circle-outline"} 
                  size={50} 
                  color="#fff" 
                />
              </View>
              <Text style={styles.modalTitle}>{modalConfig.title}</Text>
              <Text style={styles.modalSub}>{modalConfig.message}</Text>
            </View>
          </View>
        </Modal>
      </View>

      <View style={{ height: 20, backgroundColor: "#000000" }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000" },
  mainContent: { flex: 1, backgroundColor: "#f0fdf4" },
  headerSection: {
    height: height * 0.25,
    width: "100%",
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  headerInner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeTitle: { fontSize: 36, fontWeight: "bold", color: "#fff" },
  welcomeSub: { fontSize: 16, color: "#dcfce7", marginTop: 6 },
  cardContainer: { flex: 1, paddingHorizontal: 22, marginTop: -20 },
  whiteCard: {
    backgroundColor: "#fff",
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingVertical: 30,
    borderWidth: 1,
    borderColor: "#dcfce7",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    elevation: 8,
  },
  label: { fontSize: 14, color: "#374151", marginBottom: 6, marginTop: 12 },
  forgotContainer: { alignItems: "flex-end", marginTop: 8 },
  forgotText: { color: "#16a34a", fontSize: 13, fontWeight: "500" },
  loginBtn: { marginTop: 25 },
  loginGradient: {
    height: 55,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  loginBtnText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  dividerRow: { flexDirection: "row", alignItems: "center", marginVertical: 20 },
  line: { flex: 1, height: 1, backgroundColor: "#e5e7eb" },
  orText: { marginHorizontal: 12, fontSize: 13, color: "#6b7280" },
  socialRow: { flexDirection: "row", justifyContent: "space-between" },
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
  socialText: { marginLeft: 8, fontWeight: "600", color: "#374151" },
  footer: { marginTop: 25, alignItems: "center" },
  footerText: { color: "#6b7280" },
  signUpLink: { color: "#16a34a", fontWeight: "600" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 30,
    alignItems: "center",
  },
  statusCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: { fontSize: 22, fontWeight: "bold", color: "#111827" },
  modalSub: { fontSize: 15, color: "#6b7280", marginTop: 8, textAlign: "center" },
  animationOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#16a34a",
    zIndex: 9999,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: -20,
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default LoginScreen;