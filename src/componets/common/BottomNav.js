import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Home, Grid, ShoppingCart, User } from 'lucide-react-native';
import { BlurView } from 'expo-blur'; // Use View if not using Expo

const { width } = Dimensions.get('window');

const BottomNav = ({ activeRoute, navigation }) => {
  const tabs = [
    { name: 'Home', icon: Home, route: 'Home' },
    { name: 'Categories', icon: Grid, route: 'Categories' },
    { name: 'Cart', icon: ShoppingCart, route: 'Cart' },
    { name: 'Profile', icon: User, route: 'Profile' },
  ];

  return (
    <View style={styles.container}>
      {/* Liquid Glass Effect */}
      <BlurView intensity={80} tint="light" style={styles.glassWrapper}>
        {tabs.map((tab, index) => {
          const isActive = activeRoute === tab.route;
          return (
            <TouchableOpacity 
              key={index} 
              style={[styles.tab, isActive && styles.activeTab]}
              onPress={() => navigation.navigate(tab.route)}
            >
              <tab.icon 
                size={24} 
                color={isActive ? '#FFFFFF' : '#6B7280'} 
                strokeWidth={isActive ? 2.5 : 2}
              />
            </TouchableOpacity>
          );
        })}
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    width: width,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  glassWrapper: {
    flexDirection: 'row',
    width: '100%',
    height: 70,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'space-around',
    alignItems: 'center',
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  activeTab: {
    backgroundColor: '#00C853',
    padding: 12,
    borderRadius: 18,
  }
});

export default BottomNav;