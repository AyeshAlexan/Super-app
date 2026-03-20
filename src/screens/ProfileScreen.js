import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import LiquidBottomNav from "../componets/common/BottomNav";

const { width } = Dimensions.get("window");

export default function ProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [isEditing, setIsEditing] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1 234 567 8900",
    address: "123 Main St, City, State 12345",
  });
  
  const [editedData, setEditedData] = useState(profileData);

  const handleEdit = () => {
    setEditedData(profileData);
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfileData(editedData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedData(profileData);
    setIsEditing(false);
  };

  // Main navigation items
  const menuItems = [
    { icon: "shopping-outline", label: "My Orders", count: "3", path: "Orders" },
    { icon: "heart-outline", label: "Favorites", count: "12", path: "Favorites" },
    { icon: "map-marker-outline", label: "Addresses", path: "Addresses" },
    { icon: "credit-card-outline", label: "Payment Methods", path: "Payments" },
    { icon: "bell-outline", label: "Notifications", path: "Notifications" },
  ];

  // Secondary settings items
  const settingsItems = [
    { icon: "cog-outline", label: "Settings", path: "Settings" },
    { icon: "help-circle-outline", label: "Help & Support", path: "Support" },
    { icon: "information-outline", label: "About App", path: "About" },
  ];

  const renderInputField = (icon, value, key, placeholder, type = "default") => (
    <View style={styles.inputRow}>
      <Icon name={icon} size={20} color="#9ca3af" style={styles.inputIcon} />
      {isEditing ? (
        <TextInput
          style={styles.textInput}
          value={editedData[key]}
          onChangeText={(text) => setEditedData({ ...editedData, [key]: text })}
          placeholder={placeholder}
          keyboardType={type}
        />
      ) : (
        <Text style={styles.infoText}>{value}</Text>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      {/* TOP SAFE AREA */}
      <View style={{ backgroundColor: "#16a34a", height: insets.top }} />
      <StatusBar barStyle="light-content" backgroundColor="#16a34a" />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        {/* Header Gradient */}
        <LinearGradient colors={["#16a34a", "#22c55e"]} style={styles.header}>
            <View style={styles.headerTop}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                <Icon name="arrow-left" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Profile</Text>
              <View style={{ width: 40 }} />
            </View>
        </LinearGradient>

        {/* Profile Card */}
        <View style={styles.profileCardWrapper}>
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
              <Icon name="account" size={40} color="#fff" />
             </View>
              <View style={styles.nameContainer}>
                <Text style={styles.profileName}>{profileData.name}</Text>
                <Text style={styles.memberSince}>Member since March 2026</Text>
              </View>
              
              {!isEditing ? (
                <TouchableOpacity onPress={handleEdit} style={styles.editBtn}>
                  <Icon name="pencil" size={16} color="#16a34a" />
                  <Text style={styles.editBtnText}>Edit</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.editActions}>
                  <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
                    <Icon name="check" size={20} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleCancel} style={styles.cancelBtn}>
                    <Icon name="close" size={20} color="#6b7280" />
                  </TouchableOpacity>
                </View>
                
              )}
            </View>

            <View style={styles.divider} />

            <View style={styles.infoSection}>
              {renderInputField("account-outline", profileData.name, "name", "Full Name")}
              {renderInputField("email-outline", profileData.email, "email", "Email Address", "email-address")}
              {renderInputField("phone-outline", profileData.phone, "phone", "Phone Number", "phone-pad")}
              {renderInputField("map-marker-outline", profileData.address, "address", "Address")}
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>Rs.2.4k</Text>
            <Text style={styles.statLabel}>Spent</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>15</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
        </View>

        {/* Main Menu List */}
        <View style={styles.menuWrapper}>
          <View style={styles.menuCard}>
            {menuItems.map((item, index) => (
              <TouchableOpacity 
                key={item.label} 
                onPress={() => navigation.navigate(item.path)}
                style={[styles.menuItem, index !== menuItems.length - 1 && styles.menuBorder]}
              >
                <View style={styles.menuIconBox}>
                  <Icon name={item.icon} size={22} color="#16a34a" />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                {item.count && (
                  <View style={styles.countBadge}>
                    <Text style={styles.countText}>{item.count}</Text>
                  </View>
                )}
                <Icon name="chevron-right" size={24} color="#d1d5db" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.menuWrapper}>
          <Text style={styles.sectionHeader}>SETTINGS & SUPPORT</Text>
          <View style={styles.menuCard}>
            {settingsItems.map((item, index) => (
              <TouchableOpacity 
                key={item.label} 
                onPress={() => navigation.navigate(item.path)}
                style={[styles.menuItem, index !== settingsItems.length - 1 && styles.menuBorder]}
              >
                <View style={[styles.menuIconBox, { backgroundColor: '#f3f4f6' }]}>
                  <Icon name={item.icon} size={22} color="#6b7280" />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Icon name="chevron-right" size={24} color="#d1d5db" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutBtn}
          onPress={() => navigation.replace("Auth")}
        >
          <Icon name="logout" size={22} color="#ef4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* NAVIGATION BAR */}
      <View style={[styles.navPosition, { bottom: insets.bottom > 0 ? insets.bottom + 10 : 30 }]}>
         <LiquidBottomNav />
      </View>

      {/* BOTTOM SAFE AREA */}
      <View style={{ backgroundColor: "#000", height: insets.bottom }} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingBottom: 60,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 10,
    paddingBottom: 10,
  },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "bold",marginTop: 15,},
  backBtn: { backgroundColor: "rgba(255,255,255,0.2)", padding: 8, borderRadius: 12 },
  profileCardWrapper: { paddingHorizontal: 20, marginTop: -40 },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  profileHeader: { flexDirection: "row", alignItems: "center" },
  avatarContainer: {
    width: 60,
    height: 60,
    backgroundColor: "#16a34a",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  nameContainer: { flex: 1, marginLeft: 15 },
  profileName: { fontSize: 18, fontWeight: "bold", color: "#1f2937" },
  memberSince: { fontSize: 12, color: "#9ca3af" },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0fdf4",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  editBtnText: { color: "#16a34a", fontWeight: "bold", marginLeft: 4, fontSize: 13 },
  editActions: { flexDirection: "row", gap: 8 },
  saveBtn: { backgroundColor: "#16a34a", padding: 8, borderRadius: 10 },
  cancelBtn: { backgroundColor: "#f3f4f6", padding: 8, borderRadius: 10 },
  divider: { height: 1, backgroundColor: "#f3f4f6", marginVertical: 20 },
  infoSection: { gap: 15 },
  inputRow: { flexDirection: "row", alignItems: "center" },
  inputIcon: { marginRight: 12 },
  infoText: { fontSize: 14, color: "#4b5563" },
  textInput: {
    flex: 1,
    height: 40,
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 20,
    justifyContent: "space-between",
  },
  statBox: {
    width: (width - 60) / 3,
    backgroundColor: "#fff",
    paddingVertical: 15,
    borderRadius: 20,
    alignItems: "center",
    elevation: 2,
  },
  statNumber: { fontSize: 18, fontWeight: "bold", color: "#16a34a" },
  statLabel: { fontSize: 11, color: "#6b7280", marginTop: 4 },
  menuWrapper: { paddingHorizontal: 20, marginTop: 20 },
  sectionHeader: { 
    fontSize: 12, 
    fontWeight: "800", 
    color: "#9ca3af", 
    marginBottom: 8, 
    marginLeft: 10,
    letterSpacing: 1 
  },
  menuCard: { backgroundColor: "#fff", borderRadius: 25, elevation: 2, overflow: "hidden" },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  menuBorder: { borderBottomWidth: 1, borderBottomColor: "#f3f4f6" },
  menuIconBox: {
    width: 40,
    height: 40,
    backgroundColor: "#f0fdf4",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: "600", color: "#374151" },
  countBadge: {
    backgroundColor: "#16a34a",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 10,
  },
  countText: { color: "#fff", fontSize: 11, fontWeight: "bold" },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fef2f2",
    marginHorizontal: 20,
    marginTop: 25,
    padding: 16,
    borderRadius: 20,
  },
  logoutText: { color: "#ef4444", fontWeight: "bold", marginLeft: 10, fontSize: 16 },
  navPosition: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  }
});