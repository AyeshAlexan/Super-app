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

const { width } = Dimensions.get("window");

// --- Data Constants ---
const heroDeals = [
  { id: '1', title: "Fresh Vegetables", sub: "Up to 30% OFF", image: require("../../assets/Images-1/hero.png") },
  { id: '2', title: "Organic Fruits", sub: "Flash Sale: 40% OFF", image: require("../../assets/Images-1/hero.png") },
  { id: '3', title: "Dairy Deals", sub: "Flat 20% OFF", image: require("../../assets/Images-1/hero.png") }
];

const categories = [
  { name: "Fresh Vegetables", image: require("../../assets/Images-1/veg.avif") },
  { name: "Organic Fruits", image: require("../../assets/Images-1/fruits.avif") },
  { name: "Leafy Greens", image: require("../../assets/Images-1/leafy.avif") },
  { name: "Dairy & Eggs", image: require("../../assets/Images-1/dairy.avif") }
];

const flashSaleItems = [
  { id: '1', name: 'Fresh Tomatoes', price: '$2.99', oldPrice: '$4.99', discount: '40% OFF', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=300&auto=format&fit=crop' },
  { id: '2', name: 'Organic Potatoes', price: '$1.99', oldPrice: '$3.49', discount: '43% OFF', image: 'https://images.unsplash.com/photo-1518977676601-b53f02bad67b?q=80&w=300&auto=format&fit=crop' },
  { id: '3', name: 'Fresh Carrots', price: '$1.50', oldPrice: '$3.00', discount: '50% OFF', image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=300&auto=format&fit=crop' },
];

export default function HomeScreen() {
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const [selectedPill, setSelectedPill] = useState('Flash Sales');

  const navPills = ["Flash Sales", "For You", "Popular", "New"];

  const renderHeroItem = ({ item }) => (
    <View style={styles.heroCard}>
      <View style={styles.heroTextContent}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.sub}</Text>
        </View>
        <Text style={styles.heroTitle}>{item.title}</Text>
        <Text style={styles.heroSubText}>Freshly delivered daily.</Text>
        <TouchableOpacity style={styles.shopBtn}>
          <Text style={styles.shopText}>Shop Now</Text>
        </TouchableOpacity>
      </View>
      <Image source={item.image} style={styles.heroImage} />
    </View>
  );

  const renderFlashItem = ({ item }) => (
    <View style={styles.flashItemCard}>
      <Image source={{ uri: item.image }} style={styles.flashItemImage} />
      <View style={styles.discountBadge}>
        <Text style={styles.discountText}>{item.discount}</Text>
      </View>
      <View style={styles.flashItemInfo}>
        <Text style={styles.flashItemName}>{item.name}</Text>
        <Text style={styles.flashItemWeight}>per kg</Text>
        <View style={styles.priceRow}>
          <Text style={styles.currentPrice}>{item.price}</Text>
          <Text style={styles.oldPrice}>{item.oldPrice}</Text>
        </View>
      </View>
    </View>
  );

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

          {/* HERO CAROUSEL */}
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
              <Text style={styles.seeAll}>See all</Text>
            </View>
            <View style={styles.grid}>
              {categories.map((item, index) => (
                <TouchableOpacity key={index} style={styles.cardFrame}>
                  <ImageBackground source={item.image} style={styles.cardImageBack} imageStyle={{ borderRadius: 18 }}>
                    <View style={styles.overlay}><Text style={styles.catName}>{item.name}</Text></View>
                  </ImageBackground>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* FLASH DEALS NAVIGATION & ITEMS */}
          <View style={styles.flashSection}>
            <Text style={[styles.catTitle, {marginBottom: 15}]}>Amazing Products </Text>
            
            {/* Nav Pill bar: Flash Sales, For You, Popular, New */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom: 15}}>
              {navPills.map((pill) => (
                <TouchableOpacity 
                  key={pill} 
                  onPress={() => setSelectedPill(pill)}
                  style={[styles.navPill, selectedPill === pill && styles.activePill]}
                >
                  {pill === "Flash Sales" && <Icon name="flash" size={16} color={selectedPill === pill ? "#fff" : "#ff5722"} style={{marginRight: 4}} />}
                  <Text style={[styles.pillText, selectedPill === pill && styles.activePillText]}>{pill}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <FlatList
              data={flashSaleItems}
              renderItem={renderFlashItem}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingHorizontal: 2, paddingBottom: 20 }}
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
  notiBadge: { position: "absolute", top: 10, right: 10, backgroundColor: "#ef4444", width: 8, height: 8, borderRadius: 4, zIndex: 10 },

  carouselContainer: { marginTop: 20 },
  heroCard: {
    width: width - 40, marginHorizontal: 20, backgroundColor: "#16a34a",
    borderRadius: 25, padding: 20, flexDirection: "row", alignItems: "center", height: 180,
  },
  heroTextContent: { flex: 1 },
  badge: { backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, alignSelf: "flex-start", marginBottom: 5 },
  badgeText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  heroTitle: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  heroSubText: { color: "#fff", opacity: 0.8, fontSize: 12, marginBottom: 10 },
  shopBtn: { backgroundColor: "#fff", paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, alignSelf: "flex-start" },
  shopText: { color: "#16a34a", fontWeight: "bold", fontSize: 14 },
  heroImage: { width: 100, height: 100, resizeMode: "contain" },

  pagination: { flexDirection: "row", justifyContent: "center", marginTop: 10 },
  dot: { height: 6, borderRadius: 3, marginHorizontal: 3 },
  activeDot: { width: 18, backgroundColor: "#16a34a" },
  inactiveDot: { width: 6, backgroundColor: "#D1D1D1" },

  categorySection: { padding: 20 },
  catHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: 'center', marginBottom: 15 },
  catTitle: { fontSize: 20, fontWeight: "bold", color: "#222" },
  seeAll: { color: "#16a34a", fontWeight: "600" },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  cardFrame: { width: (width - 55) / 2, height: 120, marginBottom: 15 },
  cardImageBack: { flex: 1, justifyContent: "flex-end" },
  overlay: { backgroundColor: "rgba(0,0,0,0.35)", padding: 8, borderBottomLeftRadius: 18, borderBottomRightRadius: 18 },
  catName: { color: "#fff", fontWeight: "bold", fontSize: 13 },

  flashSection: { paddingHorizontal: 20 },
  navPill: { 
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 10, 
    borderRadius: 25, backgroundColor: "#f5f5f5", marginRight: 10 
  },
  activePill: { backgroundColor: "#ff5722" },
  pillText: { color: "#777", fontWeight: "600" },
  activePillText: { color: "#fff" },

  flashItemCard: { 
    width: 150, marginRight: 15, backgroundColor: '#fff', 
    borderRadius: 20, padding: 10,
    // Fade Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },
  flashItemImage: { width: "100%", height: 100, borderRadius: 15 },
  discountBadge: { position: 'absolute', top: 15, left: 15, backgroundColor: '#ef4444', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  discountText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  flashItemInfo: { marginTop: 8 },
  flashItemName: { fontWeight: 'bold', fontSize: 14, color: '#333' },
  flashItemWeight: { fontSize: 11, color: '#999' },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  currentPrice: { color: '#16a34a', fontWeight: 'bold', fontSize: 16 },
  oldPrice: { color: '#bbb', textDecorationLine: 'line-through', fontSize: 11, marginLeft: 5 },
}
);
