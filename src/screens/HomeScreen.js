import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native';
import { Bell, User, Search, Zap, Star, Leaf, Apple, Milk, Ham, Cookie } from 'lucide-react-native';
import BottomNav from '../componets/common/BottomNav';

const categories = [
  { id: 1, name: "Vegetables", icon: Leaf, color: "#E8F5E9", iconColor: "#2E7D32" },
  { id: 2, name: "Fruits", icon: Apple, color: "#FFEBEE", iconColor: "#C62828" },
  { id: 3, name: "Dairy", icon: Milk, color: "#E3F2FD", iconColor: "#1565C0" },
  { id: 4, name: "Meat", icon: Ham, color: "#FCE4EC", iconColor: "#AD1457" },
  { id: 5, name: "Snacks", icon: Cookie, color: "#F3E5F5", iconColor: "#6A1B9A" },
];

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.topRow}>
            <TouchableOpacity style={styles.iconBtn}>
              <User size={22} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.logoText}>Greenova</Text>
            <TouchableOpacity style={styles.iconBtn}>
              <Bell size={22} color="#FFF" />
              <View style={styles.badge}><Text style={styles.badgeText}>3</Text></View>
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <TextInput placeholder="Search for products..." style={styles.searchInput} />
            <TouchableOpacity style={styles.searchBtn}>
              <Search size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero Section (Image1 Replacement) */}
        <View style={styles.heroCard}>
          <Image 
            source={require('../../assets/Images-1/hero.png')}
            style={styles.heroImage} 
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>Fresh from the farm, delivered to your door.</Text>
            <Text style={styles.heroSubText}>
              Greenova brings you the freshest, finest quality vegetables, fruits, and daily essentials sourced directly from local farmers.
            </Text>
            <TouchableOpacity style={styles.shopNowBtn}>
              <Text style={styles.shopNowText}>Shop Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories Grid */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
          </View>
          <View style={styles.catGrid}>
            {categories.map((cat) => (
              <TouchableOpacity key={cat.id} style={[styles.catItem, { backgroundColor: cat.color }]}>
                <cat.icon size={28} color={cat.iconColor} />
                <Text style={[styles.catLabel, { color: cat.iconColor }]}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </ScrollView>

      <BottomNav activeRoute="Home" navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: { 
    backgroundColor: '#00C853', 
    paddingTop: 60, 
    paddingBottom: 30, 
    paddingHorizontal: 20, 
    borderBottomLeftRadius: 35, 
    borderBottomRightRadius: 35 
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  logoText: { fontSize: 22, fontWeight: '900', color: '#FFF' },
  iconBtn: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 10, borderRadius: 12 },
  badge: { position: 'absolute', top: -5, right: -5, backgroundColor: '#FF5252', borderRadius: 10, width: 18, height: 18, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  searchContainer: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 15, padding: 5, alignItems: 'center' },
  searchInput: { flex: 1, paddingHorizontal: 15, fontSize: 14 },
  searchBtn: { backgroundColor: '#00C853', padding: 10, borderRadius: 12 },
  
  heroCard: { margin: 20, borderRadius: 25, overflow: 'hidden', height: 220, elevation: 5 },
  heroImage: { width: '100%', height: '100%', position: 'absolute' },
  heroOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', padding: 20, justifyContent: 'center' },
  heroTitle: { color: '#FFF', fontSize: 20, fontWeight: '900', width: '80%' },
  heroSubText: { color: 'rgba(255,255,255,0.9)', fontSize: 12, marginTop: 8, marginBottom: 15 },
  shopNowBtn: { backgroundColor: '#FFF', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10, alignSelf: 'flex-start' },
  shopNowText: { color: '#00C853', fontWeight: 'bold' },

  section: { paddingHorizontal: 20, marginTop: 10 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
  seeAll: { color: '#00C853', fontWeight: '600' },
  catGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  catItem: { width: '18%', aspectRatio: 1, borderRadius: 15, justifyContent: 'center', alignItems: 'center', padding: 5 },
  catLabel: { fontSize: 10, fontWeight: 'bold', marginTop: 5 }
});

export default HomeScreen;