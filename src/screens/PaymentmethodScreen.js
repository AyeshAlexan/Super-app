import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  StatusBar,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; 
import BrandIcon from "react-native-vector-icons/FontAwesome";       
import { LinearGradient } from "expo-linear-gradient";
import LiquidBottomNav from "../componets/common/BottomNav";

// ✅ Import the Context Hook
import { usePayment } from "../context/PaymentContext";

const { width } = Dimensions.get("window");

export default function PaymentScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  
  // ✅ Connect to Context (Remove local setPaymentMethods state)
  const { paymentCards, addCard, setDefaultCard, deleteCard } = usePayment();

  const [modalVisible, setModalVisible] = useState(false);
  const [showCVV, setShowCVV] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });

  // --- Logic Helpers ---
  const formatCardNumber = (text) => {
    return text.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim().substring(0, 19);
  };

  const formatExpiry = (text) => {
    let cleaned = text.replace(/\D/g, ""); 
    if (cleaned.length > 2) {
      return cleaned.substring(0, 2) + "/" + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const getCardBrand = (number) => {
    const cleanNumber = number.replace(/\s?/g, "");
    if (cleanNumber.startsWith("4")) return "visa";
    if (cleanNumber.startsWith("5")) return "mastercard";
    return "credit-card"; 
  };

  const renderCardIcon = (brand, size = 40) => {
    if (brand === "visa") return <BrandIcon name="cc-visa" size={size} color="#fff" />;
    if (brand === "mastercard") return <BrandIcon name="cc-mastercard" size={size} color="#fff" />;
    return <Icon name="credit-card-outline" size={size} color="#fff" />;
  };

  const handleSave = () => {
    const brand = getCardBrand(formData.cardNumber);
    const cleanNumber = formData.cardNumber.replace(/\s/g, "");
    const masked = `**** **** **** ${cleanNumber.slice(-4)}`;
    
    const newCard = {
      brand: brand,
      cardNumber: masked,
      cardHolder: formData.cardHolder.toUpperCase(),
      expiryDate: formData.expiryDate,
      isDefault: true, // Make newly added card the default
    };

    // ✅ Call context function
    addCard(newCard);
    setModalVisible(false);
    setFormData({ cardNumber: "", cardHolder: "", expiryDate: "", cvv: "" });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      {/* ✅ TOP SAFE AREA (Green) */}
      <View style={{ backgroundColor: "#16a34a", height: insets.top }} />
      <StatusBar barStyle="light-content" backgroundColor="#16a34a" />

      <LinearGradient colors={["#16a34a", "#22c55e"]} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
            <Icon name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment Methods</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.headerBtn}>
            <Icon name="plus" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 140 }]}
        showsVerticalScrollIndicator={false}
      >
        {paymentCards.map((card) => (
          <View key={card.id} style={styles.cardWrapper}>
           <LinearGradient
  // ✅ Check for 'mastercard' (lowercase) to apply the orange gradient
  colors={
    card.brand === "visa" 
      ? ["#1e40af", "#3b82f6"] 
      : card.brand === "mastercard" 
        ? ["#ea580c", "#f97316"] // Orange for Mastercard
        : ["#4b5563", "#1f2937"] // Dark grey for others
  }
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={styles.creditCard}
>
              <View style={styles.cardHeader}>
                {renderCardIcon(card.brand)}
                {card.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultBadgeText}>Default</Text>
                  </View>
                )}
              </View>

              <Text style={styles.cardNumberText}>{card.cardNumber}</Text>

              <View style={styles.cardFooter}>
                <View>
                  <Text style={styles.cardLabel}>Cardholder</Text>
                  <Text style={styles.cardValue}>{card.cardHolder}</Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.cardLabel}>Expires</Text>
                  <Text style={styles.cardValue}>{card.expiryDate}</Text>
                </View>
              </View>
            </LinearGradient>

            <View style={styles.actionRow}>
              {!card.isDefault && (
                <TouchableOpacity onPress={() => setDefaultCard(card.id)} style={styles.setDefaultBtn}>
                  <Icon name="check-circle-outline" size={18} color="#16a34a" />
                  <Text style={styles.setDefaultText}>Set as Default</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => deleteCard(card.id)} style={styles.removeBtn}>
                <Icon name="trash-can-outline" size={18} color="#ef4444" />
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Modal remains the same... */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>
            <Text style={styles.modalTitle}>Add New Card</Text>
            
            <View style={styles.inputIconWrapper}>
                <TextInput 
                    placeholder="Card Number" 
                    style={[styles.input, { flex: 1, marginBottom: 0 }]} 
                    keyboardType="numeric"
                    maxLength={19}
                    value={formData.cardNumber}
                    onChangeText={(t) => setFormData({...formData, cardNumber: formatCardNumber(t)})}
                />
                <Icon name="credit-card-outline" size={24} color="#6b7280" style={{ marginLeft: 10 }} />
            </View>

            <TextInput 
              placeholder="Cardholder Name" 
              style={styles.input} 
              autoCapitalize="characters"
              value={formData.cardHolder} 
              onChangeText={(t) => setFormData({...formData, cardHolder: t})} 
            />
            
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TextInput 
                placeholder="MM/YY" 
                style={[styles.input, { flex: 1 }]} 
                keyboardType="numeric"
                maxLength={5}
                value={formData.expiryDate} 
                onChangeText={(t) => setFormData({...formData, expiryDate: formatExpiry(t)})} 
              />
              <View style={[styles.inputIconWrapper, { flex: 1 }]}>
                <TextInput 
                  placeholder="CVV" 
                  style={[styles.input, { flex: 1, marginBottom: 0 }]} 
                  secureTextEntry={!showCVV} 
                  keyboardType="numeric"
                  maxLength={3}
                  value={formData.cvv}
                  onChangeText={(t) => setFormData({...formData, cvv: t.replace(/\D/g, "")})}
                />
                <TouchableOpacity onPress={() => setShowCVV(!showCVV)}>
                  <Icon name={showCVV ? "eye-off" : "eye"} size={20} color="#6b7280" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>Save Payment Method</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={[styles.navContainer, { bottom: insets.bottom > 0 ? insets.bottom + 10 : 30 }]}>
        <LiquidBottomNav />
      </View>

      {/* ✅ BOTTOM SAFE AREA (Black) */}
      <View style={{ backgroundColor: "#000", height: insets.bottom }} />
    </View>
  );
}

