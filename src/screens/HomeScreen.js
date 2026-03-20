import React, { useState } from "react";
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
  StatusBar
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import LiquidBottomNav from "../componets/common/BottomNav";
import { useCart } from "../context/CartContext";

const { width } = Dimensions.get("window");

// --- Configuration Data ---
const quantityOptions = [
  { label: "250g", value: 0.25 },
  { label: "500g", value: 0.5 },
  { label: "1kg", value: 1 },
  { label: "2kg", value: 2 },
];

const heroDeals = [
  { id: '1', title: "Fresh Vegetables", sub: "Up to 30% OFF", image: require("../../assets/Images-1/hero1.png") },
  { id: '2', title: "Organic Fruits", sub: "Flash Sale: 40% OFF", image: require("../../assets/Images-1/hero2.png") },
  { id: '3', title: "Dairy Deals", sub: "Flat 20% OFF", image: require("../../assets/Images-1/hero3.png") }
];

const categories = [
  { name: "Fresh Vegetables", image: require("../../assets/Images-1/veg.avif") },
  { name: "Organic Fruits", image: require("../../assets/Images-1/fruits.avif") },
  { name: "Leafy Greens", image: require("../../assets/Images-1/leafy.avif") },
  { name: "Dairy & Eggs", image: require("../../assets/Images-1/dairy.avif") }
];

const flashSaleItems = [
  { id: 1, name: "Fresh Tomatoes", category: "Fresh Vegetables", price: 400.00, image: 'https://images.unsplash.com/photo-1443131612988-32b6d97cc5da?q=80&w=400', rating: 4.5 },
  { id: 2, name: "Organic Potatoes", category: "Fresh Vegetables", price: 300.00, image: 'https://images.unsplash.com/photo-1659738538929-715b764d59f9?q=80&w=400', rating: 4.8 },
  { id: 4, name: "Fruit Basket", category: "Organic Fruits", price: 850.00, image: 'https://images.unsplash.com/photo-1641573260130-74d81b179809?q=80&w=400', rating: 4.9 },
  { id: 5, name: "Fresh Milk", category: "Dairy & Eggs", price: 320.00, image: 'https://images.unsplash.com/photo-1772990977842-55d675ce427e?q=80&w=400', rating: 4.7 },
];

