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
import { LinearGradient } from "expo-linear-gradient";
import LiquidBottomNav from "../componets/common/BottomNav";
// ✅ STEP 1: Import Address Context
import { useAddress } from "../context/AddressContext";

const { width } = Dimensions.get("window");

export default function AddressScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  
  // ✅ STEP 2: Use Context instead of local state
  const { addresses, setAddresses, setDefaultAddress } = useAddress();

  // Form State
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    type: "home",
    label: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    isDefault: false,
  });

  // --- Logic Handlers ---

  // ✅ STEP 3: Handle Selection & Navigation back to Cart
  const handleSelectAddress = (id) => {
    setDefaultAddress(id);

    // If opened from Cart (passed via params) → go back
    if (route.params?.fromCart) {
      navigation.goBack();
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ type: "home", label: "", street: "", city: "", state: "", zipCode: "", phone: "", isDefault: false });
    setModalVisible(true);
  };

  const handleOpenEdit = (address) => {
    setEditingId(address.id);
    setFormData(address);
    setModalVisible(true);
  };

  const handleSave = () => {
    if (editingId) {
      setAddresses(prev => prev.map(addr => addr.id === editingId ? { ...formData, id: editingId } : addr));
    } else {
      const newId = Date.now();
      setAddresses(prev => [...prev, { ...formData, id: newId }]);
    }
    setModalVisible(false);
  };

  const handleDelete = (id) => {
    setAddresses(prev => prev.filter(addr => addr.id !== id));
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      {/* 1. TOP SAFE AREA (GREEN) */}
      <View style={{ backgroundColor: "#16a34a", height: insets.top }} />
      <StatusBar barStyle="light-content" backgroundColor="#16a34a" />

      {/* Header */}
      <LinearGradient colors={["#16a34a", "#22c55e"]} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
            <Icon name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Addresses</Text>
          <TouchableOpacity onPress={handleOpenAdd} style={styles.headerBtn}>
            <Icon name="plus" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 140 }]}
      >
        {addresses.map((address) => (
          <View key={address.id} style={[styles.addressCard, address.isDefault && styles.defaultBorder]}>
            <View style={styles.cardHeader}>
              <View style={styles.iconInfoRow}>
                <View style={styles.iconCircle}>
                  <Icon name={address.type === "home" ? "home-variant" : "briefcase"} size={24} color="#16a34a" />
                </View>
                <View>
                  <View style={styles.labelRow}>
                    <Text style={styles.labelText}>{address.label}</Text>
                    {address.isDefault && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultBadgeText}>Default</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.typeSubtext}>{address.type}</Text>
                </View>
              </View>
              
              <View style={styles.actionRow}>
                <TouchableOpacity onPress={() => handleOpenEdit(address)} style={styles.actionBtn}>
                  <Icon name="pencil-outline" size={20} color="#6b7280" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(address.id)} style={[styles.actionBtn, styles.deleteBtn]}>
                  <Icon name="trash-can-outline" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.detailsBox}>
              <Text style={styles.detailText}>{address.street}</Text>
              <Text style={styles.detailText}>{`${address.city}, ${address.state} ${address.zipCode}`}</Text>
              <Text style={styles.phoneText}>{address.phone}</Text>
            </View>

            {/* ✅ STEP 4: Updated Set Default / Select logic */}
            {!address.isDefault && (
              <TouchableOpacity 
                onPress={() => handleSelectAddress(address.id)} 
                style={styles.setDefaultBtn}
              >
                <Icon name="check" size={18} color="#16a34a" />
                <Text style={styles.setDefaultText}>
                  {route.params?.fromCart ? "Select this Address" : "Set as Default"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>

      {/* --- ADD/EDIT MODAL --- */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>
            <Text style={styles.modalTitle}>{editingId ? "Edit Address" : "Add New Address"}</Text>
            
            <View style={styles.typeSelector}>
              {["home", "work"].map((t) => (
                <TouchableOpacity 
                  key={t}
                  style={[styles.typeBtn, formData.type === t && styles.typeBtnActive]}
                  onPress={() => setFormData({...formData, type: t})}
                >
                  <Icon name={t === "home" ? "home" : "briefcase"} size={20} color={formData.type === t ? "#fff" : "#6b7280"} />
                  <Text style={[styles.typeBtnText, formData.type === t && {color: '#fff'}]}>{t.toUpperCase()}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput placeholder="Label (Home, Office)" style={styles.input} value={formData.label} onChangeText={(t) => setFormData({...formData, label: t})} />
            <TextInput placeholder="Street Address" style={styles.input} value={formData.street} onChangeText={(t) => setFormData({...formData, street: t})} />
            <View style={{flexDirection: 'row', gap: 10}}>
              <TextInput placeholder="City" style={[styles.input, {flex: 1}]} value={formData.city} onChangeText={(t) => setFormData({...formData, city: t})} />
              <TextInput placeholder="State" style={[styles.input, {flex: 1}]} value={formData.state} onChangeText={(t) => setFormData({...formData, state: t})} />
            </View>
            <TextInput placeholder="Phone Number" style={styles.input} value={formData.phone} keyboardType="phone-pad" onChangeText={(t) => setFormData({...formData, phone: t})} />

            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalBtn, styles.saveBtn]} onPress={handleSave}>
                <Text style={styles.saveBtnText}>Save Address</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.cancelBtn]} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Navigation Positioning */}
      <View style={[styles.navContainer, { bottom: insets.bottom > 0 ? insets.bottom + 10 : 30 }]}>
        <LiquidBottomNav />
      </View>

      {/* 2. BOTTOM SAFE AREA (BLACK) */}
      <View style={{ backgroundColor: "#000", height: insets.bottom }} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingBottom: 30, borderBottomLeftRadius: 35, borderBottomRightRadius: 35 },
  headerTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, marginTop: 10 },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  headerBtn: { backgroundColor: "rgba(255,255,255,0.2)", padding: 8, borderRadius: 12 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20 },
  addressCard: { 
    backgroundColor: "#fff", 
    borderRadius: 25, 
    padding: 20, 
    marginBottom: 20, 
    elevation: 4, 
    shadowColor: "#000", 
    shadowOpacity: 0.1, 
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    overflow: 'visible',
    marginHorizontal: 2 
  },
  defaultBorder: { borderWidth: 2, borderColor: "#22c55e" },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 15 },
  iconInfoRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconCircle: { width: 48, height: 48, backgroundColor: "#f0fdf4", borderRadius: 15, alignItems: "center", justifyContent: "center" },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  labelText: { fontSize: 18, fontWeight: "bold", color: "#1f2937" },
  defaultBadge: { backgroundColor: "#22c55e", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  defaultBadgeText: { color: "#fff", fontSize: 10, fontWeight: "bold" },
  typeSubtext: { color: "#9ca3af", fontSize: 12 },
  actionRow: { flexDirection: "row", gap: 8 },
  actionBtn: { width: 35, height: 35, backgroundColor: "#f3f4f6", borderRadius: 10, alignItems: "center", justifyContent: "center" },
  deleteBtn: { backgroundColor: "#fef2f2" },
  detailsBox: { marginBottom: 15 },
  detailText: { color: "#4b5563", fontSize: 14, marginBottom: 2 },
  phoneText: { color: "#9ca3af", fontSize: 13, marginTop: 4 },
  setDefaultBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#f0fdf4", paddingVertical: 10, borderRadius: 12 },
  setDefaultText: { color: "#16a34a", fontWeight: "bold", fontSize: 14 },
  navContainer: { position: "absolute", left: 0, right: 0, alignItems: "center" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: "#fff", borderTopLeftRadius: 35, borderTopRightRadius: 35, padding: 25 },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  typeSelector: { flexDirection: "row", gap: 10, marginBottom: 20 },
  typeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, borderRadius: 15, backgroundColor: '#f3f4f6' },
  typeBtnActive: { backgroundColor: '#16a34a' },
  typeBtnText: { fontWeight: 'bold', color: '#6b7280' },
  input: { backgroundColor: "#f3f4f6", borderRadius: 15, padding: 15, marginBottom: 12, fontSize: 14 },
  modalActions: { gap: 10, marginTop: 10 },
  modalBtn: { paddingVertical: 15, borderRadius: 15, alignItems: "center" },
  saveBtn: { backgroundColor: "#16a34a" },
  saveBtnText: { color: "#fff", fontWeight: "bold" },
  cancelBtn: { borderWidth: 1, borderColor: "#e5e7eb" },
  cancelBtnText: { color: "#6b7280", fontWeight: "bold" }
});