import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Modal,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomInput from "../componets/common/CustomeInput";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import LottieView from "lottie-react-native";

// ✅ IMPORT SERVICE
import { registerUser } from "../services/authService";

const { width } = Dimensions.get("window");

const SignupScreen = ({ navigation, setUserToken }) => {
  const lottieRef = useRef(null);

  // ✅ FORM STATES
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [town, setTown] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ✅ UI & MODAL STATES
  const [modalConfig, setModalConfig] = useState({
    visible: false,
    type: "success", 
    title: "",
    message: "",
  });
  const [showAnimationOverlay, setShowAnimationOverlay] = useState(false);

  // Helper for Logs and Modal
  const showStatus = (type, title, message) => {
    if (type === "error") {
      console.error(`[SIGNUP ERROR]: ${title} - ${message}`);
    } else {
      console.log(`[SIGNUP SUCCESS]: ${message}`);
    }

    setModalConfig({ visible: true, type, title, message });
    
    if (type === "error") {
      setTimeout(() => {
        setModalConfig(prev => ({ ...prev, visible: false }));
      }, 2500);
    }
  };

  // ✅ REGISTER FUNCTION
  const handleSignup = async () => {
    console.log("--- Registration Attempt Started ---");

    if (!name || !email || !phone || !street || !town || !password || !confirmPassword) {
      showStatus("error", "Missing Fields", "Please fill all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      showStatus("error", "Password Mismatch", "Passwords do not match.");
      return;
    }

    try {
      const payload = {
        name,
        email,
        phone,
        street,
        town,
        city: town,
        postal_code: postalCode,
        password,
        password_confirmation: confirmPassword,
      };

      const res = await registerUser(payload);
      console.log("API Registration Success:", res.data);
      const token = res.data.token;

      showStatus("success", "Welcome!", "Your account was created successfully.");

      setTimeout(() => {
        setModalConfig(prev => ({ ...prev, visible: false }));
        setShowAnimationOverlay(true);
        
        setTimeout(() => {
          if (setUserToken) setUserToken(token);
        }, 3000); 
      }, 2000);

    } catch (error) {
      const errorMsg = error.response?.data?.message || "Something went wrong during registration.";
      console.error("Full Registration Error:", error.response?.data || error.message);
      showStatus("error", "Registration Failed", errorMsg);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar backgroundColor="#000000" barStyle="light-content" />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.contentSafeArea}>
          <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subText}>Sign up to get started</Text>
            </View>

            {/* Form Card */}
            <View style={styles.formCard}>
              <Text style={styles.label}>Full Name</Text>
              <CustomInput iconName="account-outline" placeholder="Enter your name" value={name} onChangeText={setName} />

              <Text style={styles.label}>Email Address</Text>
              <CustomInput iconName="email-outline" placeholder="Enter your email" keyboardType="email-address" value={email} onChangeText={setEmail} />

              <Text style={styles.label}>Phone Number</Text>
              <CustomInput iconName="phone-outline" placeholder="Enter your phone number" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />

              <Text style={styles.label}>Street Address</Text>
              <CustomInput iconName="map-marker-outline" placeholder="Enter your street address" value={street} onChangeText={setStreet} />

              <View style={styles.row}>
                <View style={styles.flex1}>
                  <Text style={styles.label}>Town / City</Text>
                  <CustomInput iconName="city-variant-outline" placeholder="City" value={town} onChangeText={setTown} />
                </View>
                <View style={[styles.flex1, { marginLeft: 15 }]}>
                  <Text style={styles.label}>Postal Code</Text>
                  <CustomInput iconName="mailbox-outline" placeholder="Zip" keyboardType="numeric" value={postalCode} onChangeText={setPostalCode} />
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.flex1}>
                  <Text style={styles.label}>Password</Text>
                  <CustomInput 
                    iconName="lock-outline" 
                    placeholder="Create" 
                    isPassword 
                    rightIcon="eye-outline" // Restored Eye
                    value={password} 
                    onChangeText={setPassword} 
                  />
                </View>
                <View style={[styles.flex1, { marginLeft: 15 }]}>
                  <Text style={styles.label}>Confirm</Text>
                  <CustomInput 
                    iconName="lock-check-outline" 
                    placeholder="Repeat" 
                    isPassword 
                    rightIcon="eye-outline" // Restored Eye
                    value={confirmPassword} 
                    onChangeText={setConfirmPassword} 
                  />
                </View>
              </View>

              <TouchableOpacity style={styles.createBtn} onPress={handleSignup}>
                <Text style={styles.createBtnText}>Create Account</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.footer}>
                <Text style={styles.footerText}>Already have an account? <Text style={styles.link}>Login</Text></Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>

      {/* ✅ DYNAMIC STATUS MODAL */}
      <Modal visible={modalConfig.visible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View 
              style={[
                styles.statusCircle, 
                { backgroundColor: modalConfig.type === "success" ? "#00C853" : "#ef4444" }
              ]}
            >
              <Icon 
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

      {/* ✅ FULL SCREEN ANIMATION OVERLAY */}
      {showAnimationOverlay && (
        <View style={styles.animationOverlay}>
          <LottieView
            ref={lottieRef}
            source={require("../../assets/Images-1/Loading screen.json")}
            autoPlay
            loop={false}
            style={{ width: width * 0.95, height: width * 0.95 }}
          />
        </View>
      )}

      <View style={styles.bottomNavFix} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#000000" },
  safeArea: { flex: 1, backgroundColor: "#000000" },
  contentSafeArea: { flex: 1, backgroundColor: "#ffffff" },
  scrollContainer: { flexGrow: 1 },
  header: {
    backgroundColor: "#00C853",
    paddingTop: 40,
    paddingBottom: 80,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 45,
    borderBottomRightRadius: 45,
    alignItems: "center",
  },
  title: { fontSize: 34, fontWeight: "900", color: "#FFFFFF" },
  subText: { color: "rgba(255,255,255,0.9)", fontSize: 16, marginTop: 4 },
  formCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: -40,
    borderRadius: 30,
    padding: 20,
    marginBottom: 30,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  flex1: { flex: 1 },
  label: { fontSize: 13, fontWeight: "700", marginTop: 15, marginBottom: 5, color: "#374151" },
  createBtn: { backgroundColor: "#00C853", paddingVertical: 16, borderRadius: 15, alignItems: "center", marginTop: 25 },
  createBtnText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 18 },
  footer: { marginTop: 20, marginBottom: 5 },
  footerText: { textAlign: "center", color: "#6B7280", fontSize: 14 },
  link: { color: "#00C853", fontWeight: "800" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 35,
    padding: 30,
    alignItems: "center",
  },
  statusCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: { fontSize: 22, fontWeight: "bold", color: "#111827", textAlign: "center" },
  modalSub: { fontSize: 15, color: "#6b7280", textAlign: "center", marginTop: 10 },
  animationOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#16a34a",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  bottomNavFix: { height: 0, backgroundColor: "#000000" },
});

export default SignupScreen;