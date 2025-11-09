import { View, StyleSheet, Animated, TouchableOpacity, Keyboard, Text } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { PaperProvider, TextInput, Button } from "react-native-paper";
import { useNavigation } from '@react-navigation/native';
import { useAuth } from "../../../context/AuthContext";

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const { login } = useAuth(); // ✅ Only need login function

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScale = useRef(new Animated.Value(0)).current;
  const inputAnim1 = useRef(new Animated.Value(0)).current;
  const inputAnim2 = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequential entrance animations
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.stagger(100, [
        Animated.spring(inputAnim1, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(inputAnim2, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(buttonAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    // Prevent double-click
    if (isLoading) {
      console.log("⚠️ Already logging in, ignoring duplicate call");
      return;
    }

    Keyboard.dismiss();
    setIsLoading(true);
    setError(null);
    
    console.log("🔐 Starting login process...");
    
    try {
      const result = await login(email, password, setError);
      
      console.log("🔍 Login Result:", JSON.stringify(result, null, 2));
      
      if (result && result.success === true && result.user) {
        console.log("✅ Login successful!");
        console.log("📋 User Data:", JSON.stringify(result.user, null, 2));
        console.log("👤 User Role:", result.user.role);
        console.log("🔐 Is Admin:", result.user.isAdmin);
        
        // Small delay to ensure state is updated
        setTimeout(() => {
          if (result.user.role === 'admin' || result.user.isAdmin === true) {
            console.log("🎯 ADMIN USER - Redirecting to AdminDashboard...");
            navigation.replace("AdminDashboard");
          } else {
            console.log("👥 Regular user - Redirecting to Main...");
            navigation.replace("Main");
          }
        }, 100);
      } else {
        console.log("❌ Login failed - Result:", JSON.stringify(result, null, 2));
        setError("Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        {/* Loading Indicator */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        )}

        {/* Back Button */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <View style={styles.backButtonCircle}>
            <Text style={styles.backButtonText}>←</Text>
          </View>
        </TouchableOpacity>

        {/* Logo Section */}
        <Animated.View
          style={[
            styles.logoSection,
            {
              opacity: fadeAnim,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <View style={styles.logoBackground}>
            <View style={styles.microphoneIcon}>
              <View style={styles.micTop} />
              <View style={styles.micBody} />
              <View style={styles.micBase} />
            </View>
          </View>
        </Animated.View>

        {/* Title Section */}
        <Animated.View
          style={[
            styles.titleSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.welcomeBack}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Sign in to continue your journey</Text>
        </Animated.View>

        {/* Form Section */}
        <View style={styles.formSection}>
          {/* Email Input */}
          <Animated.View
            style={[
              styles.inputWrapper,
              {
                opacity: inputAnim1,
                transform: [
                  {
                    translateY: inputAnim1.interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <TextInput
              label="Email or Username"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              mode="outlined"
              outlineColor="#e5e7eb"
              activeOutlineColor="#8b5cf6"
              theme={{
                colors: {
                  background: '#f9fafb',
                },
              }}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {error && (
              <Text style={styles.errorText}>Invalid Username or Password</Text>
            )}
          </Animated.View>

          {/* Password Input */}
          <Animated.View
            style={[
              styles.inputWrapper,
              {
                opacity: inputAnim2,
                transform: [
                  {
                    translateY: inputAnim2.interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
              mode="outlined"
              outlineColor="#e5e7eb"
              activeOutlineColor="#8b5cf6"
              theme={{
                colors: {
                  background: '#f9fafb',
                },
              }}
            />
          </Animated.View>

          {/* Forgot Password Link */}
          <Animated.View
            style={[
              styles.forgotPasswordWrapper,
              { opacity: inputAnim2 },
            ]}
          >
            
          </Animated.View>

          {/* Buttons */}
          <Animated.View
            style={[
              styles.buttonSection,
              {
                opacity: buttonAnim,
                transform: [
                  {
                    translateY: buttonAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.loginButton,
                (isLoading || !email || !password) && styles.loginButtonDisabled
              ]}
              onPress={handleLogin}
              activeOpacity={0.8}
              disabled={isLoading || !email || !password}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Text>
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.divider} />
            </View>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => navigation.navigate("Register")}
              activeOpacity={0.8}
            >
              <Text style={styles.registerButtonText}>Create New Account</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Footer */}
        <Animated.View
          style={[
            styles.footer,
            { opacity: buttonAnim },
          ]}
        >
          <Text style={styles.footerText}>
            By continuing, you agree to our{' '}
            <Text style={styles.footerLink}>Terms</Text> and{' '}
            <Text style={styles.footerLink}>Privacy Policy</Text>
          </Text>
        </Animated.View>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  backButtonCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: '#374151',
  },
  logoSection: {
    alignItems: 'center',
    marginTop: 100,
    marginBottom: 20,
  },
  logoBackground: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#8b5cf6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  microphoneIcon: {
    alignItems: 'center',
  },
  micTop: {
    width: 20,
    height: 25,
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 10,
    marginBottom: 3,
  },
  micBody: {
    width: 3,
    height: 8,
    backgroundColor: 'white',
  },
  micBase: {
    width: 18,
    height: 3,
    backgroundColor: 'white',
    borderRadius: 2,
    marginTop: 2,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeBack: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#6b7280',
  },
  formSection: {
    flex: 1,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  input: {
    height: 56,
    fontSize: 15,
    backgroundColor: '#f9fafb',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
  forgotPasswordWrapper: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  forgotPassword: {
    color: '#8b5cf6',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonSection: {
    marginTop: 1,
  },
  loginButton: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 5,
  },
  loginButtonDisabled: {
    backgroundColor: '#c4b5fd',
    shadowOpacity: 0.1,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    color: '#9ca3af',
    paddingHorizontal: 16,
    fontSize: 14,
  },
  registerButton: {
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8b5cf6',
  },
  registerButtonText: {
    color: '#8b5cf6',
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 18,
  },
  footerLink: {
    color: '#8b5cf6',
    fontWeight: '600',
  },
});

export default Login;