import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  Dimensions, 
  StatusBar, 
  TextInput 
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from 'expo-linear-gradient';
import LiquidBottomNav from "../componets/common/BottomNav";
import { useCart } from "../context/CartContext";

const { width } = Dimensions.get("window");

export default function CartScreen({ navigation }) {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const insets = useSafeAreaInsets();

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = cartItems.length > 0 ? 50.00 : 0;
  const total = subtotal + deliveryFee;

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAF7" }}>
      
      {/* SAFE AREA */}
      <View style={{ backgroundColor: "#16a34a", height: insets.top }} />
      <StatusBar barStyle="light-content" backgroundColor="#16a34a" />

      {/* HEADER */}
      <View style={styles.headerWrapper}>
        <LinearGradient colors={['#16a34a', '#22c55e']} style={styles.headerGradient}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Icon name="arrow-left" size={24} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>
              My Cart ({cartItems.length})
            </Text>

            <View style={{ width: 40 }} />
          </View>
        </LinearGradient>
      </View>

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 180 }]}
        showsVerticalScrollIndicator={false}
      >

        {/* CART ITEMS */}
        <View style={styles.itemsList}>
          {cartItems.length > 0 ? cartItems.map((item) => (
            <View key={`${item.id}-${item.unit}`} style={styles.cartCard}>
              
              <Image source={{ uri: item.image }} style={styles.itemImage} />

              <View style={styles.itemDetails}>

                {/* NAME + DELETE */}
                <View style={styles.itemHeader}>
                  <Text style={styles.itemName}>{item.name}</Text>

                  <TouchableOpacity onPress={() => removeFromCart(item.id, item.unit)}>
                    <Icon name="trash-can-outline" size={22} color="#ef4444" />
                  </TouchableOpacity>
                </View>

                {/* UNIT */}
                <View style={styles.unitBadge}>
                  <Text style={styles.unitText}>{item.unit}</Text>
                </View>

                {/* PRICE + QTY */}
                <View style={styles.priceRow}>
                  
                  <Text style={styles.itemPrice}>
                    Rs.{(item.price * item.quantity).toFixed(2)}
                  </Text>

                  <View style={styles.quantityControls}>
                    <TouchableOpacity 
                      onPress={() => updateQuantity(item.id, item.unit, -1)} 
                      style={styles.qtyBtn}
                    >
                      <Icon name="minus" size={16} color="#6b7280" />
                    </TouchableOpacity>

                    <Text style={styles.qtyText}>{item.quantity}</Text>

                    <TouchableOpacity 
                      onPress={() => updateQuantity(item.id, item.unit, 1)} 
                      style={styles.qtyBtnActive}
                    >
                      <Icon name="plus" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>

              </View>
            </View>
          )) : (
            <View style={styles.emptyContainer}>
               <Icon name="cart-off" size={60} color="#D1D5DB" />
               <Text style={styles.emptyText}>Your cart is empty</Text>
            </View>
          )}
        </View>

        {/* PROMO */}
        <View style={styles.promoSection}>
          <View style={styles.promoHeader}>
            <Icon name="ticket-percent" size={24} color="#f97316" />
            <Text style={styles.promoTitle}>Apply Promo Code</Text>
          </View>
          
          <View style={styles.promoInputRow}> 
            <TextInput 
              style={styles.promoInput} 
              placeholder="Enter promo code" 
              placeholderTextColor="#9ca3af" 
            />
            <TouchableOpacity style={styles.applyBtn}>
              <Text style={styles.applyBtnText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ADDRESS */}
        <View style={styles.addressCard}>
            <View style={styles.addressRow}>
                <View style={styles.addressIconBox}>
                  <Icon name="map-marker" size={22} color="#16a34a" />
                </View>
                <View style={{flex: 1, marginLeft: 12}}>
                    <Text style={styles.addressLabel}>Delivery Address</Text>
                    <Text style={styles.addressText}>123 Main St, Colombo, Sri Lanka</Text>
                </View>
                <TouchableOpacity>
                  <Text style={styles.changeText}>Change</Text>
                </TouchableOpacity>
            </View>
        </View>

        {/* SUMMARY */}
        <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Order Summary</Text>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>Rs.{subtotal.toFixed(2)}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>Rs.{deliveryFee.toFixed(2)}</Text>
            </View>
            
            <View style={styles.divider} /> 
            
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>Rs.{total.toFixed(2)}</Text>
            </View>
            
            {cartItems.length > 0 && (
              <TouchableOpacity 
                style={styles.checkoutBtn}
                onPress={() => console.log("Checkout clicked")}
              >
                <Text style={styles.checkoutBtnText}>
                  Checkout • Rs.{total.toFixed(2)}
                </Text>
              </TouchableOpacity>
            )}
        </View>

      </ScrollView>

      {/* NAV */}
      <View style={{ position: 'absolute', bottom: insets.bottom + 10, left: 0, right: 0 }}>
        <LiquidBottomNav />
      </View>

      <View style={{ backgroundColor: "#000", height: insets.bottom }} />
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: { height: 110, overflow: 'hidden' },
  headerGradient: { flex: 1, borderBottomLeftRadius: 40, borderBottomRightRadius: 40, paddingHorizontal: 20, justifyContent: 'center' },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  backBtn: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 12 },

  scrollContent: { paddingHorizontal: 20, paddingTop: 15 },

  itemsList: { gap: 14 },

  cartCard: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    borderRadius: 20, 
    padding: 12, 
    elevation: 3, 
    shadowColor: '#000', 
    shadowOpacity: 0.08, 
    shadowRadius: 8 
  },

  itemImage: { width: 80, height: 80, borderRadius: 15 },

  itemDetails: { flex: 1, marginLeft: 12 },

  itemHeader: { flexDirection: 'row', justifyContent: 'space-between' },

  itemName: { fontWeight: 'bold', fontSize: 16, color: '#1f2937' },

  unitBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#dcfce7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 4,
    marginBottom: 6
  },

  unitText: {
    fontSize: 12,
    color: "#16a34a",
    fontWeight: "600"
  },

  priceRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },

  itemPrice: { fontSize: 18, fontWeight: 'bold', color: '#16a34a' },

  quantityControls: { flexDirection: 'row', alignItems: 'center' },

  qtyBtn: { backgroundColor: '#f3f4f6', padding: 6, borderRadius: 8 },

  qtyBtnActive: { backgroundColor: '#16a34a', padding: 6, borderRadius: 8 },

  qtyText: { fontWeight: 'bold', marginHorizontal: 10 },

  promoSection: { backgroundColor: '#fff9ef', marginTop: 20, borderRadius: 20, padding: 15, borderWidth: 1, borderColor: '#ffedd5' },

  promoHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },

  promoTitle: { fontWeight: 'bold', color: '#374151' },

  promoInputRow: { flexDirection: 'row', gap: 10 },

  promoInput: { flex: 1, backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 12, height: 45, borderWidth: 1, borderColor: '#e5e7eb' },

  applyBtn: { backgroundColor: '#f97316', paddingHorizontal: 20, borderRadius: 10, justifyContent: 'center' },

  applyBtnText: { color: '#fff', fontWeight: 'bold' },

  addressCard: { backgroundColor: '#fff', marginTop: 15, borderRadius: 15, padding: 15 },

  addressRow: { flexDirection: 'row', alignItems: 'center' },

  addressIconBox: { backgroundColor: '#f0fdf4', padding: 8, borderRadius: 10 },

  addressLabel: { fontWeight: 'bold', fontSize: 14, color: '#1f2937' },

  addressText: { fontSize: 12, color: '#6b7280' },

  changeText: { color: '#16a34a', fontWeight: 'bold' },

  summaryCard: { backgroundColor: '#fff', marginTop: 15, borderRadius: 25, padding: 20 },

  summaryTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },

  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },

  summaryLabel: { color: '#6b7280' },

  summaryValue: { fontWeight: '600' },

  divider: { height: 1, backgroundColor: '#f3f4f6', marginVertical: 12 },

  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },

  totalLabel: { fontSize: 18, fontWeight: 'bold' },

  totalValue: { fontSize: 22, fontWeight: 'bold', color: '#16a34a' },

  checkoutBtn: { backgroundColor: '#16a34a', paddingVertical: 15, borderRadius: 18, alignItems: 'center' },

  checkoutBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  emptyContainer: { alignItems: 'center', padding: 40 },

  emptyText: { color: '#9ca3af', marginTop: 10, fontSize: 16 }
});