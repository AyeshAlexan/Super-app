import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  Dimensions,
  StatusBar
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from 'expo-linear-gradient';
import LiquidBottomNav from "../componets/common/BottomNav";

const { width } = Dimensions.get("window");

// Updated Categories with Vector Icons
const categories = [
  { id: "all", name: "All", icon: "store-outline" },
  { id: "vegetables", name: "Fresh Vegetables", icon: "carrot" },
  { id: "fruits", name: "Organic Fruits", icon: "food-apple-outline" },
  { id: "leafy", name: "Leafy Greens", icon: "leaf" },
  { id: "dairy", name: "Dairy & Eggs", icon: "bottle-wine-outline" },
];

const products = [
  { id: 1, name: "Fresh Tomatoes", category: "Fresh Vegetables", price: 2.99, unit: "per kg", image: 'https://images.unsplash.com/photo-1443131612988-32b6d97cc5da?q=80&w=400', rating: 4.5, inStock: true },
  { id: 2, name: "Organic Potatoes", category: "Fresh Vegetables", price: 1.99, unit: "per kg", image: 'https://images.unsplash.com/photo-1659738538929-715b764d59f9?q=80&w=400', rating: 4.8, inStock: true },
  { id: 4, name: "Fruit Basket", category: "Organic Fruits", price: 12.99, unit: "each", image: 'https://images.unsplash.com/photo-1641573260130-74d81b179809?q=80&w=400', rating: 4.9, inStock: true },
  { id: 5, name: "Fresh Milk", category: "Dairy & Eggs", price: 3.99, unit: "per liter", image: 'https://images.unsplash.com/photo-1772990977842-55d675ce427e?q=80&w=400', rating: 4.7, inStock: true },
];

export default function CategoriesScreen({ route, navigation }) {
  const initialCategory = route.params?.selectedCat || "All";
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (route.params?.selectedCat) {
      setSelectedCategory(route.params.selectedCat);
    }
  }, [route.params?.selectedCat]);

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderProduct = ({ item }) => (
    <TouchableOpacity style={styles.productCard}>
      <View>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <View style={[styles.stockBadge, { backgroundColor: item.inStock ? '#22c55e' : '#ef4444' }]}>
          <Text style={styles.stockText}>{item.inStock ? "In Stock" : "Out of Stock"}</Text>
        </View>
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productUnit}>{item.unit}</Text>
        <View style={styles.ratingRow}>
          <Icon name="star" size={14} color="#facc15" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.priceText}>${item.price}</Text>
          <TouchableOpacity style={styles.addBtn}>
            <Icon name="plus" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* 1. TOP SAFE AREA (Green) */}
      <SafeAreaView style={{ backgroundColor: "#16a34a" }} edges={["top"]}>
        <StatusBar barStyle="light-content" backgroundColor="#16a34a" />
      </SafeAreaView>

      <View style={styles.container}>
        {/* Header with Search */}
        <LinearGradient colors={['#16a34a', '#22c55e']} style={styles.header}>
            <View style={styles.headerTop}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                <Icon name="arrow-left" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Categories</Text>
              <View style={{ width: 40 }} />
            </View>

            <View style={styles.searchContainer}>
              <Icon name="magnify" size={22} color="#9ca3af" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search products..."
                placeholderTextColor="#9ca3af"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
        </LinearGradient>

        {/* Category Horizontal Nav */}
        <View style={styles.catNavWrapper}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catNavContent}>
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.name;
              return (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => setSelectedCategory(cat.name)}
                  style={[styles.catPill, isActive && styles.activeCatPill]}
                >
                  <Icon 
                    name={cat.icon} 
                    size={20} 
                    color={isActive ? "#fff" : "#16a34a"} 
                    style={styles.catIcon} 
                  />
                  <Text style={[styles.catLabel, isActive && styles.activeCatLabel]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Products Grid */}
        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="magnify-close" size={80} color="#d1d5db" />
              <Text style={styles.emptyText}>No products found</Text>
            </View>
          }
        />

        <LiquidBottomNav />
      </View>

      {/* 2. BOTTOM SAFE AREA (Black) */}
      <SafeAreaView style={{ backgroundColor: "#000" }} edges={["bottom"]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: { 
    paddingHorizontal: 20, 
    paddingTop: 10, // Added padding since we removed SafeAreaView from inside
    paddingBottom: 25, 
    borderBottomLeftRadius: 35, 
    borderBottomRightRadius: 35 
  },
  // ... rest of your styles remain exactly the same
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, marginBottom: 20 },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  backBtn: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 12 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 15, paddingHorizontal: 15, height: 50 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: '#374151' },
  catNavWrapper: { backgroundColor: '#fff', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  catNavContent: { paddingHorizontal: 20, paddingVertical: 15 },
  catPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f4f6', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: '#e5e7eb' },
  activeCatPill: { backgroundColor: '#16a34a', borderColor: '#16a34a' },
  catIcon: { marginRight: 6 },
  catLabel: { fontWeight: '600', color: '#4b5563', fontSize: 13 },
  activeCatLabel: { color: '#fff' },
  listContent: { padding: 15, paddingBottom: 120 },
  columnWrapper: { justifyContent: 'space-between' },
  productCard: { width: (width - 45) / 2, backgroundColor: '#fff', borderRadius: 20, marginBottom: 15, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  productImage: { width: '100%', height: 130, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  stockBadge: { position: 'absolute', top: 10, right: 10, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  stockText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  productInfo: { padding: 12 },
  productName: { fontWeight: 'bold', fontSize: 15, color: '#1f2937' },
  productUnit: { fontSize: 12, color: '#9ca3af', marginVertical: 2 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  ratingText: { fontSize: 12, color: '#4b5563', marginLeft: 4, fontWeight: '600' },
  priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  priceText: { fontSize: 18, fontWeight: 'bold', color: '#16a34a' },
  addBtn: { backgroundColor: '#16a34a', padding: 6, borderRadius: 10 },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { fontSize: 18, color: '#9ca3af', marginTop: 10, fontWeight: '600' }
});