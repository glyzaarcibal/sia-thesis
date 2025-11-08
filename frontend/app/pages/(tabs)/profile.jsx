import React, { useEffect, useState } from "react";
import { 
  View, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  TextInput,
  Modal,
  Alert
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
import Toast from "react-native-simple-toast";

const Profile = ({ navigation }) => {
  const authState = useSelector((state) => state.auth.auth);
  const { onLogout, axiosInstanceWithBearer } = useAuth();
  const router = useRouter();
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  
  const [profile, setProfile] = useState({});
  const [analysisData, setAnalysisData] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    first_name: "",
    last_name: "",
    location: "",
    age: "",
    gender: "",
  });

  const fetchProfile = async () => {
    try {
      const response = await axiosInstanceWithBearer.get("/api/user/profile");
      console.log("Profile data:", response.data);
      setProfile(response.data);
      
      // Set edited profile with current data
      const profileData = {
        first_name: response.data.first_name || user.firstName || "",
        last_name: response.data.last_name || user.lastName || "",
        location: response.data.profile?.location || "",
        age: response.data.profile?.age?.toString() || "",
        gender: response.data.profile?.gender || "",
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
      // Update basic profile info
      const response = await axiosInstanceWithBearer.put("/api/user/profile", {
        gender: editedProfile.gender,
        age: editedProfile.age ? parseInt(editedProfile.age) : null,
        location: editedProfile.location,
      });

      // Update Redux store
      dispatch(setFirstName(editedProfile.first_name));
      dispatch(setLastName(editedProfile.last_name));

      // Refresh profile data
      await fetchProfile();
      
      setEditModalVisible(false);
      Toast.showWithGravity(
        "Profile updated successfully!",
        Toast.SHORT,
        Toast.CENTER
      );
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    }
  };

  useEffect(() => {
    if (!authState.isLoggedIn) {
      navigation.navigate("Login");
    }
    fetchProfile();
    fetchLatest();
  }, []);

  // Update editedProfile when modal opens
  useEffect(() => {
    if (editModalVisible) {
      setEditedProfile({
        first_name: profile.first_name || user.firstName || "",
        last_name: profile.last_name || user.lastName || "",
        location: profile.profile?.location || "",
        age: profile.profile?.age?.toString() || "",
        gender: profile.profile?.gender || "",
      });
      console.log("Modal opened, current data:", {
        first_name: profile.first_name || user.firstName,
        last_name: profile.last_name || user.lastName,
        location: profile.profile?.location,
        age: profile.profile?.age,
        gender: profile.profile?.gender,
      });
    }
  }, [editModalVisible]);

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
            </View>

            {/* Latest Analysis Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Latest Analysis</Text>
              {analysisData ? (
                <CounselingCharts analysisData={analysisData} />
              ) : (
                <View style={styles.loadingContainer}>
                  <Text>Loading analysis data...</Text>
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

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Age</Text>
                <TextInput
                  style={styles.input}
                  value={editedProfile.age}
                  onChangeText={(text) =>
                    setEditedProfile({ ...editedProfile, age: text })
                  }
                  placeholder="Enter age"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Gender</Text>
                <TextInput
                  style={styles.input}
                  value={editedProfile.gender}
                  onChangeText={(text) =>
                    setEditedProfile({ ...editedProfile, gender: text })
                  }
                  placeholder="Enter gender"
                />
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
});

export default Profile;