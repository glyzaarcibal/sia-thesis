import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { TextInput } from "react-native-paper";
import { useRouter } from "expo-router";
import axiosInstance from "../../../context/axiosInstance";
import { useAuth } from "../../../context/AuthContext";
import LoadingScreen from "../../../components/LoadingScreen";
import ErrorScreen from "../../../components/ErrorScreen";
import { Picker } from "@react-native-picker/picker";

const Register = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const router = useRouter();
  const { register } = useAuth();
  const [errors, setErrors] = useState({
    passwordMatched: false,
    passwordLength: false,
    missingEmail: false,
    invalidEmail: false,
    missingFirstName: false,
    missingLastName: false,
    userAlreadyExists: false,
  });
  const [user, setUser] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    role: "user", // Default role
  });
  const [confirmPassword, setConfirmPassword] = useState("");

  // Animation values
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(-20)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const formTranslateY = useRef(new Animated.Value(30)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(headerOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(headerTranslateY, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(formOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(formTranslateY, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    setErrors((prev) => ({
      ...prev,
      userAlreadyExists: false,
      passwordMatched: false,
      invalidEmail: false,
    }));
  }, [user]);

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    Keyboard.dismiss();
    setIsLoading(true);

    // Validate email format
    const emailValid = isValidEmail(user.email);

    setErrors((prev) => ({
      ...prev,
      passwordLength: user.password.length < 8,
      passwordMatched: user.password !== confirmPassword,
      missingEmail: user.email === "",
      invalidEmail: user.email !== "" && !emailValid,
      missingFirstName: user.first_name === "",
      missingLastName: user.last_name === "",
    }));

    // Check if there are any errors
    if (
      user.password.length < 8 ||
      user.password !== confirmPassword ||
      user.email === "" ||
      !emailValid ||
      user.first_name === "" ||
      user.last_name === ""
    ) {
      setIsLoading(false);
      setShowError(true);
      return;
    }

    let isLoggedIn = await register(user, setErrors);
    setIsLoading(false);
    if (isLoggedIn) {
      navigation.navigate("Profile");
    }
  };

  return (
    <View style={styles.container}>
      {showError && (
        <ErrorScreen isVisible={showError} setIsLoading={setShowError} />
      )}
      {isLoading && <LoadingScreen isVisible={isLoading} />}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <Animated.View
            style={[
              styles.header,
              {
                opacity: headerOpacity,
                transform: [{ translateY: headerTranslateY }],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>

            <View style={styles.iconContainer}>
              <View style={styles.iconBackground}>
                <View style={styles.userIcon}>
                  <View style={styles.userHead} />
                  <View style={styles.userBody} />
                </View>
              </View>
            </View>

            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join us and start your journey</Text>
          </Animated.View>

          {/* Form Section */}
          <Animated.View
            style={[
              styles.formContainer,
              {
                opacity: formOpacity,
                transform: [{ translateY: formTranslateY }],
              },
            ]}
          >
            {/* Name Row */}
            <View style={styles.rowContainer}>
              <View style={styles.halfInput}>
                <TextInput
                  label="First Name"
                  mode="outlined"
                  value={user.first_name}
                  onChangeText={(text) =>
                    setUser((prev) => ({ ...prev, first_name: text }))
                  }
                  style={styles.input}
                  outlineColor="#e5e7eb"
                  activeOutlineColor="#8b5cf6"
                  theme={{ roundness: 12 }}
                />
                {errors.missingFirstName && (
                  <Text style={styles.errorText}>Required field</Text>
                )}
              </View>

              <View style={styles.halfInput}>
                <TextInput
                  label="Last Name"
                  mode="outlined"
                  value={user.last_name}
                  onChangeText={(text) =>
                    setUser((prev) => ({ ...prev, last_name: text }))
                  }
                  style={styles.input}
                  outlineColor="#e5e7eb"
                  activeOutlineColor="#8b5cf6"
                  theme={{ roundness: 12 }}
                />
                {errors.missingLastName && (
                  <Text style={styles.errorText}>Required field</Text>
                )}
              </View>
            </View>

            {/* Email */}
            <View style={styles.inputContainer}>
              <TextInput
                label="Email"
                mode="outlined"
                value={user.email}
                onChangeText={(text) =>
                  setUser((prev) => ({ ...prev, email: text }))
                }
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                outlineColor="#e5e7eb"
                activeOutlineColor="#8b5cf6"
                theme={{ roundness: 12 }}
              />
              {errors.missingEmail && (
                <Text style={styles.errorText}>Email is required</Text>
              )}
              {errors.invalidEmail && (
                <Text style={styles.errorText}>Please enter a valid email</Text>
              )}
              {errors.userAlreadyExists && (
                <Text style={styles.errorText}>Email already exists</Text>
              )}
            </View>

            {/* Role Dropdown */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>I am a</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={user.role}
                  onValueChange={(itemValue) =>
                    setUser((prev) => ({ ...prev, role: itemValue }))
                  }
                  style={styles.picker}
                >
                  <Picker.Item label="User" value="user" />
                  <Picker.Item label="Psychologist" value="psychologist" />
                </Picker>
              </View>
            </View>

            {/* Password Row */}
            <View style={styles.rowContainer}>
              <View style={styles.halfInput}>
                <TextInput
                  label="Password"
                  mode="outlined"
                  value={user.password}
                  onChangeText={(text) =>
                    setUser((prev) => ({ ...prev, password: text }))
                  }
                  secureTextEntry={true}
                  style={styles.input}
                  outlineColor="#e5e7eb"
                  activeOutlineColor="#8b5cf6"
                  theme={{ roundness: 12 }}
                />
              </View>

              <View style={styles.halfInput}>
                <TextInput
                  label="Confirm Password"
                  mode="outlined"
                  value={confirmPassword}
                  onChangeText={(text) => setConfirmPassword(text)}
                  secureTextEntry={true}
                  style={styles.input}
                  outlineColor="#e5e7eb"
                  activeOutlineColor="#8b5cf6"
                  theme={{ roundness: 12 }}
                />
              </View>
            </View>

            {errors.passwordLength && (
              <Text style={styles.errorText}>
                Password must be at least 8 characters
              </Text>
            )}
            {errors.passwordMatched && (
              <Text style={styles.errorText}>Passwords do not match</Text>
            )}
          </Animated.View>

          {/* Buttons Section */}
          <Animated.View
            style={[styles.buttonsContainer, { opacity: buttonOpacity }]}
          >
            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
              activeOpacity={0.8}
            >
              <Text style={styles.registerButtonText}>Create Account</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backButtonSecondary}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <Text style={styles.backButtonSecondaryText}>
                Already have an account?
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 30,
    paddingVertical: 50,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  backButton: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  backButtonText: {
    fontSize: 24,
    color: "#8b5cf6",
  },
  iconContainer: {
    marginBottom: 20,
  },
  iconBackground: {
    width: 90,
    height: 90,
    borderRadius: 25,
    backgroundColor: "#8b5cf6",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#8b5cf6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  userIcon: {
    alignItems: "center",
  },
  userHead: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "white",
    marginBottom: 4,
  },
  userBody: {
    width: 38,
    height: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "white",
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#6b7280",
  },
  formContainer: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  rowContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  halfInput: {
    flex: 1,
  },
  input: {
    backgroundColor: "white",
    height: 50,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
    marginLeft: 4,
  },
  pickerContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    overflow: "hidden",
  },
  picker: {
    height: 50,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 11,
    marginTop: 4,
    marginLeft: 4,
  },
  buttonsContainer: {
    marginTop: 10,
  },
  registerButton: {
    backgroundColor: "#8b5cf6",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#8b5cf6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  registerButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  backButtonSecondary: {
    paddingVertical: 16,
    alignItems: "center",
  },
  backButtonSecondaryText: {
    color: "#8b5cf6",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default Register;