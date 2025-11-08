import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  PaperProvider,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { default as Text } from "../../../components/CustomText";
import { TextInput, Button, RadioButton } from "react-native-paper";
import * as Location from "expo-location";
import theme from "../../../components/CustomTheme";
import { useAuth } from "../../../context/AuthContext";

const Profile = ({ navigation }) => {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");
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

    setSubmitLoading(true);
    try {
      // Prepare data for the API call - Send directly without wrapping in userprofile
      const profileData = {
        age: age ? parseInt(age) : null,
        gender: gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : "", // Capitalize first letter
        location: location || "",
      };

      // Make the API call to update the profile
      const response = await axiosInstanceWithBearer.put(
        "/api/user/profile/",
        profileData
      );
      console.log("Profile updated successfully:", response.data);
      if (response.status === 200) {
        Alert.alert("Success", "Profile information updated successfully!");
        navigation.navigate("Main"); // Navigate to the main screen after saving
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
});

export default Profile;
