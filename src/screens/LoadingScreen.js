import React, { useEffect, useRef } from "react";
import { View, StyleSheet, StatusBar, Animated, Dimensions } from 'react-native';
import { Image } from 'expo-image'; 

const { height } = Dimensions.get('window');

const LoadingScreen = () => {
  const progress = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  const logoSource = require('../../assets/Images-1/logo.png');

  useEffect(() => {
    // 2-second loading bar progress
    Animated.timing(progress, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();

    // Subtle breathing effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.05, duration: 1500, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const loaderWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Decorative pulse circles */}
      <Animated.View style={[styles.circleTop, { transform: [{ scale: pulse }] }]} />
      <Animated.View style={[styles.circleBottom, { transform: [{ scale: pulse }] }]} />

      {/* Main Logo - Increased to 180 for better impact */}
      <Animated.View style={{ transform: [{ scale: pulse }] }}>
        <Image 
          source={logoSource} 
          style={styles.logo}
          contentFit="contain"
          transition={0} 
          priority="high" 
          cachePolicy="memory-disk"
        />
      </Animated.View>

      {/* Tightened gap to match your red arrow feedback */}
      <View style={styles.loaderContainer}>
        <View style={styles.loaderBackground}>
          <Animated.View style={[styles.loaderLine, { width: loaderWidth }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#00C853', 
    justifyContent: 'center', 
    alignItems: 'center',
    overflow: 'hidden'
  },
  circleTop: {
    position: 'absolute',
    top: -height * 0.1,
    left: -height * 0.1,
    width: height * 0.35,
    height: height * 0.35,
    borderRadius: height * 0.175,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  circleBottom: {
    position: 'absolute',
    bottom: -height * 0.1,
    right: -height * 0.1,
    width: height * 0.35,
    height: height * 0.35,
    borderRadius: height * 0.175,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  logo: { 
    width: 200, // Made it a bit bigger as requested
    height: 200, // Increased height to match the width
    tintColor: '#FFFFFF'
  },
  loaderContainer: {
    marginTop: -10, // Reduced from 80 to 40 to close that big gap
  },
  loaderBackground: { 
    width: 200, 
    height: 4, 
    backgroundColor: 'rgba(255, 255, 255, 0.25)', 
    borderRadius: 10,
    overflow: 'hidden' 
  },
  loaderLine: { 
    height: '100%', 
    backgroundColor: '#FFFFFF', 
    borderRadius: 10 
  },
});

export default LoadingScreen;