import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import LiquidBottomNav from "../componets/common/BottomNav";

const { width, height } = Dimensions.get("window");

const orders = [
  {
    id: "1",
    orderNumber: "ORD-2026-001",
    date: "March 15, 2026",
    status: "delivered",
    items: 3,
    total: 2450.0,
    products: [
      { name: "Organic Potatoes", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSynSxfuS-ZlslRivEagHusfOyrtGucZQiVYw&s" },
      { name: "Fresh Tomatoes", image: "https://images.unsplash.com/photo-1443131612988-32b6d97cc5da?q=80&w=400" },
      { name: "Milk", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=200" },
    ],
  },
  {
    id: "2",
    orderNumber: "ORD-2026-002",
    date: "March 16, 2026",
    status: "shipped",
    items: 2,
    total: 1580.0,
    products: [
      { name: "Fresh Milk", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=200" },
      { name: "Fresh Bread", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=200" },
    ],
  },
];

const statusConfig = {
  pending: { label: "Pending", icon: "clock-outline", color: "#6b7280", bg: "#f3f4f6" },
  processing: { label: "Processing", icon: "package-variant", color: "#3b82f6", bg: "#eff6ff" },
  shipped: { label: "Shipped", icon: "truck-delivery-outline", color: "#8b5cf6", bg: "#f5f3ff" },
  delivered: { label: "Delivered", icon: "check-circle-outline", color: "#16a34a", bg: "#f0fdf4" },
};

export default function OrdersScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState("all");

  const filteredOrders = orders.filter((order) => {
    if (selectedTab === "all") return true;
    return order.status === selectedTab;
  });

  const getEmptyMessage = () => {
    if (selectedTab === "all") return "You haven't placed any orders yet.";
    return `You don't have any ${selectedTab} orders.`;
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      {/* Top Safe Area - Green */}
      <View style={{ backgroundColor: "#16a34a", height: insets.top }} />
      <StatusBar barStyle="light-content" backgroundColor="#16a34a" />

      {/* Header */}
      <LinearGradient colors={["#16a34a", "#22c55e"]} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Icon name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Orders</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
          {["all", "pending", "shipped", "delivered"].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setSelectedTab(tab)}
              style={[
                styles.tab,
                selectedTab === tab && styles.activeTab
              ]}
            >
              <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 150, paddingTop: 10 }}>
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => {
            const config = statusConfig[order.status];
            return (
              <View key={order.id} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <View>
                    <Text style={styles.orderId}>{order.orderNumber}</Text>
                    <Text style={styles.orderDate}>{order.date}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
                    <Icon name={config.icon} size={16} color={config.color} />
                    <Text style={[styles.statusLabel, { color: config.color }]}>{config.label}</Text>
                  </View>
                </View>

                <View style={styles.productStrip}>
                  {order.products.slice(0, 3).map((p, i) => (
                    <Image key={i} source={{ uri: p.image }} style={styles.productThumb} />
                  ))}
                  {order.items > 3 && (
                    <View style={styles.moreThumb}>
                      <Text style={styles.moreText}>+{order.items - 3}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.divider} />

                <View style={styles.cardFooter}>
                  <View>
                    <Text style={styles.itemCount}>{order.items} Items</Text>
                    <Text style={styles.totalPrice}>Rs. {order.total.toFixed(2)}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.detailsBtn}
                    onPress={() => navigation.navigate("OrderDetails", { id: order.id })}
                  >
                    <Text style={styles.detailsBtnText}>Details</Text>
                    <Icon name="chevron-right" size={20} color="#16a34a" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        ) : (
          /* Empty State UI */
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconWrapper}>
              <Icon name="package-variant" size={50} color="#9ca3af" />
            </View>
            <Text style={styles.emptyTitle}>No orders found</Text>
            <Text style={styles.emptySubtext}>{getEmptyMessage()}</Text>
            <TouchableOpacity 
              style={styles.shopBtn}
              // Navigating to Categories inside the Main stack
              onPress={() => navigation.navigate("Main", { screen: "Categories" })}
            >
              <Text style={styles.shopBtnText}>Start Shopping</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Navigation Bar */}
      <View style={[styles.navPosition, { bottom: insets.bottom > 0 ? insets.bottom + 10 : 30 }]}>
        <LiquidBottomNav />
      </View>

      {/* Bottom Safe Area - Black */}
      <View style={{ backgroundColor: "#000", height: insets.bottom }} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingBottom: 30, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, marginTop: 10 },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  backBtn: { backgroundColor: "rgba(255,255,255,0.2)", padding: 8, borderRadius: 12 },
  
  tabsContainer: { backgroundColor: "#fff", paddingVertical: 15, elevation: 2 },
  tab: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 12, marginRight: 10, backgroundColor: "#f3f4f6" },
  activeTab: { backgroundColor: "#16a34a" },
  tabText: { fontSize: 14, fontWeight: "600", color: "#6b7280" },
  activeTabText: { color: "#fff" },

  orderCard: { backgroundColor: "#fff", marginHorizontal: 20, marginBottom: 15, borderRadius: 25, padding: 15, elevation: 3, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10 },
  orderHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
  orderId: { fontSize: 16, fontWeight: "bold", color: "#1f2937" },
  orderDate: { fontSize: 12, color: "#9ca3af" },
  statusBadge: { flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  statusLabel: { fontSize: 12, fontWeight: "bold", marginLeft: 4 },
  
  productStrip: { flexDirection: "row", marginBottom: 15 },
  productThumb: { width: 50, height: 50, borderRadius: 12, marginRight: 8, backgroundColor: "#f3f4f6" },
  moreThumb: { width: 50, height: 50, borderRadius: 12, backgroundColor: "#f3f4f6", justifyContent: "center", alignItems: "center" },
  moreText: { fontSize: 14, fontWeight: "bold", color: "#6b7280" },
  
  divider: { height: 1, backgroundColor: "#f3f4f6", marginBottom: 15 },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  itemCount: { fontSize: 12, color: "#9ca3af" },
  totalPrice: { fontSize: 18, fontWeight: "bold", color: "#16a34a" },
  detailsBtn: { flexDirection: "row", alignItems: "center", backgroundColor: "#f0fdf4", paddingLeft: 12, paddingRight: 6, paddingVertical: 6, borderRadius: 10 },
  detailsBtnText: { color: "#16a34a", fontWeight: "bold", fontSize: 14 },

  emptyContainer: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40, marginTop: height * 0.1 },
  emptyIconWrapper: { width: 100, height: 100, borderRadius: 50, backgroundColor: "#f3f4f6", alignItems: "center", justifyContent: "center", marginBottom: 20 },
  emptyTitle: { fontSize: 20, fontWeight: "bold", color: "#1f2937", marginBottom: 10 },
  emptySubtext: { fontSize: 14, color: "#9ca3af", textAlign: "center", marginBottom: 30 },
  shopBtn: { backgroundColor: "#16a34a", paddingHorizontal: 30, paddingVertical: 15, borderRadius: 15, elevation: 4, shadowColor: "#16a34a", shadowOpacity: 0.3, shadowRadius: 10 },
  shopBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  
  navPosition: { position: "absolute", left: 0, right: 0, alignItems: "center" }
});