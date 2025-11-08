import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  Modal,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { default as Text } from "../../../components/CustomText";
import { TextInput, Button, RadioButton } from "react-native-paper";
import * as Location from "expo-location";
import theme from "../../../components/CustomTheme";
import { useAuth } from "../../../context/AuthContext";

// Common country codes
const COUNTRY_CODES = [
  { code: "+63", country: "Philippines", flag: "🇵🇭" },
  { code: "+1", country: "USA/Canada", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+82", country: "South Korea", flag: "🇰🇷" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
];

const Profile = ({ navigation }) => {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");
  const [countryCode, setCountryCode] = useState("+63"); // Default to Philippines
  const [phoneNumber, setPhoneNumber] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const { axiosInstanceWithBearer } = useAuth();

  useEffect(() => {
    // Request location permission when component mounts
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "Please enable location services to automatically fetch your location.",
            [{ text: "OK" }]
          );
        }
      } catch (error) {
        console.error("Error requesting location permission:", error);
      }
    })();
  }, []);

  const getUserLocation = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied to access location");
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Get address from coordinates
      const response = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (response && response.length > 0) {
        const address = response[0];
        const locationString = `${address.city || ""}, ${
          address.region || ""
        }, ${address.country || ""}`;
        setLocation(locationString.replace(/^, |, $|, ,/g, ""));
      }
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert(
        "Error",
        "Could not fetch your location. Please enter it manually."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Validation
    if (age && isNaN(parseInt(age))) {
      Alert.alert("Error", "Please enter a valid age.");
      return;
    }

    // Validate phone number if provided
    if (phoneNumber && !/^\d{7,15}$/.test(phoneNumber)) {
      Alert.alert(
        "Error",
        "Please enter a valid phone number (7-15 digits, numbers only)."
      );
      return;
    }

    setSubmitLoading(true);
    try {
      // Prepare data for the API call
      const profileData = {
        age: age ? parseInt(age) : null,
        gender: gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : "",
        location: location || "",
        phone_number: phoneNumber ? `${countryCode}${phoneNumber}` : "",
      };

      // Make the API call to update the profile
      const response = await axiosInstanceWithBearer.put(
        "/api/user/profile/",
        profileData
      );
      console.log("Profile updated successfully:", response.data);
      if (response.status === 200) {
        Alert.alert("Success", "Profile information updated successfully!");
        navigation.navigate("Main");
      } else {
        Alert.alert("Error", "Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const selectCountryCode = (code) => {
    setCountryCode(code);
    setModalVisible(false);
  };

  const selectedCountry = COUNTRY_CODES.find((c) => c.code === countryCode);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.heading}>Let us know more about you</Text>

        <View style={styles.inputContainer}>
          <TextInput
            label="Age"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
            style={styles.input}
            mode="outlined"
            disabled={loading}
          />

          <Text style={styles.label}>Gender</Text>
          <RadioButton.Group onValueChange={setGender} value={gender}>
            <View style={styles.radioContainer}>
              <View style={styles.radioOption}>
                <RadioButton value="male" disabled={loading} />
                <Text>Male</Text>
              </View>
              <View style={styles.radioOption}>
                <RadioButton value="female" disabled={loading} />
                <Text>Female</Text>
              </View>
              <View style={styles.radioOption}>
                <RadioButton value="other" disabled={loading} />
                <Text>Other</Text>
              </View>
            </View>
          </RadioButton.Group>

          <Text style={styles.label}>Contact Number</Text>
          <View style={styles.phoneContainer}>
            <TouchableOpacity
              style={styles.countryCodeButton}
              onPress={() => setModalVisible(true)}
              disabled={loading}
            >
              <Text style={styles.countryCodeText}>
                {selectedCountry?.flag} {countryCode}
              </Text>
            </TouchableOpacity>
            <TextInput
              label="Phone Number"
              value={phoneNumber}
              onChangeText={(text) => setPhoneNumber(text.replace(/[^0-9]/g, ""))}
              keyboardType="phone-pad"
              style={styles.phoneInput}
              mode="outlined"
              disabled={loading}
              placeholder="9123456789"
            />
          </View>

          <View style={styles.locationContainer}>
            <TextInput
              label="Location"
              value={location}
              onChangeText={setLocation}
              style={styles.input}
              mode="outlined"
              disabled={loading}
            />
            <Button
              mode="contained"
              onPress={getUserLocation}
              loading={loading}
              style={styles.locationButton}
              disabled={loading}
            >
              Get Current Location
            </Button>
          </View>
        </View>

        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.saveButton}
          loading={submitLoading}
          disabled={loading || submitLoading}
        >
          Save Profile
        </Button>
      </ScrollView>

      {/* Country Code Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country Code</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={COUNTRY_CODES}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.countryItem,
                    item.code === countryCode && styles.selectedCountryItem,
                  ]}
                  onPress={() => selectCountryCode(item.code)}
                >
                  <Text style={styles.countryItemText}>
                    {item.flag} {item.country}
                  </Text>
                  <Text style={styles.countryCodeLabel}>{item.code}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollContent: {
    flexGrow: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  radioContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  phoneContainer: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-start",
  },
  countryCodeButton: {
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 4,
    padding: 16,
    marginRight: 8,
    minWidth: 100,
    justifyContent: "center",
    alignItems: "center",
    height: 56,
  },
  countryCodeText: {
    fontSize: 16,
  },
  phoneInput: {
    flex: 1,
  },
  locationContainer: {
    marginTop: 8,
  },
  locationButton: {
    marginTop: 8,
  },
  saveButton: {
    marginTop: "auto",
    marginBottom: 16,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
    paddingTop: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 24,
    color: "#888",
  },
  countryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  selectedCountryItem: {
    backgroundColor: "#e3f2fd",
  },
  countryItemText: {
    fontSize: 16,
    flex: 1,
  },
  countryCodeLabel: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
});

export default Profile;