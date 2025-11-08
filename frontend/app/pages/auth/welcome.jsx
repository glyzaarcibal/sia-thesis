import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity, BackHandler, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from "../../../context/AuthContext";

const { width, height } = Dimensions.get('window');

const Welcome = () => {
  const navigation = useNavigation();

  const { setUser } = useAuth();
  // Animation values
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const bubbleAnim1 = useRef(new Animated.Value(0)).current;
  const bubbleAnim2 = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(20)).current;
  const featureOpacity = useRef(new Animated.Value(0)).current;
  const featureTranslateY = useRef(new Animated.Value(30)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const buttonTranslateY = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    // Sequential animations
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.stagger(100, [
        Animated.spring(bubbleAnim1, {
          toValue: 1,
          tension: 40,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.spring(bubbleAnim2, {
          toValue: 1,
          tension: 40,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(titleTranslateY, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(featureOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(featureTranslateY, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(buttonTranslateY, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Delayed floating bubble animation loops
    setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bubbleAnim1, {
            toValue: 1.1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(bubbleAnim1, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(bubbleAnim2, {
            toValue: 1.15,
            duration: 2500,
            useNativeDriver: true,
          }),
          Animated.timing(bubbleAnim2, {
            toValue: 1,
            duration: 2500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, 2000);

    // Back button handler
    const backAction = () => {
      Alert.alert("Exit App", "Are you sure you want to exit?", [
        { text: "Cancel", style: "cancel" },
        { text: "Exit", onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, []);

   const handleGuest = () => {
    setUser("Guest");
    navigation.navigate("Main", { animation: "none" });
  };

  return (
    <View style={styles.container}>
      {/* Logo Section */}
      <View style={styles.logoSection}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ scale: logoScale }],
              opacity: logoOpacity,
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

        {/* Floating Bubbles */}
        <Animated.View
          style={[
            styles.bubble,
            styles.bubble1,
            {
              transform: [{ scale: bubbleAnim1 }],
              opacity: logoOpacity,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.bubble,
            styles.bubble2,
            {
              transform: [{ scale: bubbleAnim2 }],
              opacity: logoOpacity,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.bubble,
            styles.bubble3,
            {
              transform: [{ scale: bubbleAnim1 }],
              opacity: logoOpacity,
            },
          ]}
        />
      </View>

      {/* Title Section */}
      <Animated.View
        style={[
          styles.titleSection,
          {
            opacity: titleOpacity,
            transform: [{ translateY: titleTranslateY }],
          },
        ]}
      >
        <Text style={styles.welcomeText}>Welcome to Vera</Text>
        <Text style={styles.subtitle}>VERA: VOICE EMOTION RECOGNITION APPLICATION</Text>
        <Text style={styles.tagline}>Smart Support for Mental Wellness</Text>
      </Animated.View>

      {/* Features Section */}
      <Animated.View
        style={[
          styles.featuresSection,
          {
            opacity: featureOpacity,
            transform: [{ translateY: featureTranslateY }],
          },
        ]}
      >
        <View style={styles.featureItem}>
          <View style={[styles.featureIcon, { backgroundColor: '#8b5cf6' }]}>
            <View style={styles.iconCircle}>
              <View style={styles.iconDot} />
            </View>
          </View>
          <Text style={styles.featureText}>AI-Powered Emotion Analysis</Text>
        </View>

        <View style={styles.featureItem}>
          <View style={[styles.featureIcon, { backgroundColor: '#8b5cf6' }]}>
            <View style={styles.waveIcon}>
              <View style={styles.waveLine} />
              <View style={[styles.waveLine, { height: 12 }]} />
              <View style={styles.waveLine} />
            </View>
          </View>
          <Text style={styles.featureText}>Real-time Voice Recognition</Text>
        </View>

        <View style={styles.featureItem}>
          <View style={[styles.featureIcon, { backgroundColor: '#8b5cf6' }]}>
            <View style={styles.sparkIcon}>
              <View style={styles.sparkLine1} />
              <View style={styles.sparkLine2} />
            </View>
          </View>
          <Text style={styles.featureText}>Personalized Insights</Text>
        </View>
      </Animated.View>

      {/* Buttons Section */}
      <Animated.View
        style={[
          styles.buttonsSection,
          {
            opacity: buttonOpacity,
            transform: [{ translateY: buttonTranslateY }],
          },
        ]}
      >
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={styles.buttonWrapper}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.8}
          >
            <View style={styles.loginButton}>
              <Text style={styles.buttonText}>Login</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.buttonWrapper}
            onPress={() => navigation.navigate('Register')}
            activeOpacity={0.8}
          >
            <View style={styles.registerButton}>
              <Text style={styles.buttonText}>Register</Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.guestButtonWrapper}
          onPress={handleGuest}
          activeOpacity={0.8}
        >
          <View style={styles.guestButton}>
            <Text style={styles.guestButtonText}>Continue as Guest</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.footerText}>Your emotional wellness journey starts here</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 60,
  },
  logoSection: {
    alignItems: 'center',
    marginTop: 40,
    position: 'relative',
    height: 130,
    width: 170,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBackground: {
    width: 110,
    height: 110,
    borderRadius: 30,
    backgroundColor: '#8b5cf6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  microphoneIcon: {
    alignItems: 'center',
  },
  micTop: {
    width: 28,
    height: 35,
    borderWidth: 4,
    borderColor: 'white',
    borderRadius: 14,
    marginBottom: 4,
  },
  micBody: {
    width: 4,
    height: 12,
    backgroundColor: 'white',
  },
  micBase: {
    width: 24,
    height: 4,
    backgroundColor: 'white',
    borderRadius: 2,
    marginTop: 2,
  },
  bubble: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: '#c4b5fd',
  },
  bubble1: {
    width: 20,
    height: 20,
    top: 10,
    right: 20,
  },
  bubble2: {
    width: 14,
    height: 14,
    top: 35,
    right: 5,
  },
  bubble3: {
    width: 10,
    height: 10,
    top: 60,
    right: 15,
  },
  titleSection: {
    alignItems: 'center',
    paddingHorizontal: 35,
  },
  welcomeText: {
    fontSize: 25,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 11,
    color: '#8b5cf6',
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 12,
  },
  tagline: {
    fontSize: 16,
    color: '#6b7280',
  },
  featuresSection: {
    width: '100%',
    paddingHorizontal: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 12,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  iconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  waveIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  waveLine: {
    width: 3,
    height: 18,
    backgroundColor: 'white',
    borderRadius: 2,
  },
  sparkIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkLine1: {
    position: 'absolute',
    width: 16,
    height: 3,
    backgroundColor: 'white',
    borderRadius: 2,
  },
  sparkLine2: {
    position: 'absolute',
    width: 3,
    height: 16,
    backgroundColor: 'white',
    borderRadius: 2,
  },
  featureText: {
    fontSize: 11,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
  },
  buttonsSection: {
    width: '100%',
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 12,
    gap: 10,
  },
  buttonWrapper: {
    flex: 1,
  },
  loginButton: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  registerButton: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  guestButtonWrapper: {
    width: '100%',
    marginBottom: 16,
  },
  guestButton: {
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8b5cf6',
  },
  guestButtonText: {
    color: '#8b5cf6',
    fontSize: 16,
    fontWeight: '600',
  },
  footerText: {
    fontSize: 13,
    color: '#9ca3af',
    textAlign: 'center',
  },
});

export default Welcome;