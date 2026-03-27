import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ImageBackground,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import LiquidBottomNav from "../componets/common/BottomNav";
import { useCart } from "../context/CartContext";
import { getHomeProducts } from "../services/HomeServiceApi";

const { width } = Dimensions.get("window");

const quantityOptions = [
  { label: "250g", value: 0.25 },
  { label: "500g", value: 0.5 },
  { label: "1kg", value: 1 },
  { label: "2kg", value: 2 },
];

const fallbackHeroDeals = [
  { id: 'h1', title: "Fresh Vegetables", sub: "Up to 30% OFF", image: require("../../assets/Images-1/hero1.png") },
  { id: 'h2', title: "Organic Fruits", sub: "Flash Sale: 40% OFF", image: require("../../assets/Images-1/hero2.png") },
  { id: 'h3', title: "Dairy Deals", sub: "Flat 20% OFF", image: require("../../assets/Images-1/hero3.png") }
];

const fallbackCategories = [
  { name: "Fresh Vegetables", image: require("../../assets/Images-1/veg.avif") },
  { name: "Organic Fruits", image: require("../../assets/Images-1/fruits.avif") },
  { name: "Leafy Greens", image: require("../../assets/Images-1/leafy.avif") },
  { name: "Dairy & Eggs", image: require("../../assets/Images-1/dairy.avif") }
];