const styles = StyleSheet.create({
  // ... Styles stay the same as your provided code
  header: { paddingBottom: 30, borderBottomLeftRadius: 35, borderBottomRightRadius: 35 },
  headerTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, marginTop: 10 },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  headerBtn: { backgroundColor: "rgba(255,255,255,0.2)", padding: 8, borderRadius: 12 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20 },
  cardWrapper: { marginBottom: 25, borderRadius: 25, backgroundColor: "#fff", elevation: 5, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10 },
  creditCard: { padding: 25, borderRadius: 25, height: 200, justifyContent: "space-between" },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  defaultBadge: { backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.5)" },
  defaultBadgeText: { color: "#fff", fontSize: 11, fontWeight: "bold" },
  cardNumberText: { color: "#fff", fontSize: 20, letterSpacing: 3, fontWeight: "600", marginVertical: 20 },
  cardFooter: { flexDirection: "row", justifyContent: "space-between" },
  cardLabel: { color: "rgba(255,255,255,0.7)", fontSize: 10, textTransform: "uppercase", marginBottom: 2 },
  cardValue: { color: "#fff", fontSize: 13, fontWeight: "bold" },
  actionRow: { flexDirection: "row", padding: 15, gap: 10 },
  setDefaultBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5, backgroundColor: "#f0fdf4", padding: 10, borderRadius: 12 },
  setDefaultText: { color: "#16a34a", fontWeight: "bold", fontSize: 13 },
  removeBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5, backgroundColor: "#fef2f2", padding: 10, borderRadius: 12 },
  removeText: { color: "#ef4444", fontWeight: "bold", fontSize: 13 },
  navContainer: { position: "absolute", left: 0, right: 0, alignItems: "center" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "#fff", borderTopLeftRadius: 35, borderTopRightRadius: 35, padding: 25 },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { backgroundColor: "#f3f4f6", borderRadius: 15, padding: 15, marginBottom: 12, color: "#1f2937" },
  inputIconWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: "#f3f4f6", borderRadius: 15, paddingRight: 15, marginBottom: 12 },
  saveBtn: { backgroundColor: "#16a34a", padding: 18, borderRadius: 15, alignItems: "center", marginTop: 10 },
  saveBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  cancelBtn: { padding: 15, alignItems: "center" },
  cancelBtnText: { color: "#6b7280", fontWeight: "500" }
});