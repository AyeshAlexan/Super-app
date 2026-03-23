import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";

export default function SuccessScreen({ navigation, route }) {
  const { paymentType } = route.params || { paymentType: 'cash' };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.iconCircle}>
          <Icon name="check-bold" size={60} color="#16a34a" />
        </View>

        <Text style={styles.title}>Order Placed!</Text>
        <Text style={styles.subtitle}>
          Your order has been successfully processed. 
          {paymentType === 'cash' 
            ? " Please have your cash ready upon delivery." 
            : " Your payment was confirmed via card."}
        </Text>

        <View style={styles.orderIdBox}>
          <Text style={styles.orderIdLabel}>Order ID</Text>
          <Text style={styles.orderIdValue}>#ORD-77291</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.homeBtn}
          onPress={() => navigation.navigate("Main")} 
        >
          <LinearGradient colors={["#16a34a", "#22c55e"]} style={styles.gradientBtn}>
            <Text style={styles.homeBtnText}>Back to Home</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  iconCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: "#f0fdf4", alignItems: 'center', justifyContent: 'center', marginBottom: 30 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1f2937', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#6b7280', textAlign: 'center', lineHeight: 24 },
  orderIdBox: { marginTop: 40, padding: 15, backgroundColor: '#f9fafb', borderRadius: 15, width: '100%', alignItems: 'center' },
  orderIdLabel: { color: '#9ca3af', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 },
  orderIdValue: { fontSize: 18, fontWeight: 'bold', color: '#1f2937', marginTop: 5 },
  footer: { padding: 20 },
  homeBtn: { height: 60, borderRadius: 20, overflow: 'hidden' },
  gradientBtn: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  homeBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});