export default function HomeScreen({ navigation }) {
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [selectedPill, setSelectedPill] = useState("Flash Sales");
  const [selectedQty, setSelectedQty] = useState({});
  const [homeProducts, setHomeProducts] = useState({
    heroDeals: fallbackHeroDeals,
    categories: fallbackCategories,
    flashSales: [],
    forYou: [],
    popular: [],
    new: [],
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { addToCart } = useCart();
  const navPills = ["Flash Sales", "For You", "Popular", "New"];

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const data = await getHomeProducts();
      setHomeProducts({
        heroDeals: data.heroDeals?.length ? data.heroDeals : fallbackHeroDeals,
        categories: data.categories?.length ? data.categories : fallbackCategories,
        flashSales: data.flashSales || [],
        forYou: data.forYou || [],
        popular: data.popular || [],
        new: data.new || [],
      });
    } catch (error) {
      console.error("Error fetching home products:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchHomeData();
  }, []);

  const resolveImage = (imgSource) => {
    if (!imgSource) return require("../../assets/Images-1/logo.png");
    if (typeof imgSource === 'string') return { uri: imgSource };
    return imgSource;
  };

  const renderHeroItem = ({ item }) => (
    <View style={styles.heroCard}>
      <View style={styles.heroTextContent}>
        <View style={styles.badge}>
          <Text numberOfLines={1} style={styles.badgeText}>{item.sub}</Text>
        </View>
        <Text style={styles.heroTitle}>{item.title}</Text>
        <Text style={styles.heroSubText}>Freshly delivered daily.</Text>
        <TouchableOpacity 
          style={styles.shopBtn}
          onPress={() => navigation.navigate("Categories", { selectedCat: item.title })}
        >
          <Text style={styles.shopText}>Shop Now</Text>
        </TouchableOpacity>
      </View>
      <Image source={resolveImage(item.image)} style={styles.heroImage} />
    </View>
  );

  const renderFlashItem = ({ item }) => {
    const currentQtySelection = selectedQty[item.id] || quantityOptions[2]; 
    
    // Logic aligned with ProductDetailsScreen.js
    const discountPercent = item.discount_percent || 0;
    const hasDeal = discountPercent > 0;
    const originalPrice = (item.price || 0) * currentQtySelection.value;
    const finalPrice = hasDeal 
      ? originalPrice * (1 - discountPercent / 100) 
      : originalPrice;

    return (
      <View style={styles.flashItemCard}>
        {hasDeal && (
          <View style={styles.discountTag}>
            <Text style={styles.discountText}>{discountPercent}% OFF</Text>
          </View>
        )}

        <TouchableOpacity 
          onPress={() => navigation.navigate("ProductDetails", { product: item })}
          activeOpacity={0.9}
        >
          <Image source={resolveImage(item.image)} style={styles.flashItemImage} />
          <View style={styles.flashItemInfo}>
            {/* 1. FIXED: Show the actual category name if it exists in the item object */}
            <Text style={styles.itemCategoryText}>
              {item.category?.name || "Fresh Produce"}
            </Text>
            <Text style={styles.flashItemName} numberOfLines={1}>{item.name}</Text>
            
            <View style={styles.ratingRow}>
              <Icon name="star" size={12} color="#facc15" />
              <Text style={styles.ratingText}>{item.rating || '5.0'}</Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.flashItemInfo}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.qtyScroll}>
            {quantityOptions.map((q) => (
              <TouchableOpacity
                key={q.label}
                style={[
                  styles.qtyOption,
                  currentQtySelection.label === q.label && styles.qtyActive
                ]}
                onPress={() => setSelectedQty(prev => ({ ...prev, [item.id]: q }))}
              >
                <Text style={[styles.qtyLabel, currentQtySelection.label === q.label && styles.qtyLabelActive]}>
                  {q.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.cartRow}>
            <View>
                {/* 2. FIXED: Price rounding matches Details screen */}
                <Text style={styles.currentPrice}>
                    Rs.{finalPrice % 1 === 0 ? finalPrice.toFixed(0) : finalPrice.toFixed(2)}
                </Text>
                {hasDeal && (
                    <Text style={styles.homeOldPrice}>Rs.{originalPrice.toFixed(0)}</Text>
                )}
            </View>
            <TouchableOpacity
              style={styles.addCartBtn}
              onPress={() =>
                addToCart({
                  id: item.id,
                  name: item.name,
                  price: finalPrice,
                  image: item.image,
                  unit: currentQtySelection.label,
                  quantity: 1,
                })
              }
            >
              <Icon name="cart-plus" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ backgroundColor: "#16a34a" }} edges={["top"]}>
        <StatusBar barStyle="light-content" backgroundColor="#16a34a" />
      </SafeAreaView>

      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#16a34a"]} />
          }
        >
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.iconBtn}><Icon name="account-outline" size={26} color="#fff" /></TouchableOpacity>
            <View style={styles.logoWrapper}>
              <Image source={require("../../assets/Images-1/logo.png")} style={styles.logo} />
            </View>
            <TouchableOpacity style={styles.iconBtn}>
              <View style={styles.notiBadge} />
              <Icon name="bell-outline" size={26} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* HERO CAROUSEL */}
          <View style={styles.carouselContainer}>
            <FlatList
              data={homeProducts.heroDeals}
              renderItem={renderHeroItem}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => item.id?.toString() || index.toString()}
              onScroll={(e) => {
                const x = e.nativeEvent.contentOffset.x;
                setActiveHeroIndex(Math.round(x / width));
              }}
            />
            <View style={styles.pagination}>
              {homeProducts.heroDeals.map((_, index) => (
                <View key={index} style={[styles.dot, activeHeroIndex === index ? styles.activeDot : styles.inactiveDot]} />
              ))}
            </View>
          </View>

          {/* CATEGORIES GRID */}
          <View style={styles.categorySection}>
            <View style={styles.catHeader}>
              <Text style={styles.catTitle}>Categories</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Categories")}>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.grid}>
              {homeProducts.categories.map((item, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.cardFrame}
                  onPress={() => navigation.navigate("Categories", { selectedCat: item.name })}
                >
                  <ImageBackground source={resolveImage(item.image)} style={styles.cardImageBack} imageStyle={{ borderRadius: 18 }}>
                    <View style={styles.overlay}>
                      <Text style={styles.catName}>{item.name}</Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* DYNAMIC PRODUCT SECTION */}
          <View style={styles.flashSection}>
            <Text style={[styles.catTitle, { marginBottom: 15 }]}>Amazing Products</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 15 }}>
              {navPills.map((pill) => (
                <TouchableOpacity 
                  key={pill} 
                  onPress={() => setSelectedPill(pill)}
                  style={[styles.navPill, selectedPill === pill && styles.activePill]}
                >
                  {pill === "Flash Sales" && (
                    <Icon name="flash" size={16} color={selectedPill === pill ? "#fff" : "#ff5722"} style={{marginRight: 4}} />
                  )}
                  <Text style={[styles.pillText, selectedPill === pill && styles.activePillText]}>{pill}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <FlatList
              data={
                selectedPill === "Flash Sales" ? homeProducts.flashSales :
                selectedPill === "For You" ? homeProducts.forYou :
                selectedPill === "Popular" ? homeProducts.popular :
                homeProducts.new
              }
              renderItem={renderFlashItem}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => item.id?.toString() || index.toString()}
              contentContainerStyle={{ paddingBottom: 20, paddingLeft: 5 }}
              ListEmptyComponent={<Text style={{marginLeft: 15, color: '#999'}}>No products available.</Text>}
            />
          </View>

          <View style={{ height: 120 }} />
        </ScrollView>

        <LiquidBottomNav />
      </View>

      <SafeAreaView style={{ backgroundColor: "#000" }} edges={["bottom"]} />
    </View>
  );
}

