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

export default function ProductDetailsScreen({ route, navigation }) {
  const { product = {
    id: Date.now(),
    name: "Fresh Tomatoes",
    category: "Fresh Vegetables",
    price: 100.00,
    unit: "per kg",
    image: 'https://images.unsplash.com/photo-1443131612988-32b6d97cc5da?q=80&w=400',
    rating: 4.5
  } } = route.params || {};

  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  
  const toastFade = useRef(new Animated.Value(0)).current;

  const handleAddToCart = () => {
    if (!product || isAdding) return;
    setIsAdding(true);

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      unit: product.unit,
      quantity: quantity,
    });

    setShowToast(true);

    Animated.sequence([
      Animated.timing(toastFade, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(1500),
      Animated.timing(toastFade, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => {
      setShowToast(false);
      setIsAdding(false);
    });
  };

  return (
    <View style={styles.mainContainer}>
      <SafeAreaView style={{ backgroundColor: "#16a34a" }} edges={["top"]}>
        <StatusBar barStyle="light-content" backgroundColor="#16a34a" />
      </SafeAreaView>

      <View style={styles.contentContainer}>
        <ScrollView bounces={false} contentContainerStyle={{ paddingBottom: 180 }}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: product.image }} style={styles.mainImage} />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.4)']}
              style={styles.imageGradient}
            />
            <View style={styles.headerButtons}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.roundBtn}>
                <Icon name="arrow-left" size={24} color="#374151" />
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)} style={styles.roundBtn}>
                  <Icon name={isFavorite ? "heart" : "heart-outline"} size={24} color={isFavorite ? "#ef4444" : "#374151"} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.roundBtn}>
                  <Icon name="share-variant" size={24} color="#374151" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.detailsWrapper}>
            <View style={styles.infoCard}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{product.category}</Text>
              </View>
              <Text style={styles.productName}>{product.name}</Text>
              <View style={styles.reviewRow}>
                <Icon name="star" size={18} color="#facc15" />
                <Text style={styles.ratingText}>{`${product.rating || "4.5"}`}</Text>
                <Text style={styles.reviewText}>{"(128 Reviews)"}</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceText}>{`Rs.${product.price}`}</Text>
                <Text style={styles.unitText}>{`/ ${product.unit}`}</Text>
              </View>
              <Text style={styles.description}>
                Fresh, high-quality produce picked at peak freshness. Perfect for your healthy daily meals.
              </Text>
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Product Details</Text>
              <View style={styles.grid}>
                <View style={styles.gridBox}><Text style={styles.gridLabel}>Weight</Text><Text style={styles.gridValue}>1 kg</Text></View>
                <View style={styles.gridBox}><Text style={styles.gridLabel}>Origin</Text><Text style={styles.gridValue}>Local Farm</Text></View>
                <View style={styles.gridBox}><Text style={styles.gridLabel}>Best Before</Text><Text style={styles.gridValue}>3 days</Text></View>
                <View style={styles.gridBox}><Text style={styles.gridLabel}>Stock Status</Text><Text style={[styles.gridValue, {color: '#16a34a'}]}>In Stock</Text></View>
              </View>
            </View>

            <LinearGradient colors={['#fffdf2', '#fffbeb']} style={[styles.sectionCard, {borderColor: '#fef3c7', borderWidth: 1}]}>
              <Text style={styles.sectionTitle}>Deals for You</Text>
              <View style={styles.dealRow}>
                <View style={[styles.dealIcon, {backgroundColor: '#f59e0b'}]}><Icon name="party-popper" size={22} color="#fff" /></View>
                <View>
                  <Text style={styles.dealTitle}>40% OFF</Text>
                  <Text style={styles.dealSub}>Limited time offer</Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        </ScrollView>

        <View style={styles.bottomFloatingContainer}>
          {showToast && (
            <Animated.View style={[styles.toastContainer, { opacity: toastFade }]}>
              <LinearGradient colors={['#16a34a', '#22c55e']} style={styles.toastGradient}>
                <Icon name="check-circle" size={18} color="#fff" />
                <Text style={styles.toastText}>Item added to cart!</Text>
              </LinearGradient>
            </Animated.View>
          )}
          <View style={styles.actionBar}>
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))} style={styles.qtyBtn}>
                <Icon name="minus" size={20} color="#374151" />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{`${quantity}`}</Text>
              <TouchableOpacity onPress={() => setQuantity(quantity + 1)} style={styles.qtyBtn}>
                <Icon name="plus" size={20} color="#374151" />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={[styles.addBtn, { opacity: isAdding ? 0.6 : 1 }]} 
              onPress={handleAddToCart}
              disabled={isAdding}
            >
              <LinearGradient colors={['#16a34a', '#22c55e']} style={styles.addGradient}>
                <Icon name={isAdding ? "sync" : "cart-outline"} size={22} color="#fff" />
                <Text style={styles.addBtnText}>{isAdding ? "Adding..." : `Add • Rs.${(product.price * quantity).toFixed(2)}`}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <SafeAreaView style={{ backgroundColor: "#000" }} edges={["bottom"]} />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#16a34a" },
  contentContainer: { flex: 1, backgroundColor: "#f9fafb" },
  imageContainer: { width: width, height: height * 0.35, backgroundColor: '#fff' },
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
  priceText: { fontSize: 30, fontWeight: 'bold', color: '#16a34a' },
  unitText: { color: '#6b7280', fontSize: 16, marginLeft: 5 },
  description: { color: '#6b7280', lineHeight: 22, fontSize: 15 },
  sectionCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginTop: 15, elevation: 8 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1f2937', marginBottom: 15 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between' },
  gridBox: { width: '48%', backgroundColor: '#f0fdf4', padding: 15, borderRadius: 18, borderWidth: 1, borderColor: '#dcfce7' },
  gridLabel: { fontSize: 11, color: '#16a34a', textTransform: 'uppercase', letterSpacing: 0.5, opacity: 0.7 },
  gridValue: { fontWeight: 'bold', color: '#1f2937', marginTop: 2, fontSize: 15 },
  dealRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dealIcon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  dealTitle: { fontWeight: 'bold', color: '#374151', fontSize: 14 },
  dealSub: { fontSize: 12, color: '#6b7280' },
  bottomFloatingContainer: { position: 'absolute', bottom: 30, left: 0, right: 0, alignItems: 'center', zIndex: 100 },
  toastContainer: { marginBottom: 12, width: width * 0.85 },
  toastGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 12, borderRadius: 18, elevation: 8 },
  toastText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  actionBar: { width: width * 0.92, backgroundColor: '#fff', borderRadius: 28, padding: 10, flexDirection: 'row', gap: 12, elevation: 15 },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 22, padding: 4 },
  qtyBtn: { width: 38, height: 38, backgroundColor: '#fff', borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  qtyText: { width: 35, textAlign: 'center', fontWeight: 'bold', fontSize: 17, color: '#1e293b' },
  addBtn: { flex: 1 },
  addGradient: { height: 54, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  addBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});