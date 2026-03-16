import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomInput from '../componets/common/CustomeInput';

const SignupScreen = ({ navigation }) => {
  return (
    <View style={styles.mainContainer}>

      {/* Black Status Bar */}
      <StatusBar backgroundColor="#000000" barStyle="light-content" />

      {/* Safe Area */}
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.contentSafeArea}>

          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >

            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subText}>Sign up to get started</Text>
            </View>

            {/* Form Card */}
            <View style={styles.formCard}>

              <Text style={styles.label}>Full Name</Text>
              <CustomInput
                iconName="account-outline"
                placeholder="Enter your name"
              />

              <Text style={styles.label}>Email Address</Text>
              <CustomInput
                iconName="email-outline"
                placeholder="Enter your email"
                keyboardType="email-address"
              />

              <Text style={styles.label}>Phone Number</Text>
              <CustomInput
                iconName="phone-outline"
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />

              <Text style={styles.label}>Street Address</Text>
              <CustomInput
                iconName="map-marker-outline"
                placeholder="Enter your street address"
              />

              {/* City + Zip */}
              <View style={styles.row}>
                <View style={styles.flex1}>
                  <Text style={styles.label}>Town / City</Text>
                  <CustomInput
                    iconName="city-variant-outline"
                    placeholder="City"
                  />
                </View>

                <View style={[styles.flex1, { marginLeft: 15 }]}>
                  <Text style={styles.label}>Postal Code</Text>
                  <CustomInput
                    iconName="mailbox-outline"
                    placeholder="Zip"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              {/* Password Row */}
              <View style={styles.row}>
                <View style={styles.flex1}>
                  <Text style={styles.label}>Password</Text>
                  <CustomInput
                    iconName="lock-outline"
                    placeholder="Create"
                    isPassword
                    rightIcon="eye-outline"
                  />
                </View>

                <View style={[styles.flex1, { marginLeft: 15 }]}>
                  <Text style={styles.label}>Confirm</Text>
                  <CustomInput
                    iconName="lock-check-outline"
                    placeholder="Repeat"
                    isPassword
                    rightIcon="eye-outline"
                  />
                </View>
              </View>

              {/* Terms */}
              <View style={styles.termsRow}>
                <View style={styles.checkboxPlaceholder} />
                <Text style={styles.termsText}>
                  I agree to the{' '}
                  <Text style={styles.link}>Terms</Text> and{' '}
                  <Text style={styles.link}>Privacy Policy</Text>
                </Text>
              </View>

              {/* Create Button */}
              <TouchableOpacity style={styles.createBtn}>
                <Text style={styles.createBtnText}>Create Account</Text>
              </TouchableOpacity>

              {/* Footer */}
              <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                style={styles.footer}
              >
                <Text style={styles.footerText}>
                  Already have an account?{' '}
                  <Text style={styles.link}>Login</Text>
                </Text>
              </TouchableOpacity>

            </View>
          </ScrollView>

        </View>
      </SafeAreaView>

      {/* Bottom Safe Area Fix */}
      <View style={styles.bottomNavFix} />

    </View>
  );
};

const styles = StyleSheet.create({

  mainContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },

  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },

  contentSafeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  scrollContainer: {
    flexGrow: 1,
  },

  header: {
    backgroundColor: '#00C853',
    paddingTop: 40,
    paddingBottom: 80,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 45,
    borderBottomRightRadius: 45,
    alignItems: 'center',
  },

  title: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  subText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    marginTop: 4,
  },

  formCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: -40,
    borderRadius: 30,
    padding: 20,
    marginBottom: 30,

    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  flex1: {
    flex: 1,
  },

  label: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 15,
    marginBottom: 5,
    color: '#374151',
  },

  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },

  checkboxPlaceholder: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
    borderColor: '#D1D5DB',
  },

  termsText: {
    flex: 1,
    fontSize: 12,
    color: '#6B7280',
  },

  link: {
    color: '#00C853',
    fontWeight: '800',
  },

  createBtn: {
    backgroundColor: '#00C853',
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
  },

  createBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },

  footer: {
    marginTop: 20,
    marginBottom: 5,
  },

  footerText: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 14,
  },

  bottomNavFix: {
    height: 0,
    backgroundColor: '#000000',
  }

});

export default SignupScreen;