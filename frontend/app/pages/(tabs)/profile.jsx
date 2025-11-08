import React, { useEffect, useState } from "react";
import { 
  View, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  TextInput,
  Modal,
  Alert,
  FlatList
} from "react-native";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useSelector, useDispatch } from "react-redux";
import { default as Text } from "../../../components/CustomText";
import BoldText from "../../../components/BoldText";
import CounselingCharts from "../../../components/CounselingCharts";
import { setFirstName, setLastName } from "../../../redux/userSlice";
import Toast from "../../../utils/toast";
import { Picker } from '@react-native-picker/picker';

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
  const authState = useSelector((state) => state.auth.auth);
  const { onLogout, axiosInstanceWithBearer } = useAuth();
  const router = useRouter();
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  
  const [profile, setProfile] = useState({});
  const [analysisData, setAnalysisData] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [countryCodeModalVisible, setCountryCodeModalVisible] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    first_name: "",
    last_name: "",
    location: "",
    age: "",
    gender: "",
    phone_number: "",
    country_code: "+63",
  });

  // Generate age options from 13 to 100
  const ageOptions = Array.from({ length: 88 }, (_, i) => i + 13);
  
  const genderOptions = [
    { label: "Select Gender", value: "" },
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
    { label: "Other", value: "Other" },
  ];

  const parsePhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return { countryCode: "+63", number: "" };
    
    // Find matching country code
    const matchedCode = COUNTRY_CODES.find(c => phoneNumber.startsWith(c.code));
    
    if (matchedCode) {
      return {
        countryCode: matchedCode.code,
        number: phoneNumber.substring(matchedCode.code.length)
      };
    }
    
    // Default to +63 if no match
    return { countryCode: "+63", number: phoneNumber };
  };

  const fetchProfile = async () => {
    try {
      const response = await axiosInstanceWithBearer.get("/api/user/profile");
      console.log("Profile data:", response.data);
      setProfile(response.data);
      
      // Parse phone number
      const { countryCode, number } = parsePhoneNumber(response.data.profile?.phone_number);
      
      // Set edited profile with current data
      const profileData = {
        first_name: response.data.first_name || user.firstName || "",
        last_name: response.data.last_name || user.lastName || "",
        location: response.data.profile?.location || "",
        age: response.data.profile?.age?.toString() || "",
        gender: response.data.profile?.gender || "",
        country_code: countryCode,
        phone_number: number,
      };
      
      console.log("Setting editedProfile:", profileData);
      setEditedProfile(profileData);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchLatest = async () => {
    try {
      const response = await axiosInstanceWithBearer.get(
        `/get-analysis/${user.id}`
      );
      console.log("Latest analysis response:", response.data);
      setAnalysisData(response.data);
    } catch (error) {
      console.error("Error fetching latest analysis:", error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      // Validate phone number if provided
      if (editedProfile.phone_number && !/^\d{7,15}$/.test(editedProfile.phone_number)) {
        Alert.alert(
          "Error",
          "Please enter a valid phone number (7-15 digits, numbers only)."
        );
        return;
      }

      // Combine country code and phone number
      const fullPhoneNumber = editedProfile.phone_number 
        ? `${editedProfile.country_code}${editedProfile.phone_number}` 
        : "";

      // Update profile info (including first_name and last_name)
      const response = await axiosInstanceWithBearer.put("/api/user/profile", {
        first_name: editedProfile.first_name,
        last_name: editedProfile.last_name,
        gender: editedProfile.gender,
        age: editedProfile.age ? parseInt(editedProfile.age) : null,
        location: editedProfile.location,
        phone_number: fullPhoneNumber,
      });

      console.log("Profile updated:", response.data);

      // Update Redux store
      dispatch(setFirstName(editedProfile.first_name));
      dispatch(setLastName(editedProfile.last_name));

      // Refresh profile data
      await fetchProfile();
      
      setEditModalVisible(false);
      Toast.show("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    }
  };

  const selectCountryCode = (code) => {
    setEditedProfile({ ...editedProfile, country_code: code });
    setCountryCodeModalVisible(false);
  };

  useEffect(() => {
    if (!authState.isLoggedIn) {
      navigation.navigate("Login");
    }
    fetchProfile();
    // fetchLatest(); // Comment out since endpoint doesn't exist yet
  }, []);

  // Update editedProfile when modal opens
  useEffect(() => {
    if (editModalVisible) {
      const { countryCode, number } = parsePhoneNumber(profile.profile?.phone_number);
      
      setEditedProfile({
        first_name: profile.first_name || user.firstName || "",
        last_name: profile.last_name || user.lastName || "",
        location: profile.profile?.location || "",
        age: profile.profile?.age?.toString() || "",
        gender: profile.profile?.gender || "",
        country_code: countryCode,
        phone_number: number,
      });
      console.log("Modal opened, current data:", {
        first_name: profile.first_name || user.firstName,
        last_name: profile.last_name || user.lastName,
        location: profile.profile?.location,
        age: profile.profile?.age,
        gender: profile.profile?.gender,
        phone_number: profile.profile?.phone_number,
      });
    }
  }, [editModalVisible]);

  const selectedCountry = COUNTRY_CODES.find((c) => c.code === editedProfile.country_code);

  return (
    <View style={styles.container}>
      <ScrollView>
        {authState.isLoggedIn ? (
          <View>
            {/* Header Section */}
            <View style={styles.header}>
              {/* Back Icon */}
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => router.back()}
              >
                <MaterialIcons name="arrow-back" size={30} color="white" />
              </TouchableOpacity>

              {/* Settings Icon */}
              <TouchableOpacity
                style={styles.iconContainerRight}
                onPress={() => navigation.navigate("Settings")}
              >
                <MaterialIcons name="settings" size={30} color="white" />
              </TouchableOpacity>

              {/* Avatar with Edit Icon */}
              <View style={styles.avatarContainer}>
                <AntDesign name="user" size={50} color="#6cbab0" />
                <TouchableOpacity
                  style={styles.editIcon}
                  onPress={() => setEditModalVisible(true)}
                >
                  <MaterialIcons name="edit" size={20} color="white" />
                </TouchableOpacity>
              </View>

              {/* Username  */}
              <View style={[styles.usernameWrapper, { flexDirection: "column" }]}>
                <BoldText style={styles.username}>
                  {user.firstName + " " + user.lastName}
                </BoldText>
                <Text style={{ color: "#fefefe" }}>(@{user.name})</Text>
              </View>

              {/* Bio Section */}
              <Text style={styles.bio}>
                {profile.profile?.location || "Location not set"}
              </Text>
              <Text style={styles.bio}>
                {profile.profile?.age ? `Age: ${profile.profile.age}` : ""}
                {profile.profile?.age && profile.profile?.gender ? " • " : ""}
                {profile.profile?.gender || ""}
              </Text>
              {profile.profile?.phone_number && (
                <Text style={styles.bio}>
                  📞 {profile.profile.phone_number}
                </Text>
              )}
            </View>

            {/* Latest Analysis Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Latest Analysis</Text>
              {analysisData ? (
                <CounselingCharts analysisData={analysisData} />
              ) : (
                <View style={styles.loadingContainer}>
                  <Text>No analysis data available</Text>
                </View>
              )}
            </View>

            {/* Edit Profile Button */}
            <TouchableOpacity
              style={styles.otherSetting}
              onPress={() => setEditModalVisible(true)}
            >
              <MaterialIcons name="edit" size={24} color="#6cbab0" />
              <Text style={styles.settingText}>Edit Profile</Text>
            </TouchableOpacity>

            {/* Other Settings */}
            <TouchableOpacity
              style={styles.otherSetting}
              onPress={() => navigation.navigate("Settings")}
            >
              <MaterialIcons name="settings" size={24} color="#6cbab0" />
              <Text style={styles.settingText}>Settings</Text>
            </TouchableOpacity>

            {/* Logout Button */}
            <TouchableOpacity
              style={styles.otherSetting}
              onPress={() => {
                onLogout();
                navigation.navigate("Welcome");
              }}
            >
              <MaterialIcons name="logout" size={24} color="#6cbab0" />
              <Text style={styles.settingText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>You need to be logged in to view this page.</Text>
          </View>
        )}
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <BoldText style={styles.modalTitle}>Edit Profile</BoldText>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                  style={styles.input}
                  value={editedProfile.first_name}
                  onChangeText={(text) =>
                    setEditedProfile({ ...editedProfile, first_name: text })
                  }
                  placeholder="Enter first name"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                  style={styles.input}
                  value={editedProfile.last_name}
                  onChangeText={(text) =>
                    setEditedProfile({ ...editedProfile, last_name: text })
                  }
                  placeholder="Enter last name"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Location</Text>
                <TextInput
                  style={styles.input}
                  value={editedProfile.location}
                  onChangeText={(text) =>
                    setEditedProfile({ ...editedProfile, location: text })
                  }
                  placeholder="Enter location"
                />
              </View>

              {/* Age Dropdown */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Age</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={editedProfile.age}
                    onValueChange={(itemValue) =>
                      setEditedProfile({ ...editedProfile, age: itemValue })
                    }
                    style={styles.picker}
                  >
                    <Picker.Item label="Select Age" value="" />
                    {ageOptions.map((age) => (
                      <Picker.Item key={age} label={age.toString()} value={age.toString()} />
                    ))}
                  </Picker>
                </View>
              </View>

              {/* Gender Dropdown */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Gender</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={editedProfile.gender}
                    onValueChange={(itemValue) =>
                      setEditedProfile({ ...editedProfile, gender: itemValue })
                    }
                    style={styles.picker}
                  >
                    {genderOptions.map((option) => (
                      <Picker.Item key={option.value} label={option.label} value={option.value} />
                    ))}
                  </Picker>
                </View>
              </View>

              {/* Phone Number with Country Code */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Contact Number</Text>
                <View style={styles.phoneContainer}>
                  <TouchableOpacity
                    style={styles.countryCodeButton}
                    onPress={() => setCountryCodeModalVisible(true)}
                  >
                    <Text style={styles.countryCodeText}>
                      {selectedCountry?.flag} {editedProfile.country_code}
                    </Text>
                  </TouchableOpacity>
                  <TextInput
                    style={styles.phoneInput}
                    value={editedProfile.phone_number}
                    onChangeText={(text) =>
                      setEditedProfile({ 
                        ...editedProfile, 
                        phone_number: text.replace(/[^0-9]/g, "") 
                      })
                    }
                    placeholder="9123456789"
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleUpdateProfile}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Country Code Modal */}
      <Modal
        visible={countryCodeModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setCountryCodeModalVisible(false)}
      >
        <View style={styles.countryModalOverlay}>
          <View style={styles.countryModalContent}>
            <View style={styles.countryModalHeader}>
              <Text style={styles.countryModalTitle}>Select Country Code</Text>
              <TouchableOpacity
                onPress={() => setCountryCodeModalVisible(false)}
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
                    item.code === editedProfile.country_code && styles.selectedCountryItem,
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
  },
  header: {
    backgroundColor: "#6cbab0",
    alignItems: "center",
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    position: "relative",
  },
  iconContainer: {
    position: "absolute",
    top: 20,
    left: 10,
    zIndex: 1,
  },
  iconContainerRight: {
    position: "absolute",
    top: 20,
    right: 10,
    zIndex: 1,
  },
  avatarContainer: {
    backgroundColor: "white",
    borderRadius: 100,
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#6cbab0",
    borderRadius: 20,
    padding: 8,
  },
  usernameWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  username: {
    fontSize: 20,
    color: "#fff",
  },
  bio: {
    fontSize: 14,
    color: "#fff",
    marginTop: 5,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 10,
    color: "#6cbab0",
  },
  loadingContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    margin: 10,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
  otherSetting: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    marginTop: 10,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalTitle: {
    fontSize: 20,
    color: "#333",
  },
  modalBody: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    overflow: "hidden",
  },
  picker: {
    height: 50,
  },
  // Phone Number Styles
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  countryCodeButton: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    padding: 12,
    marginRight: 8,
    minWidth: 90,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  countryCodeText: {
    fontSize: 16,
  },
  phoneInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  saveButton: {
    backgroundColor: "#6cbab0",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  // Country Code Modal Styles
  countryModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  countryModalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
    paddingTop: 16,
  },
  countryModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  countryModalTitle: {
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