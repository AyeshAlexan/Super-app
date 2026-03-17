import React from "react";
import { View, TouchableOpacity, StyleSheet, Text, Platform } from "react-native";
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

  const handleNavigation = (targetScreen) => {
    if (route.name === targetScreen) return;

    // Custom animation logic:
    // If we are on Categories and going to Home, it should feel like "going back"
    if (route.name === "Categories" && targetScreen === "Home") {
      navigation.navigate("Home"); 
      // Note: If you want a literal slide left, native-stack handles 
      // this best if Home is the base of your stack.
    } else {
      navigation.navigate(targetScreen);
    }
  };

  return (
    <View style={styles.outerContainer}>
      <BlurView intensity={80} tint="light" style={styles.blurWrapper}>
        <View style={styles.innerContent}>
          {navItems.map((item) => {
            const isActive = route.name === item.name;

            return (
              <TouchableOpacity
                key={item.name}
                style={styles.navItem}
                onPress={() => handleNavigation(item.name)}
                activeOpacity={0.7}
              >
                {isActive ? (
                  <LinearGradient
                    colors={["rgba(255, 255, 255, 0.95)", "rgba(255, 255, 255, 0.8)"]}
                    style={styles.activeButton}
                  >
                    <View style={styles.indicatorDot} />
                    <Icon name={item.activeIcon} size={24} color="#16a34a" />
                    <Text style={styles.activeText}>{item.name}</Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.inactiveButton}>
                    <Icon name={item.icon} size={24} color="rgba(50, 50, 50, 0.6)" />
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
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  blurWrapper: {
    borderRadius: 35,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  innerContent: {
    height: 80,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "rgba(22, 188, 83, 0.88)", // Matches your glassy green
  },
  navItem: {
    flex: 1,
    alignItems: "center",
  },
  activeButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    // Slight shadow for the white pill to make it pop against green
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inactiveButton: {
    alignItems: "center",
  },
  indicatorDot: {
    position: "absolute",
    top: 2,
    width: 4,
    height: 4,
    backgroundColor: "#16a34a",
    borderRadius: 2,
  },
  text: {
    fontSize: 10,
    color: "rgba(40, 40, 40, 0.7)",
    marginTop: 4,
    fontWeight: "500",
  },
  activeText: {
    fontSize: 10,
    color: "#16a34a",
    marginTop: 2,
    fontWeight: "bold",
  },
});