import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  Dimensions,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import LiquidBottomNav from "../componets/common/BottomNav";
import { useCart } from "../context/CartContext";

const { width } = Dimensions.get("window");

const quantityOptions = [
  { label: "250g", value: 0.25 },
  { label: "500g", value: 0.5 },
  { label: "1kg", value: 1 },
  { label: "2kg", value: 2 },
];

const initialFavorites = [
  { id: 1, name: "Fresh Tomatoes", category: "Vegetables", price: 400.00, image: 'https://images.unsplash.com/photo-1443131612988-32b6d97cc5da?q=80&w=400', rating: 4.5, inStock: true },
  { id: 2, name: "Organic Potatoes", category: "Vegetables", price: 300.00, image: 'https://images.unsplash.com/photo-1659738538929-715b764d59f9?q=80&w=400', rating: 4.8, inStock: true },
  { id: 3, name: "Fresh Carrots", category: "Vegetables", price: 280.00, image: 'https://images.unsplash.com/photo-1611048660183-dc688cc049f2?q=80&w=400', rating: 4.6, inStock: true },
  { id: 5, name: "Fresh Milk", category: "Dairy", price: 320.00, image: 'https://images.unsplash.com/photo-1772990977842-55d675ce427e?q=80&w=400', rating: 4.7, inStock: true },
];

export default function FavoritesScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { addToCart } = useCart();
  const [favorites, setFavorites] = useState(initialFavorites);
  const [selectedQty, setSelectedQty] = useState({});
  const [toast, setToast] = useState("");

  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  const handleQuickAdd = (item) => {
    const qty = selectedQty[item.id] || quantityOptions[2]; // Default 1kg
    const finalPrice = item.price * qty.value;

    addToCart({
      id: item.id,
      name: item.name,
      price: finalPrice,
      image: item.image,
      unit: qty.label,
      quantity: 1,
    });

    setToast(`Added ${qty.label} of ${item.name}`);
    setTimeout(() => setToast(""), 2000);
  };

  const renderProduct = ({ item }) => {
    const currentQtySelection = selectedQty[item.id] || quantityOptions[2];
    const dynamicPrice = item.price * currentQtySelection.value;

    return (
      <View style={styles.productCard}>
        {/* Remove Heart Button */}
        <TouchableOpacity style={styles.removeBtn} onPress={() => removeFavorite(item.id)}>
          <Icon name="heart" size={18} color="#ef4444" />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => navigation.navigate("ProductDetails", { product: item })}
          activeOpacity={0.9}
        >
          <Image source={{ uri: item.image }} style={styles.productImage} />
          {!item.inStock && (
            <View style={styles.outOfStockOverlay}>
              <Text style={styles.outOfStockText}>Out of Stock</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
          
          <View style={styles.ratingRow}>
            <Icon name="star" size={14} color="#facc15" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>

          {/* Weight Selection Scroll */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.qtyScroll}>
            {quantityOptions.map((q) => (
              <TouchableOpacity
                key={q.label}
                style={[styles.qtyOption, currentQtySelection.label === q.label && styles.qtyActive]}
                onPress={() => setSelectedQty(prev => ({ ...prev, [item.id]: q }))}
              >
                <Text style={[styles.qtyText, currentQtySelection.label === q.label && styles.qtyTextActive]}>
                  {q.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.priceRow}>
            <Text style={styles.priceText}>{`Rs.${dynamicPrice.toFixed(0)}`}</Text>
            <TouchableOpacity 
              style={[styles.addBtn, !item.inStock && { backgroundColor: '#d1d5db' }]} 
              onPress={() => handleQuickAdd(item)}
              disabled={!item.inStock}
            >
              <Icon name="cart-plus" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
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
          <Text style={styles.headerTitle}>Favorites</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{favorites.length}</Text>
          </View>
        </View>
      </LinearGradient>

      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Icon name="heart-outline" size={50} color="#f87171" />
          </View>
          <Text style={styles.emptyTitle}>No favorites yet</Text>
          <Text style={styles.emptySubtext}>Save your favorite products here</Text>
          <TouchableOpacity 
            style={styles.browseBtn}
            onPress={() => navigation.navigate("Main", { screen: "Categories" })}
          >
            <Text style={styles.browseBtnText}>Browse Products</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Toast Notification */}
      {toast !== "" && (
        <View style={styles.toast}>
          <Icon name="check-circle" size={18} color="#fff" style={{marginRight: 8}} />
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      )}

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
  header: { paddingBottom: 30, borderBottomLeftRadius: 35, borderBottomRightRadius: 35 },
  headerTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, marginTop: 10 },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  backBtn: { backgroundColor: "rgba(255,255,255,0.2)", padding: 8, borderRadius: 12 },
  countBadge: { backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  countText: { color: "#fff", fontWeight: "bold" },

  listContent: { padding: 15, paddingBottom: 150 },
  columnWrapper: { justifyContent: "space-between" },
  
  productCard: { 
    width: (width - 45) / 2, 
    backgroundColor: "#fff", 
    borderRadius: 22, 
    marginBottom: 15, 
    elevation: 4, 
    shadowColor: "#000", 
    shadowOpacity: 0.1, 
    shadowRadius: 10,
    overflow: 'hidden'
  },
  removeBtn: { 
    position: "absolute", 
    top: 8, 
    right: 8, 
    zIndex: 10, 
    backgroundColor: "rgba(255,255,255,0.9)", 
    padding: 6, 
    borderRadius: 20,
    elevation: 2
  },
  productImage: { width: "100%", height: 110 },
  outOfStockOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center", height: 110 },
  outOfStockText: { color: "#fff", fontSize: 10, fontWeight: "bold", backgroundColor: "#ef4444", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },

  productInfo: { padding: 12 },
  productName: { fontSize: 14, fontWeight: "bold", color: "#1f2937" },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  ratingText: { fontSize: 12, color: '#4b5563', marginLeft: 4, fontWeight: '600' },
  
  qtyScroll: { marginVertical: 8 },
  qtyOption: { paddingHorizontal: 8, paddingVertical: 4, backgroundColor: '#f3f4f6', borderRadius: 6, marginRight: 6, borderWidth: 1, borderColor: '#e5e7eb' },
  qtyActive: { backgroundColor: '#16a34a', borderColor: '#16a34a' },
  qtyText: { fontSize: 10, color: '#6b7280', fontWeight: '600' },
  qtyTextActive: { color: '#fff' },

  priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 },
  priceText: { fontSize: 16, fontWeight: 'bold', color: '#16a34a' },
  addBtn: { backgroundColor: '#16a34a', padding: 8, borderRadius: 10 },

  emptyContainer: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40, marginTop: 50 },
  emptyIconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: "#fee2e2", alignItems: "center", justifyContent: "center", marginBottom: 20 },
  emptyTitle: { fontSize: 20, fontWeight: "bold", color: "#1f2937", marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: "#9ca3af", textAlign: "center", marginBottom: 30 },
  browseBtn: { backgroundColor: "#16a34a", paddingHorizontal: 25, paddingVertical: 14, borderRadius: 15 },
  browseBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  toast: { 
    position: 'absolute', 
    bottom: 130, 
    alignSelf: 'center', 
    backgroundColor: 'rgba(22, 163, 74, 0.95)', 
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20, 
    paddingVertical: 12, 
    borderRadius: 25, 
    zIndex: 9999,
  },
  toastText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  navPosition: { position: "absolute", left: 0, right: 0, alignItems: "center" }
});