import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function LiquidBottomNav() {
  const navigation = useNavigation();
  const route = useRoute();

  const navItems = [
    { name: "Home", icon: "home-outline", activeIcon: "home" },
    { name: "Categories", icon: "view-grid-outline", activeIcon: "view-grid" },
    { name: "Cart", icon: "cart-outline", activeIcon: "cart" },
    { name: "Profile", icon: "account-outline", activeIcon: "account" },
  ];

  return (
    <View style={styles.outerContainer}>
      <BlurView intensity={90} tint="light" style={styles.blurWrapper}>
        <View style={styles.innerContent}>
          {navItems.map((item) => {
            const isActive = route.name === item.name;

            return (
              <TouchableOpacity
                key={item.name}
                style={styles.navItem}
                onPress={() => navigation.navigate(item.name)} // ✅ NAVIGATION FIX
              >
                {isActive ? (
                  <LinearGradient
                    colors={["#22c55e", "#16a34a"]}
                    style={styles.activeButton}
                  >
                    <View style={styles.indicatorDot} />
                    <Icon name={item.activeIcon} size={24} color="#fff" />
                    <Text style={styles.activeText}>{item.name}</Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.inactiveButton}>
                    <Icon name={item.icon} size={24} color="#6b7280" />
                    <Text style={styles.text}>{item.name}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    borderRadius: 35,
    zIndex: 100,
  },
  blurWrapper: {
    borderRadius: 35,
    overflow: "hidden",
  },
  innerContent: {
    height: 85,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.85)", // ✅ BLACK BOTTOM
  },
  navItem: {
    flex: 1,
    alignItems: "center",
  },
  activeButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: "center",
  },
  inactiveButton: {
    alignItems: "center",
  },
  indicatorDot: {
    position: "absolute",
    top: 4,
    width: 5,
    height: 5,
    backgroundColor: "#fff",
    borderRadius: 2.5,
  },
  text: {
    fontSize: 10,
    color: "#9ca3af",
    marginTop: 4,
  },
  activeText: {
    fontSize: 10,
    color: "#fff",
    marginTop: 2,
  },
});