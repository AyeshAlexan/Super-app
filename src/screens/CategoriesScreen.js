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
  StatusBar,
  ActivityIndicator,
  RefreshControl // ✅ added
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from 'expo-linear-gradient';
import LiquidBottomNav from "../componets/common/BottomNav";
import { useCart } from "../context/CartContext";
import { productService } from "../services/productService";

const { width } = Dimensions.get("window");

export default function CategoriesScreen({ route, navigation }) {
  const initialCategory = route.params?.selectedCat || "All";
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQty, setSelectedQty] = useState({});
  const [toast, setToast] = useState("");

  const [categories, setCategories] = useState([{ id: "all", name: "All", icon: "store-outline" }]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false); // ✅ added

  const { addToCart } = useCart();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [catRes, prodRes] = await Promise.all([
        productService.getAllCategories(),
        productService.getProducts()
      ]);

      const dbCats = catRes.data.map(cat => ({
        id: cat.id,
        name: cat.name,
        icon: getCategoryIcon(cat.slug)
      }));

      setCategories([{ id: "all", name: "All", icon: "store-outline" }, ...dbCats]);
      setProducts(prodRes.data);
    } catch (error) {
      console.error("Error loading market data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false); // ✅ important
    }
  };

  // ✅ pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const getCategoryIcon = (slug) => {
    if (slug.includes('veg')) return "carrot";
    if (slug.includes('fruit')) return "food-apple-outline";
    if (slug.includes('leaf')) return "leaf";
    if (slug.includes('dairy')) return "bottle-wine-outline";
    return "tag-outline";
  };

  // ✅ dynamic quantity options
  const getQuantityOptions = (unit) => {
    if (!unit) return [];

    const u = unit.toUpperCase();

    if (u === "KG" || u === "G") {
      return [
        { label: "250g", value: 0.25 },
        { label: "500g", value: 0.5 },
        { label: "1kg", value: 1 },
        { label: "2kg", value: 2 },
      ];
    }

    if (u === "UNIT" || u === "PACKET" || u === "BRANCH") {
      return [
        { label: "1", value: 1 },
        { label: "2", value: 2 },
        { label: "3", value: 3 },
        { label: "5", value: 5 },
        { label: "6", value: 6 },
        { label: "7", value: 7 },
        { label: "8", value: 8 },
        { label: "9", value: 9 },
        { label: "10", value: 10 }
      ];
    }

    return [{ label: "1", value: 1 }];
  };

  const handleQuickAdd = (item) => {
    const options = getQuantityOptions(item.unit);
    const qty = selectedQty[item.id] || options[0];
    const finalPrice = item.price * qty.value;

    addToCart({
      id: item.id,
      name: item.name,
      price: finalPrice,
      image: item.image,
      unit: qty.label,
      quantity: 1,
    });

    setToast(`Added ${qty.label} of ${item.name} to cart!`);
    setTimeout(() => setToast(""), 2000);
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" ||
      product.categories.some(c => c.name === selectedCategory);

    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderProduct = ({ item }) => {
    const options = getQuantityOptions(item.unit);
    const currentQtySelection = selectedQty[item.id] || options[0];
    const dynamicPrice = item.price * currentQtySelection.value;

    return (
      <View style={styles.productCard}>
        <TouchableOpacity
          onPress={() => navigation.navigate("ProductDetails", { product: item })}
          activeOpacity={0.9}
        >
          <Image source={{ uri: item.image }} style={styles.productImage} />

          {item.is_organic === 1 && (
            <View style={styles.organicBadge}>
              <Icon name="leaf" size={10} color="#fff" />
              <Text style={styles.organicText}>Organic</Text>
            </View>
          )}

          <View style={[styles.stockBadge, { backgroundColor: item.stock_quantity > 0 ? '#22c55e' : '#ef4444' }]}>
            <Text style={styles.stockText}>
              {item.stock_quantity > 0 ? "In Stock" : "Out of Stock"}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>

          <View style={styles.ratingRow}>
            <Icon name="star" size={14} color="#facc15" />
            <Text style={styles.ratingText}>4.5</Text>
            <Text style={styles.unitBaseText}> • Per {item.unit}</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.qtyScroll}>
            {options.map((q) => (
              <TouchableOpacity
                key={q.label}
                style={[
                  styles.qtyOption,
                  currentQtySelection.label === q.label && styles.qtyActive
                ]}
                onPress={() =>
                  setSelectedQty(prev => ({ ...prev, [item.id]: q }))
                }
              >
                <Text
                  style={[
                    styles.qtyText,
                    currentQtySelection.label === q.label && styles.qtyTextActive
                  ]}
                >
                  {q.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.priceRow}>
            <View>
              {item.old_price && <Text style={styles.oldPrice}>Rs.{item.old_price}</Text>}
              <Text style={styles.priceText}>{`Rs.${dynamicPrice.toFixed(0)}`}</Text>
            </View>
            <TouchableOpacity
              style={[styles.addBtn, item.stock_quantity <= 0 && { backgroundColor: '#d1d5db' }]}
              onPress={() => handleQuickAdd(item)}
              disabled={item.stock_quantity <= 0}
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
      <SafeAreaView style={{ backgroundColor: "#16a34a" }} edges={["top"]}>
        <StatusBar barStyle="light-content" backgroundColor="#16a34a" />
      </SafeAreaView>

      <View style={styles.container}>
        <LinearGradient colors={['#16a34a', '#22c55e']} style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Icon name="arrow-left" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Greenova Market</Text>
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
                  <Icon name={cat.icon} size={20} color={isActive ? "#fff" : "#16a34a"} style={styles.catIcon} />
                  <Text style={[styles.catLabel, isActive && styles.activeCatLabel]}>{cat.name}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#16a34a" />
            <Text style={{ marginTop: 10, color: '#6b7280' }}>Loading fresh products...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredProducts}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={styles.listContent}
            columnWrapperStyle={styles.columnWrapper}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#16a34a"]} />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Icon name="magnify-close" size={80} color="#d1d5db" />
                <Text style={styles.emptyText}>No products found</Text>
              </View>
            }
          />
        )}

        {toast !== "" && (
          <View style={styles.toast}>
            <Icon name="check-circle" size={18} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.toastText}>{toast}</Text>
          </View>
        )}

        <LiquidBottomNav />
      </View>

      <SafeAreaView style={{ backgroundColor: "#000" }} edges={["bottom"]} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { 
    paddingHorizontal: 20, 
    paddingTop: 10, 
    paddingBottom: 25, 
    borderBottomLeftRadius: 35, 
    borderBottomRightRadius: 35 
  },
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
  listContent: { padding: 15, paddingBottom: 140 },
  columnWrapper: { justifyContent: 'space-between' },
  productCard: { width: (width - 45) / 2, backgroundColor: '#fff', borderRadius: 20, marginBottom: 15, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, overflow: 'hidden' },
  productImage: { width: '100%', height: 120 },
  organicBadge: { position: 'absolute', top: 10, left: 10, backgroundColor: '#15803d', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6 },
  organicText: { color: '#fff', fontSize: 9, fontWeight: 'bold', marginLeft: 3 },
  stockBadge: { position: 'absolute', top: 10, right: 10, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  stockText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  productInfo: { padding: 12 },
  productName: { fontWeight: 'bold', fontSize: 15, color: '#1f2937' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  ratingText: { fontSize: 12, color: '#4b5563', marginLeft: 4, fontWeight: '600' },
  unitBaseText: { fontSize: 11, color: '#9ca3af' },
  qtyScroll: { marginVertical: 8 },
  qtyOption: { paddingHorizontal: 8, paddingVertical: 4, backgroundColor: '#f3f4f6', borderRadius: 6, marginRight: 6, borderWidth: 1, borderColor: '#e5e7eb' },
  qtyActive: { backgroundColor: '#16a34a', borderColor: '#16a34a' },
  qtyText: { fontSize: 11, color: '#6b7280', fontWeight: '600' },
  qtyTextActive: { color: '#fff' },
  priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 },
  oldPrice: { fontSize: 11, color: '#9ca3af', textDecorationLine: 'line-through', marginBottom: -2 },
  priceText: { fontSize: 17, fontWeight: 'bold', color: '#16a34a' },
  addBtn: { backgroundColor: '#16a34a', padding: 8, borderRadius: 10 },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { fontSize: 18, color: '#9ca3af', marginTop: 10, fontWeight: '600' },
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
    elevation: 10,
    zIndex: 9999,
  },
  toastText: { color: '#fff', fontWeight: 'bold', fontSize: 14 }
});