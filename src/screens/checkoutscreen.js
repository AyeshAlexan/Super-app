import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import BrandIcon from "react-native-vector-icons/FontAwesome";
import LottieView from 'lottie-react-native';

// ✅ Context Hooks
import { useCart } from "../context/CartContext";
import { useAddress } from "../context/AddressContext";
import { usePayment } from "../context/PaymentContext";

export default function CheckoutScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  // ✅ Context Data
  const { cartItems, clearCart } = useCart(); 
  const { addresses, getDefaultAddress } = useAddress();
  const { getDefaultCard } = usePayment();

  // ✅ State
  const [deliveryOption, setDeliveryOption] = useState("standard");
  const [paymentType, setPaymentType] = useState("cash");
  const [isLoading, setIsLoading] = useState(false); 
  
  // ✅ Dynamic Selection
  const selectedAddress = getDefaultAddress() || addresses[0];
  const selectedCard = getDefaultCard();

  // ✅ Totals Calculation
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = deliveryOption === "express" ? 250.0 : 50.0;
  const total = subtotal + deliveryFee;

  // ✅ Place Order Handler
  const handlePlaceOrder = () => {
    setIsLoading(true);
    
    // Simulate order processing (3 seconds)
    setTimeout(() => {
      setIsLoading(false);
      clearCart(); 
      navigation.replace("Success", { paymentType }); 
    }, 3000);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <View style={{ backgroundColor: "#16a34a", height: insets.top }} />
      <StatusBar barStyle="light-content" />

      <View style={{ flex: 1, backgroundColor: "#f9fafb" }}>
        {/* Header */}
        <LinearGradient colors={["#16a34a", "#22c55e"]} style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
              <Icon name="arrow-left" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Checkout</Text>
            {/* ✅ FIXED: Changed <div> to <View> */}
            <View style={{ width: 40 }} />
          </View>
        </LinearGradient>

        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 150 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* 1. Address Section */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Delivery Address</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Addresses")}>
                <Text style={styles.editLink}>Change</Text>
              </TouchableOpacity>
            </View>
            {selectedAddress ? (
              <View style={styles.selectedInfoRow}>
                <View style={styles.iconCircle}>
                  <Icon name="map-marker" size={20} color="#16a34a" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoLabel}>{selectedAddress.label || "Home"}</Text>
                  <Text style={styles.infoSubtext}>{selectedAddress.street}, {selectedAddress.city}</Text>
                </View>
              </View>
            ) : (
              <Text style={styles.infoSubtext}>Please add a delivery address</Text>
            )}
          </View>

          {/* 2. Delivery Method */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Delivery Method</Text>
            <View style={styles.rowContainer}>
              <TouchableOpacity
                style={[styles.smallMethod, deliveryOption === "standard" && styles.activeMethod]}
                onPress={() => setDeliveryOption("standard")}
              >
                <Icon name="truck-delivery" size={24} color={deliveryOption === "standard" ? "#16a34a" : "#6b7280"} />
                <Text style={styles.methodName}>Standard</Text>
                <Text style={styles.methodPrice}>Rs.50</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.smallMethod, deliveryOption === "express" && styles.activeMethod]}
                onPress={() => setDeliveryOption("express")}
              >
                <Icon name="lightning-bolt" size={24} color={deliveryOption === "express" ? "#16a34a" : "#6b7280"} />
                <Text style={styles.methodName}>Express</Text>
                <Text style={styles.methodPrice}>Rs.250</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 3. Payment Type */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Payment Type</Text>
            <View style={styles.rowContainer}>
              <TouchableOpacity
                style={[styles.smallMethod, paymentType === "cash" && styles.activeMethod]}
                onPress={() => setPaymentType("cash")}
              >
                <Icon name="cash-marker" size={24} color={paymentType === "cash" ? "#16a34a" : "#6b7280"} />
                <Text style={styles.methodName}>Cash on Delivery</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.smallMethod, paymentType === "card" && styles.activeMethod]}
                onPress={() => setPaymentType("card")}
              >
                <Icon name="credit-card-outline" size={24} color={paymentType === "card" ? "#16a34a" : "#6b7280"} />
                <Text style={styles.methodName}>Pay with Card</Text>
              </TouchableOpacity>
            </View>

            {paymentType === "card" && (
              <View style={styles.cardDetailsBox}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.infoLabel}>Selected Card</Text>
                  <TouchableOpacity onPress={() => navigation.navigate("Payments")}>
                    <Text style={styles.editLink}>Change</Text>
                  </TouchableOpacity>
                </View>
                {selectedCard ? (
                  <View style={styles.selectedInfoRow}>
                    <View style={[styles.iconCircle, { backgroundColor: selectedCard.brand === "visa" ? "#1e40af" : "#ea580c" }]}>
                      <BrandIcon name={selectedCard.brand === "visa" ? "cc-visa" : "cc-mastercard"} size={16} color="#fff" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.infoLabel}>{selectedCard.brand.toUpperCase()} {selectedCard.cardNumber}</Text>
                      <Text style={styles.infoSubtext}>{selectedCard.cardHolder}</Text>
                    </View>
                  </View>
                ) : (
                  <Text style={[styles.infoSubtext, { marginTop: 10 }]}>No card selected</Text>
                )}
              </View>
            )}
          </View>

          {/* 4. Order Summary */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            {cartItems.map((item, index) => (
              <View key={index} style={styles.summaryRow}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                  <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="cover" />
                  <Text style={styles.summaryText}>{item.name} x {item.quantity}</Text>
                </View>
                <Text style={styles.summaryPrice}>Rs.{(item.price * item.quantity).toFixed(2)}</Text>
              </View>
            ))}
            <View style={styles.divider} />
            <View style={styles.summaryRow}><Text style={styles.summaryText}>Subtotal</Text><Text style={styles.summaryPrice}>Rs.{subtotal.toFixed(2)}</Text></View>
            <View style={styles.summaryRow}><Text style={styles.summaryText}>Delivery</Text><Text style={styles.summaryPrice}>Rs.{deliveryFee.toFixed(2)}</Text></View>
            <View style={[styles.summaryRow, { marginTop: 10 }]}><Text style={styles.totalLabel}>Total</Text><Text style={styles.totalPrice}>Rs.{total.toFixed(2)}</Text></View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + 15 }]}>
          <TouchableOpacity 
            style={styles.placeOrderBtn} 
            onPress={handlePlaceOrder}
          >
            <Text style={styles.placeOrderText}>Place Order</Text>
            <View style={styles.priceBadge}>
              <Text style={styles.badgeText}>Rs.{total.toFixed(2)}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ backgroundColor: "#000", height: insets.bottom }} />
      </View>

      {/* ✅ Lottie Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <LottieView
            source={require("../../assets/Images-1/Delivery Truck.json")} 
            autoPlay
            loop
            style={{ width: 280, height: 280 }}
          />
          <Text style={styles.loadingText}>Processing Order...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingBottom: 25, borderBottomLeftRadius: 35, borderBottomRightRadius: 35 },
  headerTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, marginTop: 10 },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  headerBtn: { backgroundColor: "rgba(255,255,255,0.2)", padding: 8, borderRadius: 12 },
  scrollContent: { padding: 20 },
  sectionCard: { backgroundColor: "#fff", borderRadius: 25, padding: 20, marginBottom: 20, elevation: 3 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sectionTitle: { fontSize: 17, fontWeight: "bold", color: "#1f2937", marginBottom: 15 },
  editLink: { color: "#16a34a", fontWeight: "bold" },
  rowContainer: { flexDirection: 'row', gap: 12 },
  smallMethod: { flex: 1, alignItems: 'center', padding: 15, borderRadius: 18, borderWidth: 1.5, borderColor: "#f3f4f6", backgroundColor: '#fff' },
  activeMethod: { borderColor: "#16a34a", backgroundColor: "#f0fdf4" },
  methodName: { fontWeight: "bold", fontSize: 12, marginTop: 5, textAlign: 'center' },
  methodPrice: { color: "#16a34a", fontSize: 12, fontWeight: 'bold' },
  cardDetailsBox: { marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  selectedInfoRow: { flexDirection: "row", alignItems: "center", gap: 15, marginTop: 12 },
  iconCircle: { width: 45, height: 45, borderRadius: 15, backgroundColor: "#f0fdf4", alignItems: "center", justifyContent: "center" },
  infoLabel: { fontWeight: "bold", color: "#1f2937" },
  infoSubtext: { color: "#6b7280", fontSize: 13 },
  itemImage: { width: 50, height: 50, borderRadius: 12 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 },
  summaryText: { color: "#6b7280", fontSize: 14 },
  summaryPrice: { fontWeight: "bold", color: "#1f2937" },
  divider: { height: 1, backgroundColor: "#f3f4f6", marginVertical: 12 },
  totalLabel: { fontWeight: "bold", fontSize: 18 },
  totalPrice: { fontWeight: "bold", fontSize: 22, color: "#16a34a" },
  footer: { backgroundColor: "#fff", padding: 20, borderTopLeftRadius: 30, borderTopRightRadius: 30, elevation: 20 },
  placeOrderBtn: { backgroundColor: "#16a34a", flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 18, borderRadius: 20 },
  placeOrderText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  priceBadge: { marginLeft: 12, backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  badgeText: { color: "#fff", fontWeight: "bold" },
  loadingOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  loadingText: { marginTop: 10, fontSize: 16, fontWeight: 'bold', color: '#16a34a' }
});