const styles = StyleSheet.create({
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#16a34a", height: 100, paddingHorizontal: 20, borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
  logoWrapper: { flex: 1, alignItems: "center" },
  logo: { width: 240, height: 100, resizeMode: "contain" },
  iconBtn: { backgroundColor: "rgba(255,255,255,0.2)", padding: 10, borderRadius: 15 },
  notiBadge: { position: "absolute", top: 10, right: 10, backgroundColor: "#ef4444", width: 8, height: 8, borderRadius: 4 },
  carouselContainer: { marginTop: 20 },
  heroCard: { width: width - 40, marginHorizontal: 20, backgroundColor: "#16a34a", borderRadius: 25, padding: 20, flexDirection: "row", alignItems: "center", height: 190 },
  heroTextContent: { flex: 1 },
  badge: { backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, alignSelf: "flex-start", maxWidth: 140 },
  badgeText: { color: "#fff", fontSize: 11, fontWeight: "bold" },
  heroTitle: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  heroSubText: { color: "#fff", opacity: 0.8, fontSize: 12, marginBottom: 10 },
  shopBtn: { backgroundColor: "#fff", paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, alignSelf: "flex-start" },
  shopText: { color: "#16a34a", fontWeight: "bold", fontSize: 13 },
  heroImage: { width: 130, height: 130, borderRadius: 10 },
  pagination: { flexDirection: "row", justifyContent: "center", marginTop: 10 },
  dot: { height: 6, borderRadius: 3, marginHorizontal: 3 },
  activeDot: { width: 18, backgroundColor: "#16a34a" },
  inactiveDot: { width: 6, backgroundColor: "#D1D1D1" },
  categorySection: { padding: 20 },
  catHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  catTitle: { fontSize: 20, fontWeight: "bold" },
  seeAll: { color: "#16a34a" },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  cardFrame: { width: (width - 55) / 2, height: 120, marginBottom: 15 },
  cardImageBack: { flex: 1, justifyContent: "flex-end" },
  overlay: { backgroundColor: "rgba(0,0,0,0.35)", padding: 8, borderBottomLeftRadius: 18, borderBottomRightRadius: 18 },
  catName: { color: "#fff", fontWeight: "bold", fontSize: 13 },
  flashSection: { paddingHorizontal: 20 },
  navPill: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 25, backgroundColor: "#f5f5f5", marginRight: 10, flexDirection: "row", alignItems: "center" },
  activePill: { backgroundColor: "#ff5722" },
  pillText: { color: "#777", fontWeight: "600" },
  activePillText: { color: "#fff" },
  flashItemCard: { width: 180, marginRight: 15, backgroundColor: "#fff", borderRadius: 22, padding: 10, elevation: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, marginBottom: 10 },
  discountTag: { position: "absolute", top: 12, right: 12, backgroundColor: "#ff5722", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, zIndex: 10 },
  discountText: { color: "#fff", fontSize: 10, fontWeight: "bold" },
  flashItemImage: { width: "100%", height: 110, borderRadius: 18 },
  flashItemInfo: { marginTop: 10 },
  itemCategoryText: { color: '#16a34a', fontSize: 10, fontWeight: 'bold' },
  flashItemName: { fontWeight: "bold", fontSize: 15, color: "#1f2937" },
  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  ratingText: { fontSize: 12, color: "#6b7280", marginLeft: 4, fontWeight: "600" },
  qtyScroll: { marginVertical: 10 },
  qtyOption: { paddingHorizontal: 10, paddingVertical: 5, backgroundColor: "#f3f4f6", borderRadius: 8, marginRight: 6, borderWidth: 1, borderColor: "#e5e7eb" },
  qtyActive: { backgroundColor: "#16a34a", borderColor: "#16a34a" },
  qtyLabel: { fontSize: 11, color: "#4b5563", fontWeight: "bold" },
  qtyLabelActive: { color: "#fff" },
  currentPrice: { color: "#16a34a", fontWeight: "bold", fontSize: 18 },
  homeOldPrice: { fontSize: 10, color: '#9ca3af', textDecorationLine: 'line-through' },
  cartRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 5 },
  addCartBtn: { backgroundColor: "#16a34a", padding: 8, borderRadius: 12 },
});