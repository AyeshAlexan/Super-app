import React from "react";
import {View, Text, Image, StyleSheet, StatusBar} from 'react-native';
import COLORS from '../constants/colors';

const LoadingScreen = () =>{
    return(
        <View style={styles.container}>
            <StatusBar backgroundColor={COLORS.primary} barStyle="light-content"/>
            <View style={styles.logoContainer}>
                <Image source={require('../../assets/Images-1/logo.png')} style={styles.logo}/>
            </View>
            <Text Style={styles.title}>Greenova</Text>
            <Text Style={styles.subtitle}>Fresh.Natural.Green</Text>
            <View style ={styles.loaderLine}/>
        </View>
    );
};

const styles =StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  logoContainer: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 20, borderRadius: 25, marginBottom: 20 },
  logo: { width: 80, height: 80, tintColor: COLORS.white },
  title: { fontSize: 32, fontWeight: 'bold', color: COLORS.white },
  subtitle: { fontSize: 16, color: COLORS.white, marginTop: 5 },
  loaderLine: { width: 150, height: 4, backgroundColor: COLORS.white, marginTop: 40, borderRadius: 2 },

})