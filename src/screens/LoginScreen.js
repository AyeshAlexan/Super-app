import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import COLORS from '../constants/colors';
import CustomerInput from "../componets/common/CustomeInput";

const LoginScreen = ({navigation}) =>{
    return(
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcomeText}>Welcome Back</Text>
                <Text style={styles.subText}>Login to your account</Text>
            </View>

            <View style={styles.formCard}>
                <Text style={styles.label}>Email Address</Text>
                <CustomerInput iconName="email-outline" placeholder="Enter your email"/>
                
                <Text style={styles.label} >Password </Text>
                <CustomerInput iconName="lock-outline" placeholder="Enter your password" isPassword rightIcons= "eye-outline" />
                
                <TouchableOpacity>
                    <Text style={styles.forgetText}>Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.loginBtn}>
                    <Text style={styles.loginBtnText}>Login</Text>
                </TouchableOpacity>

                <Text style={styles.orText}>or contine with</Text>

                <View style= {styles.socialRow}>
                    <TouchableOpacity style={styles.socialBtn}><Text>Google</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.socialBtn}><Text>Facebook</Text></TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                   <Text style={styles.footerText}> Dont have an account?<Text style={styles.signUpLink}>Sign Up</Text></Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles =StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: COLORS.primary },
  header: { padding: 40, alignItems: 'center' },
  welcomeText: { fontSize: 28, fontWeight: 'bold', color: COLORS.white },
  subText: { color: COLORS.white, fontSize: 16 },
  formCard: { flex: 1, backgroundColor: COLORS.white, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25 },
  label: { fontWeight: 'bold', marginTop: 10 },
  forgotText: { color: COLORS.primary, textAlign: 'right', marginVertical: 10 },
  loginBtn: { backgroundColor: COLORS.primary, padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  loginBtnText: { color: COLORS.white, fontWeight: 'bold', fontSize: 18 },
  orText: { textAlign: 'center', marginVertical: 20, color: COLORS.darkGrey },
  socialRow: { flexDirection: 'row', justifyContent: 'space-between' },
  socialBtn: { flex: 0.48, borderWidth: 1, borderColor: COLORS.border, padding: 12, borderRadius: 12, alignItems: 'center' },
  footerText: { textAlign: 'center', marginTop: 30 },
  signUpLink: { color: COLORS.primary, fontWeight: 'bold' }
});

export default LoginScreen;