import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from 'expo-linear-gradient';
import { useCart } from "../context/CartContext";

const { width, height } = Dimensions.get("window");

const quantityOptions = [
  { label: "250g", value: 0.25 },
  { label: "500g", value: 0.5 },
  { label: "1kg", value: 1 },
  { label: "2kg", value: 2 },
];

export default function ProductDetailsScreen({ route, navigation }) {
  const { product } = route.params || {};
  const { addToCart } = useCart();
  const [selectedQty, setSelectedQty] = useState(quantityOptions[2]); 
  const [isFavorite, setIsFavorite] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  const toastFade = useRef(new Animated.Value(0)).current;

  // Dynamic Discount logic using discount_percent column
  const discountPercent = product.discount_percent || 0;
  const hasDeal = discountPercent > 0;
  
  const originalPrice = product.price * selectedQty.value;
  const finalPrice = hasDeal 
    ? originalPrice * (1 - discountPercent / 100) 
    : originalPrice;

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: finalPrice,
      image: product.image,
      unit: selectedQty.label,
      quantity: 1,
    });

    setShowToast(true);
    Animated.sequence([
      Animated.timing(toastFade, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(1500),
      Animated.timing(toastFade, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => setShowToast(false));
  };

  return (
    <View style={styles.mainContainer}>
      {/* 5. Top Safe Area Green */}
      <SafeAreaView style={{ backgroundColor: "#16a34a" }} edges={["top"]}>
        <StatusBar barStyle="light-content" backgroundColor="#16a34a" />
      </SafeAreaView>

      <View style={styles.contentContainer}>
        <ScrollView bounces={false} contentContainerStyle={{ paddingBottom: 180 }}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: product.image }} style={styles.mainImage} />
            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.4)']} style={styles.imageGradient} />
            <View style={styles.headerButtons}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.roundBtn}>
                <Icon name="arrow-left" size={24} color="#374151" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)} style={styles.roundBtn}>
                <Icon name={isFavorite ? "heart" : "heart-outline"} size={24} color={isFavorite ? "#ef4444" : "#374151"} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.detailsWrapper}>
            <View style={styles.infoCard}>
              <View style={styles.categoryBadge}>
                {/* 1. Dynamic Category Name */}
                <Text style={styles.categoryText}>
                  {product.category?.name || "Fresh Produce"}
                </Text>
              </View>
              <Text style={styles.productName}>{product.name}</Text>
              
              <View style={styles.reviewRow}>
                <Icon name="star" size={18} color="#facc15" />
                <Text style={styles.ratingText}>{product.rating || "4.5"}</Text>
                <Text style={styles.reviewText}>{`(${product.reviews_count || 0} Reviews)`}</Text>
              </View>

              <View style={styles.priceRow}>
                {/* 2. Remove decimals if price is whole number */}
                <Text style={styles.priceText}>
                   Rs.{finalPrice % 1 === 0 ? finalPrice.toFixed(0) : finalPrice.toFixed(2)}
                </Text>
                <Text style={styles.unitText}>{`/ ${selectedQty.label}`}</Text>
                {hasDeal && (
                  <Text style={styles.oldPrice}>Rs.{originalPrice.toFixed(0)}</Text>
                )}
              </View>

              <Text style={styles.description}>{product.description}</Text>
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Product Details</Text>
              <View style={styles.grid}>
                <View style={styles.gridBox}>
                   <Text style={styles.gridLabel}>Available Stock</Text>
                   {/* FIX: Parse integer to remove .000 and use unit from database */}
                   <Text style={styles.gridValue}>
                     {product.stock_quantity ? parseInt(product.stock_quantity) : 0} {product.unit || 'units'}
                   </Text>
                </View>
                <View style={styles.gridBox}>
                   <Text style={styles.gridLabel}>Origin</Text>
                   <Text style={styles.gridValue}>{product.origin || "Local Farm"}</Text>
                </View>
                
                {/* 3. Conditional Label: Only show if deal exists */}
                {hasDeal && (
                  <View style={styles.gridBox}>
                    <Text style={styles.gridLabel}>Label</Text>
                    <Text style={styles.gridValue}>Weekly Deal</Text>
                  </View>
                )}
                
                <View style={styles.gridBox}>
                   <Text style={styles.gridLabel}>Stock Status</Text>
                   <Text style={[styles.gridValue, {color: product.stock_quantity > 0 ? '#16a34a' : '#ef4444'}]}>
                     {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                   </Text>
                </View>
              </View>
            </View>

            {/* 4. Dynamic Deal Section */}
            {hasDeal && (
              <LinearGradient colors={['#fffdf2', '#fffbeb']} style={[styles.sectionCard, {borderColor: '#fef3c7', borderWidth: 1}]}>
                <Text style={styles.sectionTitle}>Deals for You</Text>
                <View style={styles.dealRow}>
                  <View style={[styles.dealIcon, {backgroundColor: '#f59e0b'}]}>
                    <Icon name="party-popper" size={22} color="#fff" />
                  </View>
                  <View>
                    <Text style={styles.dealTitle}>{discountPercent}% OFF</Text>
                    <Text style={styles.dealSub}>Limited time offer</Text>
                  </View>
                </View>
              </LinearGradient>
            )}
          </View>
        </ScrollView>

        <View style={styles.bottomFloatingContainer}>
          {showToast && (
            <Animated.View style={[styles.toastContainer, { opacity: toastFade }]}>
              <LinearGradient colors={['#16a34a', '#22c55e']} style={styles.toastGradient}>
                <Icon name="check-circle" size={18} color="#fff" />
                <Text style={styles.toastText}>Added to cart!</Text>
              </LinearGradient>
            </Animated.View>
          )}

          <View style={styles.actionBar}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
              {quantityOptions.map((q) => (
                <TouchableOpacity
                  key={q.label}
                  style={[styles.qtyBtn, { marginHorizontal: 4, backgroundColor: selectedQty.label === q.label ? "#16a34a" : "#fff" }]}
                  onPress={() => setSelectedQty(q)}
                >
                  <Text style={{ color: selectedQty.label === q.label ? "#fff" : "#374151", fontWeight: "bold" }}>{q.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.addBtn} onPress={handleAddToCart}>
              <LinearGradient colors={['#16a34a', '#22c55e']} style={styles.addGradient}>
                <Icon name="cart-outline" size={22} color="#fff" />
                <Text style={styles.addBtnText}>
                  {`Add • Rs.${finalPrice % 1 === 0 ? finalPrice.toFixed(0) : finalPrice.toFixed(2)}`}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 5. Bottom Safe Area Black */}
      <SafeAreaView style={{ backgroundColor: "#000" }} edges={["bottom"]} />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#16a34a" },
  contentContainer: { flex: 1, backgroundColor: "#f9fafb" },
  imageContainer: { width: width, height: height * 0.35 },
  mainImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  imageGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 100 },
  headerButtons: { position: 'absolute', top: 20, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between' },
  roundBtn: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', elevation: 4 },
  detailsWrapper: { marginTop: -30, paddingHorizontal: 20 },
  infoCard: { backgroundColor: '#fff', borderRadius: 25, padding: 22, elevation: 10 },
  categoryBadge: { backgroundColor: '#f0fdf4', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, marginBottom: 8 },
  categoryText: { color: '#16a34a', fontSize: 12, fontWeight: 'bold' },
  productName: { fontSize: 26, fontWeight: 'bold', color: '#1f2937' },
  reviewRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  ratingText: { marginLeft: 5, fontWeight: 'bold', color: '#1f2937' },
  reviewText: { marginLeft: 5, color: '#9ca3af' },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', marginVertical: 12 },
  priceText: { fontSize: 28, fontWeight: 'bold', color: '#16a34a' },
  oldPrice: { fontSize: 16, color: '#9ca3af', textDecorationLine: 'line-through', marginLeft: 10 },
  unitText: { color: '#6b7280', fontSize: 16, marginLeft: 5 },
  description: { color: '#6b7280', lineHeight: 22, fontSize: 15 },
  sectionCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginTop: 15, elevation: 8 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1f2937', marginBottom: 15 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between' },
  gridBox: { width: '48%', backgroundColor: '#f0fdf4', padding: 12, borderRadius: 18, borderWidth: 1, borderColor: '#dcfce7' },
  gridLabel: { fontSize: 10, color: '#16a34a', textTransform: 'uppercase', opacity: 0.7 },
  gridValue: { fontWeight: 'bold', color: '#1f2937', marginTop: 2, fontSize: 14 },
  dealRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dealIcon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  dealTitle: { fontWeight: 'bold', color: '#374151', fontSize: 18 },
  dealSub: { fontSize: 12, color: '#6b7280' },
  bottomFloatingContainer: { position: 'absolute', bottom: 40, left: 0, right: 0, alignItems: 'center' },
  toastContainer: { marginBottom: 12, width: width * 0.85 },
  toastGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 12, borderRadius: 18 },
  toastText: { color: '#fff', fontWeight: 'bold' },
  actionBar: { width: width * 0.92, backgroundColor: '#fff', borderRadius: 28, padding: 10, flexDirection: 'row', gap: 12, elevation: 15 },
  qtyBtn: { width: 45, height: 45, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#f1f5f9' },
  addBtn: { flex: 1 },
  addGradient: { height: 54, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  addBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});