export default function HomeScreen({ navigation }) {
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [selectedPill, setSelectedPill] = useState('Flash Sales');
  const [selectedQty, setSelectedQty] = useState({}); // Stores selection per product ID
  const { addToCart } = useCart();

  const navPills = ["Flash Sales", "For You", "Popular", "New"];

  // --- HERO ---
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
          onPress={() => navigation.navigate('Categories', { selectedCat: item.title })}
        >
          <Text style={styles.shopText}>Shop Now</Text>
        </TouchableOpacity>
      </View>
      <Image source={item.image} style={styles.heroImage} />
    </View>
  );

  // --- FLASH ITEM ---
  const renderFlashItem = ({ item }) => {
    const currentQtySelection = selectedQty[item.id] || quantityOptions[2]; // Default 1kg
    const dynamicPrice = item.price * currentQtySelection.value;

    return (
      <View style={styles.flashItemCard}>
        {/* Flash Tag */}
        <View style={styles.discountTag}>
          <Text style={styles.discountText}>40% OFF</Text>
        </View>

        <Image source={{ uri: item.image }} style={styles.flashItemImage} />

        <View style={styles.flashItemInfo}>
          <Text style={styles.flashItemName} numberOfLines={1}>{item.name}</Text>
          
          <View style={styles.ratingRow}>
            <Icon name="star" size={12} color="#facc15" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>

          {/* Weight Selector Scroll (Image 2 Style) */}
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
            <Text style={styles.currentPrice}>Rs.{dynamicPrice.toFixed(0)}</Text>
            <TouchableOpacity
              style={styles.addCartBtn}
              onPress={() =>
                addToCart({
                  id: item.id,
                  name: item.name,
                  price: dynamicPrice,
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

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ backgroundColor: "#16a34a" }} edges={["top"]}>
        <StatusBar barStyle="light-content" backgroundColor="#16a34a" />
      </SafeAreaView>

      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <ScrollView showsVerticalScrollIndicator={false}>
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

          {/* HERO */}
          <View style={styles.carouselContainer}>
            <FlatList
              data={heroDeals}
              renderItem={renderHeroItem}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              onScroll={(e) => {
                const x = e.nativeEvent.contentOffset.x;
                setActiveHeroIndex(Math.round(x / width));
              }}
            />
            <View style={styles.pagination}>
              {heroDeals.map((_, index) => (
                <View key={index} style={[styles.dot, activeHeroIndex === index ? styles.activeDot : styles.inactiveDot]} />
              ))}
            </View>
          </View>

          {/* CATEGORIES */}
          <View style={styles.categorySection}>
            <View style={styles.catHeader}>
              <Text style={styles.catTitle}>Categories</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.grid}>
              {categories.map((item, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.cardFrame}
                  onPress={() => navigation.navigate('Categories', { selectedCat: item.name })}
                >
                  <ImageBackground source={item.image} style={styles.cardImageBack} imageStyle={{ borderRadius: 18 }}>
                    <View style={styles.overlay}>
                      <Text style={styles.catName}>{item.name}</Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* FLASH SALES */}
          <View style={styles.flashSection}>
            <Text style={[styles.catTitle, {marginBottom: 15}]}>Amazing Products</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom: 15}}>
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
              data={flashSaleItems}
              renderItem={renderFlashItem}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={{ paddingBottom: 20, paddingLeft: 5 }}
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
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    backgroundColor: "#16a34a", height: 100, paddingHorizontal: 20,
    borderBottomLeftRadius: 40, borderBottomRightRadius: 40,
  },
  logoWrapper: { flex: 1, alignItems: "center" },
  logo: { width: 240, height: 100, resizeMode: "contain" },
  iconBtn: { backgroundColor: "rgba(255,255,255,0.2)", padding: 10, borderRadius: 15 },
  notiBadge: { position: "absolute", top: 10, right: 10, backgroundColor: "#ef4444", width: 8, height: 8, borderRadius: 4 },

  carouselContainer: { marginTop: 20 },
  heroCard: {
    width: width - 40, marginHorizontal: 20, backgroundColor: "#16a34a",
    borderRadius: 25, padding: 20, flexDirection: "row", alignItems: "center", height: 190,
  },
  heroTextContent: { flex: 1 },
  badge: { backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, alignSelf: "flex-start", maxWidth: 140 },
  badgeText: { color: "#fff", fontSize: 11, fontWeight: "bold" },
  heroTitle: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  heroSubText: { color: "#fff", opacity: 0.8, fontSize: 12, marginBottom: 10 },
  shopBtn: { backgroundColor: "#fff", paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, alignSelf: "flex-start" },
  shopText: { color: "#16a34a", fontWeight: "bold", fontSize: 13 },
  heroImage: { width: 130, height: 130 },

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
  overlay: { backgroundColor: "rgba(0,0,0,0.35)", padding: 8 },
  catName: { color: "#fff", fontWeight: "bold", fontSize: 13 },

  flashSection: { paddingHorizontal: 20 },
  navPill: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 25, backgroundColor: "#f5f5f5", marginRight: 10, flexDirection: 'row', alignItems: 'center' },
  activePill: { backgroundColor: "#ff5722" },
  pillText: { color: "#777", fontWeight: "600" },
  activePillText: { color: "#fff" },

  // Updated Flash Item UI
  flashItemCard: { 
    width: 180, 
    marginRight: 15, 
    backgroundColor: '#fff', 
    borderRadius: 22, 
    padding: 10, 
    // High-quality shadow
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginBottom: 10
  },
  discountTag: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#ff5722',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    zIndex: 10
  },
  discountText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  flashItemImage: { width: "100%", height: 110, borderRadius: 18 },
  flashItemInfo: { marginTop: 10 },
  flashItemName: { fontWeight: 'bold', fontSize: 15, color: '#1f2937' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  ratingText: { fontSize: 12, color: '#6b7280', marginLeft: 4, fontWeight: '600' },
  
  // Weight Selector (Image 2 style)
  qtyScroll: { marginVertical: 10 },
  qtyOption: { paddingHorizontal: 10, paddingVertical: 5, backgroundColor: '#f3f4f6', borderRadius: 8, marginRight: 6, borderWidth: 1, borderColor: '#e5e7eb' },
  qtyActive: { backgroundColor: '#16a34a', borderColor: '#16a34a' },
  qtyLabel: { fontSize: 11, color: '#4b5563', fontWeight: 'bold' },
  qtyLabelActive: { color: '#fff' },

  currentPrice: { color: '#16a34a', fontWeight: 'bold', fontSize: 18 },
  cartRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 },
  addCartBtn: { backgroundColor: '#16a34a', padding: 8, borderRadius: 12 }
});