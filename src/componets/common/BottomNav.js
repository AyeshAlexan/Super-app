import React, { useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, Text, Platform, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { BlurView } from "expo-blur";
import { useNavigation, useRoute } from "@react-navigation/native";
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  useSharedValue,
} from "react-native-reanimated";

import { useCart } from "../../context/CartContext";

const { width: windowWidth } = Dimensions.get("window");

export default function LiquidBottomNav() {
  const navigation = useNavigation();
  const route = useRoute();
  
  const { cartItems } = useCart();
  const cartCount = cartItems?.length || 0;

  const navItems = [
    { name: "Home", icon: "home-outline", activeIcon: "home" },
    { name: "Categories", icon: "view-grid-outline", activeIcon: "view-grid" },
    { name: "Cart", icon: "cart-outline", activeIcon: "cart" },
    { name: "Profile", icon: "account-outline", activeIcon: "account" },
  ];

  // ✅ FIX 1: HANDLE NESTED ROUTES
  const getActiveRoute = () => {
    if (route.name === "Main" && route.state) {
      const nestedRoute = route.state.routes[route.state.index];
      return nestedRoute.name;
    }
    return route.name;
  };

  const currentRoute = getActiveRoute();

  const activeIndex = navItems.findIndex(item => item.name === currentRoute);

  const containerWidth = windowWidth - 40;
  const tabWidth = containerWidth / navItems.length;

  const translateX = useSharedValue(0);

  useEffect(() => {
    if (activeIndex !== -1) {
      translateX.value = withSpring(activeIndex * tabWidth, {
        damping: 18,
        stiffness: 150,
        mass: 0.6,
      });
    }
  }, [activeIndex, tabWidth]);

  const animatedPillStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.outerContainer}>
      <BlurView intensity={80} tint="light" style={styles.blurWrapper}>
        <View style={styles.innerContent}>
          
          {/* ACTIVE INDICATOR */}
          <Animated.View style={[
            styles.activeButtonContainer, 
            { width: tabWidth }, 
            animatedPillStyle
          ]}>
            <View style={styles.whiteSquircle}>
              <View style={styles.indicatorDot} />
            </View>
          </Animated.View>

          {navItems.map((item) => {
            const isActive = currentRoute === item.name;
            const isCart = item.name === "Cart";

            return (
              <TouchableOpacity
                key={item.name}
                style={styles.navItem}
                
                // ✅ FIX 2: CORRECT NAVIGATION
                onPress={() =>
                  navigation.navigate("Main", {
                    screen: item.name,
                  })
                }

                activeOpacity={0.8}
              >
                <View style={styles.iconWrapper}>
                  <Icon 
                    name={isActive ? item.activeIcon : item.icon} 
                    size={26} 
                    color={isActive ? "#16a34a" : "rgba(255, 255, 255, 0.9)"} 
                  />

                  {/* CART BADGE */}
                  {isCart && cartCount > 0 && (
                    <View style={styles.badgeContainer}>
                      <Text style={styles.badgeText}>
                        {cartCount > 9 ? "9+" : cartCount}
                      </Text>
                    </View>
                  )}

                  <Text style={[
                    styles.navText, 
                    isActive ? styles.activeText : styles.inactiveText
                  ]}>
                    {item.name}
                  </Text>
                </View>
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
      android: { elevation: 10 },
    }),
  },
  blurWrapper: {
    borderRadius: 35,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  innerContent: {
    height: 85,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#22c55e", 
  },
  activeButtonContainer: {
    position: 'absolute',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  whiteSquircle: {
    width: 65,
    height: 65,
    backgroundColor: '#fff',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  indicatorDot: {
    position: 'absolute',
    top: 8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#16a34a',
  },
  navItem: {
    flex: 1,
    height: '100%',
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  navText: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600',
  },
  activeText: {
    color: '#16a34a',
  },
  inactiveText: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  badgeContainer: {
    position: 'absolute',
    right: -6,
    top: -4,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 2,
  },
});